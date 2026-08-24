/* ตัวช่วยร่วมของสคริปต์เก็บข้อมูล — ดึงหน้าเว็บ ถอด HTML และบันทึกไฟล์
 * แยกออกมาเพราะทั้งสามแหล่งใช้ตรรกะ retry และการถอดข้อความชุดเดียวกัน
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const DATA_DIR = path.join(ROOT, "data");

export const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const today = () => new Date().toISOString().slice(0, 10);

/** ดึงหน้าเว็บพร้อม retry แบบ exponential backoff เมื่อเจอ 429 หรือ 5xx */
export async function fetchText(url, attempt = 1) {
  const response = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/json" },
  });
  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await sleep(800 * 2 ** (attempt - 1));
    return fetchText(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response.text();
}

/** ถอด HTML เป็นข้อความอ่านได้ โดยรักษาการขึ้นบรรทัดของหัวข้อและ bullet ไว้ */
export function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li|div|h[1-6]|tr|td)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** ตัดส่วนหัว/ท้ายเว็บออก เหลือเฉพาะช่วงที่เป็นเนื้อประกาศงาน */
export function sliceJobBody(text, startPatterns, endPatterns = []) {
  const start = startPatterns.reduce((best, pattern) => {
    const index = text.search(pattern);
    return index >= 0 && (best < 0 || index < best) ? index : best;
  }, -1);
  if (start < 0) return "";
  const tail = text.slice(start);
  const end = endPatterns.reduce((best, pattern) => {
    const index = tail.search(pattern);
    return index > 200 && (best < 0 || index < best) ? index : best;
  }, -1);
  return (end > 0 ? tail.slice(0, end) : tail).slice(0, 12000).trim();
}

export async function saveJson(filename, payload) {
  await mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, filename);
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return target;
}

/** ทำงานเป็นชุดแบบขนาน เพื่อไม่ยิงพร้อมกันทั้งหมดจนโดนบล็อก */
export async function inBatches(items, size, worker) {
  const results = [];
  for (let offset = 0; offset < items.length; offset += size) {
    const batch = items.slice(offset, offset + size);
    results.push(...(await Promise.all(batch.map(worker))));
    if (offset + size < items.length) await sleep(300);
  }
  return results;
}

/* คำที่บ่งชี้ว่าประกาศงานอยู่ในกาฬสินธุ์จริง ไม่ใช่แค่ผลค้นระดับภาค */
export const KALASIN_PATTERN =
  /กาฬสินธุ์|Kalasin|ยางตลาด|กุฉินารายณ์|สมเด็จ|ห้วยผึ้ง|กมลาไสย|สหัสขันธ์|คำม่วง|เขาวง|ท่าคันโท|หนองกุงศรี|นามน|ร่องคำ|สามชัย|นาคู|ดอนจาน|ฆ้องชัย|ห้วยเม็ก|นามล/i;

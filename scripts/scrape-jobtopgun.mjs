/* เก็บประกาศงานจาก JOBTOPGUN
 *
 * หน้ารายการเรนเดอร์ฝั่งเซิร์ฟเวอร์ จึงอ่านลิงก์งานจาก HTML ได้โดยตรง
 * แต่พารามิเตอร์ ?page= ถูกละเลย — ทุกหน้าคืนชุดเดิม 30 รายการ
 * จึงขยายความครอบคลุมด้วยหน้าแยกตามสายงาน (เช่น jobs-in-sales/in-kalasin)
 * ซึ่งเป็นวิธีเดียวกับที่ curriculum-graph ใช้คำค้นย่อยเพื่อเพิ่ม recall
 *
 * slug ที่ไม่มีอยู่จริงจะถอยกลับไปแสดงรายการเริ่มต้น สคริปต์จึงเทียบชุดผลลัพธ์
 * กับรายการเริ่มต้น ถ้าเหมือนกันทุกรายการให้ถือว่าเป็น fallback แล้วข้ามไป
 *
 * ข้อควรระวังด้านข้อมูล: ผลค้น "in-kalasin" ของ JOBTOPGUN เป็นระดับภาค
 * ประกาศจำนวนมากระบุพื้นที่เป็น "ภาคอีสาน" ไม่ใช่กาฬสินธุ์โดยตรง
 * จึงตรวจเนื้อประกาศด้วย KALASIN_PATTERN แล้วติดธง inKalasin ไว้ให้ขั้นถัดไปกรอง
 */

import {
  KALASIN_PATTERN, fetchText, inBatches, saveJson, sliceJobBody, stripHtml, today,
} from "./lib.mjs";

const BASE = "https://www.jobtopgun.com";
const SOURCE = "JOBTOPGUN";
const LIST_URL = `${BASE}/th/jobs/in-kalasin`;
const CATEGORY_SLUGS = [
  "it-technology", "sales", "accounting", "marketing", "engineering",
  "hr", "human-resources", "logistics", "administration", "customer-service",
  "education", "agriculture", "legal", "production", "finance", "construction",
];

const jobIds = html =>
  [...new Set([...html.matchAll(/\/th\/jobs\/(j\d+-\d+)/g)].map(match => match[1]))];

/* ---------- ขั้นที่ 1 อ่านรายการจากหน้าเริ่มต้นและหน้าแยกสายงาน ---------- */

const baseIds = jobIds(await fetchText(LIST_URL));
const baseKey = [...baseIds].sort().join(",");
const collected = new Map(baseIds.map(id => [id, ["ทั้งหมด"]]));
const categories = [{ slug: "ทั้งหมด", found: baseIds.length, isFallback: false }];

for (const slug of CATEGORY_SLUGS) {
  let ids = [];
  try {
    ids = jobIds(await fetchText(`${BASE}/th/jobs/jobs-in-${slug}/in-kalasin`));
  } catch {
    categories.push({ slug, found: 0, isFallback: false, error: true });
    continue;
  }
  const isFallback = [...ids].sort().join(",") === baseKey;
  categories.push({ slug, found: ids.length, isFallback });
  if (isFallback) continue;
  for (const id of ids) {
    const tags = collected.get(id) || [];
    if (!tags.includes(slug)) tags.push(slug);
    collected.set(id, tags);
  }
}

const realCategories = categories.filter(c => !c.isFallback && !c.error);
console.log(`รายการ: ${collected.size} งานไม่ซ้ำ จาก ${realCategories.length} หน้าสายงานที่ใช้ได้`);

/* ---------- ขั้นที่ 2 ดึงหน้ารายละเอียดเพื่อเอาเนื้องานไปสกัดทักษะ ---------- */

const BODY_START = [/คุณสมบัติและประสบการณ์/, /Responsibilities/i, /หน้าที่ความรับผิดชอบ/, /รายละเอียดงาน/];
/* ตัดก่อนถึง Benefits และ About เพราะสองส่วนนั้นเป็นสวัสดิการและข้อความแนะนำบริษัท
   ซึ่งพูดถึงการฝึกอบรม ประกัน และจุดยืนด้านสิ่งแวดล้อม ไม่ใช่ทักษะที่ตำแหน่งนี้ต้องการ */
const BODY_END = [/\bBenefits\b/, /\bAbout\s/, /สวัสดิการ/, /สมัครงานนี้/, /งานที่คล้ายกัน/i, /Similar jobs/i];

async function fetchJob([id, tags]) {
  const url = `${BASE}/th/jobs/${id}`;
  try {
    const html = await fetchText(url);
    const text = stripHtml(html);
    const body = sliceJobBody(text, BODY_START, BODY_END);

    /* หัวข้อ h1 มีรูปแบบ "{ตำแหน่ง} - {บริษัท}" และ h2 ท้ายหน้าคือ "About {บริษัท}"
       จึงใช้ h2 ระบุชื่อบริษัทแล้วตัดส่วนนั้นออกจาก h1 เพื่อให้เหลือชื่อตำแหน่งล้วน */
    const heading = stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
    const company = stripHtml(
      [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
        .map(match => match[1])
        .find(value => /^\s*About\s+/i.test(stripHtml(value))) || "",
    ).replace(/^About\s+/i, "").trim();
    const title = company && heading.endsWith(company)
      ? heading.slice(0, -company.length).replace(/\s*-\s*$/, "").trim()
      : heading;

    /* meta description สรุปพื้นที่และเงินเดือนไว้ในรูปแบบคงที่ อ่านง่ายกว่าการไล่หาในเนื้อหน้า */
    const meta = html.match(/name="description"\s+content="([^"]*)"/)?.[1] || "";
    /* ชื่อตำแหน่งบางรายการมีคำว่า "พื้นที่" อยู่ด้วย จึงยึดคู่ "พื้นที่ … เงินเดือน" คู่สุดท้าย */
    const area = [...meta.matchAll(/พื้นที่\s*(.+?)\s*เงินเดือน/g)].at(-1)?.[1]?.trim() || "";
    const salary = meta.match(/เงินเดือน\s*(.+?)\s*ดูรายละเอียด/)?.[1]?.trim() || "";

    const haystack = `${heading} ${area} ${body}`;
    return {
      source: SOURCE,
      sourceId: `jobtopgun-${id}`,
      title,
      company,
      province: KALASIN_PATTERN.test(haystack) ? "กาฬสินธุ์" : "",
      district: "",
      location: area,
      salary,
      employment: text.match(/งานประจำ|งานตามสัญญาจ้าง|งานนอกเวลา/)?.[0] || "",
      listed: text.match(/Posted\s*([\d/]+)/i)?.[1] || "",
      url,
      categories: tags,
      description: body,
      hasDescription: body.length > 120,
      inKalasin: KALASIN_PATTERN.test(haystack),
    };
  } catch (error) {
    return {
      source: SOURCE, sourceId: `jobtopgun-${id}`, title: "", company: "", url,
      categories: tags, description: "", hasDescription: false, inKalasin: false,
      error: error.message.slice(0, 160),
    };
  }
}

const jobs = await inBatches([...collected.entries()], 8, fetchJob);
const ok = jobs.filter(job => !job.error);
const kalasin = ok.filter(job => job.inKalasin);

const target = await saveJson("raw-jobtopgun.json", {
  meta: {
    source: SOURCE,
    sourceUrl: LIST_URL,
    capturedAt: today(),
    collected: jobs.length,
    withDescription: ok.filter(job => job.hasDescription).length,
    inKalasin: kalasin.length,
    categories,
    note: "ผลค้น in-kalasin ของ JOBTOPGUN เป็นระดับภาคอีสาน จึงติดธง inKalasin จากการตรวจชื่อจังหวัดและอำเภอในเนื้อประกาศ",
  },
  jobs,
});

console.log(`JOBTOPGUN: ${jobs.length} งาน · มีเนื้อหา ${ok.filter(j => j.hasDescription).length} · อยู่ในกาฬสินธุ์ ${kalasin.length}`);
console.log(`บันทึกที่ ${target}`);

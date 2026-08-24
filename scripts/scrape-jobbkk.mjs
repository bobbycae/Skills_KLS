/* เก็บประกาศงานกาฬสินธุ์จาก JOBBKK
 *
 * หน้ารายการส่งลิงก์งานมากับ HTML เพียงบางส่วน ที่เหลือเติมด้วยสคริปต์ฝั่งไคลเอนต์
 * และพารามิเตอร์แบ่งหน้าไม่มีผล จึงเก็บได้เท่าที่เซิร์ฟเวอร์ส่งมา
 * ชดเชยด้วยการเรียกทั้งเส้นทางภาษาไทยและ /jobs/search ซึ่งคืนชุดลิงก์ต่างกันเล็กน้อย
 *
 * ลิงก์ที่ต่อท้ายด้วย source=job_hilight คือประกาศที่ซื้อพื้นที่โฆษณา
 * ไม่ได้ผูกกับจังหวัดที่ค้น จึงเก็บไว้แต่ติดธง isPromoted เพื่อให้กรองออกได้ภายหลัง
 *
 * หน้ารายละเอียดเรนเดอร์ฝั่งเซิร์ฟเวอร์เต็มรูปแบบ จึงได้เนื้องานครบทุกรายการ
 */

import {
  KALASIN_PATTERN, fetchText, inBatches, saveJson, sliceJobBody, stripHtml, today,
} from "./lib.mjs";

const SOURCE = "JOBBKK";
const LIST_URLS = [
  "https://jobbkk.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%81%E0%B8%B2%E0%B8%AC%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C",
  "https://jobbkk.com/jobs/search?province=กาฬสินธุ์",
];

const found = new Map();
for (const listUrl of LIST_URLS) {
  const html = await fetchText(listUrl);
  for (const match of html.matchAll(/\/jobs\/(detail|detailurgent)\/(\d+)\/(\d+)(\?source=job_hilight)?/g)) {
    const [, kind, companyId, jobId, promoted] = match;
    const key = `${companyId}/${jobId}`;
    const isPromoted = Boolean(promoted);
    /* ลิงก์เดียวกันอาจปรากฏทั้งแบบโฆษณาและแบบผลค้นปกติ ให้ผลค้นปกติชนะเสมอ */
    if (!found.has(key) || (found.get(key).isPromoted && !isPromoted)) {
      found.set(key, { kind, companyId, jobId, isPromoted });
    }
  }
}
console.log(`รายการ: ${found.size} ลิงก์ (โฆษณา ${[...found.values()].filter(j => j.isPromoted).length})`);

const BODY_START = [/รายละเอียดงาน/, /หน้าที่ความรับผิดชอบ/, /คุณสมบัติ/, /สถานที่ปฏิบัติงาน/];
const BODY_END = [/ตำแหน่งงานอื่น/, /งานที่เกี่ยวข้อง/, /สมัครงานตำแหน่งนี้/, /JOBBKK\.COM/];

async function fetchJob(entry) {
  const url = `https://jobbkk.com/jobs/${entry.kind}/${entry.companyId}/${entry.jobId}`;
  try {
    const html = await fetchText(url);
    const text = stripHtml(html);
    const body = sliceJobBody(text, BODY_START, BODY_END);
    /* ค้นข้อมูลรายช่องจากข้อความทั้งหน้า ไม่ใช่เฉพาะช่วงเนื้องาน
       เพราะหน้าแบบ detailurgent วางตารางข้อมูลไว้นอกบล็อกรายละเอียด */
    const field = label =>
      text.match(new RegExp(`${label}\\s*:?\\s*([^\\n•]{1,120})`))?.[1]?.trim() || "";
    const place = field("สถานที่ปฏิบัติงาน");

    /* หน้าแบบ detail มี h1 เป็นชื่อตำแหน่ง แต่แบบ detailurgent ไม่มี
       จึงถอยไปใช้ <title> ซึ่งมีรูปแบบ "{ตำแหน่ง} | {บริษัท} งาน หางาน สมัครงาน - jobbkk.com" */
    const pageTitle = stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
    const [titlePart, companyPart = ""] = pageTitle.split("|");
    const title = stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "")
      || titlePart.trim();
    const company = companyPart
      .replace(/งาน\s*หางาน\s*สมัครงาน\s*-\s*jobbkk\.com\s*$/i, "")
      .trim();

    return {
      source: SOURCE,
      sourceId: `jobbkk-${entry.companyId}-${entry.jobId}`,
      title,
      company,
      province: KALASIN_PATTERN.test(place) ? "กาฬสินธุ์" : "",
      district: place.replace(/กาฬสินธุ์|\(|\)/g, "").replace(/ทุกเขต\/อำเภอ/, "").trim(),
      location: place,
      salary: field("เงินเดือน\\(บาท\\)") || field("เงินเดือน"),
      employment: field("รูปแบบงาน"),
      listed: "",
      url,
      isPromoted: entry.isPromoted,
      description: body,
      hasDescription: body.length > 120,
      inKalasin: KALASIN_PATTERN.test(`${place} ${body.slice(0, 2000)}`),
    };
  } catch (error) {
    return {
      source: SOURCE, sourceId: `jobbkk-${entry.companyId}-${entry.jobId}`, title: "", company: "",
      url, isPromoted: entry.isPromoted, description: "", hasDescription: false, inKalasin: false,
      error: error.message.slice(0, 160),
    };
  }
}

const jobs = await inBatches([...found.values()], 6, fetchJob);
const target = await saveJson("raw-jobbkk.json", {
  meta: {
    source: SOURCE,
    sourceUrl: LIST_URLS[0],
    capturedAt: today(),
    collected: jobs.length,
    withDescription: jobs.filter(job => job.hasDescription).length,
    inKalasin: jobs.filter(job => job.inKalasin).length,
    promoted: jobs.filter(job => job.isPromoted).length,
    note: "หน้ารายการของ JOBBKK ส่งลิงก์มาบางส่วนและไม่รองรับการแบ่งหน้าฝั่งเซิร์ฟเวอร์ จำนวนที่เก็บได้จึงน้อยกว่ายอดที่เว็บรายงาน",
  },
  jobs,
});

console.log(`JOBBKK: ${jobs.length} งาน · มีเนื้อหา ${jobs.filter(j => j.hasDescription).length} · อยู่ในกาฬสินธุ์ ${jobs.filter(j => j.inKalasin).length}`);
console.log(`บันทึกที่ ${target}`);

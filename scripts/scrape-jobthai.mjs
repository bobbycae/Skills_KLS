/* เก็บประกาศงานกาฬสินธุ์จาก JobThai
 *
 * JobThai เป็น Next.js และฝังผล Apollo GraphQL ไว้ใน __NEXT_DATA__ ของหน้ารายการ
 * จึงอ่านรายการได้ครบโดยไม่ต้องเรนเดอร์ JavaScript — ใช้ province "04" คือกาฬสินธุ์
 *
 * ข้อจำกัดที่ตรวจสอบแล้ว: หน้ารายละเอียดงานเรนเดอร์ฝั่งไคลเอนต์และซ่อนเนื้องานไว้หลังปุ่ม
 * "ดูรายละเอียดงาน" การดึงด้วย fetch จึงได้แค่ชื่อตำแหน่ง สถานที่ และเงินเดือน
 * แหล่งนี้จึงบันทึก hasDescription:false และให้ขั้นสกัดทักษะใช้ชื่อตำแหน่งเป็นหลัก
 */

import { fetchText, saveJson, sleep, today } from "./lib.mjs";

const LIST_URL = province =>
  `https://www.jobthai.com/th/jobs?province=${province}&page=`;
const PROVINCE = "04";
const SOURCE = "JobThai";

function parseNextData(html) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error("ไม่พบ __NEXT_DATA__ — โครงสร้างหน้าเว็บอาจเปลี่ยน");
  return JSON.parse(match[1]);
}

/* ผลค้นถูกเก็บใน ROOT_QUERY ด้วยคีย์ที่มีอาร์กิวเมนต์ของ query ประกอบอยู่
   จึงต้องค้นด้วย prefix แทนการอ้างคีย์ตรง ๆ เพราะอาร์กิวเมนต์เปลี่ยนตามหน้า */
function readSearchResult(data) {
  const rootQuery = data?.props?.apolloState?.ROOT_QUERY || {};
  for (const [key, value] of Object.entries(rootQuery)) {
    if (key.startsWith("searchJobs") && value?.data) {
      return { total: Number(value.data.total || 0), jobs: value.data.data || [] };
    }
  }
  return { total: 0, jobs: [] };
}

function toJob(item) {
  return {
    source: SOURCE,
    sourceId: `jobthai-${item.id}`,
    title: (item.jobTitle || "").trim(),
    company: (item.companyName || "").trim(),
    province: item.province?.name || "",
    district: item.district?.name || "",
    location: [item.district?.name, item.province?.name].filter(Boolean).join(" · "),
    salary: (item.salary || "").trim(),
    employment: item.jobType?.name || "",
    listed: item.updatedAt || "",
    url: `https://www.jobthai.com/th/company/job/${item.id}`,
    description: "",
    hasDescription: false,
  };
}

const pageUrl = page =>
  `https://www.jobthai.com/th/jobs?province=${PROVINCE}&page=${page}`;

const first = parseNextData(await fetchText(pageUrl(1)));
const { total } = readSearchResult(first);
const byId = new Map();

for (const item of readSearchResult(first).jobs) {
  const job = toJob(item);
  byId.set(job.sourceId, job);
}

const pageSize = readSearchResult(first).jobs.length || 20;
const pages = Math.max(1, Math.ceil(total / pageSize));
for (let page = 2; page <= pages; page += 1) {
  await sleep(400);
  const result = readSearchResult(parseNextData(await fetchText(pageUrl(page))));
  for (const item of result.jobs) {
    const job = toJob(item);
    byId.set(job.sourceId, job);
  }
  console.log(`  หน้า ${page}/${pages} — สะสม ${byId.size} งาน`);
}

const jobs = [...byId.values()];
const target = await saveJson("raw-jobthai.json", {
  meta: {
    source: SOURCE,
    sourceUrl: LIST_URL(PROVINCE),
    capturedAt: today(),
    reportedTotal: total,
    collected: jobs.length,
    pages,
    descriptionsAvailable: false,
    note: "หน้ารายละเอียดของ JobThai เรนเดอร์ฝั่งไคลเอนต์และซ่อนเนื้องานไว้หลังปุ่ม จึงเก็บได้เฉพาะข้อมูลจากหน้ารายการ",
  },
  jobs,
});

console.log(`JobThai: ประกาศ ${jobs.length}/${total} รายการ · บันทึกที่ ${target}`);

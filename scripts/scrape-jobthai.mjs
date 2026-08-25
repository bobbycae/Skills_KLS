/* เก็บประกาศงานกาฬสินธุ์จาก JobThai
 *
 * JobThai เป็น Next.js และฝังผล Apollo GraphQL ไว้ใน __NEXT_DATA__ ของหน้ารายการ
 * จึงอ่านรายการได้ครบโดยไม่ต้องเรนเดอร์ JavaScript — ใช้ province "04" คือกาฬสินธุ์
 *
 * เนื้อประกาศอยู่ที่ /th/job/{id} ซึ่งเรนเดอร์ฝั่งเซิร์ฟเวอร์เต็มรูปแบบ
 * ระวังอย่าสับสนกับ /th/company/job/{id} ที่หน้ารายการลิงก์ไป — หน้านั้นแสดงโปรไฟล์บริษัท
 * และซ่อนเนื้องานไว้หลังปุ่ม "ดูรายละเอียดงาน" ดึงด้วย fetch แล้วจะได้หน้าเปล่า
 */

import { fetchText, inBatches, saveJson, sleep, stripHtml, today } from "./lib.mjs";

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
    url: `https://www.jobthai.com/th/job/${item.id}`,
    description: "",
    hasDescription: false,
  };
}

/* หน้ารายละเอียดวางเนื้อหาเรียงเป็น รายละเอียดงาน → คุณสมบัติผู้สมัคร → สวัสดิการ
   ตัดที่สวัสดิการเพราะย่อหน้านั้นพูดถึงประกันและการฝึกอบรม ซึ่งไม่ใช่ทักษะที่งานต้องการ */
async function fetchDescription(job) {
  try {
    const text = stripHtml(await fetchText(job.url));
    const start = text.search(/รายละเอียดงาน|คุณสมบัติผู้สมัคร/);
    if (start < 0) return job;
    const tail = text.slice(start);
    const stop = tail.search(/สวัสดิการ|วิธีการสมัคร|ติดต่อ\s/);
    const body = (stop > 200 ? tail.slice(0, stop) : tail).slice(0, 12000).trim();
    return { ...job, description: body, hasDescription: body.length > 120 };
  } catch (error) {
    return { ...job, detailError: error.message.slice(0, 160) };
  }
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

const jobs = await inBatches([...byId.values()], 6, fetchDescription);
const withDescription = jobs.filter(job => job.hasDescription).length;
console.log(`  ดึงเนื้อประกาศได้ ${withDescription}/${jobs.length}`);

const target = await saveJson("raw-jobthai.json", {
  meta: {
    source: SOURCE,
    sourceUrl: LIST_URL(PROVINCE),
    capturedAt: today(),
    reportedTotal: total,
    collected: jobs.length,
    pages,
    withDescription,
    inKalasin: jobs.length,
    note: "กรองด้วยรหัสจังหวัด 04 ที่ต้นทาง ทุกรายการจึงอยู่ในกาฬสินธุ์ · เนื้อประกาศอ่านจาก /th/job/{id} ซึ่งเรนเดอร์ฝั่งเซิร์ฟเวอร์",
  },
  jobs,
});

console.log(`JobThai: ประกาศ ${jobs.length}/${total} รายการ · มีเนื้อหา ${withDescription} · บันทึกที่ ${target}`);

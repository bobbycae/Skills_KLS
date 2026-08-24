/* รวมข้อมูลสามแหล่ง สกัดทักษะ แล้วสร้างไฟล์ข้อมูลสำหรับหน้าเว็บ
 *
 * หลักการนับที่ยึดตาม curriculum-graph: แยก "ที่มาของข้อมูล" ออกจาก "ฐานที่ใช้นับ"
 *   - รายการที่เก็บมาทั้งหมด = ที่มา ใช้ตรวจสอบย้อนกลับ ไม่ใช้คำนวณสถิติ
 *   - รายการที่ยืนยันว่าอยู่ในกาฬสินธุ์ = ฐานเดียวที่ใช้คำนวณจำนวนงานและสถิติทักษะ
 *
 * เหตุผล: ผลค้น "กาฬสินธุ์" ของ JOBTOPGUN เป็นระดับภาคอีสาน และ JOBBKK แทรกประกาศโฆษณา
 * ที่ไม่ผูกกับจังหวัด ถ้านับรวมทั้งหมดจะได้ภาพตลาดแรงงานที่เกินจริง
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR, ROOT, today } from "./lib.mjs";
import {
  SKILL_CATEGORIES, buildSkillCounts, inferRequirementsFromText, inferSkillsFromText,
} from "./skill-taxonomy-th.mjs";
import { writeFile } from "node:fs/promises";

const SOURCE_FILES = ["raw-jobthai.json", "raw-jobtopgun.json", "raw-jobbkk.json"];

const sources = [];
const rawJobs = [];
for (const filename of SOURCE_FILES) {
  const payload = JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8"));
  sources.push(payload.meta);
  rawJobs.push(...payload.jobs.filter(job => !job.error));
}

/* ---------- รวมประกาศซ้ำข้ามแหล่ง ---------- */

/* ประกาศเดียวกันมักลงหลายเว็บด้วยชื่อตำแหน่งและบริษัทเดียวกัน
   จึงสร้างคีย์จากชื่อที่ตัดช่องว่างและอักขระพิเศษออก แล้วเก็บที่มาไว้ทุกแหล่ง */
const normalise = value =>
  (value || "").toLowerCase().replace(/[\s\-–—()[\]/.,|]/g, "").replace(/บริษัท|จำกัด|มหาชน/g, "");

const merged = new Map();
for (const job of rawJobs) {
  const key = `${normalise(job.title)}::${normalise(job.company)}`;
  const existing = merged.get(key);
  if (!existing) {
    merged.set(key, { ...job, sources: [{ source: job.source, url: job.url, sourceId: job.sourceId }] });
    continue;
  }
  existing.sources.push({ source: job.source, url: job.url, sourceId: job.sourceId });
  /* ให้รายการที่มีเนื้องานชนะ เพราะใช้สกัดทักษะได้ */
  if (!existing.hasDescription && job.hasDescription) {
    existing.description = job.description;
    existing.hasDescription = true;
  }
  existing.inKalasin = existing.inKalasin || job.inKalasin;
  for (const field of ["salary", "location", "district", "employment"]) {
    if (!existing[field] && job[field]) existing[field] = job[field];
  }
}

/* ---------- สกัดทักษะ ---------- */

const jobs = [...merged.values()].map(job => {
  /* ประกาศจาก JobThai ไม่มีเนื้องาน จึงสกัดจากชื่อตำแหน่งเท่านั้น
     บันทึก skillMethod ไว้เพื่อให้หน้าเว็บบอกที่มาของทักษะแต่ละงานได้ */
  const haystack = `${job.title} ${job.description || ""}`;
  const skills = inferSkillsFromText(haystack);
  return {
    id: job.sourceId,
    title: job.title,
    company: job.company,
    location: job.location || job.district || "",
    district: job.district || "",
    salary: job.salary || "",
    employment: job.employment || "",
    url: job.url,
    sources: job.sources,
    inKalasin: Boolean(job.inKalasin ?? (job.province === "กาฬสินธุ์")),
    hasDescription: Boolean(job.hasDescription),
    skillMethod: job.hasDescription ? "เนื้อประกาศฉบับเต็ม" : "ชื่อตำแหน่งเท่านั้น",
    skills,
    requirements: inferRequirementsFromText(haystack),
    summary: (job.description || "").replace(/\s+/g, " ").slice(0, 320),
  };
});

const kalasinJobs = jobs.filter(job => job.inKalasin);

/* ---------- สถิติ ---------- */

const technical = buildSkillCounts(kalasinJobs).filter(s => s.category !== "ทักษะเชิงพฤติกรรม");
const soft = buildSkillCounts(kalasinJobs, { category: "ทักษะเชิงพฤติกรรม" });

const byCategory = SKILL_CATEGORIES.map(category => {
  const skills = buildSkillCounts(kalasinJobs, { category });
  return {
    category,
    skills,
    jobCount: kalasinJobs.filter(job => job.skills.some(s => s.category === category)).length,
  };
}).sort((a, b) => b.jobCount - a.jobCount);

const requirementCounts = (() => {
  const totals = new Map();
  for (const job of kalasinJobs) {
    for (const tag of job.requirements) totals.set(tag, (totals.get(tag) || 0) + 1);
  }
  return [...totals.entries()]
    .map(([name, count]) => ({
      name, count, percent: Math.round((count / (kalasinJobs.length || 1)) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
})();

const districts = (() => {
  const totals = new Map();
  for (const job of kalasinJobs) {
    const name = (job.district || job.location || "")
      .replace(/กาฬสินธุ์|\(|\)|ทุกเขต\/อำเภอ|จ\.|อ\./g, "").split(",")[0].trim();
    const key = name || "ไม่ระบุอำเภอ";
    totals.set(key, (totals.get(key) || 0) + 1);
  }
  return [...totals.entries()].map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
})();

const payload = {
  meta: {
    capturedAt: today(),
    builtAt: new Date().toISOString().slice(0, 10),
    collected: jobs.length,
    confirmedKalasin: kalasinJobs.length,
    withDescription: kalasinJobs.filter(job => job.hasDescription).length,
    companies: new Set(kalasinJobs.map(job => job.company).filter(Boolean)).size,
    withSalary: kalasinJobs.filter(job => job.salary).length,
    skillMethod: "จับคู่คำสำคัญด้วยทะเบียนทักษะภาษาไทย (ไม่ได้ใช้โมเดลภาษา)",
    sources,
  },
  stats: { technical, soft, byCategory, requirements: requirementCounts, districts },
  jobs: kalasinJobs,
  excluded: jobs.filter(job => !job.inKalasin).map(job => ({
    id: job.id, title: job.title, company: job.company,
    location: job.location, url: job.url, source: job.sources[0]?.source,
  })),
};

const target = path.join(ROOT, "src", "jobsData.json");
await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`เก็บมาทั้งหมด ${jobs.length} · ยืนยันกาฬสินธุ์ ${kalasinJobs.length} · มีเนื้อหา ${payload.meta.withDescription}`);
console.log(`ทักษะเทคนิค ${technical.length} · ทักษะพฤติกรรม ${soft.length} · อำเภอ ${districts.length}`);
console.log(`บันทึกที่ ${target}`);

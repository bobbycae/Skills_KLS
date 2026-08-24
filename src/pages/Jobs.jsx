import { useMemo, useState } from "react";
import data from "../jobsData.json";
import { PageHead, Section } from "./ui.jsx";

const { meta, jobs, stats } = data;
const ALL = "ทั้งหมด";
const skillOptions = [ALL, ...stats.technical.slice(0, 12).map(skill => skill.name)];

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState(ALL);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter(job => {
      if (skill !== ALL && !job.skills.some(item => item.name === skill)) return false;
      if (!needle) return true;
      return `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(needle);
    });
  }, [query, skill]);

  return (
    <>
      <PageHead
        eyebrow="ฐานข้อมูลประกาศงาน"
        title="ตำแหน่งงานในจังหวัดกาฬสินธุ์"
        lead={`ประกาศ ${meta.confirmedKalasin} รายการที่ยืนยันว่าระบุพื้นที่ปฏิบัติงานในกาฬสินธุ์ ทุกรายการลิงก์กลับไปยังประกาศต้นทางเพื่อตรวจสอบได้`}
      />

      <div className="wrap">
        <Section title={`พบ ${filtered.length} ตำแหน่ง`}>
          <div className="filters">
            <input
              type="search"
              placeholder="ค้นหาชื่อตำแหน่ง บริษัท หรือพื้นที่"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
            {skillOptions.map(option => (
              <button
                key={option}
                className={`btn${skill === option ? " on" : ""}`}
                onClick={() => setSkill(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="jobgrid">
            {filtered.map(job => (
              <article key={job.id} className="jobcard">
                <p className="jt">
                  <a href={job.url} target="_blank" rel="noreferrer noopener">{job.title || "(ไม่ระบุชื่อตำแหน่ง)"}</a>
                </p>
                {job.company && <p className="jc">{job.company}</p>}

                <div className="jmeta">
                  {job.location && <span>{job.location}</span>}
                  {job.salary && <span>{job.salary}</span>}
                  {job.employment && <span>{job.employment}</span>}
                  <span>{job.skillMethod}</span>
                  {job.sources.map(source => (
                    <span key={source.sourceId} className="srcpill">{source.source}</span>
                  ))}
                </div>

                {job.skills.length > 0 && (
                  <div className="tags">
                    {job.skills.map(item => (
                      <span key={item.name} className="tag">{item.name}</span>
                    ))}
                  </div>
                )}
                {job.skills.length === 0 && (
                  <p className="hint">ไม่พบทักษะที่ตรงกับทะเบียน — ประกาศนี้มีเพียงชื่อตำแหน่งสั้น ๆ</p>
                )}

                {job.requirements.length > 0 && (
                  <div className="tags">
                    {job.requirements.map(name => (
                      <span key={name} className="tag">{name}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="hint">ไม่พบประกาศที่ตรงกับเงื่อนไข ลองล้างคำค้นหรือเลือกทักษะอื่น</p>
          )}
        </Section>

        <div className="note">
          <b>ประกาศที่ตัดออก {data.excluded.length} รายการ</b> — เป็นผลค้นที่เว็บต้นทางคืนมาภายใต้คำค้น
          “กาฬสินธุ์” แต่เนื้อประกาศระบุพื้นที่ปฏิบัติงานเป็นภาคอีสานหรือจังหวัดอื่น
          จึงไม่นับรวมในสถิติทุกหน้า ดูเหตุผลได้ในหน้าระเบียบวิธี
        </div>
      </div>
    </>
  );
}

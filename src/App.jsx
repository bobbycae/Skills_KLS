import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import Skills from "./pages/Skills.jsx";
import Jobs from "./pages/Jobs.jsx";
import Method from "./pages/Method.jsx";
import NotFound from "./pages/NotFound.jsx";
import data from "./jobsData.json";

const NAV = [
  { to: "/", label: "หน้าแรก", end: true },
  { to: "/skills", label: "ทักษะที่ต้องการ" },
  { to: "/jobs", label: "ตำแหน่งงาน" },
  { to: "/method", label: "ระเบียบวิธีและข้อจำกัด" },
];

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="site">
      <header className="site-head">
        <div className="wrap head-in">
          <div className="brand">
            <div className="brand-mark">KLS</div>
            <div className="brand-txt">
              <b>ทักษะที่ตลาดแรงงานกาฬสินธุ์ต้องการ</b>
              <small>สกัดจากประกาศรับสมัครงานจริง · เก็บข้อมูล {data.meta.capturedAt}</small>
            </div>
          </div>
          <div className="head-chips">
            <span className="chip">{data.meta.confirmedKalasin} ตำแหน่ง</span>
            <span className="chip">{data.stats.technical.length} ทักษะเทคนิค</span>
            <span className="chip">3 แหล่งข้อมูล</span>
          </div>
        </div>
      </header>

      <nav className="site-nav">
        <div className="wrap nav-in">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>
          ))}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/method" element={<Method />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <b>ทักษะที่ตลาดแรงงานกาฬสินธุ์ต้องการ</b> · ข้อมูลประกอบการพัฒนาหลักสูตร มหาวิทยาลัยกาฬสินธุ์
          <div className="foot-note">
            รวบรวมจาก JobThai · JOBTOPGUN · JOBBKK เมื่อ {data.meta.capturedAt} ·
            สถิติทั้งหมดคำนวณจากประกาศ {data.meta.confirmedKalasin} รายการที่ยืนยันว่าอยู่ในจังหวัดกาฬสินธุ์เท่านั้น ·
            เป็นภาพช่วงเวลาหนึ่ง ไม่ใช่สำมะโนตลาดแรงงานทั้งจังหวัด
          </div>
          <div className="foot-by">
            สร้างโดย <b>Ronnachai Sangmuenmao</b>
            <span>Computer Engineering · Kalasin University</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

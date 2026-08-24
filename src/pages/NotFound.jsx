import { Link } from "react-router-dom";
import { PageHead } from "./ui.jsx";

export default function NotFound() {
  return (
    <>
      <PageHead title="ไม่พบหน้าที่ต้องการ" lead="ลิงก์อาจพิมพ์ผิดหรือถูกย้ายไปแล้ว" />
      <div className="wrap sect">
        <Link className="btn primary" to="/">กลับหน้าแรก</Link>
      </div>
    </>
  );
}

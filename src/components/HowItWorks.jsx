import React from 'react';
import { MousePointerClick, ImageUp, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick size={40} color="#ff3366" />,
      title: "1. Chọn Mẫu & Đặt Hàng",
      desc: "Trải nghiệm các mẫu web demo của chúng tôi và chọn mẫu bạn ưng ý nhất. Điền form thông tin đặt hàng."
    },
    {
      icon: <ImageUp size={40} color="#ff9933" />,
      title: "2. Gửi Ảnh & Lời Chúc",
      desc: "Gửi cho chúng tôi những bức ảnh kỷ niệm, câu đố cá nhân hóa và những lời chúc bí mật bạn muốn giấu trong Két Sắt."
    },
    {
      icon: <Rocket size={40} color="#27c93f" />,
      title: "3. Nhận Web & Gửi Tặng",
      desc: "Chỉ sau 24-48h, bạn sẽ nhận được một đường link trang web hoàn chỉnh để gửi cho người ấy vào đúng ngày đặc biệt."
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '80px' }}>
          Quy trình <span className="text-gradient">Đơn giản</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-dark)', borderRadius: '50%', padding: '15px', border: '1px solid var(--glass-border)' }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', margin: '40px 0 15px' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

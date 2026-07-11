import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const handleScrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: 0.3, borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '300px', height: '300px', background: 'var(--secondary-color)', filter: 'blur(120px)', opacity: 0.3, borderRadius: '50%' }}></div>

      <div className="container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Sparkles color="#ff9933" size={16} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Giải pháp Quà tặng Kỹ thuật số Xu hướng 2026</span>
        </div>
        
        <h1 style={{ fontSize: '4.5rem', marginBottom: '20px', letterSpacing: '-1px' }}>
          Tặng Quà <span className="text-gradient">Độc Bản</span><br /> Bằng Website Tương Tác
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Thay vì những món quà vật chất nhàm chán, hãy khiến người ấy bất ngờ với một trang web giải đố Escape Room chứa đựng kỷ niệm của riêng hai bạn.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button onClick={handleScrollToPricing} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Xem Bảng Giá <ArrowRight size={20} />
          </button>
          <a href="#showcase" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Xem Bản Mẫu
          </a>
        </div>
      </div>
    </section>
  );
}

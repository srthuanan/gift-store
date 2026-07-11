import React from 'react';
import { Gift, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" style={{ padding: '80px 0 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Gift color="#ff3366" size={28} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}><span className="text-gradient">GiftWeb</span> Studio</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Chuyên thiết kế và phát triển các trang web làm quà tặng tương tác. Món quà độc nhất vô nhị dành cho người bạn yêu thương.
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Liên hệ Đặt hàng</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={18} /> 0987.654.321 (Zalo)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={18} /> order@giftweb.studio</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={18} /> Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Sẵn sàng làm người ấy bất ngờ?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Nhắn tin cho chúng tôi ngay để được tư vấn kịch bản và chọn mẫu phù hợp.</p>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%' }}>Chat qua Zalo Ngay</a>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
          &copy; 2026 GiftWeb Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Gift } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{ padding: '20px 0', position: 'fixed', width: '100%', top: 0, zIndex: 100, background: 'rgba(15, 12, 41, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gift color="#ff3366" size={28} />
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}><span className="text-gradient">GiftWeb</span> Studio</h2>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#showcase" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Mẫu Web</a>
          <a href="#pricing" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Bảng Giá</a>
          <a href="#contact" className="btn btn-primary" style={{ padding: '8px 20px' }}>Đặt Làm Ngay</a>
        </div>
      </div>
    </nav>
  );
}

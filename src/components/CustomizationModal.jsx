import React, { useState, useRef } from 'react';
import { X, Upload, Eye, Image as ImageIcon, Check, ChevronRight, Lock, Heart } from 'lucide-react';

const S = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(3, 3, 6, 0.85)',
    backdropFilter: 'blur(16px)',
    zIndex: 2000,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '16px',
    boxSizing: 'border-box',
  },
  modal: {
    width: '100%', maxWidth: '960px',
    height: '85vh',
    background: 'linear-gradient(160deg, #12121a 0%, #0a0a0f 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    color: '#e2e2e8',
    fontFamily: "'Outfit', sans-serif",
  },
  sidebar: {
    width: '280px',
    background: 'rgba(255, 255, 255, 0.01)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '24px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  editorArea: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column', gap: '24px',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Outfit', sans-serif",
  },
  label: {
    fontSize: '0.75rem', fontWeight: '600',
    color: '#8b8b9f',
    textTransform: 'uppercase', letterSpacing: '1.5px',
    marginBottom: '8px',
    display: 'block',
  },
};

function ImageUploadSlot({ img, idx, onChange }) {
  const fileInputRef = useRef();
  return (
    <div 
      onClick={() => fileInputRef.current.click()}
      style={{
        aspectRatio: '1', borderRadius: '14px',
        border: img ? '1px solid rgba(255, 51, 102, 0.4)' : '1px dashed rgba(255, 255, 255, 0.15)',
        background: img ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
      }}
    >
      {img ? (
        <>
          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}
          >
            <Upload size={18} color="#fff" />
          </div>
        </>
      ) : (
        <>
          <ImageIcon size={20} color="#555" style={{ marginBottom: '6px' }} />
          <span style={{ fontSize: '0.72rem', color: '#555' }}>Ảnh {idx + 1}</span>
        </>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
    </div>
  );
}

export default function CustomizationModal({ isOpen, onClose }) {
  const [template, setTemplate] = useState('box');
  const [wishes, setWishes] = useState([
    "Lần đầu mình gặp gỡ...\nÁnh mắt em làm tim anh lỡ nhịp.",
    "Chuyến du lịch đầu tiên...\nNơi tiếng cười em hòa vào tiếng sóng.",
    "Những chiều bình yên bên em...\nThời gian như dừng lại trong hạnh phúc.",
    "Hành trình trọn đời bên nhau...\nAnh sẽ cùng em đi qua mọi giông bão.",
    "Chúc mừng sinh nhật anh yêu! ❤️"
  ]);
  const [anniversaryDate, setAnniversaryDate] = useState('1258');
  const [password, setPassword] = useState('23042026');
  const [images, setImages] = useState([null, null, null, null]);
  const [previewLoading, setPreviewLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const newImages = [...images];
        newImages[index] = canvas.toDataURL('image/jpeg', 0.72);
        setImages(newImages);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = () => {
    setPreviewLoading(true);
    localStorage.setItem('local_gift_preview', JSON.stringify({ wishes, images, anniversaryDate, password }));
    const url = template === 'box' ? '/demo-box/index.html?preview=true' : '/demo/index.html?preview=true';
    window.open(url, '_blank');
    setTimeout(() => setPreviewLoading(false), 1000);
  };

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        
        {/* Main Split Layout */}
        <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
          
          {/* Left Sidebar: Select Template & Status */}
          <div style={S.sidebar}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Mẫu Trực Quan</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Cấu hình trực tiếp món quà của bạn</div>
              </div>

              {/* Minimalist Selection */}
              <div>
                <span style={S.label}>Chọn Giao Diện</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { key: 'box', label: '🫙 Hũ Đom Đóm' },
                    { key: 'timeline', label: '📖 Memory Timeline' },
                  ].map(t => (
                    <button 
                      key={t.key} 
                      onClick={() => setTemplate(t.key)}
                      style={{
                        padding: '12px 16px', borderRadius: '12px', textAlign: 'left',
                        background: template === t.key ? 'rgba(255, 51, 102, 0.1)' : 'transparent',
                        border: template === t.key ? '1px solid rgba(255, 51, 102, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                        color: template === t.key ? '#ff3366' : '#999',
                        fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Action */}
            <button 
              onClick={onClose}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
              }}
            >
              Đóng Trình Tạo
            </button>
          </div>

          {/* Right Area: Form Controls */}
          <div style={S.editorArea}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>Cấu Hình Nội Dung</h2>
              <button 
                onClick={handlePreview}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff3366, #ff6633)',
                  border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(255,51,102,0.3)',
                }}
              >
                <Eye size={16} /> {previewLoading ? 'Đang mở...' : 'Xem Thử Giao Diện'}
              </button>
            </div>

            {/* 4 Photo slots side by side */}
            <div>
              <span style={S.label}>Tải Lên 4 Ảnh Kỷ Niệm</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {images.map((img, idx) => (
                  <ImageUploadSlot key={idx} img={img} idx={idx} onChange={e => handleImageChange(idx, e)} />
                ))}
              </div>
            </div>

            {/* Configurable wishes */}
            <div>
              <span style={S.label}>Lời Chúc Theo Từng Cột Mốc</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {wishes.slice(0, 4).map((w, idx) => (
                  <div key={idx}>
                    <span style={{ fontSize: '0.72rem', color: '#666', display: 'block', marginBottom: '4px' }}>Cột mốc {idx + 1}</span>
                    <textarea 
                      value={w}
                      onChange={e => {
                        const n = [...wishes];
                        n[idx] = e.target.value;
                        setWishes(n);
                      }}
                      rows={2}
                      style={{ ...S.input, resize: 'none' }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#666', display: 'block', marginBottom: '4px' }}>Lời chúc kết màn (Bức thư cuối)</span>
                <textarea 
                  value={wishes[4]}
                  onChange={e => {
                    const n = [...wishes];
                    n[4] = e.target.value;
                    setWishes(n);
                  }}
                  rows={3}
                  style={{ ...S.input, resize: 'none' }}
                />
              </div>
            </div>

            {/* Double column inputs for days & password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={S.label}>Số Ngày Kỷ Niệm</span>
                <input 
                  type="number" value={anniversaryDate} 
                  onChange={e => setAnniversaryDate(e.target.value)}
                  style={S.input}
                />
              </div>
              <div>
                <span style={S.label}>Mật Khẩu Bảo Mật (Nếu Có)</span>
                <input 
                  type="text" value={password} 
                  onChange={e => setPassword(e.target.value)}
                  style={S.input}
                />
              </div>
            </div>

          </div>

        </div>
        
      </div>
    </div>
  );
}

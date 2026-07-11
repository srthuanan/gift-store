import React, { useState, useRef } from 'react';
import { ExternalLink, CheckCircle2, Settings, Upload, Eye, Image as ImageIcon, MessageCircle, RefreshCw, CreditCard, Sparkles, Check } from 'lucide-react';
import { supabase } from '../supabase';

const S = {
  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
  },
  label: {
    fontSize: '0.7rem', fontWeight: '600',
    color: '#8b8b9f',
    textTransform: 'uppercase', letterSpacing: '1px',
    marginBottom: '6px',
    display: 'block',
  }
};

function MiniImageUpload({ img, idx, onChange, label }) {
  const fileRef = useRef();
  return (
    <div 
      onClick={() => fileRef.current.click()}
      style={{
        aspectRatio: '1', borderRadius: '10px',
        border: img ? '1px solid rgba(255, 51, 102, 0.4)' : '1px dashed rgba(255, 255, 255, 0.12)',
        background: img ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {img ? (
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <ImageIcon size={16} color="#444" />
          <span style={{ fontSize: '0.62rem', color: '#444', marginTop: '2px', textAlign: 'center', padding: '0 2px' }}>
            {label || `Ảnh ${idx + 1}`}
          </span>
        </>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
    </div>
  );
}

export default function DemoShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Configuration States
  const [customerPhone, setCustomerPhone] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('1258');
  const [password, setPassword] = useState('23042026');
  
  // Wishes
  const [wishes, setWishes] = useState([
    "Lần đầu mình gặp gỡ...\nÁnh mắt em làm tim anh lỡ nhịp.",
    "Chuyến du lịch đầu tiên...\nNơi tiếng cười em hòa vào tiếng sóng.",
    "Những chiều bình yên bên em...\nThời gian như dừng lại trong hạnh phúc.",
    "Hành trình trọn đời bên nhau...\nAnh sẽ cùng em đi qua mọi giông bão.",
    "Chúc mừng sinh nhật anh yêu! ❤️"
  ]);

  // Images for templates
  const [images, setImages] = useState([null, null, null, null]);

  // Simulated link generation
  const [generatedLink, setGeneratedLink] = useState('');

  const templates = [
    {
      id: "love-escape",
      name: "Love Escape Room",
      url: "/demo/index.html",
      price: 299000,
      priceFormatted: "299.000đ",
      desc: "Mẫu web quà tặng đình đám nhất của chúng tôi. Thay vì tặng thiệp giấy, người ấy sẽ phải giải các câu đố đáng yêu để 'mở khóa' từng kỷ niệm, và vỡ òa cảm xúc với màn chúc mừng sinh nhật hoành tráng ở cuối cùng.",
      features: [
        "Câu đố mật khẩu bảo vệ riêng tư",
        "Trò chơi vuốt thẻ như Tinder",
        "Nhắn tin tương tác giấu mật mã",
        "Bản đồ kỷ niệm định vị 15 bức ảnh",
        "Két sắt tình yêu",
        "Hiệu ứng sinh nhật hoành tráng",
        "Đồng hồ đếm ngày yêu nhau"
      ]
    },
    {
      id: "timeline",
      name: "Memory Timeline",
      url: "/demo-timeline/index.html",
      price: 199000,
      priceFormatted: "199.000đ",
      desc: "Mẫu giao diện mang phong cách điện ảnh (Cinematic) dành cho các cặp đôi thích sự tinh tế. Cùng cuộn ngược thời gian để nhìn lại hành trình yêu nhau với các bức ảnh Polaroid bay lơ lửng tuyệt đẹp.",
      features: [
        "Hiệu ứng Parallax Scrolling mượt mà",
        "Dòng thời gian hiển thị cột mốc",
        "Ảnh Polaroid lơ lửng không gian 3D",
        "Hiệu ứng lá rơi / tuyết rơi",
        "Bức thư tay tương tác ở cuối trang",
        "Nhạc nền du dương tự động phát"
      ]
    },
    {
      id: "memory-jar",
      name: "Hũ Kỷ Niệm",
      url: "/demo-box/index.html",
      price: 249000,
      priceFormatted: "249.000đ",
      desc: "Mẫu hũ thủy tinh đom đóm kỷ niệm đầy lãng mạn và có chiều sâu nghệ thuật. Người nhận sẽ chạm mở nắp hũ để giải phóng các đom đóm lơ lửng, mỗi chú đom đóm phát sáng chứa đựng một bức ảnh Polaroid và nhật ký ký ức ngọt ngào.",
      features: [
        "Thiết kế hũ thủy tinh phát sáng 3D cổ kính",
        "Hiệu ứng đom đóm bay lơ lửng ngẫu nhiên sinh động",
        "Tương tác chạm đom đóm mở ảnh Polaroid kỷ niệm",
        "Hiệu ứng hội tụ trái tim Neon lộng lẫy kết màn",
        "Bức thư tình cuối cùng viết tay lãng mạn",
        "Pháo hoa trái tim nổ tung chúc mừng"
      ]
    },
    {
      id: "stars",
      name: "Starry Constellations",
      url: "/demo-stars/index.html",
      price: 399000,
      priceFormatted: "399.000đ",
      desc: "Một bầu trời đêm đầy sao lấp lánh dành riêng cho buổi tỏ tình hay cầu hôn. Người ấy sẽ vẽ các đường nối các vì sao để giải mã thông điệp 'Will You Marry Me?' rực sáng giữa ngân hà.",
      features: [
        "Giao diện Dark Mode huyền bí",
        "Canvas bầu trời sao tương tác",
        "Vuốt để nối các vì sao thành chòm sao",
        "Ảnh ẩn giấu đằng sau các chòm sao",
        "Thông điệp rực sáng kết màn",
        "Tích hợp lời nhắn thoại bí mật"
      ]
    }
  ];

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const newImages = [...images];
        newImages[index] = canvas.toDataURL('image/jpeg', 0.7);
        setImages(newImages);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyConfiguration = () => {
    localStorage.setItem('local_gift_preview', JSON.stringify({ wishes, images, anniversaryDate, password }));
    setIframeKey(prev => prev + 1);
  };

  const resetConfiguration = () => {
    setImages([null, null, null, null]);
    localStorage.removeItem('local_gift_preview');
    setIframeKey(prev => prev + 1);
  };

  const handleGoToPayment = () => {
    if (!customerPhone) {
      alert("Vui lòng nhập Số điện thoại liên hệ để nhận link web!");
      return;
    }
    // Apply configuration one last time to make sure localStorage is updated
    applyConfiguration();
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    // Generate a unique ID for the customer's web gift
    const randomId = 'gift_' + Math.random().toString(36).substring(2, 10);
    const linkPath = templates[activeTab].id === 'love-escape' ? 'demo' : templates[activeTab].id === 'timeline' ? 'demo-timeline' : 'demo-box';
    const finalUrl = `${window.location.origin}/${linkPath}/index.html?id=${randomId}&gift=true`;

    try {
      const { error } = await supabase
        .from('gifts')
        .insert({
          id: randomId,
          template: templates[activeTab].id,
          anniversary_date: anniversaryDate,
          password: password,
          wishes: wishes,
          images: images,
          customer_phone: customerPhone
        });

      if (error) throw error;

      // Keep localStorage as temporary local cache
      localStorage.setItem(`gift_data_${randomId}`, JSON.stringify({ wishes, images, anniversaryDate, password }));

      setGeneratedLink(finalUrl);
      setShowPayment(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error saving configuration to Supabase:", err);
      alert("Đã xảy ra lỗi khi tạo quà tặng trên Cloud. Vui lòng thử lại!");
    }
  };

  const copyGeneratedLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Đã copy đường dẫn quà tặng thành công!");
  };

  // Render dynamic form matching current active template
  const renderDynamicForm = () => {
    const currentTpl = templates[activeTab].id;

    if (currentTpl === 'love-escape') {
      return (
        <>
          <div>
            <span style={S.label}>1. Tải lên 4 ảnh đôi</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {images.map((img, idx) => (
                <MiniImageUpload key={idx} img={img} idx={idx} onChange={e => handleImageChange(idx, e)} label={`Mảnh ${idx + 1}`} />
              ))}
            </div>
          </div>
          <div>
            <span style={S.label}>2. Lời chúc chặng đường (4 câu)</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
              {wishes.slice(0, 4).map((w, idx) => (
                <input 
                  key={idx}
                  type="text"
                  value={w.replace('\n', ' ')}
                  onChange={e => {
                    const n = [...wishes];
                    n[idx] = e.target.value;
                    setWishes(n);
                  }}
                  style={S.input}
                  placeholder={`Lời chúc ${idx + 1}`}
                />
              ))}
            </div>
            <span style={S.label}>Thư chúc mừng kết bài</span>
            <textarea 
              value={wishes[4]}
              onChange={e => {
                const n = [...wishes];
                n[4] = e.target.value;
                setWishes(n);
              }}
              rows={2}
              style={{ ...S.input, resize: 'none' }}
              placeholder="Lời chúc mừng sinh nhật..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <span style={S.label}>Số ngày đếm yêu</span>
              <input type="number" value={anniversaryDate} onChange={e => setAnniversaryDate(e.target.value)} style={S.input} />
            </div>
            <div>
              <span style={S.label}>Mật khẩu mở cửa (8 số)</span>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} style={S.input} />
            </div>
            <div>
              <span style={S.label}>Số điện thoại của bạn *</span>
              <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={S.input} placeholder="Nhập SĐT..." />
            </div>
          </div>
        </>
      );
    }

    if (currentTpl === 'timeline') {
      return (
        <>
          <div>
            <span style={S.label}>1. Tải lên 4 ảnh dọc (Polaroid)</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {images.map((img, idx) => (
                <MiniImageUpload key={idx} img={img} idx={idx} onChange={e => handleImageChange(idx, e)} label={`Ảnh bay ${idx + 1}`} />
              ))}
            </div>
          </div>
          <div>
            <span style={S.label}>2. Mốc thời gian & Mô tả</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {wishes.slice(0, 4).map((w, idx) => (
                <input 
                  key={idx}
                  type="text"
                  value={w.replace('\n', ' ')}
                  onChange={e => {
                    const n = [...wishes];
                    n[idx] = e.target.value;
                    setWishes(n);
                  }}
                  style={S.input}
                  placeholder={`Mốc kỷ niệm ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <span style={S.label}>3. Thư tay cuối trang</span>
              <textarea 
                value={wishes[4]}
                onChange={e => {
                  const n = [...wishes];
                  n[4] = e.target.value;
                  setWishes(n);
                }}
                rows={2}
                style={{ ...S.input, resize: 'none' }}
              />
            </div>
            <div>
              <span style={S.label}>Số điện thoại của bạn *</span>
              <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ ...S.input, height: '46px', marginTop: '4px' }} placeholder="Nhập SĐT..." />
            </div>
          </div>
        </>
      );
    }

    if (currentTpl === 'memory-jar') {
      return (
        <>
          <div>
            <span style={S.label}>1. Tải lên 4 ảnh đom đóm</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {images.map((img, idx) => (
                <MiniImageUpload key={idx} img={img} idx={idx} onChange={e => handleImageChange(idx, e)} label={`Hũ ảnh ${idx + 1}`} />
              ))}
            </div>
          </div>
          <div>
            <span style={S.label}>2. Thư ký ức khi chạm đom đóm (4 câu)</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
              {wishes.slice(0, 4).map((w, idx) => (
                <input 
                  key={idx}
                  type="text"
                  value={w.replace('\n', ' ')}
                  onChange={e => {
                    const n = [...wishes];
                    n[idx] = e.target.value;
                    setWishes(n);
                  }}
                  style={S.input}
                  placeholder={`Lời chúc đom đóm ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <span style={S.label}>Đồng hồ đếm ngày</span>
              <input type="number" value={anniversaryDate} onChange={e => setAnniversaryDate(e.target.value)} style={S.input} />
            </div>
            <div>
              <span style={S.label}>Lời chúc phong thư kết</span>
              <input type="text" value={wishes[4]} onChange={e => { const n = [...wishes]; n[4] = e.target.value; setWishes(n); }} style={S.input} />
            </div>
            <div>
              <span style={S.label}>Số điện thoại của bạn *</span>
              <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={S.input} placeholder="Nhập SĐT..." />
            </div>
          </div>
        </>
      );
    }

    return (
      <div style={{ padding: '20px 0', textShadow: 'none', color: '#ff3366', textAlign: 'center', fontWeight: '600' }}>
        🌌 Giao diện tỏ tình ngân hà Starry sử dụng file ghi âm & vẽ hình chòm sao không hỗ trợ live custom ảnh.
      </div>
    );
  };

  return (
    <section id="showcase" className="section" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>
          Trải nghiệm <span className="text-gradient">Các Mẫu Web Nổi Bật</span>
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {templates.map((tpl, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setActiveTab(idx);
                setIsConfiguring(false);
                setShowPayment(false);
                setShowSuccess(false);
              }}
              className={activeTab === idx ? "btn btn-primary" : "btn btn-outline"}
              style={{ padding: '10px 20px', minWidth: '150px' }}
            >
              {tpl.name}
            </button>
          ))}
        </div>
 
        <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 340px) 1fr', gap: '40px', padding: '40px', alignItems: 'center' }}>
          
          {/* Left Block: Simulated Phone Frame */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', width: '100%', maxWidth: '340px' }}>
            <div style={{ background: '#2d3436', padding: '10px', display: 'flex', gap: '6px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <div style={{ height: '600px', background: '#111', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden' }}>
               <div style={{ width: '274px', height: '593px', marginTop: '5px', overflow: 'hidden', borderRadius: '25px' }}>
                   <div style={{ width: '375px', height: '812px', transform: 'scale(0.73)', transformOrigin: 'top left' }}>
                       <iframe 
                         key={iframeKey}
                         src={showSuccess ? `${generatedLink}` : `${templates[activeTab].url}?preview=true&v=${iframeKey}`} 
                         style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} 
                         title={templates[activeTab].name} 
                       />
                   </div>
               </div>
               <a 
                 href={showSuccess ? generatedLink : `${templates[activeTab].url}?preview=true`}
                 target="_blank" 
                 rel="noreferrer" 
                 style={{ 
                   position: 'absolute', 
                   bottom: '15px', 
                   left: '50%', 
                   transform: 'translateX(-50%)', 
                   padding: '6px 14px', 
                   fontSize: '0.78rem', 
                   background: 'rgba(0, 0, 0, 0.65)', 
                   backdropFilter: 'blur(5px)',
                   border: '1px solid rgba(255, 255, 255, 0.15)',
                   borderRadius: '20px',
                   color: '#aaa',
                   textDecoration: 'none',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px',
                   boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer'
                 }}
               >
                 Toàn màn hình <ExternalLink size={12} />
               </a>
            </div>
          </div>
 
          {/* Right Block: Showcase OR Configurations OR Payment OR Success */}
          <div>
            {/* 1. Success UI */}
            {showSuccess && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(39,201,63,0.1)', border: '2px solid #27c93f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <Check size={32} color="#27c93f" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: '#fff', margin: '0 0 8px' }}>Tạo Link Quà Tặng Thành Công!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Giao diện của bạn đã được xuất ra hệ thống cloud riêng.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px 16px' }}>
                  <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'inline-block' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}`}
                      alt="Mã QR Quà Tặng"
                      style={{ width: '160px', height: '160px', display: 'block' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#ff3366', fontWeight: '600', letterSpacing: '0.5px' }}>
                    QUÉT MÃ QR ĐỂ NHẬN QUÀ TẶNG 🎁
                  </span>
                  
                  {/* Download QR Button */}
                  <button 
                    onClick={async () => {
                      try {
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generatedLink)}`;
                        const response = await fetch(qrUrl);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = 'ma_qr_qua_tang.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                      } catch (err) {
                        console.error("Lỗi tải ảnh QR:", err);
                        alert("Không thể tải trực tiếp. Bạn vui lòng chụp màn hình hoặc lưu ảnh QR trên nhé!");
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                  >
                    📥 Tải Mã QR Về Máy
                  </button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', wordBreak: 'break-all' }}>
                  <span style={S.label}>Hoặc copy đường dẫn riêng</span>
                  <a href={generatedLink} target="_blank" rel="noreferrer" style={{ color: '#aaa', fontWeight: '500', fontSize: '0.88rem', textDecoration: 'underline' }}>
                    {generatedLink}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={copyGeneratedLink} className="btn btn-primary" style={{ flex: 1, padding: '12px 0' }}>
                    Copy Đường Dẫn
                  </button>
                  <button onClick={() => setShowSuccess(false)} className="btn btn-outline" style={{ flex: 1, padding: '12px 0', borderColor: 'rgba(255,255,255,0.1)' }}>
                    Tiếp tục tạo mẫu mới
                  </button>
                </div>
              </div>
            )}

            {/* 2. Payment UI */}
            {!showSuccess && showPayment && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} color="#ff3366" /> Thanh toán tự động
                  </h4>
                  <button 
                    onClick={() => setShowPayment(false)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    Quay lại
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ background: '#fff', padding: '6px', borderRadius: '10px' }}>
                    <img 
                      src={`https://img.vietqr.io/image/MB-1133224455-compact2.png?amount=${templates[activeTab].price}&addInfo=GIFT${customerPhone}&accountName=NGUYEN%20VAN%20A`} 
                      alt="VietQR"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <div>Mẫu: <strong style={{ color: '#fff' }}>{templates[activeTab].name}</strong></div>
                    <div>Giá tiền: <strong style={{ color: '#fbbf24' }}>{templates[activeTab].priceFormatted}</strong></div>
                    <div>Số tài khoản: <strong style={{ color: '#fff' }}>1133224455 (MB Bank)</strong></div>
                    <div>Nội dung: <strong style={{ color: '#86efac' }}>GIFT{customerPhone}</strong></div>
                  </div>
                </div>

                <button 
                  onClick={handlePaymentSuccess}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px 0', fontSize: '1rem', background: '#22c55e', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Sparkles size={18} /> Tôi đã chuyển khoản xong
                </button>
              </div>
            )}

            {/* 3. Normal Showcase OR Customization Form */}
            {!showSuccess && !showPayment && (
              <>
                {!isConfiguring ? (
                  <>
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }} className="text-gradient">{templates[activeTab].name}</h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: 1.6 }}>
                      {templates[activeTab].desc}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
                      {templates[activeTab].features.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 color="#27c93f" size={20} style={{ minWidth: '20px' }} />
                          <span style={{ fontSize: '1.05rem' }}>{item}</span>
                        </div>
                      ))}
                    </div>
         
                    <div style={{ display: 'flex', gap: '15px' }}>
                      {templates[activeTab].id !== 'stars' && (
                        <button 
                          onClick={() => {
                            setIsConfiguring(true);
                            applyConfiguration();
                          }}
                          className="btn btn-outline" 
                          style={{ flex: 1, padding: '16px 0', border: '1px solid #ff3366', color: '#ff3366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                          <Settings size={18} /> Thử cấu hình mẫu này
                        </button>
                      )}
                      <a href="#pricing" className="btn btn-primary" style={{ flex: 1, padding: '16px 0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Xem Bảng Giá
                      </a>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Bảng Cấu Hình - {templates[activeTab].name}</h4>
                      <button 
                        onClick={() => setIsConfiguring(false)}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                      >
                        Quay lại giới thiệu
                      </button>
                    </div>

                    {/* Render Form Inputs specific to the active template */}
                    {renderDynamicForm()}

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                      <button 
                        onClick={applyConfiguration}
                        className="btn btn-outline" 
                        style={{ flex: 1, padding: '12px 0', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <RefreshCw size={14} /> Cập nhật xem thử
                      </button>
                      
                      <button 
                        onClick={handleGoToPayment}
                        className="btn btn-primary" 
                        style={{ flex: 2, padding: '12px 0', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none' }}
                      >
                        <CreditCard size={16} /> Thanh toán đặt mua web
                      </button>

                      <button 
                        onClick={resetConfiguration}
                        className="btn btn-outline" 
                        style={{ padding: '12px 15px', fontSize: '0.9rem', cursor: 'pointer', borderColor: 'rgba(255,255,255,0.1)', color: '#888' }}
                      >
                        Đặt lại
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

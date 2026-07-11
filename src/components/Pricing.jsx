import React from 'react';
import { Check, MessageCircle } from 'lucide-react';

const ZALO_LINK = 'https://zalo.me/0987654321';

export default function Pricing() {
  const plans = [
    {
      name: "Cơ Bản",
      price: "199.000đ",
      features: [
        "Sử dụng template có sẵn",
        "Thay đổi nội dung text",
        "Thay tối đa 5 hình ảnh",
        "Link web dạng tên miền chung",
        "Lưu trữ trong 1 tháng"
      ],
      recommended: false
    },
    {
      name: "Cao Cấp",
      price: "499.000đ",
      features: [
        "Mọi thứ trong gói Cơ Bản",
        "Thay đổi lên đến 20 hình ảnh",
        "Thay đổi nội dung câu đố mật mã",
        "Tích hợp nhạc nền tự chọn",
        "Lưu trữ vĩnh viễn trên Netlify"
      ],
      recommended: true
    },
    {
      name: "Độc Bản (VIP)",
      price: "999.000đ",
      features: [
        "Mọi thứ trong gói Cao Cấp",
        "Thiết kế riêng giao diện và cốt truyện",
        "Tên miền riêng (vd: tenban.com)",
        "Video chúc mừng tự động phát",
        "Hỗ trợ kỹ thuật 24/7"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="section" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
          Bảng Giá <span className="text-gradient">Dịch Vụ</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '60px', fontSize: '1.2rem' }}>
          Chọn gói phù hợp để tạo nên món quà bất ngờ nhất.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
          {plans.map((plan, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '40px 30px', border: plan.recommended ? '2px solid var(--primary-color)' : '', transform: plan.recommended ? 'scale(1.05)' : 'none', position: 'relative' }}>
              {plan.recommended && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'linear-gradient(90deg, #ff3366, #ff9933)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  ĐƯỢC YÊU THÍCH NHẤT
                </div>
              )}
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{plan.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }} className="text-gradient">{plan.price}</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={20} color={plan.recommended ? '#ff3366' : '#27c93f'} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`${ZALO_LINK}?text=${encodeURIComponent(`Mình muốn đặt gói ${plan.name} (${plan.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={plan.recommended ? "btn btn-primary" : "btn btn-outline"}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', boxSizing: 'border-box', textDecoration: 'none',
                  border: plan.recommended ? 'none' : '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <MessageCircle size={18} /> Đặt hàng qua Zalo
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

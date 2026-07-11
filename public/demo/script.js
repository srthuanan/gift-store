document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const hbdMusic = document.getElementById('hbdMusic');
    bgMusic.volume = 0.5;
    hbdMusic.volume = 0.8;

    function vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }

    function switchStage(fromId, toId) {
        document.getElementById(fromId).classList.remove('active');
        document.getElementById(toId).classList.add('active');
    }
    window.switchStage = switchStage;

    // Check for local preview or generated gift link
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    const giftId = urlParams.get('id');
    const isGiftLink = isPreview || giftId;
    
    // *** IMMEDIATELY skip password gate if in preview mode ***
    if (isPreview) {
        switchStage('stage-gate', 'stage-swipe');
        // Preview banner
        const previewBanner = document.createElement('div');
        previewBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#ff3366,#ff9933);color:#fff;text-align:center;font-size:0.72rem;font-weight:700;letter-spacing:1.5px;padding:5px;font-family:Outfit,sans-serif;text-transform:uppercase';
        previewBanner.innerText = '✦ CHẾ ĐỘ XEM THỬ – KHÔNG PHẢI BẢN THẬT ✦';
        document.body.appendChild(previewBanner);
    }
    
    let GATE_PASS = "23042026"; // Đổi pass thành ngày gặp nhau
    let START_DATE = new Date("2026-04-23T00:00:00");
    let customImages = ["images/demo_couple.png", "images/demo_couple.png", "images/demo_couple.png", "images/demo_couple.png"];
    let customWishes = [
        "Lần đầu mình gặp gỡ...\nÁnh mắt em làm tim anh lỡ nhịp.",
        "Chuyến du lịch đầu tiên...\nNơi tiếng cười em hòa vào tiếng sóng.",
        "Những chiều bình yên bên em...\nThời gian như dừng lại trong hạnh phúc.",
        "Hành trình trọn đời bên nhau...\nAnh sẽ cùng em đi qua mọi giông bão."
      ];
    let customMainWish = "Chúc mừng sinh nhật anh người yêu của em! Tuổi mới luôn vui vẻ và hạnh phúc nhé. Cảm ơn anh vì đã luôn yêu thương và che chở cho em suốt thời gian qua. ❤️";
    
    // Initialize Supabase client
    const supabaseUrl = 'https://yuprzftcvawqybjixkmt.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHJ6ZnRjdmF3cXliaml4a210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzQ5MjksImV4cCI6MjA5OTMxMDkyOX0.6veKPAL05Ge24yhHxuZUHZXB-YVVMSTAgN1kZYgf1qQ';
    const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    async function loadGiftConfiguration() {
        if (isPreview) {
            const previewData = localStorage.getItem('local_gift_preview');
            if (previewData) {
                applyData(JSON.parse(previewData));
            }
        } else if (giftId && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('gifts')
                    .select('*')
                    .eq('id', giftId)
                    .single();
                if (error) throw error;
                if (data) {
                    applyData({
                        password: data.password,
                        anniversaryDate: data.anniversary_date,
                        images: data.images,
                        wishes: data.wishes
                    });
                }
            } catch(e) {
                console.error("Supabase load error, checking localStorage fallback", e);
                const localData = localStorage.getItem(`gift_data_${giftId}`);
                if (localData) applyData(JSON.parse(localData));
            }
        }
    }

    function applyData(data) {
        if (data.password) {
            GATE_PASS = data.password;
        }
        if (data.anniversaryDate) {
            const daysAgo = parseInt(data.anniversaryDate) || 0;
            if (daysAgo > 0) {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() - daysAgo);
                START_DATE = targetDate;
                // Re-calculate anniversary clock if function exists
                if (typeof updateLoveTimer === 'function') updateLoveTimer();
            }
        }
        if (data.images && data.images.length > 0) {
            for(let i = 0; i < 4; i++) {
                if(data.images[i]) customImages[i] = data.images[i];
            }
        }
        if (data.wishes && data.wishes.length > 0) {
            for(let i = 0; i < 4; i++) {
                if(data.wishes[i]) customWishes[i] = data.wishes[i];
            }
        }
        if (data.wishes && data.wishes[4]) {
            customMainWish = data.wishes[4];
        }

        // Apply dynamically to DOM
        const tc = document.getElementById('tinderCard');
        if (tc) {
            tc.style.backgroundImage = `url('${customImages[0]}')`;
        }
        
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('demo_couple.png') || img.src.endsWith('demo_couple.png') || img.getAttribute('src').includes('demo_couple.png')) {
                img.src = customImages[0];
            }
        });
        
        const hbdSub = document.getElementById('hbdSub');
        if (hbdSub) {
            hbdSub.innerText = customMainWish;
        }
    }

    // Run loader immediately
    loadGiftConfiguration();


    // --- STAGE 0: GATE ---
    const gateBtn = document.getElementById('gateBtn');
    const gatePassInput = document.getElementById('gatePass');
    
    gateBtn.addEventListener('click', () => {
        if (gatePassInput.value === GATE_PASS) {
            vibrate(50);
            switchStage('stage-gate', 'stage-swipe');
            bgMusic.play().catch(e=>console.log(e));
        } else {
            vibrate([50, 50, 50]);
            const box = document.querySelector('.lock-box');
            box.classList.add('shake');
            setTimeout(() => box.classList.remove('shake'), 400);
            gatePassInput.value = '';
        }
    });

    // --- STAGE 1: SWIPE ---
    const tinderCard = document.getElementById('tinderCard');
    const hammer = new Hammer(tinderCard);
    
    hammer.on('pan', (e) => {
        const x = e.deltaX;
        tinderCard.style.transform = `translate(${x}px, ${e.deltaY}px) rotate(${x*0.05}deg)`;
        tinderCard.style.transition = 'none';
    });
    hammer.on('panend', (e) => {
        tinderCard.style.transition = 'transform 0.4s ease-out';
        if (e.deltaX > 100) { 
            tinderCard.style.transform = `translate(1000px, ${e.deltaY}px) rotate(45deg)`;
            vibrate(100);
            if(window.confetti) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#ff4b2b', '#2ecc71'] });
            setTimeout(() => {
                switchStage('stage-swipe', 'stage-puzzle');
                initPuzzle();
            }, 500);
        } else if (e.deltaX < -100) { 
            vibrate([50, 50]); 
            tinderCard.style.transform = `translate(-1000px, ${e.deltaY}px) rotate(-45deg)`;
            setTimeout(() => {
                alert("Ơ ơ kìa... vuốt sang phải chứ!");
                tinderCard.style.transform = 'translate(0px, 0px) rotate(0deg)'; 
            }, 300);
        } else { 
            tinderCard.style.transform = 'translate(0px, 0px) rotate(0deg)';
        }
    });

    // --- STAGE 2: PUZZLE ---
    let puzzleSolved = false;
    function initPuzzle() {
        if(puzzleSolved) return;
        const board = document.getElementById('puzzleBoard');
        board.innerHTML = '';
        const order = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
        let selectedTile = null;

        order.forEach((val, index) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-piece';
            tile.dataset.correct = val;
            tile.dataset.current = index;
            tile.style.backgroundImage = `url('${customImages[0]}')`;
            
            // 270x480 ratio math
            const row = Math.floor(val / 3);
            const col = val % 3;
            tile.style.backgroundPosition = `-${col * 90}px -${row * 160}px`;
            
            tile.addEventListener('click', () => {
                if(selectedTile === null) {
                    selectedTile = tile;
                    tile.classList.add('selected');
                    vibrate(20);
                } else {
                    if(selectedTile !== tile) {
                        const cur1 = selectedTile.dataset.current;
                        const cur2 = tile.dataset.current;
                        const next1 = selectedTile.nextSibling;
                        const next2 = tile.nextSibling;
                        board.insertBefore(tile, next1);
                        board.insertBefore(selectedTile, next2);
                        selectedTile.dataset.current = cur2;
                        tile.dataset.current = cur1;
                        vibrate(40);
                        checkPuzzleWin();
                    }
                    selectedTile.classList.remove('selected');
                    selectedTile = null;
                }
            });
            board.appendChild(tile);
        });
    }

    function checkPuzzleWin() {
        const tiles = document.querySelectorAll('.puzzle-piece');
        let win = true;
        tiles.forEach((t, i) => { if(parseInt(t.dataset.correct) !== i) win = false; });
        if(win) {
            puzzleSolved = true;
            vibrate([100, 50, 100]);
            if(window.confetti) confetti();
            setTimeout(() => {
                switchStage('stage-puzzle', 'stage-chat');
                startMessenger();
            }, 1500);
        }
    }
    window.skipPuzzle = () => { checkPuzzleWin(); puzzleSolved = true; switchStage('stage-puzzle', 'stage-chat'); startMessenger(); };

    // --- STAGE 3: MESSENGER (SINH NHẬT) ---
    const messages = [
        { text: "Anh qua được bàn ghép hình rồi hả 😍", type: "received", delay: 1000 },
        { text: "Dễ ẹc à hehe.", type: "sent", delay: 2500 },
        { text: "Thế để em đố anh câu này nhé, xem anh có tinh ý không nha.", type: "received", delay: 4500 },
        { text: `<img src='${customImages[0]}'>`, type: "received", delay: 6000 },
        { text: "Tình yêu của em dành cho anh xuất phát từ con tim chân thành, KHÔNG vụ lợi ❤️", type: "received", delay: 9000 },
        { text: "Em luôn mong chúng mình sẽ vững vàng gắn bó như kiềng BA chân.", type: "received", delay: 12000 },
        { text: "Bởi vì trên thế giới này, ĐÔI ta là duy nhất! 🥰", type: "received", delay: 15000 },
        { text: "Anh đã nhặt ra được 3 con số kỳ diệu từ những câu trên chưa ta?", type: "received", delay: 18000 },
        { text: "Nếu giải được rồi, thì mở bản đồ lên đi tìm 'Tình yêu của em' đi nào! Cố lên chồng yêu!", type: "received", delay: 21000 }
    ];

    function startMessenger() {
        const chatArea = document.getElementById('chatArea');
        const typeIndicator = document.getElementById('typeIndicator');
        chatArea.innerHTML = ''; 
        
        messages.forEach((msg, i) => {
            setTimeout(() => {
                typeIndicator.innerText = msg.type === 'received' ? "Người ấy đang gõ..." : "Bạn đang gõ...";
                typeIndicator.style.opacity = 1;
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = `message ${msg.type}`;
                    div.innerHTML = msg.text;
                    chatArea.appendChild(div);
                    typeIndicator.style.opacity = 0; 
                    vibrate(30);
                    setTimeout(() => div.classList.add('show'), 50);
                    chatArea.scrollTop = chatArea.scrollHeight;
                    if (i === messages.length - 1) {
                        setTimeout(() => switchStage('stage-chat', 'stage-map'), 4500);
                    }
                }, 1000);
            }, msg.delay);
        });
    }

    // --- STAGE 4: MAP ---
    const viewedImages = new Set();
    const TOTAL_PINS = 13;

    window.openMapMsg = (el, txt, img) => {
        let finalImg = img;
        let finalTxt = txt;
        
        if (isPreview) {
            const pins = Array.from(document.querySelectorAll('.pin:not(.vault-pin)'));
            const pinIndex = pins.indexOf(el);
            if (pinIndex !== -1) {
                const wishIdx = pinIndex % 4;
                finalImg = customImages[wishIdx];
                finalTxt = customWishes[wishIdx];
            }
        }
        
        document.getElementById('polaroidImg').src = finalImg;
        document.getElementById('mapText').innerText = finalTxt;
        document.getElementById('mapModal').classList.add('active');
        vibrate(20);

        // Ẩn điểm ghim đi
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';

        viewedImages.add(el);
        if(viewedImages.size === TOTAL_PINS) {
            document.getElementById('vaultPin').style.display = 'flex';
        }
    };
    window.closeMapMsg = () => { document.getElementById('mapModal').classList.remove('active'); };
    window.goToVault = () => { vibrate(50); switchStage('stage-map', 'stage-vault'); };

    // --- STAGE 5: VAULT (Mật mã 032) ---
    const VAULT_CODE = "032"; // 32 tuổi
    let enteredCode = "";
    const vaultDisplay = document.getElementById('vaultDisplay');
    const vaultError = document.getElementById('vaultError');

    window.pressKey = (num) => {
        vibrate(20);
        if(enteredCode.length < 3) { enteredCode += num; updateVaultDisplay(); }
    };
    window.clearVault = () => { vibrate(20); enteredCode = ""; updateVaultDisplay(); vaultError.style.opacity = 0; };
    window.checkVault = () => {
        if(enteredCode === VAULT_CODE) {
            vibrate([100, 50, 100]);
            vaultDisplay.style.color = "#fff";
            vaultDisplay.style.background = "#2ecc71";
            setTimeout(() => {
                switchStage('stage-vault', 'stage-final');
                
                // Suspense Mode
                const suspenseText = document.getElementById('suspenseText');
                suspenseText.style.opacity = 1;
                
                setTimeout(() => {
                    suspenseText.innerText = "Phát hiện sự kiện bất thường...";
                }, 2000);

                setTimeout(() => {
                    suspenseText.innerText = "Anh tưởng đây chỉ là trò chơi thôi sao?";
                }, 4000);
                
                setTimeout(() => {
                    suspenseText.style.opacity = 0;
                }, 6000);

                setTimeout(() => {
                    suspenseText.style.display = 'none';
                    document.getElementById('cakeContainer').style.display = 'block';
                }, 7500);

            }, 1000);
        } else {
            vibrate([50, 50, 50]);
            vaultError.style.opacity = 1;
            const vc = document.querySelector('.vault-container');
            vc.classList.add('shake');
            setTimeout(() => vc.classList.remove('shake'), 400);
            setTimeout(() => { window.clearVault(); }, 800);
        }
    };
    function updateVaultDisplay() {
        let display = enteredCode;
        while(display.length < 3) display += "_";
        vaultDisplay.innerText = display.split('').join(' ');
    }

    // --- STAGE 6: CAKE & SCRATCH (Birthday Finale) ---
    let candlesBlown = 0;
    window.blowCandle = (candleElement) => {
        if(candleElement.classList.contains('blown')) return;
        candleElement.classList.add('blown');
        vibrate(30);
        candlesBlown++;
        
        if(candlesBlown === 3) {
            // Đã thổi hết 3 nến
            vibrate([100, 100, 100, 100]);
            bgMusic.pause(); // Tắt nhạc lãng mạn
            hbdMusic.play(); // Bật nhạc sinh nhật
            
            // Hiệu ứng background & gallery cực mạnh
            const finalStage = document.getElementById('stage-final');
            finalStage.style.background = "linear-gradient(135deg, #1a1a2e, #ff00cc, #333399)";
            finalStage.style.backgroundSize = "400% 400%";
            finalStage.style.animation = "gradientBG 10s ease infinite";
            
            setTimeout(() => {
                document.getElementById('floatingGallery').style.display = 'block';
                if (isPreview) {
                    const floatImgs = document.querySelectorAll('.float-img');
                    floatImgs.forEach((img, idx) => {
                        img.src = customImages[idx % customImages.length];
                    });
                }
                setTimeout(() => document.getElementById('floatingGallery').style.opacity = '1', 100);
            }, 500);

            // Bắn pháo giấy liên tục cực đã (10 giây)
            const duration = 10000;
            const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 8, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#ff0000', '#00ff00', '#0000ff', '#f1c40f'] });
                confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#ff0000', '#00ff00', '#0000ff', '#f1c40f'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());

            // Ẩn bánh, hiện quà và thư
            setTimeout(() => {
                document.getElementById('cakeContainer').style.display = 'none';
                document.getElementById('hbdText').style.display = 'block';
                document.getElementById('hbdSub').style.display = 'block';
                document.getElementById('timerContainer').style.display = 'block';
                document.getElementById('scratchSection').style.display = 'block';
                startTimer();
                initScratchCard();
            }, 1500);
        }
    };

    // --- STAGE 6: FINAL TIMER & SCRATCH ---
    function startTimer() {
        function updateTimer() {
            const now = new Date();
            const diff = now - START_DATE;
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            const format = (n) => n < 10 ? '0' + n : n;

            document.getElementById('tYears').innerText = years;
            document.getElementById('tMonths').innerText = format(months);
            document.getElementById('tDays').innerText = format(days);
            document.getElementById('tHours').innerText = format(hours);
            document.getElementById('tMins').innerText = format(mins);
            document.getElementById('tSecs').innerText = format(secs);
        }
        updateTimer(); setInterval(updateTimer, 1000);
    }

    function initScratchCard() {
        if (isPreview) {
            const prizeImg = document.querySelector('.scratch-prize img');
            if (prizeImg) prizeImg.src = customImages[0];
        }
        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        const wrap = document.querySelector('.scratch-wrap');
        canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight;
        ctx.fillStyle = '#bdc3c7'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "20px Outfit"; ctx.fillStyle = "#7f8c8d"; ctx.textAlign = "center";
        ctx.fillText("CÀO MẠNH LẤY QUÀ!", canvas.width / 2, canvas.height / 2);

        let isDrawing = false, scratchedPixels = 0, finished = false;
        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
            const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }
        function scratch(e) {
            if (!isDrawing || finished) return;
            e.preventDefault(); 
            const pos = getMousePos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI); ctx.fill();
            scratchedPixels++;
            if(scratchedPixels % 5 === 0) vibrate(10);
            if (scratchedPixels > 70) { 
                finished = true; ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none';
                vibrate([100, 50, 100]);
                if(window.confetti) confetti({ particleCount: 150, spread: 100, origin: { y: 0.8 }, zIndex: 1000 });
            }
        }
        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        window.addEventListener('touchend', () => isDrawing = false);
    }
});

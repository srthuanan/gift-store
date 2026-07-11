document.addEventListener('DOMContentLoaded', () => {
    // 1. Check URL parameters for preview or giftId
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    const giftId = urlParams.get('id');

    let customImages = [
        "../demo-timeline/images/photo_1.png",
        "../demo-timeline/images/photo_2.png",
        "../demo-timeline/images/photo_3.png",
        "../demo-timeline/images/photo_4.png"
    ];
    let customWishes = [
        "Lần đầu mình gặp gỡ...\nÁnh mắt em làm tim anh lỡ nhịp.",
        "Chuyến du lịch đầu tiên...\nNơi tiếng cười em hòa vào tiếng sóng.",
        "Những chiều bình yên bên em...\nThời gian như dừng lại trong hạnh phúc.",
        "Hành trình trọn đời bên nhau...\nAnh sẽ cùng em đi qua mọi giông bão.",
        "Chúc mừng sinh nhật anh yêu! ❤️"
    ];

    // Initialize Supabase Client
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
        // Load first image sketch
        setTimeout(initScrollObserver, 500);
    }

    let targetLoveDays = 1258;

    function applyData(data) {
        if (data.anniversaryDate) {
            targetLoveDays = parseInt(data.anniversaryDate) || 1258;
            const daysEl = document.getElementById('loveDaysVal');
            if (daysEl) daysEl.innerText = targetLoveDays;
        }
        if (data.images && data.images.length > 0) {
            for(let i = 0; i < 4; i++) {
                if(data.images[i]) customImages[i] = data.images[i];
            }
        }
        if (data.wishes && data.wishes.length > 0) {
            for(let i = 0; i < 4; i++) {
                if(data.wishes[i]) {
                    customWishes[i] = data.wishes[i];
                    const descEl = document.getElementById(`desc-${i}`);
                    if (descEl) descEl.innerText = data.wishes[i];
                }
            }
        }
        if (data.wishes && data.wishes[4]) {
            customWishes[4] = data.wishes[4];
            const letterEl = document.getElementById('finalLetterText');
            if (letterEl) letterEl.innerText = data.wishes[4];
        }
    }

    // Load Supabase or local configuration
    loadGiftConfiguration();

    // 2. Play Audio & Start intro transition
    const introPlayer = document.getElementById('introPlayer');
    const bgMusic = document.getElementById('bgMusic');
    const vinylDisc = document.getElementById('vinylDisc');
    const stylusArm = document.getElementById('stylusArm');

    introPlayer.addEventListener('click', () => {
        bgMusic.play().catch(e => console.log("Audio auto-play blocked"));
        
        // Start countup love days animation
        startLoveDaysCountUp();

        // Trigger record animations
        if (stylusArm) stylusArm.classList.add('active');
        if (vinylDisc) {
            setTimeout(() => {
                vinylDisc.classList.add('playing');
            }, 400);
        }

        // Delay screen switch slightly to let user enjoy the tactile record player touch and countup
        setTimeout(() => {
            document.getElementById('stage-intro').style.display = 'none';
            document.getElementById('stage-content').style.display = 'flex';
            createFallingParticles();
        }, 2800);
    });

    function startLoveDaysCountUp() {
        const daysEl = document.getElementById('loveDaysVal');
        if (!daysEl) return;
        
        let start = 0;
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentDays = Math.floor(easeProgress * targetLoveDays);
            
            daysEl.innerText = currentDays;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // 3. Falling Gold Dust Particles Ambient Effect
    function createFallingParticles() {
        for(let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-10px';
            
            document.body.appendChild(p);
            
            const speed = Math.random() * 1.5 + 0.8;
            let topPos = -10;
            
            function fall() {
                topPos += speed;
                p.style.top = topPos + 'px';
                if(topPos < window.innerHeight) {
                    requestAnimationFrame(fall);
                } else {
                    topPos = -10;
                    p.style.left = Math.random() * 100 + 'vw';
                    requestAnimationFrame(fall);
                }
            }
            requestAnimationFrame(fall);
        }
    }

    // 4. Scroll triggered pencil drawing loang màu nước
    const loadedImages = {};
    const observers = [];

    function initScrollObserver() {
        for(let i = 0; i < 4; i++) {
            const node = document.getElementById(`node-${i}`);
            const canvas = document.getElementById(`canvas-${i}`);
            
            if(!node || !canvas) continue;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        node.classList.add('active');
                        startCanvasDrawing(i, canvas);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            observer.observe(node);
            observers.push(observer);
        }
    }

    function startCanvasDrawing(index, canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = customImages[index];
        img.onload = () => {
            loadedImages[index] = img;
            
            // Draw pencil sketch animation (Simulated draw line effect)
            let progress = 0;
            function drawSketch() {
                progress += 0.04;
                ctx.clearRect(0,0,300,300);
                
                // Draw grey outlines
                ctx.globalAlpha = progress * 0.4;
                ctx.drawImage(img, 0, 0, 300, 300);
                
                // Overlay draw pencil effect lines
                ctx.globalAlpha = 1.0;
                ctx.strokeStyle = '#dfc397';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, progress * 300);
                ctx.lineTo(300, progress * 300);
                ctx.stroke();

                if(progress < 1) {
                    requestAnimationFrame(drawSketch);
                } else {
                    // Transition to color loang màu nước
                    applyColorLoang(img, ctx);
                }
            }
            drawSketch();
        };
    }

    function applyColorLoang(img, ctx) {
        let opacity = 0.4;
        function transition() {
            opacity += 0.03;
            ctx.clearRect(0,0,300,300);
            ctx.globalAlpha = opacity;
            ctx.drawImage(img, 0, 0, 300, 300);
            if(opacity < 1.0) {
                requestAnimationFrame(transition);
            }
        }
        transition();
    }

    // 5. Navigation from scroll stage to maze stage
    window.goToBlowStage = () => {
        document.getElementById('stage-content').style.display = 'none';
        document.getElementById('stage-maze').style.display = 'flex';
        resetMaze();
    };

    // Maze Game Engine
    let ballX = 15;
    let ballY = 15;
    const mazeWalls = [
        { x: 100, y: 0, w: 6, h: 100 },
        { x: 0, y: 120, w: 100, h: 6 },
        { x: 160, y: 60, w: 140, h: 6 },
        { x: 160, y: 60, w: 6, h: 180 },
        { x: 100, y: 240, w: 100, h: 6 }
    ];

    function resetMaze() {
        ballX = 15;
        ballY = 15;
        const ball = document.getElementById('mazeBall');
        if (ball) {
            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';
        }
    }

    window.moveBall = (direction) => {
        const step = 20;
        let newX = ballX;
        let newY = ballY;

        if (direction === 'up') newY -= step;
        if (direction === 'down') newY += step;
        if (direction === 'left') newX -= step;
        if (direction === 'right') newX += step;

        // Boundary constraint
        if (newX < 0 || newX > 280 || newY < 0 || newY > 280) return;

        // Collision detection with walls
        const ballSize = 20;
        let isCollided = false;
        for (let i = 0; i < mazeWalls.length; i++) {
            const w = mazeWalls[i];
            if (
                newX < w.x + w.w &&
                newX + ballSize > w.x &&
                newY < w.y + w.h &&
                newY + ballSize > w.y
            ) {
                isCollided = true;
                break;
            }
        }

        if (!isCollided) {
            ballX = newX;
            ballY = newY;
            const ball = document.getElementById('mazeBall');
            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';

            // Check if reached target (260, 260)
            if (ballX >= 240 && ballY >= 240) {
                // Winning transition
                setTimeout(() => {
                    alert("❤️ Chúng ta đã tìm thấy nhau vượt qua mọi rào cản! Hãy chuyển sang chương tiếp theo.");
                    document.getElementById('stage-maze').style.display = 'none';
                    document.getElementById('stage-puzzle').style.display = 'flex';
                    initPuzzleGame();
                }, 300);
            }
        }
    };

    // Puzzle Game Logic
    let puzzleOrder = [2, 0, 3, 1]; // Shuffled initial order
    const correctOrder = [0, 1, 2, 3];
    let selectedPieceIndex = null;

    function initPuzzleGame() {
        const board = document.getElementById('puzzleBoard');
        const pieces = board.querySelectorAll('.puzzle-piece');
        
        pieces.forEach((piece, idx) => {
            piece.style.backgroundImage = `url('${customImages[0]}')`;
            updatePieceDisplay(idx);
        });
    }

    function updatePieceDisplay(index) {
        const piece = document.getElementById(`piece-${index}`);
        const value = puzzleOrder[index];
        // Calculate background offsets for 2x2 grid
        const xOffset = (value % 2) * -144;
        const yOffset = Math.floor(value / 2) * -144;
        piece.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    }

    window.selectPiece = (index) => {
        const piece = document.getElementById(`piece-${index}`);
        
        if (selectedPieceIndex === null) {
            selectedPieceIndex = index;
            piece.classList.add('selected');
        } else {
            // Swap places
            const prevIndex = selectedPieceIndex;
            document.getElementById(`piece-${prevIndex}`).classList.remove('selected');
            
            const temp = puzzleOrder[prevIndex];
            puzzleOrder[prevIndex] = puzzleOrder[index];
            puzzleOrder[index] = temp;
            
            updatePieceDisplay(prevIndex);
            updatePieceDisplay(index);
            
            selectedPieceIndex = null;
            checkPuzzleComplete();
        }
    };

    function checkPuzzleComplete() {
        const isMatched = puzzleOrder.every((val, idx) => val === correctOrder[idx]);
        if (isMatched) {
            document.getElementById('puzzleSuccessMsg').style.opacity = 1;
            document.getElementById('puzzleNextBtn').style.display = 'inline-block';
            
            // Disable further clicks
            for (let i = 0; i < 4; i++) {
                document.getElementById(`piece-${i}`).style.pointerEvents = 'none';
                document.getElementById(`piece-${i}`).style.border = 'none';
            }
        }
    }

    window.goToRealBlowStage = () => {
        document.getElementById('stage-puzzle').style.display = 'none';
        document.getElementById('stage-blow').style.display = 'flex';
    };

    // 6. Web Audio API / Microphone sensing for Candle blow
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;

    window.requestMicAccess = () => {
        const hintEl = document.getElementById('blowHint');
        const micBtn = document.getElementById('micBtn');

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                micBtn.style.display = 'none';
                hintEl.innerText = "Cảm biến đã sẵn sàng! Hãy ghé miệng sát vào điện thoại và THỔI MẠNH.";
                
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                
                microphone = audioContext.createMediaStreamSource(stream);
                javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
                
                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                
                javascriptNode.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    
                    let values = 0;
                    for (let i = 0; i < array.length; i++) {
                        values += array[i];
                    }
                    const average = values / array.length;
                    
                    // Lowered average threshold to 40 for higher sensitivity (easy blow)
                    if (average > 40) {
                        extinguishCandle();
                    }
                };

                // Fallback: Also allow direct click/touch on the flame even if mic is enabled
                document.getElementById('candleFlame').style.cursor = 'pointer';
                document.getElementById('candleFlame').addEventListener('click', extinguishCandle);
            })
            .catch(err => {
                console.error("Mic access denied", err);
                hintEl.innerText = "Quyền truy cập micro bị chặn hoặc không khả dụng. Hãy chạm trực tiếp vào ngọn nến để thổi!";
                document.getElementById('candleFlame').style.cursor = 'pointer';
                document.getElementById('candleFlame').addEventListener('click', extinguishCandle);
            });
    };

    function extinguishCandle() {
        // Disconnect audio processors
        if(javascriptNode) {
            javascriptNode.onaudioprocess = null;
            audioContext.close();
        }

        // Blow flame animation
        const flame = document.getElementById('candleFlame');
        flame.classList.add('blown');

        // Show fireworks and transition to secret envelope
        setTimeout(() => {
            const canvasF = document.getElementById('fireworks');
            canvasF.style.display = 'block';
            startFireworksEffect(canvasF);
            
            setTimeout(() => {
                document.getElementById('stage-blow').style.display = 'none';
                document.getElementById('stage-envelope').style.display = 'flex';
            }, 2500);
        }, 600);
    }

    // 6.5. Interactive Envelope Open
    let isEnvelopeOpened = false;
    window.openEnvelope = () => {
        if (isEnvelopeOpened) return;
        isEnvelopeOpened = true;

        const flap = document.getElementById('envFlap');
        const letter = document.getElementById('envLetter');

        // Step 1: Open flap
        flap.classList.add('open');

        // Step 2: Pull out letter card from pocket
        setTimeout(() => {
            letter.classList.add('pull-out');
            
            // Step 3: Fade in the fullscreen gorgeous letter card overlay
            setTimeout(() => {
                document.getElementById('letterOverlay').classList.add('show');
            }, 1200);
        }, 600);
    };

    // 7. HTML5 Canvas Fireworks particle effects
    function startFireworksEffect(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        
        function randomColor() {
            const colors = ['#ff3366', '#ff9933', '#eab308', '#22c55e', '#a855f7'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function createFirework(x, y) {
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                particles.push({
                    x: x,
                    y: y,
                    dx: Math.cos(angle) * speed,
                    dy: Math.sin(angle) * speed,
                    color: randomColor(),
                    alpha: 1.0,
                    decay: Math.random() * 0.015 + 0.01
                });
            }
        }

        // Loop random launches
        const fireInterval = setInterval(() => {
            createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
        }, 400);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.x += p.dx;
                p.y += p.dy;
                p.dy += 0.05; // gravity
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(idx, 1);
                } else {
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(draw);
        }
        
        draw();

        // Stop launching after 8 seconds but keep drawing remaining
        setTimeout(() => {
            clearInterval(fireInterval);
        }, 8000);
    }
});

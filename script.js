// المتغيرات العامة
let currentPage = 1;
let treasuresFound = 0;
let loveCount = 0;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let photos = [];
let musicPlaying = false;
let gamesCompleted = 0;

// تحميل الصور المحفوظة
function loadPhotos() {
    const saved = localStorage.getItem('valentinePhotos');
    if (saved) {
        photos = JSON.parse(saved);
    }
}

loadPhotos();

// القلوب المتحركة
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    container.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        container.appendChild(heart);
    }
}

// بداية التجربة
document.getElementById('startBtn').addEventListener('click', function() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const music = document.getElementById('bgMusic');
    
    // إخفاء شاشة الترحيب
    welcomeScreen.style.animation = 'fadeOut 0.5s';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
    }, 500);
    
    // تشغيل الموسيقى
    music.volume = 0.3;
    music.play().then(() => {
        musicPlaying = true;
        document.getElementById('musicIcon').textContent = '🔊';
    }).catch(error => {
        console.log('Music autoplay blocked:', error);
    });
    
    createFloatingHearts();
});

// التحكم في الموسيقى
document.getElementById('musicBtn').addEventListener('click', function() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    
    if (musicPlaying) {
        music.pause();
        icon.textContent = '🔇';
        musicPlaying = false;
    } else {
        music.volume = 0.3;
        music.play().then(() => {
            icon.textContent = '🔊';
            musicPlaying = true;
        }).catch(error => {
            alert('❌ لا يمكن تشغيل الموسيقى');
        });
    }
});

// بداية الرحلة
document.getElementById('startJourneyBtn').addEventListener('click', function() {
    showPage(2);
    setTimeout(() => updateProgress('progress1', 14), 100);
});

// عرض الصفحة
function showPage(pageNum) {
    for (let i = 1; i <= 10; i++) {
        const page = document.getElementById('page' + i);
        if (page) page.classList.add('hidden');
    }
    
    const targetPage = document.getElementById('page' + pageNum);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        currentPage = pageNum;
        
        setTimeout(() => {
            if (pageNum === 3) initTreasureMap();
            if (pageNum === 5) initMemoryGame();
            if (pageNum === 9) displayPhotos();
        }, 100);
    }
}

// تحديث شريط التقدم
function updateProgress(id, percent) {
    const progress = document.getElementById(id);
    if (progress) {
        setTimeout(() => {
            progress.style.width = percent + '%';
            progress.textContent = percent + '%';
        }, 100);
    }
}

// تحديث عداد الألعاب
function updateGamesCompleted() {
    gamesCompleted++;
    const counter = document.getElementById('gamesCompleted');
    if (counter) {
        counter.textContent = `${gamesCompleted}/7`;
    }
}

// صفحة 2: اللغز
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const result = this.getAttribute('data-answer');
        if (result === 'correct') {
            createConfetti();
            const msg = document.getElementById('riddleMsg');
            msg.classList.remove('hidden', 'error-msg');
            msg.classList.add('success-msg');
            msg.textContent = '✅ برافو يا قلبي! الإجابة صح 💖';
            
            updateGamesCompleted();
            
            setTimeout(() => {
                showPage(3);
                setTimeout(() => updateProgress('progress2', 28), 100);
            }, 1500);
        } else {
            const msg = document.getElementById('riddleMsg');
            msg.classList.remove('hidden');
            msg.classList.add('error-msg');
            msg.textContent = '❌ حاولي تاني يا حبيبتي! فكري في إجابة تانية 💕';
        }
    });
});

// خريطة الكنز
function initTreasureMap() {
    const map = document.getElementById('treasureMap');
    if (!map) return;
    
    map.innerHTML = '';
    treasuresFound = 0;
    updateFoundCount();
    
    const items = ['🌟', '⭐', '💫', '✨', '🌙', '☀️', '🌈', '🦋', '🌺'];
    const hearts = [2, 4, 7];
    
    items.forEach((item, index) => {
        const treasure = document.createElement('div');
        treasure.className = 'treasure-item';
        treasure.innerHTML = hearts.includes(index) ? '❓' : item;
        treasure.dataset.hasHeart = hearts.includes(index);
        treasure.addEventListener('click', function() {
            checkTreasure(this);
        });
        map.appendChild(treasure);
    });
}

function updateFoundCount() {
    const countEl = document.getElementById('foundCount');
    if (countEl) countEl.textContent = `لقيتي: ${treasuresFound}/3 💖`;
}

function checkTreasure(element) {
    if (element.classList.contains('found')) return;
    
    if (element.dataset.hasHeart === 'true') {
        element.innerHTML = '💖';
        element.classList.add('found');
        treasuresFound++;
        updateFoundCount();
        
        const messages = [
            '✨ لقيتي قلب! ✨\n💕 أول مرة شوفتك فيها',
            '✨ لقيتي قلب تاني! ✨\n💑 أول مرة مسكت إيدك',
            '✨ لقيتي آخر قلب! ✨\n❤️ يوم ما قولتلك بحبك'
        ];
        
        alert(messages[treasuresFound - 1]);
        
        if (treasuresFound === 3) {
            createConfetti();
            updateGamesCompleted();
            document.getElementById('treasureMsg').classList.remove('hidden');
            document.getElementById('treasureMsg').textContent = '🎉 برافو! لقيتي كل القلوب! 🎉';
            
            setTimeout(() => {
                showPage(4);
                setTimeout(() => updateProgress('progress3', 42), 100);
            }, 2000);
        }
    } else {
        alert('❌ مفيش قلب هنا... دوري في مكان تاني 💕');
    }
}

// الكود السري
const code1 = document.getElementById('code1');
const code2 = document.getElementById('code2');

code1.addEventListener('input', function() {
    if (this.value.length >= 1) {
        code2.focus();
    }
});

document.getElementById('checkCodeBtn').addEventListener('click', function() {
    const enteredCode = code1.value + code2.value;
    const msg = document.getElementById('codeMsg');
    
    if (enteredCode === '21') {
        msg.classList.add('hidden');
        createConfetti();
        updateGamesCompleted();
        alert('✅ برافو يا حبيبتي! الكود صح 💖');
        
        setTimeout(() => {
            showPage(5);
            setTimeout(() => updateProgress('progress4', 56), 100);
        }, 1000);
    } else if (enteredCode.length === 2) {
        msg.classList.remove('hidden');
        msg.textContent = '❌ الكود غلط يا حبيبتي! حاولي تاني 💕';
    }
});

// لعبة الذاكرة
function initMemoryGame() {
    const game = document.getElementById('memoryGame');
    if (!game) return;
    
    game.innerHTML = '';
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    updateMatchCount();
    
    const symbols = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '💓'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    cards.forEach((symbol) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<div class="card-content">❤️</div>`;
        card.dataset.symbol = symbol;
        card.addEventListener('click', function() {
            flipCard(this);
        });
        game.appendChild(card);
        memoryCards.push(card);
    });
}

function updateMatchCount() {
    const countEl = document.getElementById('matchCount');
    if (countEl) countEl.textContent = `أزواج: ${matchedPairs}/8 💖`;
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    card.querySelector('.card-content').textContent = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateMatchCount();
        flippedCards = [];
        canFlip = true;
        
        if (matchedPairs === 8) {
            createConfetti();
            updateGamesCompleted();
            document.getElementById('memoryMsg').classList.remove('hidden');
            document.getElementById('memoryMsg').textContent = '🎊 ممتازة يا قلبي! 🎊';
            
            setTimeout(() => {
                showPage(6);
                setTimeout(() => updateProgress('progress5', 70), 100);
            }, 2000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('.card-content').textContent = '❤️';
            card2.querySelector('.card-content').textContent = '❤️';
            flippedCards = [];
            canFlip = true;
        }, 400);
    }
}

// عداد الحب
const loveQuotes = [
    'بحبك ❤️', 'أنتِ كل حياتي 💕', 'قلبي كله ليكي 💖',
    'مستقبلي معاكي 💗', 'أحلى حاجة في حياتي 💝', 'نور عيني 💘',
    'حبيبة قلبي 💞', 'روحي وحياتي 💓', 'أميرتي الجميلة 👑',
    'يا أغلى إنسانة 💎', 'معاكي الدنيا جنة 🌹', 'بحبك للأبد ♾️',
    'أنتِ كل حاجة 🌟', 'مش عارف أعيش من غيرك 💫', 'حياتي بدأت معاكي ✨',
    'أحلى خطيبة 💍', 'زي القمر 🌙', 'أجمل من الدنيا 🌍',
    'ملاكي الحارس 😇', 'للأبد معاكي 💝'
];

document.getElementById('loveCounter').addEventListener('click', function() {
    if (loveCount < 20) {
        loveCount++;
        document.getElementById('loveCount').textContent = loveCount;
        document.getElementById('loveQuote').textContent = loveQuotes[loveCount - 1];
        createHeart();
        
        if (loveCount === 20) {
            createConfetti();
            updateGamesCompleted();
            
            setTimeout(() => {
                alert('💖 كملتي 20 ضغطة! يلا للمحطة الجاية 💖');
                showPage(7);
                setTimeout(() => updateProgress('progress6', 84), 100);
            }, 1000);
        }
    }
});

// مقياس الحب
document.getElementById('calculateLoveBtn').addEventListener('click', function() {
    const meter = document.getElementById('loveMeter');
    const result = document.getElementById('loveResult');
    const continueBtn = document.getElementById('continueBtn7');
    
    let percentage = 0;
    const interval = setInterval(() => {
        percentage += 2;
        meter.style.width = percentage + '%';
        meter.textContent = percentage + '%';
        
        if (percentage >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                meter.textContent = '∞%';
                result.classList.remove('hidden');
                result.textContent = '💕 نسبة حبنا أكبر من 100%... نسبتنا لا نهائية! 💕';
                continueBtn.classList.remove('hidden');
                createConfetti();
                updateGamesCompleted();
            }, 500);
        }
    }, 30);
});

document.getElementById('continueBtn7').addEventListener('click', function() {
    showPage(8);
    setTimeout(() => updateProgress('progress7', 92), 100);
});

// فتح الألبوم
document.getElementById('albumPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('openAlbumBtn').click();
    }
});

document.getElementById('openAlbumBtn').addEventListener('click', function() {
    const password = document.getElementById('albumPassword').value;
    const msg = document.getElementById('albumMsg');
    
    if (password === 'ذكرياتنا2026' || password === 'ذكرياتنا 2026') {
        msg.classList.add('hidden');
        createConfetti();
        updateGamesCompleted();
        
        setTimeout(() => {
            showPage(9);
        }, 1000);
    } else {
        msg.classList.remove('hidden');
        msg.textContent = '❌ الباسورد غلط يا حبيبتي! 💕';
    }
});

// معالجة الصور
const romanticCaptions = [
    "أنتِ أجمل حاجة في حياتي ❤️", "معاكي كل لحظة جميلة 💕",
    "حبيبة قلبي وروحي 💖", "أحلى ذكرياتي معاكي 🌹",
    "أنتِ نور عيني 💝", "مستقبلي وأملي 👰",
    "قلبي كله ليكي 💗", "أميرتي الجميلة 👑",
    "حياتي كلها أنتِ 💓", "بحبك لآخر نفس 💞",
    "أجمل إحساس 💘", "ملاكي الحارس 😇",
    "زي القمر في السما 🌙", "وردتي الجميلة 🌺",
    "حلم حياتي 💫", "أحلى ذكرى 📸"
];

document.getElementById('photoUpload').addEventListener('change', function(event) {
    const files = event.target.files;
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photos.push({
                src: e.target.result,
                caption: romanticCaptions[photos.length % romanticCaptions.length]
            });
            savePhotos();
            displayPhotos();
        };
        reader.readAsDataURL(file);
    }
});

function displayPhotos() {
    const gallery = document.getElementById('photoGallery');
    const empty = document.getElementById('emptyGallery');
    const countEl = document.getElementById('photoCount');
    
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (photos.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            card.innerHTML = `
                <img src="${photo.src}" alt="صورة ${index + 1}">
                <div class="photo-caption">${photo.caption}</div>
                <button class="delete-photo">×</button>
            `;
            
            // فتح الصورة
            card.querySelector('img').addEventListener('click', function() {
                document.getElementById('modalImage').src = photo.src;
                document.getElementById('imageModal').style.display = 'block';
            });
            
            // حذف الصورة
            card.querySelector('.delete-photo').addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('🗑️ متأكدة تحذفي الصورة دي؟')) {
                    photos.splice(index, 1);
                    savePhotos();
                    displayPhotos();
                }
            });
            
            gallery.appendChild(card);
        });
    }
    
    if (countEl) countEl.textContent = photos.length;
}

function savePhotos() {
    localStorage.setItem('valentinePhotos', JSON.stringify(photos));
}

// إغلاق المودال
document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('imageModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// الاستمرار للصفحة الأخيرة
document.getElementById('continueToFinalBtn').addEventListener('click', function() {
    showPage(10);
    createMassiveConfetti();
});

// كشف المفاجآت
document.querySelectorAll('.surprise-box').forEach(box => {
    box.addEventListener('click', function() {
        const num = this.getAttribute('data-surprise');
        const content = document.getElementById('surpriseContent' + num);
        
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            createConfetti();
        } else {
            content.style.display = 'none';
        }
    });
});

// الأزرار النهائية
document.getElementById('backToAlbumBtn').addEventListener('click', function() {
    showPage(9);
});

document.getElementById('restartBtn').addEventListener('click', function() {
    if (confirm('🔄 هتبدأي الرحلة من الأول؟\n\nكل الذكريات والصور هتفضل محفوظة 💕')) {
        loveCount = 0;
        treasuresFound = 0;
        matchedPairs = 0;
        gamesCompleted = 0;
        showPage(1);
        document.getElementById('gamesCompleted').textContent = '0/7';
    }
});

// تأثير الكونفيتي
function createConfetti() {
    const colors = ['#ff0080', '#ff8c00', '#ffd700', '#00ff80', '#00ffff', '#ff00ff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// إضافة animation للكونفيتي
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function createMassiveConfetti() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createConfetti(), i * 200);
    }
}

// قلب متحرك
function createHeart() {
    const heart = document.createElement('div');
    heart.style.position = 'fixed';
    heart.style.left = (Math.random() * 80 + 10) + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 20 + 30) + 'px';
    heart.textContent = '❤️';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'float 3s ease-out forwards';
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
}

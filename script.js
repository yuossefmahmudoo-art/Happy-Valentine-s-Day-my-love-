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

// متغيرات لعبة ترتيب الكلمات
let currentSentence = [];
const targetSentence = ["بحبك", "يا", "أجمل", "وأغلى", "حاجة", "في", "حياتي"];

// الصور الافتراضية للألبوم
const defaultPhotos = [
    {
        src: 'https://i.postimg.cc/90Hj5f3J/01K39A2MG2C6PGM7YQS3RX6CGN.jpg',
        caption: 'أنتِ أجمل حاجة في حياتي ❤️'
    },
    {
        src: 'https://i.postimg.cc/C5CpFVYP/01K399MW4936BB4TJPP53PHVSG.jpg',
        caption: 'معاكي كل لحظة جميلة 💕'
    },
    {
        src: 'https://i.postimg.cc/VLBzwXkF/01K399D6KJCXSGPV7TZTHSHV8T.jpg',
        caption: 'حبيبة قلبي وروحي 💖'
    },
    {
        src: 'https://i.postimg.cc/4yvRJTsR/01K111R8AHJS5G8S9ZY6V23MPX.jpg',
        caption: 'أحلى ذكرياتي معاكي 🌹'
    }
];

// تحميل الصور
function loadPhotos() {
    const saved = localStorage.getItem('valentinePhotos');
    if (saved) {
        photos = JSON.parse(saved);
    } else {
        photos = [...defaultPhotos];
        savePhotos();
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
    
    // تشغيل الموسيقى مع محاولات متعددة
    music.volume = 0.4;
    
    const playAttempt = () => {
        music.play()
            .then(() => {
                musicPlaying = true;
                document.getElementById('musicIcon').textContent = '🔊';
                console.log('✅ الموسيقى شغالة!');
            })
            .catch(error => {
                console.log('محاولة تشغيل الموسيقى...', error);
                setTimeout(playAttempt, 1000);
            });
    };
    
    playAttempt();
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
        showCustomAlert('⏸️ الموسيقى متوقفة');
    } else {
        music.volume = 0.4;
        music.play()
            .then(() => {
                icon.textContent = '🔊';
                musicPlaying = true;
                showCustomAlert('🎵 الموسيقى شغالة!');
            })
            .catch(error => {
                showCustomAlert('❌ لا يمكن تشغيل الموسيقى');
            });
    }
});

// رسالة تنبيه مخصصة
function showCustomAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.3s';
        setTimeout(() => alert.remove(), 300);
    }, 2000);
}

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
            if (pageNum === 4) initWordPuzzle();
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

// خريطة الكنز - محدثة
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
        treasure.dataset.heartIndex = hearts.indexOf(index);
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
        
        const heartIndex = parseInt(element.dataset.heartIndex);
        showMemoryModal(heartIndex);
        
        if (treasuresFound === 3) {
            setTimeout(() => {
                createConfetti();
                updateGamesCompleted();
                showSuccessMessage();
            }, 500);
        }
    } else {
        showCustomAlert('💔 مفيش قلب هنا... دوري في مكان تاني يا حبيبتي 💕');
    }
}

// عرض مودال الذكريات
function showMemoryModal(index) {
    const modal = document.getElementById('memoryModal');
    const title = document.getElementById('memoryTitle');
    const text = document.getElementById('memoryText');
    
    const memories = [
        {
            title: '✨ لقيتي القلب الأول! ✨',
            text: '💕 أول مرة شوفتك فيها\n\nاليوم ده قلبي عرف معنى الحب الحقيقي. كانت لحظة سحرية غيرت حياتي للأبد. أول ما شوفتك حسيت إني لقيت اللي كنت بدور عليه طول عمري ❤️'
        },
        {
            title: '✨ لقيتي القلب الثاني! ✨',
            text: '💑 أول مرة مسكت إيدك\n\nحسيت وقتها إني مسكت العالم كله. إيدك الصغيرة في إيدي كانت أحلى إحساس في الدنيا. ومن ساعتها مش عايز أسيب إيدك أبداً 💕'
        },
        {
            title: '✨ لقيتي القلب الأخير! ✨',
            text: '❤️ يوم ما قولتلك بحبك\n\nأجمل يوم في حياتي. قلبي كان بيدق بسرعة وأنا بقول الكلمة دي. وأنتِ قولتيلي بحبك كمان، وساعتها حسيت إني أسعد إنسان في الدنيا. الحب ده هيفضل للأبد يا قلبي 💖'
        }
    ];
    
    const memory = memories[index];
    title.textContent = memory.title;
    text.innerHTML = memory.text.replace(/\n/g, '<br>');
    
    modal.style.display = 'block';
    createConfetti();
}

// إغلاق مودال الذكريات
document.getElementById('closeMemoryBtn').addEventListener('click', function() {
    document.getElementById('memoryModal').style.display = 'none';
});

// رسالة النجاح
function showSuccessMessage() {
    const msg = document.getElementById('treasureMsg');
    msg.classList.remove('hidden');
    msg.textContent = 'برافو يا حبيبتي! لقيتي كل القلوب! 🎉';
    
    setTimeout(() => {
        showPage(4);
        setTimeout(() => updateProgress('progress3', 42), 100);
    }, 2500);
}

// ------------------------------------------------------------
// لعبة ترتيب الكلمات (الجديدة)
// ------------------------------------------------------------
function initWordPuzzle() {
    const bank = document.getElementById('wordsBank');
    const area = document.getElementById('sentenceArea');
    const msg = document.getElementById('wordMsg');
    
    if (!bank || !area) return;
    
    // إعادة تعيين الحالة
    currentSentence = [];
    bank.innerHTML = '';
    area.innerHTML = '<span class="placeholder-text">اضغطي على الكلمات بالترتيب...</span>';
    area.classList.remove('correct');
    msg.classList.add('hidden');
    msg.textContent = '';
    
    // خلط الكلمات
    const shuffled = [...targetSentence].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(word => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.onclick = () => selectWord(chip, word);
        bank.appendChild(chip);
    });
}

function selectWord(chip, word) {
    if (chip.classList.contains('used')) return;
    
    const area = document.getElementById('sentenceArea');
    
    // إزالة النص الافتراضي عند أول اختيار
    if (currentSentence.length === 0) {
        area.innerHTML = '';
    }
    
    currentSentence.push(word);
    chip.classList.add('used');
    
    // إضافة الكلمة لمنطقة الجملة
    const selectedChip = document.createElement('div');
    selectedChip.className = 'word-chip';
    selectedChip.textContent = word;
    selectedChip.onclick = () => {
        // إزالة الكلمة عند الضغط عليها في منطقة الجملة
        selectedChip.remove();
        currentSentence = currentSentence.filter(w => w !== word);
        chip.classList.remove('used'); // إعادة تفعيل الكلمة في البنك
        
        if (currentSentence.length === 0) {
            area.innerHTML = '<span class="placeholder-text">اضغطي على الكلمات بالترتيب...</span>';
        }
    };
    
    area.appendChild(selectedChip);
}

document.getElementById('resetWordsBtn').addEventListener('click', initWordPuzzle);

document.getElementById('checkSentenceBtn').addEventListener('click', function() {
    const msg = document.getElementById('wordMsg');
    const area = document.getElementById('sentenceArea');
    
    // تحويل المصفوفات لنصوص للمقارنة
    const currentStr = currentSentence.join(' ');
    const targetStr = targetSentence.join(' ');
    
    if (currentStr === targetStr) {
        msg.classList.remove('hidden', 'error-msg');
        msg.classList.add('success-msg');
        msg.textContent = '✅ صح يا روحي! وأنا كمان بحبك أوي 💕';
        area.classList.add('correct');
        
        createConfetti();
        updateGamesCompleted();
        
        setTimeout(() => {
            showPage(5);
            setTimeout(() => updateProgress('progress4', 56), 100);
        }, 2000);
    } else {
        msg.classList.remove('hidden');
        msg.classList.add('error-msg');
        msg.textContent = '❌ الجملة مش مرتبة صح يا قلبي! حاولي تاني 💕';
        area.classList.add('shake');
        setTimeout(() => area.classList.remove('shake'), 500);
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
                showCustomAlert('💖 كملتي 20 ضغطة! يلا للمحطة الجاية يا قلبي 💖');
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
    "أنتِ نور عيني 💝",
    "مستقبلي وأملي 👰",
    "قلبي كله ليكي 💗",
    "أميرتي الجميلة 👑",
    "حياتي كلها أنتِ 💓",
    "بحبك لآخر نفس 💞",
    "أجمل إحساس 💘",
    "ملاكي الحارس 😇",
    "زي القمر في السما 🌙",
    "وردتي الجميلة 🌺",
    "حلم حياتي 💫",
    "أحلى ذكرى 📸",
    "معاكي كل حاجة حلوة 🌹",
    "يا أغلى حبيبة ❤️",
    "للأبد معاكي 💕"
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
    const countEl = document.getElementById('photoCount');
    
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
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
            if (confirm('🗑️ متأكدة تحذفي الصورة دي يا قلبي؟')) {
                photos.splice(index, 1);
                savePhotos();
                displayPhotos();
            }
        });
        
        gallery.appendChild(card);
    });
    
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
    
    const memoryModal = document.getElementById('memoryModal');
    if (event.target === memoryModal) {
        memoryModal.style.display = 'none';
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
    if (confirm('🔄 هتبدأي الرحلة من الأول يا حبيبتي؟\n\nكل الذكريات والصور هتفضل محفوظة 💕')) {
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
        confetti.style.pointerEvents = 'none';
        
        const duration = Math.random() * 3 + 2;
        confetti.style.animation = `confettiFall ${duration}s linear forwards`;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), duration * 1000);
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

// تحميل الصور عند فتح الصفحة
window.addEventListener('load', function() {
    displayPhotos();
});
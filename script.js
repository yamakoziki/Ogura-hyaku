class KarutaSystem {
    constructor() {
        this.currentPoem = null;
        this.isReading = false;
        this.timer = { seconds: 0, minutes: 0, interval: null, isRunning: false };
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.currentSortOrder = 'number'; // 'number', 'author', 'kami', 'season'
        this.sortedPoems = [...HYAKUNIN_ISSHU];
        this.pauseDuration = 0.5; // 句間の間隔（秒）
        this.pronunciationControlEnabled = true; // は/わ発音制御
        this.intonationControlEnabled = true; // 詠歌調の抑揚制御
        this.currentSegments = []; // 現在の読み上げセグメント
        this.currentSegmentIndex = 0; // 現在のセグメントインデックス
        this.isPaused = false; // 一時停止状態
        
        // 季節データマッピング
        this.seasonData = {
            1: "秋", 2: "夏", 3: "冬", 4: "冬", 5: "秋", 6: "冬", 7: "雑", 8: "雑", 9: "春", 10: "雑",
            11: "雑", 12: "春", 13: "恋", 14: "恋", 15: "春", 16: "雑", 17: "秋", 18: "恋", 19: "恋", 20: "恋",
            21: "秋", 22: "秋", 23: "秋", 24: "秋", 25: "恋", 26: "秋", 27: "恋", 28: "冬", 29: "秋", 30: "恋",
            31: "冬", 32: "秋", 33: "春", 34: "雑", 35: "春", 36: "夏", 37: "秋", 38: "恋", 39: "恋", 40: "恋",
            41: "恋", 42: "恋", 43: "恋", 44: "恋", 45: "恋", 46: "恋", 47: "秋", 48: "恋", 49: "恋", 50: "恋",
            51: "恋", 52: "恋", 53: "恋", 54: "恋", 55: "雑", 56: "恋", 57: "恋", 58: "秋", 59: "恋", 60: "雑",
            61: "春", 62: "雑", 63: "恋", 64: "冬", 65: "恋", 66: "春", 67: "恋", 68: "雑", 69: "秋", 70: "秋",
            71: "秋", 72: "恋", 73: "春", 74: "恋", 75: "秋", 76: "雑", 77: "恋", 78: "秋", 79: "秋", 80: "恋",
            81: "夏", 82: "恋", 83: "雑", 84: "雑", 85: "恋", 86: "秋", 87: "秋", 88: "恋", 89: "恋", 90: "恋",
            91: "冬", 92: "恋", 93: "雑", 94: "秋", 95: "雑", 96: "春", 97: "恋", 98: "夏", 99: "雑", 100: "雑"
        };
        
        // 季節順序 (春→夏→秋→冬→恋→雑)
        this.seasonOrder = { "春": 1, "夏": 2, "秋": 3, "冬": 4, "恋": 5, "雑": 6 };
        
        // 詠歌調の抑揚パターン (音高・速度・強調の変化)
        this.intonationPatterns = [
            { pitch: 1.2, rate: 0.9, volume: 0.9 }, // 第1句: 高めの音高、ゆっくり
            { pitch: 1.1, rate: 1.0, volume: 1.0 }, // 第2句: やや高め、標準
            { pitch: 0.9, rate: 1.1, volume: 0.95 }, // 第3句: やや低め、やや速く
            { pitch: 1.0, rate: 1.0, volume: 1.0 }, // 第4句: 標準
            { pitch: 0.8, rate: 0.8, volume: 1.1 }  // 第5句: 低め、ゆっくり、強調
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.displayPoemList();
    }

    initializeElements() {
        // DOM要素の取得
        this.elements = {
            randomBtn: document.getElementById('randomBtn'),
            readBtn: document.getElementById('readBtn'),
            stopBtn: document.getElementById('stopBtn'),
            showAnswerBtn: document.getElementById('showAnswerBtn'),
            poemNumber: document.getElementById('poemNumber'),
            poemAuthor: document.getElementById('poemAuthor'),
            kamiNoKu: document.getElementById('kamiNoKu'),
            shimoNoKu: document.getElementById('shimoNoKu'),
            shimoNoKuDiv: document.getElementById('shimoNoKuDiv'),
            poemReading: document.getElementById('poemReading'),
            readingText: document.getElementById('readingText'),
            poemMeaning: document.getElementById('poemMeaning'),
            meaningText: document.getElementById('meaningText'),
            timer: document.getElementById('timer'),
            startTimerBtn: document.getElementById('startTimerBtn'),
            pauseTimerBtn: document.getElementById('pauseTimerBtn'),
            resetTimerBtn: document.getElementById('resetTimerBtn'),
            searchInput: document.getElementById('searchInput'),
            poemList: document.getElementById('poemList'),
            speechRate: document.getElementById('speechRate'),
            speechRateValue: document.getElementById('speechRateValue'),
            pauseDuration: document.getElementById('pauseDuration'),
            pauseDurationValue: document.getElementById('pauseDurationValue'),
            pronunciationControl: document.getElementById('pronunciationControl'),
            intonationControl: document.getElementById('intonationControl'),
            sortByNumber: document.getElementById('sortByNumber'),
            sortByAuthor: document.getElementById('sortByAuthor'),
            sortByKami: document.getElementById('sortByKami'),
            sortBySeason: document.getElementById('sortBySeason')
        };
    }

    bindEvents() {
        // ボタンイベントの設定
        this.elements.randomBtn.addEventListener('click', () => this.selectRandomPoem());
        this.elements.readBtn.addEventListener('click', () => this.readPoem());
        this.elements.stopBtn.addEventListener('click', () => this.stopReading());
        this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        
        // タイマーイベント
        this.elements.startTimerBtn.addEventListener('click', () => this.startTimer());
        this.elements.pauseTimerBtn.addEventListener('click', () => this.pauseTimer());
        this.elements.resetTimerBtn.addEventListener('click', () => this.resetTimer());
        
        // 検索イベント
        this.elements.searchInput.addEventListener('input', () => this.filterPoems());
        
        // 読み上げ速度イベント
        this.elements.speechRate.addEventListener('input', () => this.updateSpeechRate());
        
        // 句間間隔イベント
        this.elements.pauseDuration.addEventListener('input', () => this.updatePauseDuration());
        
        // 発音制御イベント
        this.elements.pronunciationControl.addEventListener('change', () => this.updatePronunciationControl());
        
        // 抑揚制御イベント
        this.elements.intonationControl.addEventListener('change', () => this.updateIntonationControl());
        
        // ソートイベント
        this.elements.sortByNumber.addEventListener('click', () => this.sortPoems('number'));
        this.elements.sortByAuthor.addEventListener('click', () => this.sortPoems('author'));
        this.elements.sortByKami.addEventListener('click', () => this.sortPoems('kami'));
        this.elements.sortBySeason.addEventListener('click', () => this.sortPoems('season'));
    }

    selectRandomPoem() {
        const randomIndex = Math.floor(Math.random() * HYAKUNIN_ISSHU.length);
        this.currentPoem = HYAKUNIN_ISSHU[randomIndex];
        this.displayPoem(false); // 下の句を隠して表示
    }

    selectPoem(index) {
        this.currentPoem = this.sortedPoems[index];
        this.displayPoem(false);
    }

    displayPoem(showAll = false) {
        if (!this.currentPoem) return;

        this.elements.poemNumber.textContent = this.currentPoem.number;
        this.elements.poemAuthor.textContent = this.currentPoem.author;
        this.elements.kamiNoKu.textContent = this.currentPoem.kamiNoKu;
        this.elements.shimoNoKu.textContent = this.currentPoem.shimoNoKu;
        this.elements.readingText.textContent = this.currentPoem.reading;
        this.elements.meaningText.textContent = this.currentPoem.meaning;

        // 表示制御
        if (showAll) {
            this.elements.shimoNoKuDiv.style.display = 'block';
            this.elements.poemReading.style.display = 'block';
            this.elements.poemMeaning.style.display = 'block';
        } else {
            this.elements.shimoNoKuDiv.style.display = 'none';
            this.elements.poemReading.style.display = 'none';
            this.elements.poemMeaning.style.display = 'none';
        }
    }

    showAnswer() {
        if (this.currentPoem) {
            this.displayPoem(true);
        }
    }

    readPoem() {
        if (!this.currentPoem) return;
        
        if (this.isPaused) {
            // 一時停止状態から再開
            this.resumeReading();
        } else {
            // 新規または最初から読み上げ
            if (this.isReading) {
                this.stopReading(); // 既存の読み上げを停止
            }
            this.readPoemWithPauses();
        }
    }

    readPoemWithPauses() {
        const reading = this.currentPoem.reading;
        this.currentSegments = this.parseToSegments(reading);
        this.currentSegmentIndex = 0;
        
        this.isReading = true;
        this.isPaused = false;
        this.elements.readBtn.disabled = true;
        this.elements.readBtn.textContent = '読み上げ中...';

        this.readSegments(this.currentSegments, 0);
    }

    parseToSegments(reading) {
        // ひらがなの読みを既存の空白で分割
        // 空白で区切られた各句を配列として返す
        return reading.trim().split(/\s+/).filter(segment => segment.length > 0);
    }

    readSegments(segments, index) {
        if (index >= segments.length || !this.isReading) {
            // 読み上げ完了
            this.isReading = false;
            this.isPaused = false;
            this.currentSegmentIndex = 0; // リセット
            this.elements.readBtn.disabled = false;
            this.elements.readBtn.textContent = '読み上げ';
            return;
        }
        
        // 現在のインデックスを保存
        this.currentSegmentIndex = index;

        const segment = segments[index];
        const processedSegment = this.pronunciationControlEnabled ? 
            this.processPronunciation(segment) : segment;
        this.utterance = new SpeechSynthesisUtterance(processedSegment);
        
        // 日本語の音声設定
        this.utterance.lang = 'ja-JP';
        
        // 基本設定
        const baseRate = parseFloat(this.elements.speechRate.value);
        let pitch = 1.0;
        let rate = baseRate;
        let volume = 1.0;
        
        // 抑揚制御が有効な場合、句ごとの変化を適用
        if (this.intonationControlEnabled && index < this.intonationPatterns.length) {
            const pattern = this.intonationPatterns[index];
            pitch = pattern.pitch;
            rate = baseRate * pattern.rate;
            volume = pattern.volume;
        }
        
        this.utterance.pitch = pitch;
        this.utterance.rate = rate;
        this.utterance.volume = volume;

        this.utterance.onend = () => {
            if (index < segments.length - 1 && this.isReading) {
                // 句間の間隔を挟んで次のセグメントを読む
                setTimeout(() => {
                    if (this.isReading) { // 停止されていないかチェック
                        this.readSegments(segments, index + 1);
                    }
                }, this.pauseDuration * 1000);
            } else {
                // 最後のセグメントまたは停止された場合
                this.readSegments(segments, segments.length);
            }
        };

        this.synth.speak(this.utterance);
    }

    stopReading() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isReading = false;
        this.isPaused = true; // 一時停止状態に設定
        this.elements.readBtn.disabled = false;
        this.elements.readBtn.textContent = '続きから再開';
    }
    
    resumeReading() {
        if (!this.currentSegments.length || this.currentSegmentIndex >= this.currentSegments.length) {
            // セグメントがない、または最後まで読み終わっている場合は最初から
            this.readPoemWithPauses();
            return;
        }
        
        this.isReading = true;
        this.isPaused = false;
        this.elements.readBtn.disabled = true;
        this.elements.readBtn.textContent = '読み上げ中...';
        
        this.readSegments(this.currentSegments, this.currentSegmentIndex);
    }

    // タイマー機能
    startTimer() {
        if (!this.timer.isRunning) {
            this.timer.interval = setInterval(() => {
                this.timer.seconds++;
                if (this.timer.seconds >= 60) {
                    this.timer.minutes++;
                    this.timer.seconds = 0;
                }
                this.updateTimerDisplay();
            }, 1000);
            this.timer.isRunning = true;
            this.elements.startTimerBtn.textContent = '実行中';
            this.elements.startTimerBtn.disabled = true;
        }
    }

    pauseTimer() {
        if (this.timer.isRunning) {
            clearInterval(this.timer.interval);
            this.timer.isRunning = false;
            this.elements.startTimerBtn.textContent = 'タイマー開始';
            this.elements.startTimerBtn.disabled = false;
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.timer.seconds = 0;
        this.timer.minutes = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const mins = this.timer.minutes.toString().padStart(2, '0');
        const secs = this.timer.seconds.toString().padStart(2, '0');
        this.elements.timer.textContent = `${mins}:${secs}`;
    }

    displayPoemList() {
        this.elements.poemList.innerHTML = '';
        
        this.sortedPoems.forEach((poem, index) => {
            const poemItem = document.createElement('div');
            poemItem.className = 'poem-item';
            const season = this.seasonData[poem.number];
            poemItem.innerHTML = `
                <div class="poem-item-number">${poem.number}</div>
                <div class="poem-item-content">
                    <div class="poem-item-header">
                        <div class="poem-item-author">${poem.author}</div>
                        <div class="poem-item-season" data-season="${season}">${season}</div>
                    </div>
                    <div class="poem-item-text">${poem.kamiNoKu}</div>
                </div>
            `;
            
            // 季節ラベルの色設定
            const seasonLabel = poemItem.querySelector('.poem-item-season');
            this.applySeasonColor(seasonLabel, season);
            
            poemItem.addEventListener('click', () => this.selectPoem(index));
            this.elements.poemList.appendChild(poemItem);
        });
    }

    filterPoems() {
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const poemItems = this.elements.poemList.querySelectorAll('.poem-item');
        
        poemItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateSpeechRate() {
        const rate = this.elements.speechRate.value;
        this.elements.speechRateValue.textContent = rate;
        
        // 読み上げ中の場合は停止して再開
        if (this.isReading) {
            this.stopReading();
            // 少し待ってから再開
            setTimeout(() => {
                this.readPoem();
            }, 100);
        }
    }

    updatePauseDuration() {
        const duration = parseFloat(this.elements.pauseDuration.value);
        this.pauseDuration = duration;
        this.elements.pauseDurationValue.textContent = duration + '秒';
        
        // 読み上げ中の場合は停止して再開
        if (this.isReading) {
            this.stopReading();
            // 少し待ってから再開
            setTimeout(() => {
                this.readPoem();
            }, 100);
        }
    }

    sortPoems(sortType) {
        this.currentSortOrder = sortType;
        
        // ボタンのアクティブ状態を更新
        document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
        const buttonId = sortType === 'season' ? 'sortBySeason' : `sortBy${sortType.charAt(0).toUpperCase() + sortType.slice(1)}`;
        this.elements[buttonId].classList.add('active');
        
        // ソート実行
        switch(sortType) {
            case 'number':
                this.sortedPoems = [...HYAKUNIN_ISSHU].sort((a, b) => a.number - b.number);
                break;
            case 'author':
                this.sortedPoems = [...HYAKUNIN_ISSHU].sort((a, b) => {
                    return a.author.localeCompare(b.author, 'ja', { 
                        numeric: true, 
                        sensitivity: 'base' 
                    });
                });
                break;
            case 'kami':
                this.sortedPoems = [...HYAKUNIN_ISSHU].sort((a, b) => {
                    return a.kamiNoKu.localeCompare(b.kamiNoKu, 'ja', { 
                        numeric: true, 
                        sensitivity: 'base' 
                    });
                });
                break;
            case 'season':
                this.sortedPoems = [...HYAKUNIN_ISSHU].sort((a, b) => {
                    const seasonA = this.seasonData[a.number];
                    const seasonB = this.seasonData[b.number];
                    const orderA = this.seasonOrder[seasonA];
                    const orderB = this.seasonOrder[seasonB];
                    
                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }
                    // 同じ季節内では番号順
                    return a.number - b.number;
                });
                break;
        }
        
        this.displayPoemList();
        
        // 検索フィルターが適用されていれば再適用
        if (this.elements.searchInput.value.trim() !== '') {
            this.filterPoems();
        }
    }

    applySeasonColor(element, season) {
        const seasonColors = {
            "春": { background: "linear-gradient(135deg, #ffc0cb, #ffb6c1)", color: "#8b008b" },
            "夏": { background: "linear-gradient(135deg, #90ee90, #98fb98)", color: "#006400" },
            "秋": { background: "linear-gradient(135deg, #ffa500, #ffd700)", color: "#8b4513" },
            "冬": { background: "linear-gradient(135deg, #add8e6, #87ceeb)", color: "#191970" },
            "恋": { background: "linear-gradient(135deg, #ff69b4, #ff1493)", color: "#ffffff" },
            "雑": { background: "linear-gradient(135deg, #d3d3d3, #c0c0c0)", color: "#2f4f4f" }
        };
        
        const colors = seasonColors[season];
        if (colors) {
            element.style.background = colors.background;
            element.style.color = colors.color;
        }
    }

    updatePronunciationControl() {
        this.pronunciationControlEnabled = this.elements.pronunciationControl.checked;
        
        // 読み上げ中の場合は停止して再開
        if (this.isReading) {
            this.stopReading();
            setTimeout(() => {
                this.readPoem();
            }, 100);
        }
    }

    updateIntonationControl() {
        this.intonationControlEnabled = this.elements.intonationControl.checked;
        
        // 読み上げ中の場合は停止して再開
        if (this.isReading) {
            this.stopReading();
            setTimeout(() => {
                this.readPoem();
            }, 100);
        }
    }

    processPronunciation(text) {
        // 日本語の「は」の発音を制御
        // 助詞の「は」は「わ」として読ませる
        
        let processed = text;
        
        // 百人一首でよく使われる助詞「は」のパターンを変換
        const waPatterns = [
            // 基本的な助詞パターン
            { from: /では(?=\s|$)/g, to: 'でわ' },      // では → でわ
            { from: /には(?=\s|$)/g, to: 'にわ' },      // には → にわ  
            { from: /とは(?=\s|$)/g, to: 'とわ' },      // とは → とわ
            { from: /のは(?=\s|$)/g, to: 'のわ' },      // のは → のわ
            { from: /ばは(?=\s|$)/g, to: 'ばわ' },      // ばは → ばわ
            { from: /もは(?=\s|$)/g, to: 'もわ' },      // もは → もわ
            { from: /かは(?=\s|$)/g, to: 'かわ' },      // かは → かわ
            
            // 百人一首に特有のパターン
            { from: /いろは(?=\s|$)/g, to: 'いろわ' },  // 花の色は → いろわ
            { from: /みは(?=\s|$)/g, to: 'みわ' },      // 身は → みわ  
            { from: /よは(?=\s|$)/g, to: 'よわ' },      // 夜は → よわ
            { from: /そでは(?=\s|$)/g, to: 'そでわ' }, // 袖は → そでわ
            
            // 文中の単独「は」（主題提示）
            { from: /\s+は\s+/g, to: ' わ ' },          // 「〜 は 〜」
            { from: /^は\s+/g, to: 'わ ' },             // 文頭の「は 〜」
        ];
        
        waPatterns.forEach(pattern => {
            processed = processed.replace(pattern.from, pattern.to);
        });
        
        return processed;
    }
}

// システム初期化
document.addEventListener('DOMContentLoaded', () => {
    new KarutaSystem();
});
class KarutaSystem {
    constructor() {
        this.currentPoem = null;
        this.isReading = false;
        this.timer = { seconds: 0, minutes: 0, interval: null, isRunning: false };
        this.synth = window.speechSynthesis;
        this.utterance = null;
        
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
            speechRateValue: document.getElementById('speechRateValue')
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
    }

    selectRandomPoem() {
        const randomIndex = Math.floor(Math.random() * HYAKUNIN_ISSHU.length);
        this.currentPoem = HYAKUNIN_ISSHU[randomIndex];
        this.displayPoem(false); // 下の句を隠して表示
    }

    selectPoem(index) {
        this.currentPoem = HYAKUNIN_ISSHU[index];
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
        if (!this.currentPoem || this.isReading) return;

        this.stopReading(); // 既存の読み上げを停止

        const textToRead = this.currentPoem.reading;
        this.utterance = new SpeechSynthesisUtterance(textToRead);
        
        // 日本語の音声設定
        this.utterance.lang = 'ja-JP';
        this.utterance.rate = parseFloat(this.elements.speechRate.value); // 読み上げ速度（スライダーから取得）
        this.utterance.pitch = 1.0; // 音の高さ
        this.utterance.volume = 1.0; // 音量

        this.utterance.onstart = () => {
            this.isReading = true;
            this.elements.readBtn.disabled = true;
            this.elements.readBtn.textContent = '読み上げ中...';
        };

        this.utterance.onend = () => {
            this.isReading = false;
            this.elements.readBtn.disabled = false;
            this.elements.readBtn.textContent = '読み上げ';
        };

        this.synth.speak(this.utterance);
    }

    stopReading() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isReading = false;
        this.elements.readBtn.disabled = false;
        this.elements.readBtn.textContent = '読み上げ';
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
        
        HYAKUNIN_ISSHU.forEach((poem, index) => {
            const poemItem = document.createElement('div');
            poemItem.className = 'poem-item';
            poemItem.innerHTML = `
                <div class="poem-item-number">${poem.number}</div>
                <div class="poem-item-content">
                    <div class="poem-item-author">${poem.author}</div>
                    <div class="poem-item-text">${poem.kamiNoKu}</div>
                </div>
            `;
            
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
}

// システム初期化
document.addEventListener('DOMContentLoaded', () => {
    new KarutaSystem();
});
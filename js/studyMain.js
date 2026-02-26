// 学习模式 - 主控制器
// 简洁、专业、高效

class StudyMode {
    constructor() {
        this.currentAlgorithm = 'sha256';
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.penColor = '#000000';
        this.penSize = 2;
        this.history = [];
        this.settings = {
            theme: 'light',
            fontSize: 'medium',
            detailedRecords: false,
            autoSave: true
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.initCanvas();
        this.initEventListeners();
        this.loadHistory();
        
        console.log('📚 学习模式已初始化');
    }
    
    loadSettings() {
        const saved = localStorage.getItem('studySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        this.applySettings();
    }
    
    applySettings() {
        document.body.className = `study-mode theme-${this.settings.theme}`;
        
        const fontSizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = fontSizes[this.settings.fontSize];
    }
    
    saveSettings() {
        localStorage.setItem('studySettings', JSON.stringify(this.settings));
    }
    
    initCanvas() {
        this.canvas = document.getElementById('draw-canvas');
        if (!this.canvas) return;
        
        const container = document.getElementById('canvas-container');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        window.addEventListener('resize', () => {
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        });
    }
    
    initEventListeners() {
        document.querySelectorAll('.tab-btn[data-algorithm]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchAlgorithm(btn.dataset.algorithm);
            });
        });
        
        document.querySelectorAll('.canvas-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTool(btn.dataset.tool);
            });
        });
        
        const penColor = document.getElementById('pen-color');
        if (penColor) {
            penColor.addEventListener('input', (e) => {
                this.penColor = e.target.value;
            });
        }
        
        const penSize = document.getElementById('pen-size');
        if (penSize) {
            penSize.addEventListener('input', (e) => {
                this.penSize = parseInt(e.target.value);
            });
        }
        
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.canvas.addEventListener('mousemove', (e) => this.draw(e));
            this.canvas.addEventListener('mouseup', () => this.stopDrawing());
            this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        }
        
        const clearCanvas = document.getElementById('clear-canvas');
        if (clearCanvas) {
            clearCanvas.addEventListener('click', () => this.clearCanvas());
        }
        
        const historyBtn = document.getElementById('history-btn');
        const historyPanel = document.getElementById('history-panel');
        const closeHistory = document.getElementById('close-history');
        
        if (historyBtn && historyPanel) {
            historyBtn.addEventListener('click', () => {
                historyPanel.classList.toggle('show');
            });
        }
        
        if (closeHistory) {
            closeHistory.addEventListener('click', () => {
                historyPanel.classList.remove('show');
            });
        }
        
        const settingsBtn = document.getElementById('settings-btn');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettings = document.getElementById('close-settings');
        
        if (settingsBtn && settingsPanel) {
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
            });
        }
        
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                settingsPanel.classList.remove('show');
            });
        }
        
        document.querySelectorAll('.setting-item input, .setting-item select').forEach(input => {
            input.addEventListener('change', () => {
                this.updateSetting(input.id, input.type === 'checkbox' ? input.checked : input.value);
            });
        });
        
        const toggleCanvas = document.getElementById('toggle-canvas');
        const toggleResult = document.getElementById('toggle-result');
        const canvasContainer = document.getElementById('canvas-container');
        const resultContainer = document.getElementById('result-container');
        
        if (toggleCanvas && canvasContainer) {
            toggleCanvas.addEventListener('click', () => {
                canvasContainer.style.display = 'block';
                resultContainer.style.display = 'none';
            });
        }
        
        if (toggleResult && resultContainer) {
            toggleResult.addEventListener('click', () => {
                canvasContainer.style.display = 'none';
                resultContainer.style.display = 'block';
            });
        }
    }
    
    switchAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-algorithm="${algorithm}"]`)?.classList.add('active');
        
        console.log('切换算法:', algorithm);
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        document.querySelectorAll('.canvas-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineWidth = this.penSize;
        this.ctx.strokeStyle = this.penColor;
        
        if (this.currentTool === 'pen') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
            
            if (this.settings.autoSave) {
                this.saveSnapshot();
            }
        }
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    updateSetting(id, value) {
        const settingMap = {
            'theme-select': 'theme',
            'font-size': 'fontSize',
            'detailed-records': 'detailedRecords',
            'auto-save': 'autoSave'
        };
        
        const settingKey = settingMap[id];
        if (settingKey) {
            this.settings[settingKey] = value;
            this.saveSettings();
            this.applySettings();
        }
    }
    
    loadHistory() {
        const saved = localStorage.getItem('studyHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }
    
    saveSnapshot() {
        const snapshot = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            algorithm: this.currentAlgorithm,
            input: document.getElementById('input-area')?.value || '',
            canvas: this.canvas.toDataURL()
        };
        
        this.history.unshift(snapshot);
        
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        localStorage.setItem('studyHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    renderHistory() {
        const list = document.getElementById('history-list');
        const count = document.getElementById('history-count');
        
        if (count) {
            count.textContent = `历史记录: ${this.history.length}条`;
        }
        
        if (!list) return;
        
        list.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <span class="history-algorithm">${item.algorithm.toUpperCase()}</span>
                    <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-item-preview">${item.input.substring(0, 50)}${item.input.length > 50 ? '...' : ''}</div>
                <div class="history-item-actions">
                    <button class="small-btn" onclick="studyMode.loadSnapshot(${item.id})">加载</button>
                    <button class="small-btn" onclick="studyMode.deleteSnapshot(${item.id})">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    loadSnapshot(id) {
        const snapshot = this.history.find(h => h.id === id);
        if (!snapshot) return;
        
        this.switchAlgorithm(snapshot.algorithm);
        
        const inputArea = document.getElementById('input-area');
        if (inputArea) {
            inputArea.value = snapshot.input;
        }
        
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = snapshot.canvas;
    }
    
    deleteSnapshot(id) {
        this.history = this.history.filter(h => h.id !== id);
        localStorage.setItem('studyHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    exportPNG() {
        const link = document.createElement('a');
        link.download = `泡泡鲸密码箱-${this.currentAlgorithm}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

const studyMode = new StudyMode();

export default studyMode;

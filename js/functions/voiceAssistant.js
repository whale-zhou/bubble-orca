// 语音助手模块 - 泡泡鲸语音助手
// 支持唤醒词、语音识别、语音反馈

class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isEnabled = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.wakeWords = ['泡泡鲸', 'bubble orca', 'bubbleorca', '泡泡鲸密码箱'];
        this.onWakeUp = null;
        this.onCommand = null;
        this.neonBorder = null;
        
        this.init();
    }
    
    init() {
        if (!this.checkSupport()) {
            console.warn('语音识别不被此浏览器支持');
            return;
        }
        
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'zh-CN';
        
        this.recognition.onresult = (event) => this.handleResult(event);
        this.recognition.onerror = (event) => this.handleError(event);
        this.recognition.onend = () => this.handleEnd();
        
        this.createNeonBorder();
        
        console.log('泡泡鲸语音助手已初始化');
    }
    
    checkSupport() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    
    checkSupport() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    
    createNeonBorder() {
        this.neonBorder = document.createElement('div');
        this.neonBorder.id = 'voice-neon-border';
        this.neonBorder.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.neonBorder);
        
        const style = document.createElement('style');
        style.textContent = `
            #voice-neon-border.active {
                opacity: 1;
            }
            
            #voice-neon-border::before,
            #voice-neon-border::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 4px solid transparent;
                border-radius: 0;
                animation: neonPulse 2s ease-in-out infinite;
            }
            
            #voice-neon-border::before {
                border-color: #ff00ff;
                box-shadow: 
                    0 0 10px #ff00ff,
                    0 0 20px #ff00ff,
                    0 0 40px #ff00ff,
                    inset 0 0 10px rgba(255, 0, 255, 0.3);
            }
            
            #voice-neon-border::after {
                border-color: #00ffff;
                box-shadow: 
                    0 0 10px #00ffff,
                    0 0 20px #00ffff,
                    0 0 40px #00ffff,
                    inset 0 0 10px rgba(0, 255, 255, 0.3);
                animation-delay: 1s;
            }
            
            @keyframes neonPulse {
                0%, 100% {
                    opacity: 0.6;
                    filter: brightness(1);
                }
                50% {
                    opacity: 1;
                    filter: brightness(1.3);
                }
            }
            
            #voice-neon-border .corner {
                position: absolute;
                width: 50px;
                height: 50px;
                border: 3px solid;
                animation: cornerPulse 1.5s ease-in-out infinite;
            }
            
            #voice-neon-border .corner-tl {
                top: 0;
                left: 0;
                border-right: none;
                border-bottom: none;
                border-color: #ff00ff;
                box-shadow: -5px -5px 20px #ff00ff;
            }
            
            #voice-neon-border .corner-tr {
                top: 0;
                right: 0;
                border-left: none;
                border-bottom: none;
                border-color: #00ffff;
                box-shadow: 5px -5px 20px #00ffff;
                animation-delay: 0.5s;
            }
            
            #voice-neon-border .corner-bl {
                bottom: 0;
                left: 0;
                border-right: none;
                border-top: none;
                border-color: #00ffff;
                box-shadow: -5px 5px 20px #00ffff;
                animation-delay: 1s;
            }
            
            #voice-neon-border .corner-br {
                bottom: 0;
                right: 0;
                border-left: none;
                border-top: none;
                border-color: #ff00ff;
                box-shadow: 5px 5px 20px #ff00ff;
                animation-delay: 1.5s;
            }
            
            @keyframes cornerPulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 1;
                }
            }
            
            #voice-status-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff00ff;
                border-radius: 20px;
                padding: 30px 50px;
                z-index: 10001;
                display: none;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                box-shadow: 
                    0 0 30px rgba(255, 0, 255, 0.5),
                    0 0 60px rgba(0, 255, 255, 0.3);
            }
            
            #voice-status-indicator.show {
                display: flex;
                animation: fadeInScale 0.3s ease-out;
            }
            
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            #voice-status-indicator .icon {
                font-size: 48px;
                animation: bounce 1s ease-in-out infinite;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            #voice-status-indicator .text {
                color: #fff;
                font-size: 18px;
                font-weight: 500;
            }
            
            #voice-status-indicator .transcript {
                color: #00ffff;
                font-size: 14px;
                max-width: 300px;
                text-align: center;
                min-height: 20px;
            }
        `;
        document.head.appendChild(style);
        
        ['tl', 'tr', 'bl', 'br'].forEach(pos => {
            const corner = document.createElement('div');
            corner.className = `corner corner-${pos}`;
            this.neonBorder.appendChild(corner);
        });
        
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.id = 'voice-status-indicator';
        this.statusIndicator.innerHTML = `
            <div class="icon">🐋</div>
            <div class="text">正在聆听...</div>
            <div class="transcript"></div>
        `;
        document.body.appendChild(this.statusIndicator);
    }
    
    async enable() {
        if (!this.checkSupport()) {
            alert('您的浏览器不支持语音识别功能，请使用Chrome或Edge浏览器');
            return false;
        }
        
        try {
            const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
            permission.getTracks().forEach(track => track.stop());
            
            this.isEnabled = true;
            localStorage.setItem('voiceAssistantEnabled', 'true');
            this.startListening();
            
            return true;
        } catch (error) {
            console.error('麦克风权限被拒绝:', error);
            alert('需要麦克风权限才能使用语音助手功能');
            return false;
        }
    }
    
    disable() {
        this.isEnabled = false;
        localStorage.setItem('voiceAssistantEnabled', 'false');
        this.stopListening();
        this.hideNeonBorder();
    }
    
    startListening() {
        if (!this.recognition || this.isListening) return;
        
        try {
            this.recognition.start();
            this.isListening = true;
            console.log('语音助手开始监听...');
        } catch (error) {
            console.error('启动语音识别失败:', error);
        }
    }
    
    stopListening() {
        if (!this.recognition || !this.isListening) return;
        
        try {
            this.recognition.stop();
            this.isListening = false;
            console.log('语音助手停止监听');
        } catch (error) {
            console.error('停止语音识别失败:', error);
        }
    }
    
    handleResult(event) {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase().trim();
        
        console.log('识别结果:', transcript);
        
        if (this.statusIndicator) {
            const transcriptEl = this.statusIndicator.querySelector('.transcript');
            if (transcriptEl) {
                transcriptEl.textContent = transcript;
            }
        }
        
        for (const wakeWord of this.wakeWords) {
            if (transcript.includes(wakeWord.toLowerCase())) {
                this.onWakeWordDetected(transcript.replace(wakeWord.toLowerCase(), '').trim());
                return;
            }
        }
        
        if (this.neonBorder && this.neonBorder.classList.contains('active')) {
            if (this.onCommand) {
                this.onCommand(transcript);
            }
        }
    }
    
    onWakeWordDetected(command) {
        console.log('唤醒词检测到！命令:', command);
        
        this.showNeonBorder();
        this.speak('我在');
        
        if (this.onWakeUp) {
            this.onWakeUp(command);
        }
        
        setTimeout(() => {
            if (command && this.onCommand) {
                this.onCommand(command);
            }
        }, 1000);
    }
    
    showNeonBorder() {
        if (this.neonBorder) {
            this.neonBorder.classList.add('active');
        }
        if (this.statusIndicator) {
            this.statusIndicator.classList.add('show');
        }
        
        this.hideTimeout = setTimeout(() => {
            this.hideNeonBorder();
        }, 10000);
    }
    
    hideNeonBorder() {
        if (this.neonBorder) {
            this.neonBorder.classList.remove('active');
        }
        if (this.statusIndicator) {
            this.statusIndicator.classList.remove('show');
        }
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    
    speak(text) {
        if (!this.synthesis) return;
        
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const voices = this.synthesis.getVoices();
        const chineseVoice = voices.find(voice => voice.lang.includes('zh'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        this.synthesis.speak(utterance);
    }
    
    handleError(event) {
        console.error('语音识别错误:', event.error);
        
        if (event.error === 'no-speech') {
            return;
        }
        
        if (event.error === 'not-allowed') {
            this.disable();
            alert('麦克风权限被拒绝，语音助手已关闭');
        }
    }
    
    handleEnd() {
        if (this.isEnabled && this.isListening) {
            setTimeout(() => {
                try {
                    this.recognition.start();
                } catch (error) {
                    console.error('重启语音识别失败:', error);
                }
            }, 100);
        }
    }
    
    setOnWakeUp(callback) {
        this.onWakeUp = callback;
    }
    
    setOnCommand(callback) {
        this.onCommand = callback;
    }
    
    getStatus() {
        return {
            supported: this.checkSupport(),
            enabled: this.isEnabled,
            listening: this.isListening
        };
    }
}

const voiceAssistant = new VoiceAssistant();

export default voiceAssistant;
export { VoiceAssistant };

// 语音助手模块 - 泡泡鲸语音助手
// 支持唤醒词、语音识别、语音反馈

class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isEnabled = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.wakeWords = ['泡泡鲸', 'bubble orca', 'bubbleorca', '泡泡鲸密码箱', '泡泡金', '泡鲸', '泡泡', '小鲸', '鲸鱼'];
        this.wakeWordThreshold = 0.6;
        this.onWakeUp = null;
        this.onCommand = null;
        this.neonBorder = null;
        this.statusIndicator = null;
        this.lastTranscript = '';
        this.wakeWordDetected = false;
        this.consecutiveErrors = 0;
        this.maxRetries = 3;
        
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
        this.recognition.maxAlternatives = 3;
        
        this.recognition.onresult = (event) => this.handleResult(event);
        this.recognition.onerror = (event) => this.handleError(event);
        this.recognition.onend = () => this.handleEnd();
        this.recognition.onstart = () => this.handleStart();
        
        this.createNeonBorder();
        
        if (this.synthesis) {
            this.synthesis.onvoiceschanged = () => {
                this.voices = this.synthesis.getVoices();
            };
        }
        
        console.log('🐋 泡泡鲸语音助手已初始化');
        console.log('📢 唤醒词:', this.wakeWords.join(', '));
    }
    
    checkSupport() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    
    createNeonBorder() {
        const style = document.createElement('style');
        style.textContent = `
            /* 霓虹海浪边框 - 全屏四周 */
            #voice-neon-border {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s ease;
                overflow: hidden;
            }
            
            #voice-neon-border.active {
                opacity: 1;
            }
            
            /* 海浪边框 - 此起彼伏效果 */
            #voice-neon-border .wave-border {
                position: absolute;
            }
            
            /* 顶部海浪 - 柔和淡色 */
            #voice-neon-border .wave-top {
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, 
                    transparent 0%,
                    rgba(100, 200, 255, 0.4) 10%,
                    rgba(180, 130, 255, 0.4) 25%,
                    rgba(100, 200, 255, 0.5) 40%,
                    rgba(180, 130, 255, 0.5) 55%,
                    rgba(100, 200, 255, 0.4) 70%,
                    rgba(180, 130, 255, 0.4) 85%,
                    transparent 100%
                );
                background-size: 300% 100%;
                animation: waveFlowTop 3s ease-in-out infinite;
                box-shadow: 
                    0 0 8px rgba(100, 200, 255, 0.3),
                    0 0 15px rgba(180, 130, 255, 0.2);
            }
            
            /* 底部海浪 - 延迟启动，此起彼伏 */
            #voice-neon-border .wave-bottom {
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, 
                    transparent 0%,
                    rgba(180, 130, 255, 0.4) 10%,
                    rgba(100, 200, 255, 0.4) 25%,
                    rgba(180, 130, 255, 0.5) 40%,
                    rgba(100, 200, 255, 0.5) 55%,
                    rgba(180, 130, 255, 0.4) 70%,
                    rgba(100, 200, 255, 0.4) 85%,
                    transparent 100%
                );
                background-size: 300% 100%;
                animation: waveFlowBottom 3.5s ease-in-out infinite;
                animation-delay: 0.8s;
                box-shadow: 
                    0 0 8px rgba(180, 130, 255, 0.3),
                    0 0 15px rgba(100, 200, 255, 0.2);
            }
            
            /* 左侧海浪 - 不同节奏 */
            #voice-neon-border .wave-left {
                top: 0;
                left: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(180deg, 
                    transparent 0%,
                    rgba(180, 130, 255, 0.4) 10%,
                    rgba(100, 200, 255, 0.4) 25%,
                    rgba(180, 130, 255, 0.5) 40%,
                    rgba(100, 200, 255, 0.5) 55%,
                    rgba(180, 130, 255, 0.4) 70%,
                    rgba(100, 200, 255, 0.4) 85%,
                    transparent 100%
                );
                background-size: 100% 300%;
                animation: waveFlowLeft 4s ease-in-out infinite;
                animation-delay: 0.3s;
                box-shadow: 
                    0 0 8px rgba(180, 130, 255, 0.3),
                    0 0 15px rgba(100, 200, 255, 0.2);
            }
            
            /* 右侧海浪 - 不同节奏 */
            #voice-neon-border .wave-right {
                top: 0;
                right: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(180deg, 
                    transparent 0%,
                    rgba(100, 200, 255, 0.4) 10%,
                    rgba(180, 130, 255, 0.4) 25%,
                    rgba(100, 200, 255, 0.5) 40%,
                    rgba(180, 130, 255, 0.5) 55%,
                    rgba(100, 200, 255, 0.4) 70%,
                    rgba(180, 130, 255, 0.4) 85%,
                    transparent 100%
                );
                background-size: 100% 300%;
                animation: waveFlowRight 3.8s ease-in-out infinite;
                animation-delay: 1.1s;
                box-shadow: 
                    0 0 8px rgba(100, 200, 255, 0.3),
                    0 0 15px rgba(180, 130, 255, 0.2);
            }
            
            /* 海浪流动动画 - 柔和的ease-in-out */
            @keyframes waveFlowTop {
                0% { background-position: 0% 0%; }
                100% { background-position: 300% 0%; }
            }
            
            @keyframes waveFlowBottom {
                0% { background-position: 300% 0%; }
                100% { background-position: 0% 0%; }
            }
            
            @keyframes waveFlowLeft {
                0% { background-position: 0% 0%; }
                100% { background-position: 0% 300%; }
            }
            
            @keyframes waveFlowRight {
                0% { background-position: 0% 300%; }
                100% { background-position: 0% 0%; }
            }
            
            /* 四角光晕装饰 - 柔和淡色 */
            #voice-neon-border .corner-glow {
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                filter: blur(20px);
                animation: cornerPulse 3s ease-in-out infinite;
            }
            
            #voice-neon-border .corner-glow-tl {
                top: -15px;
                left: -15px;
                background: radial-gradient(circle, rgba(180, 130, 255, 0.3) 0%, transparent 70%);
            }
            
            #voice-neon-border .corner-glow-tr {
                top: -15px;
                right: -15px;
                background: radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%);
                animation-delay: 0.7s;
            }
            
            #voice-neon-border .corner-glow-bl {
                bottom: -15px;
                left: -15px;
                background: radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%);
                animation-delay: 1.4s;
            }
            
            #voice-neon-border .corner-glow-br {
                bottom: -15px;
                right: -15px;
                background: radial-gradient(circle, rgba(180, 130, 255, 0.3) 0%, transparent 70%);
                animation-delay: 2.1s;
            }
            
            @keyframes cornerPulse {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.6;
                    transform: scale(1.2);
                }
            }
            
            /* 顶部状态提示 */
            #voice-status-toast {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                border: 1px solid rgba(100, 200, 255, 0.3);
                border-radius: 30px;
                padding: 10px 25px;
                z-index: 10000;
                display: none;
                align-items: center;
                gap: 10px;
                box-shadow: 
                    0 0 15px rgba(100, 200, 255, 0.2),
                    0 0 30px rgba(180, 130, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            
            #voice-status-toast.show {
                display: flex;
                animation: toastSlide 0.3s ease-out;
            }
            
            @keyframes toastSlide {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            #voice-status-toast .icon {
                font-size: 20px;
                animation: pulse 1s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            #voice-status-toast .text {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                font-weight: 500;
            }
            
            #voice-status-toast .transcript {
                color: rgba(100, 200, 255, 0.9);
                font-size: 12px;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
        
        this.neonBorder = document.createElement('div');
        this.neonBorder.id = 'voice-neon-border';
        
        const waves = ['top', 'bottom', 'left', 'right'];
        waves.forEach(wave => {
            const el = document.createElement('div');
            el.className = `wave-border wave-${wave}`;
            this.neonBorder.appendChild(el);
        });
        
        const corners = ['tl', 'tr', 'bl', 'br'];
        corners.forEach(corner => {
            const el = document.createElement('div');
            el.className = `corner-glow corner-glow-${corner}`;
            this.neonBorder.appendChild(el);
        });
        
        document.body.appendChild(this.neonBorder);
        
        this.statusToast = document.createElement('div');
        this.statusToast.id = 'voice-status-toast';
        this.statusToast.innerHTML = `
            <span class="icon">🐋</span>
            <span class="text">正在聆听...</span>
            <span class="transcript"></span>
        `;
        document.body.appendChild(this.statusToast);
    }
    
    handleStart() {
        console.log('🎤 语音识别已启动');
        this.consecutiveErrors = 0;
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
            console.log('🎯 语音助手开始监听...');
        } catch (error) {
            if (error.name === 'InvalidStateError') {
                console.log('语音识别已在运行中');
            } else {
                console.error('启动语音识别失败:', error);
            }
        }
    }
    
    stopListening() {
        if (!this.recognition || !this.isListening) return;
        
        try {
            this.recognition.stop();
            this.isListening = false;
            console.log('🛑 语音助手停止监听');
        } catch (error) {
            console.error('停止语音识别失败:', error);
        }
    }
    
    handleResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        const currentTranscript = (finalTranscript + interimTranscript).toLowerCase().trim();
        
        if (currentTranscript && currentTranscript !== this.lastTranscript) {
            this.lastTranscript = currentTranscript;
            console.log('🎤 识别结果:', currentTranscript);
            
            if (this.statusToast) {
                const transcriptEl = this.statusToast.querySelector('.transcript');
                if (transcriptEl) {
                    transcriptEl.textContent = currentTranscript;
                }
            }
        }
        
        if (finalTranscript) {
            this.processTranscript(finalTranscript.toLowerCase().trim());
        }
    }
    
    processTranscript(transcript) {
        console.log('📝 处理语音:', transcript);
        
        for (const wakeWord of this.wakeWords) {
            const wakeWordLower = wakeWord.toLowerCase();
            if (transcript.includes(wakeWordLower)) {
                const command = transcript.replace(wakeWordLower, '').trim();
                this.onWakeWordDetected(command);
                return;
            }
        }
        
        for (const wakeWord of this.wakeWords) {
            if (this.fuzzyMatch(transcript, wakeWord.toLowerCase(), this.wakeWordThreshold)) {
                console.log('🎯 模糊匹配成功:', wakeWord);
                const command = transcript.replace(wakeWord.toLowerCase(), '').trim();
                this.onWakeWordDetected(command);
                return;
            }
        }
        
        if (this.wakeWordDetected) {
            if (this.onCommand) {
                this.onCommand(transcript);
            }
            this.wakeWordDetected = false;
        }
    }
    
    fuzzyMatch(text, pattern, threshold) {
        const textLower = text.toLowerCase();
        const patternLower = pattern.toLowerCase();
        
        if (textLower.includes(patternLower)) {
            return true;
        }
        
        let matchCount = 0;
        let patternIndex = 0;
        
        for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
            if (textLower[i] === patternLower[patternIndex]) {
                matchCount++;
                patternIndex++;
            }
        }
        
        const similarity = matchCount / patternLower.length;
        return similarity >= threshold;
    }
    
    onWakeWordDetected(command) {
        console.log('🎉 唤醒词检测到！命令:', command);
        
        this.wakeWordDetected = true;
        this.showNeonBorder();
        this.speak('我在');
        
        if (this.onWakeUp) {
            this.onWakeUp(command);
        }
        
        if (command && this.onCommand) {
            setTimeout(() => {
                this.onCommand(command);
            }, 500);
        }
    }
    
    showNeonBorder() {
        if (this.neonBorder) {
            this.neonBorder.classList.add('active');
        }
        if (this.statusToast) {
            this.statusToast.classList.add('show');
            const textEl = this.statusToast.querySelector('.text');
            if (textEl) {
                textEl.textContent = '🐋 已唤醒';
            }
        }
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        this.hideTimeout = setTimeout(() => {
            this.hideNeonBorder();
        }, 15000);
        
        // 添加点击空白区域退出功能
        this.clickToExitHandler = (e) => {
            if (e.target === document.body || 
                e.target.closest('#voice-neon-border') === null && 
                e.target.closest('#voice-status-toast') === null &&
                e.target.closest('.settings-panel') === null &&
                e.target.closest('.modal') === null) {
                this.hideNeonBorder();
                console.log('🖱️ 点击空白区域退出语音助手');
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', this.clickToExitHandler);
        }, 300);
    }
    
    hideNeonBorder() {
        if (this.neonBorder) {
            this.neonBorder.classList.remove('active');
        }
        if (this.statusToast) {
            this.statusToast.classList.remove('show');
        }
        this.wakeWordDetected = false;
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        // 移除点击事件监听器
        if (this.clickToExitHandler) {
            document.removeEventListener('click', this.clickToExitHandler);
            this.clickToExitHandler = null;
        }
    }
    
    speak(text) {
        if (!this.synthesis) {
            console.warn('语音合成不可用');
            return;
        }
        
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        if (this.voices && this.voices.length > 0) {
            const chineseVoice = this.voices.find(voice => 
                voice.lang.includes('zh') && voice.name.includes('Female')
            ) || this.voices.find(voice => voice.lang.includes('zh'));
            if (chineseVoice) {
                utterance.voice = chineseVoice;
            }
        }
        
        this.synthesis.speak(utterance);
        console.log('🔊 语音反馈:', text);
    }
    
    handleError(event) {
        console.error('❌ 语音识别错误:', event.error);
        
        this.consecutiveErrors++;
        
        if (event.error === 'no-speech') {
            return;
        }
        
        if (event.error === 'aborted') {
            return;
        }
        
        if (event.error === 'not-allowed') {
            this.isEnabled = false;
            localStorage.setItem('voiceAssistantEnabled', 'false');
            alert('麦克风权限被拒绝，语音助手已关闭');
            return;
        }
        
        if (event.error === 'network') {
            console.warn('网络错误，尝试重新连接...');
        }
        
        if (this.consecutiveErrors >= this.maxRetries) {
            console.error('连续错误次数过多，停止监听');
            this.isEnabled = false;
        }
    }
    
    handleEnd() {
        console.log('🔄 语音识别会话结束');
        
        if (this.isEnabled) {
            setTimeout(() => {
                if (this.isEnabled && !this.isListening) {
                    try {
                        this.recognition.start();
                    } catch (error) {
                        console.error('重启语音识别失败:', error);
                    }
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
    
    showWelcome() {
        this.showNeonBorder();
        this.speak('泡泡鲸语音助手已启动，请说泡泡鲸唤醒我');
        
        setTimeout(() => {
            this.hideNeonBorder();
        }, 5000);
    }
}

const voiceAssistant = new VoiceAssistant();

export default voiceAssistant;
export { VoiceAssistant };

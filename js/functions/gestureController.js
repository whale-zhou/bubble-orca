// 手势识别模块 - 隔空交互
// 使用 MediaPipe Hands 进行手部检测

class GestureController {
    constructor() {
        this.isEnabled = false;
        this.isRunning = false;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.hands = null;
        this.camera = null;
        this.previewContainer = null;
        this.gestureIndicator = null;
        
        this.lastGesture = null;
        this.gestureStartTime = 0;
        this.gestureHoldTime = 300;
        
        this.lastHandY = 0;
        this.lastHandX = 0;
        this.swipeThreshold = 30;
        this.lastSwipeTime = 0;
        this.swipeCooldown = 200;
        this.swipeHistory = [];
        this.swipeHistoryMax = 5;
        
        this.pinchDistance = 0;
        this.lastPinchDistance = 0;
        this.isPinching = false;
        
        this.handsDetected = 0;
        this.lastClapTime = 0;
        this.clapCooldown = 1000;
        
        this.onGesture = null;
        this.voiceAssistant = null;
        
        this.styles = null;
    }
    
    async init() {
        this.createStyles();
        this.createPreviewContainer();
        this.createGestureIndicator();
        
        console.log('🖐️ 手势控制器已初始化');
    }
    
    createStyles() {
        this.styles = document.createElement('style');
        this.styles.textContent = `
            /* 摄像头预览容器 */
            #gesture-preview-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 200px;
                height: 150px;
                border-radius: 12px;
                overflow: hidden;
                z-index: 9998;
                display: none;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(100, 200, 255, 0.5);
                background: #000;
            }
            
            #gesture-preview-container.show {
                display: block;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            #gesture-preview-container.dragging {
                cursor: grabbing;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            }
            
            #gesture-preview-container.hidden-content video,
            #gesture-preview-container.hidden-content canvas {
                opacity: 0;
            }
            
            #gesture-preview-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transform: scaleX(-1);
            }
            
            #gesture-preview-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform: scaleX(-1);
                pointer-events: none;
            }
            
            /* 预览控制按钮 */
            #gesture-preview-controls {
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                gap: 5px;
                z-index: 10;
            }
            
            .gesture-preview-btn {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: none;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .gesture-preview-btn:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }
            
            .gesture-preview-btn.eye-closed {
                opacity: 0.5;
            }
            
            /* 拖动条 */
            #gesture-preview-drag-handle {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 30px;
                cursor: grab;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
                z-index: 5;
            }
            
            #gesture-preview-drag-handle:active {
                cursor: grabbing;
            }
            
            /* 手势提示 */
            #gesture-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.85);
                border: 2px solid rgba(100, 200, 255, 0.6);
                border-radius: 20px;
                padding: 20px 40px;
                z-index: 10000;
                display: none;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                box-shadow: 0 0 30px rgba(100, 200, 255, 0.3);
                backdrop-filter: blur(10px);
            }
            
            #gesture-indicator.show {
                display: flex;
                animation: popIn 0.2s ease-out;
            }
            
            @keyframes popIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            #gesture-indicator .gesture-icon {
                font-size: 48px;
            }
            
            #gesture-indicator .gesture-name {
                color: white;
                font-size: 18px;
                font-weight: 500;
            }
            
            #gesture-indicator .gesture-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            #gesture-indicator .gesture-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #64c8ff, #b482ff);
                width: 0%;
                transition: width 0.1s linear;
            }
            
            /* 状态标签 */
            #gesture-status-badge {
                position: absolute;
                bottom: 5px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 10px;
                border-radius: 10px;
                font-size: 11px;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(this.styles);
    }
    
    createPreviewContainer() {
        this.previewContainer = document.createElement('div');
        this.previewContainer.id = 'gesture-preview-container';
        this.previewContainer.innerHTML = `
            <div id="gesture-preview-drag-handle"></div>
            <div id="gesture-preview-controls">
                <button class="gesture-preview-btn" id="gesture-toggle-visibility" title="显示/隐藏">
                    <span class="eye-icon">👁️</span>
                </button>
                <button class="gesture-preview-btn" id="gesture-close" title="关闭手势控制">
                    ✕
                </button>
            </div>
            <video id="gesture-preview-video" autoplay playsinline></video>
            <canvas id="gesture-preview-canvas"></canvas>
            <div id="gesture-status-badge">🖐️ 检测中...</div>
        `;
        document.body.appendChild(this.previewContainer);
        
        this.video = this.previewContainer.querySelector('#gesture-preview-video');
        this.canvas = this.previewContainer.querySelector('#gesture-preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupDraggable();
        this.setupControls();
    }
    
    setupDraggable() {
        const handle = this.previewContainer.querySelector('#gesture-preview-drag-handle');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.previewContainer.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            const rect = this.previewContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            newLeft = Math.max(0, Math.min(window.innerWidth - 200, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - 150, newTop));
            
            this.previewContainer.style.left = newLeft + 'px';
            this.previewContainer.style.top = newTop + 'px';
            this.previewContainer.style.right = 'auto';
            this.previewContainer.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.previewContainer.classList.remove('dragging');
        });
    }
    
    setupControls() {
        const toggleBtn = this.previewContainer.querySelector('#gesture-toggle-visibility');
        const closeBtn = this.previewContainer.querySelector('#gesture-close');
        
        toggleBtn.addEventListener('click', () => {
            this.previewContainer.classList.toggle('hidden-content');
            const icon = toggleBtn.querySelector('.eye-icon');
            if (this.previewContainer.classList.contains('hidden-content')) {
                icon.textContent = '👁️‍🗨️';
                toggleBtn.classList.add('eye-closed');
            } else {
                icon.textContent = '👁️';
                toggleBtn.classList.remove('eye-closed');
            }
        });
        
        closeBtn.addEventListener('click', () => {
            this.disable();
        });
    }
    
    createGestureIndicator() {
        this.gestureIndicator = document.createElement('div');
        this.gestureIndicator.id = 'gesture-indicator';
        this.gestureIndicator.innerHTML = `
            <div class="gesture-icon">🖐️</div>
            <div class="gesture-name">检测中</div>
            <div class="gesture-progress">
                <div class="gesture-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(this.gestureIndicator);
    }
    
    async enable() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            this.video.srcObject = stream;
            await this.video.play();
            
            this.canvas.width = this.video.videoWidth || 640;
            this.canvas.height = this.video.videoHeight || 480;
            
            await this.loadMediaPipe();
            
            this.isEnabled = true;
            this.isRunning = true;
            this.previewContainer.classList.add('show');
            localStorage.setItem('gestureControlEnabled', 'true');
            
            this.startDetection();
            
            console.log('✅ 手势控制已启用');
            return true;
        } catch (error) {
            console.error('启用手势控制失败:', error);
            alert('需要摄像头权限才能使用手势控制功能');
            return false;
        }
    }
    
    async loadMediaPipe() {
        if (window.Hands) {
            this.initHands();
            return;
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
            script.onload = () => {
                this.initHands();
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    initHands() {
        this.hands = new window.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        
        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });
        
        this.hands.onResults((results) => this.onResults(results));
    }
    
    startDetection() {
        const detect = async () => {
            if (!this.isRunning || !this.video.readyState >= 2) {
                if (this.isRunning) {
                    requestAnimationFrame(detect);
                }
                return;
            }
            
            try {
                await this.hands.send({ image: this.video });
            } catch (error) {
                console.error('手势检测错误:', error);
            }
            
            requestAnimationFrame(detect);
        };
        
        detect();
    }
    
    onResults(results) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.handsDetected = results.multiHandLandmarks.length;
            
            for (const landmarks of results.multiHandLandmarks) {
                this.drawHand(landmarks);
                this.analyzeGesture(landmarks);
            }
            
            if (results.multiHandLandmarks.length === 2) {
                this.detectClap(results.multiHandLandmarks);
            }
            
            this.updateStatus(`🖐️ 检测到 ${this.handsDetected} 只手`);
        } else {
            this.handsDetected = 0;
            this.updateStatus('🖐️ 检测中...');
            this.hideGestureIndicator();
        }
    }
    
    drawHand(landmarks) {
        this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
        this.ctx.lineWidth = 2;
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20],
            [5, 9], [9, 13], [13, 17]
        ];
        
        for (const [start, end] of connections) {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x * this.canvas.width, startPoint.y * this.canvas.height);
            this.ctx.lineTo(endPoint.x * this.canvas.width, endPoint.y * this.canvas.height);
            this.ctx.stroke();
        }
        
        for (const point of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(
                point.x * this.canvas.width,
                point.y * this.canvas.height,
                4, 0, 2 * Math.PI
            );
            this.ctx.fillStyle = 'rgba(180, 130, 255, 0.9)';
            this.ctx.fill();
        }
    }
    
    analyzeGesture(landmarks) {
        const gesture = this.detectGesture(landmarks);
        
        if (gesture) {
            const now = Date.now();
            
            if (gesture === this.lastGesture) {
                const holdTime = now - this.gestureStartTime;
                const progress = Math.min(holdTime / this.gestureHoldTime, 1);
                
                this.showGestureIndicator(gesture, progress);
                
                if (holdTime >= this.gestureHoldTime) {
                    this.executeGesture(gesture, landmarks);
                    this.gestureStartTime = now + this.gestureHoldTime;
                }
            } else {
                this.lastGesture = gesture;
                this.gestureStartTime = now;
                this.showGestureIndicator(gesture, 0);
            }
        } else {
            this.lastGesture = null;
            this.hideGestureIndicator();
        }
        
        this.detectSwipe(landmarks);
    }
    
    detectGesture(landmarks) {
        const thumb = landmarks[4];
        const index = landmarks[8];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];
        const wrist = landmarks[0];
        const indexMcp = landmarks[5];
        const middleMcp = landmarks[9];
        const ringMcp = landmarks[13];
        const pinkyMcp = landmarks[17];
        
        const thumbExtended = this.isFingerExtended(landmarks, 'thumb');
        const indexExtended = this.isFingerExtended(landmarks, 'index');
        const middleExtended = this.isFingerExtended(landmarks, 'middle');
        const ringExtended = this.isFingerExtended(landmarks, 'ring');
        const pinkyExtended = this.isFingerExtended(landmarks, 'pinky');
        
        const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
        
        const thumbIndexDist = this.getDistance(thumb, index);
        
        if (extendedCount === 0 && !thumbExtended) {
            return 'fist';
        }
        
        if (thumbIndexDist < 0.06 && middleExtended === false && ringExtended === false && pinkyExtended === false) {
            return 'pinch';
        }
        
        if (thumbIndexDist > 0.1 && thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'zoom_out';
        }
        
        return null;
    }
    
    isFingerExtended(landmarks, finger) {
        const fingerIndices = {
            thumb: [1, 2, 3, 4],
            index: [5, 6, 7, 8],
            middle: [9, 10, 11, 12],
            ring: [13, 14, 15, 16],
            pinky: [17, 18, 19, 20]
        };
        
        const indices = fingerIndices[finger];
        if (!indices) return false;
        
        if (finger === 'thumb') {
            const thumb = landmarks[4];
            const indexMcp = landmarks[5];
            return thumb.x < indexMcp.x;
        }
        
        const tip = landmarks[indices[3]];
        const pip = landmarks[indices[1]];
        const mcp = landmarks[indices[0]];
        
        return tip.y < pip.y && pip.y < mcp.y;
    }
    
    getDistance(p1, p2) {
        return Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + 
            Math.pow(p1.y - p2.y, 2)
        );
    }
    
    detectSwipe(landmarks) {
        const wrist = landmarks[0];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        
        const now = Date.now();
        
        if (now - this.lastSwipeTime < this.swipeCooldown) return;
        
        const indexExtended = this.isFingerExtended(landmarks, 'index');
        const middleExtended = this.isFingerExtended(landmarks, 'middle');
        const ringExtended = this.isFingerExtended(landmarks, 'ring');
        const pinkyExtended = this.isFingerExtended(landmarks, 'pinky');
        
        const isPalmSwipe = indexExtended && middleExtended && ringExtended && pinkyExtended;
        const isOneFingerSwipe = indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
        const isTwoFingerSwipe = indexExtended && middleExtended && !ringExtended && !pinkyExtended;
        
        if (!isPalmSwipe && !isOneFingerSwipe && !isTwoFingerSwipe) {
            this.swipeHistory = [];
            return;
        }
        
        let referencePoint;
        if (isPalmSwipe) {
            referencePoint = wrist;
        } else if (isTwoFingerSwipe) {
            referencePoint = {
                x: (indexTip.x + middleTip.x) / 2,
                y: (indexTip.y + middleTip.y) / 2
            };
        } else {
            referencePoint = indexTip;
        }
        
        this.swipeHistory.push({
            y: referencePoint.y,
            time: now
        });
        
        if (this.swipeHistory.length > this.swipeHistoryMax) {
            this.swipeHistory.shift();
        }
        
        if (this.swipeHistory.length >= 3) {
            const first = this.swipeHistory[0];
            const last = this.swipeHistory[this.swipeHistory.length - 1];
            const deltaY = last.y - first.y;
            const deltaTime = last.time - first.time;
            
            if (deltaTime < 500 && Math.abs(deltaY) > 0.05) {
                if (deltaY > 0) {
                    this.executeSwipe('down');
                } else {
                    this.executeSwipe('up');
                }
                this.lastSwipeTime = now;
                this.swipeHistory = [];
            }
        }
        
        this.lastHandY = referencePoint.y;
        this.lastHandX = referencePoint.x;
    }
    
    detectClap(handsLandmarks) {
        const now = Date.now();
        if (now - this.lastClapTime < this.clapCooldown) return;
        
        const leftWrist = handsLandmarks[0][0];
        const rightWrist = handsLandmarks[1][0];
        
        const distance = this.getDistance(leftWrist, rightWrist);
        
        if (distance < 0.15) {
            this.lastClapTime = now;
            this.executeClap();
        }
    }
    
    executeGesture(gesture, landmarks) {
        console.log('🎯 执行手势:', gesture);
        
        switch (gesture) {
            case 'fist':
                this.simulateShortcut('screenshot');
                break;
            case 'pinch':
                this.zoomIn();
                break;
            case 'zoom_out':
                this.zoomOut();
                break;
        }
        
        if (this.onGesture) {
            this.onGesture(gesture);
        }
    }
    
    simulateShortcut(action) {
        console.log('⌨️ 模拟快捷键:', action);
        
        if (action === 'screenshot') {
            this.showQuickIndicator('📸 截图 (Alt+A)');
            
            const event = new KeyboardEvent('keydown', {
                key: 'a',
                code: 'KeyA',
                keyCode: 65,
                which: 65,
                altKey: true,
                bubbles: true
            });
            document.dispatchEvent(event);
            
            const event2 = new KeyboardEvent('keyup', {
                key: 'a',
                code: 'KeyA',
                keyCode: 65,
                which: 65,
                altKey: true,
                bubbles: true
            });
            document.dispatchEvent(event2);
            
            document.body.style.border = '4px solid rgba(100, 200, 255, 0.8)';
            setTimeout(() => {
                document.body.style.border = '';
            }, 300);
        }
    }
    
    executeSwipe(direction) {
        console.log('👆 滑动:', direction);
        
        const scrollAmount = 300;
        
        if (direction === 'up') {
            window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
        } else {
            window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        }
        
        this.showQuickIndicator(direction === 'up' ? '⬆️ 向上滚动' : '⬇️ 向下滚动');
    }
    
    executeClap() {
        console.log('👏 拍手 - 唤醒语音助手');
        
        if (this.voiceAssistant) {
            this.voiceAssistant.showNeonBorder();
            this.voiceAssistant.speak('我在');
        }
        
        this.showQuickIndicator('👏 唤醒语音助手');
    }
    
    takeScreenshot() {
        this.showQuickIndicator('📸 截图');
        
        document.body.style.border = '4px solid rgba(100, 200, 255, 0.8)';
        setTimeout(() => {
            document.body.style.border = '';
        }, 300);
    }
    
    zoomIn() {
        this.showQuickIndicator('🔍 放大');
        document.body.style.transform = `scale(${1.1})`;
        document.body.style.transformOrigin = 'center center';
    }
    
    zoomOut() {
        this.showQuickIndicator('🔍 缩小');
        document.body.style.transform = `scale(${1})`;
    }
    
    showVoiceAssistant() {
        if (this.voiceAssistant) {
            this.voiceAssistant.showNeonBorder();
            this.voiceAssistant.speak('我在');
        }
        this.showQuickIndicator('🐋 唤醒语音助手');
    }
    
    showGestureIndicator(gesture, progress) {
        const icons = {
            'fist': '✊',
            'pinch': '🤏',
            'zoom_out': '👌'
        };
        
        const names = {
            'fist': '截图',
            'pinch': '放大',
            'zoom_out': '缩小'
        };
        
        const icon = this.gestureIndicator.querySelector('.gesture-icon');
        const name = this.gestureIndicator.querySelector('.gesture-name');
        const progressBar = this.gestureIndicator.querySelector('.gesture-progress-bar');
        
        icon.textContent = icons[gesture] || '🖐️';
        name.textContent = names[gesture] || gesture;
        progressBar.style.width = (progress * 100) + '%';
        
        this.gestureIndicator.classList.add('show');
    }
    
    hideGestureIndicator() {
        this.gestureIndicator.classList.remove('show');
    }
    
    showQuickIndicator(text) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 18px;
            z-index: 10001;
            animation: popIn 0.2s ease-out;
            border: 2px solid rgba(100, 200, 255, 0.5);
        `;
        indicator.textContent = text;
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transition = 'opacity 0.3s';
            setTimeout(() => indicator.remove(), 300);
        }, 800);
    }
    
    updateStatus(text) {
        const badge = this.previewContainer.querySelector('#gesture-status-badge');
        if (badge) {
            badge.textContent = text;
        }
    }
    
    disable() {
        this.isRunning = false;
        this.isEnabled = false;
        
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        this.previewContainer.classList.remove('show');
        this.hideGestureIndicator();
        localStorage.setItem('gestureControlEnabled', 'false');
        
        console.log('🛑 手势控制已关闭');
    }
    
    setVoiceAssistant(va) {
        this.voiceAssistant = va;
    }
    
    getStatus() {
        return {
            enabled: this.isEnabled,
            running: this.isRunning,
            handsDetected: this.handsDetected
        };
    }
}

const gestureController = new GestureController();

export default gestureController;
export { GestureController };

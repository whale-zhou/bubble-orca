class QuantumStateAnimator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.animationId = null;
        this.currentPhase = 0;
        this.phaseNames = [
            '初始态 |0⟩',
            'Hadamard 叠加态',
            '受控模幂运算',
            '量子傅里叶变换',
            '相位干涉',
            '测量坍缩'
        ];
        this.currentPhaseIndex = 0;
        this.animationProgress = 0;
        this.qubitStates = [];
        this.numQubits = 3;
        this.N = 15;
        this.a = 2;
        this.isComplete = false;
        this.speed = 1;
        this.isPlaying = true;
    }

    initQubitStates(numQubits) {
        this.numQubits = numQubits;
        this.qubitStates = [];
        for (let i = 0; i < numQubits; i++) {
            this.qubitStates.push({
                alpha: { re: 1, im: 0 },
                beta: { re: 0, im: 0 },
                phase: 0,
                probability0: 1,
                probability1: 0
            });
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {
        const ctx = this.ctx;
        
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#0f0f1a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }

    drawHeader() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('Shor 算法量子态演化动画', this.width / 2, 30);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#818cf8';
        ctx.fillText(`当前阶段: ${this.phaseNames[this.currentPhaseIndex]}`, this.width / 2, 55);
        
        const indicatorY = 80;
        const indicatorWidth = 500;
        const startX = (this.width - indicatorWidth) / 2;
        const stepWidth = indicatorWidth / this.phaseNames.length;
        
        for (let i = 0; i < this.phaseNames.length; i++) {
            const x = startX + i * stepWidth + stepWidth / 2;
            
            if (i < this.currentPhaseIndex) {
                ctx.fillStyle = '#22c55e';
            } else if (i === this.currentPhaseIndex) {
                ctx.fillStyle = '#6366f1';
            } else {
                ctx.fillStyle = '#374151';
            }
            
            ctx.beginPath();
            ctx.arc(x, indicatorY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            if (i < this.phaseNames.length - 1) {
                ctx.strokeStyle = i < this.currentPhaseIndex ? '#22c55e' : '#374151';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 10, indicatorY);
                ctx.lineTo(x + stepWidth - 10, indicatorY);
                ctx.stroke();
            }
        }
    }

    drawBlochSphere(centerX, centerY, radius, qubitIndex, state) {
        const ctx = this.ctx;
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.stroke();
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText('|0⟩', centerX, centerY - radius - 10);
        ctx.fillText('|1⟩', centerX, centerY + radius + 15);
        
        const theta = Math.acos(Math.sqrt(state.probability0) * 2 - 1);
        const phi = state.phase;
        
        const x = centerX + radius * Math.sin(theta) * Math.cos(phi);
        const y = centerY - radius * Math.cos(theta);
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText(`q${qubitIndex}`, centerX, centerY + radius + 35);
    }

    drawProbabilityBars(startX, startY, width, height) {
        const ctx = this.ctx;
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('概率分布', startX, startY - 10);
        
        const numStates = Math.pow(2, this.numQubits);
        const barWidth = width / numStates - 4;
        
        for (let i = 0; i < numStates; i++) {
            const probability = this.calculateStateProbability(i);
            const barHeight = probability * height;
            const x = startX + i * (barWidth + 4);
            const y = startY + height - barHeight;
            
            const gradient = ctx.createLinearGradient(x, y, x, startY + height);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            ctx.font = '12px monospace';
            ctx.fillStyle = '#d1d5db';
            ctx.textAlign = 'center';
            ctx.fillText(`|${i.toString(2).padStart(this.numQubits, '0')}⟩`, x + barWidth / 2, startY + height + 15);
        }
    }

    calculateStateProbability(stateIndex) {
        if (this.currentPhaseIndex === 0) {
            return stateIndex === 0 ? 1 : 0;
        } else if (this.currentPhaseIndex === 1) {
            return 1 / Math.pow(2, this.numQubits);
        } else if (this.currentPhaseIndex >= 4) {
            const period = this.findPeriod();
            const numPeaks = Math.pow(2, this.numQubits) / period;
            if (stateIndex % period === 0) {
                return 1 / numPeaks * 0.8 + 0.2 / Math.pow(2, this.numQubits);
            }
            return 0.2 / Math.pow(2, this.numQubits);
        }
        return 1 / Math.pow(2, this.numQubits);
    }

    findPeriod() {
        const periods = { 15: 4, 21: 6, 35: 12, 9: 6 };
        return periods[this.N] || 4;
    }

    drawSineWaveView(startX, startY, width, height) {
        const ctx = this.ctx;
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('量子傅里叶变换 - 频域视角', startX, startY - 10);
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY + height / 2);
        ctx.lineTo(startX + width, startY + height / 2);
        ctx.stroke();
        
        const period = this.findPeriod();
        const frequencies = [];
        for (let i = 0; i < period; i++) {
            frequencies.push(Math.pow(2, this.numQubits) * i / period);
        }
        
        for (let f = 0; f < frequencies.length; f++) {
            const freq = frequencies[f];
            const amplitude = height * 0.35;
            
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${240 + f * 30}, 70%, 60%)`;
            ctx.lineWidth = 2;
            
            for (let x = 0; x < width; x++) {
                const t = x / width * 4 * Math.PI;
                const y = startY + height / 2 - amplitude * Math.sin(freq * t / 10 + this.animationProgress * Math.PI * 2) * Math.exp(-Math.pow(x - width / 2, 2) / (width * width / 8));
                
                if (x === 0) {
                    ctx.moveTo(startX + x, y);
                } else {
                    ctx.lineTo(startX + x, y);
                }
            }
            ctx.stroke();
        }
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#d1d5db';
        ctx.textAlign = 'center';
        ctx.fillText('频率 →', startX + width / 2, startY + height + 20);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`检测到周期 r = ${period}`, startX + width / 2, startY + height + 40);
    }

    drawPhaseDisc(centerX, centerY, radius, qubitIndex, phase) {
        const ctx = this.ctx;
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        const gradient = ctx.createConicGradient(phase, centerX, centerY);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        gradient.addColorStop(0.25, 'rgba(139, 92, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
        gradient.addColorStop(0.75, 'rgba(34, 197, 94, 0.8)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.8)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + (radius - 10) * Math.cos(phase),
            centerY + (radius - 10) * Math.sin(phase)
        );
        ctx.stroke();
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`q${qubitIndex}`, centerX, centerY + radius + 20);
        ctx.fillText(`φ=${(phase * 180 / Math.PI).toFixed(0)}°`, centerX, centerY + radius + 35);
    }

    drawMeasurementAnimation(centerX, centerY, radius, progress) {
        const ctx = this.ctx;
        
        const numDots = 20;
        for (let i = 0; i < numDots; i++) {
            const angle = (i / numDots) * Math.PI * 2;
            const r = radius * (1 - progress * 0.8);
            const x = centerX + r * Math.cos(angle + progress * Math.PI * 4);
            const y = centerY + r * Math.sin(angle + progress * Math.PI * 4);
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(139, 92, 246, ${1 - progress})`;
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const result = Math.random() > 0.5 ? '|1⟩' : '|0⟩';
        ctx.font = `bold ${20 + progress * 20}px monospace`;
        ctx.fillStyle = `rgba(34, 197, 94, ${progress})`;
        ctx.textAlign = 'center';
        ctx.fillText(result, centerX, centerY + 10);
    }

    drawInfoPanel(x, y, width, height) {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(30, 30, 50, 0.8)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 10);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('量子态信息', x + 15, y + 25);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        
        const info = this.getPhaseInfo();
        const lines = info.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, x + 15, y + 50 + i * 20);
        });
    }

    getPhaseInfo() {
        const infos = [
            `初始态: 所有量子比特处于 |0⟩\n这是一个纯经典状态\n|ψ⟩ = |000...0⟩`,
            `Hadamard 门创建叠加态\n每个量子比特同时处于 |0⟩ 和 |1⟩\n|ψ⟩ = (|0⟩+|1⟩)⊗n / √2ⁿ`,
            `受控模幂运算\n计算 a^x mod N\n量子纠缠产生周期性`,
            `量子傅里叶变换\n将周期信息转换到频域\n相位干涉开始形成`,
            `相位干涉\n概率幅在某些状态增强\n在其他状态抵消`,
            `测量坍缩\n波函数坍缩到单一状态\n获得周期信息`
        ];
        return infos[this.currentPhaseIndex];
    }

    updateAnimation() {
        if (this.isComplete || !this.isPlaying) return false;
        
        this.animationProgress += 0.003 * this.speed;
        
        if (this.animationProgress >= 1) {
            this.animationProgress = 0;
            this.currentPhaseIndex++;
            
            if (this.currentPhaseIndex >= this.phaseNames.length) {
                this.currentPhaseIndex = this.phaseNames.length - 1;
                this.animationProgress = 1;
                this.isComplete = true;
                this.isPlaying = false;
                this.stop();
                return false;
            }
        }
        
        for (let i = 0; i < this.qubitStates.length; i++) {
            this.qubitStates[i].phase += 0.02;
        }
        
        return true;
    }

    draw() {
        this.clear();
        this.drawBackground();
        this.drawHeader();
        
        const blochStartX = 50;
        const blochY = 250;
        const blochRadius = 55;
        const blochSpacing = 130;
        
        for (let i = 0; i < Math.min(this.numQubits, 4); i++) {
            const state = {
                probability0: this.currentPhaseIndex < 2 ? 1 - this.animationProgress * 0.5 : 0.5,
                probability1: this.currentPhaseIndex < 2 ? this.animationProgress * 0.5 : 0.5,
                phase: this.qubitStates[i] ? this.qubitStates[i].phase : 0
            };
            this.drawBlochSphere(blochStartX + i * blochSpacing, blochY, blochRadius, i, state);
        }
        
        const probStartX = 550;
        const probStartY = 150;
        this.drawProbabilityBars(probStartX, probStartY, 300, 150);
        
        if (this.currentPhaseIndex >= 3) {
            this.drawSineWaveView(550, 350, 300, 120);
        }
        
        const phaseStartX = 50;
        const phaseStartY = 400;
        for (let i = 0; i < Math.min(this.numQubits, 4); i++) {
            const phase = this.qubitStates[i] ? this.qubitStates[i].phase : i * Math.PI / 4;
            this.drawPhaseDisc(phaseStartX + i * 100, phaseStartY, 35, i, phase);
        }
        
        this.drawInfoPanel(40, 500, 300, 130);
        
        if (this.currentPhaseIndex === 5) {
            this.drawMeasurementAnimation(500, 450, 70, this.animationProgress);
        }
    }

    animate() {
        const shouldContinue = this.updateAnimation();
        this.draw();
        if (shouldContinue) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    start(N, a) {
        this.N = N;
        this.a = a;
        const numQubits = Math.ceil(Math.log2(N * N));
        this.initQubitStates(Math.min(numQubits, 4));
        this.currentPhaseIndex = 0;
        this.animationProgress = 0;
        this.isComplete = false;
        this.isPlaying = true;
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    pause() {
        this.isPlaying = false;
        this.stop();
    }

    resume() {
        if (!this.isComplete) {
            this.isPlaying = true;
            this.animate();
        }
    }
}

function showQuantumAnimation(N, a) {
    let modal = document.getElementById('quantum-animation-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quantum-animation-modal';
        modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-6 max-w-5xl border border-white/10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold gradient-text">量子态演化动画</h3>
                    <button id="close-quantum-animation-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div class="mb-4 bg-gray-800/50 rounded-lg p-3">
                    <div class="flex items-center gap-3 flex-wrap">
                        <button id="restart-animation-btn" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs font-medium transition-colors">
                            重新播放
                        </button>
                        <button id="pause-animation-btn" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-medium transition-colors">
                            暂停
                        </button>
                        <div class="flex items-center gap-1.5">
                            <span class="text-gray-400 text-xs">速度:</span>
                            <button class="speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="0.5">0.5x</button>
                            <button class="speed-btn px-2 py-1 bg-indigo-600 rounded text-white text-xs transition-colors" data-speed="1">1x</button>
                            <button class="speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="1.5">1.5x</button>
                            <button class="speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="2">2x</button>
                            <button class="speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="3">3x</button>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 rounded-lg p-2">
                    <canvas id="quantum-animation-canvas" width="900" height="650"></canvas>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    
    const canvas = document.getElementById('quantum-animation-canvas');
    const animator = new QuantumStateAnimator(canvas);
    canvas._animator = animator;
    animator.start(N, a);
    
    const pauseBtn = document.getElementById('pause-animation-btn');
    
    pauseBtn.onclick = function() {
        if (animator.isComplete) {
            animator.stop();
            animator.start(N, a);
            this.textContent = '暂停';
        } else if (animator.isPlaying) {
            animator.pause();
            this.textContent = '继续';
        } else {
            animator.resume();
            this.textContent = '暂停';
        }
    };
    
    document.getElementById('restart-animation-btn').onclick = () => {
        animator.stop();
        animator.start(N, a);
        pauseBtn.textContent = '暂停';
    };
    
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const speed = parseFloat(this.dataset.speed);
            animator.speed = speed;
            
            document.querySelectorAll('.speed-btn').forEach(b => {
                b.classList.remove('bg-indigo-600');
                b.classList.add('bg-gray-700');
            });
            this.classList.remove('bg-gray-700');
            this.classList.add('bg-indigo-600');
        });
    });
    
    document.getElementById('close-quantum-animation-modal').onclick = () => {
        animator.stop();
        modal.style.display = 'none';
    };
}

export { QuantumStateAnimator, showQuantumAnimation };

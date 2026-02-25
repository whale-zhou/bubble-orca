class SHA256Animator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.animationId = null;
        
        this.phaseNames = [
            '消息填充',
            '消息分块',
            '消息调度展开',
            '压缩函数迭代',
            '雪崩效应展示',
            '最终哈希值'
        ];
        this.currentPhaseIndex = 0;
        this.animationProgress = 0;
        this.isComplete = false;
        this.isPlaying = true;
        
        this.inputMessage = '';
        this.paddedMessage = [];
        this.messageBlocks = [];
        this.messageSchedule = [];
        this.workingVariables = [];
        this.finalHash = [];
        
        this.particles = [];
        this.avalancheBits = [];
        
        this.initialHash = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        this.roundConstants = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        
        this.currentRound = 0;
        this.avalancheSource = '';
        this.avalancheTarget = '';
        this.speed = 1;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {
        const ctx = this.ctx;
        
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width
        );
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#0f0f2a');
        gradient.addColorStop(1, '#050510');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        
        this.drawScanline();
    }

    drawScanline() {
        const ctx = this.ctx;
        const y = (Date.now() / 20) % this.height;
        
        const gradient = ctx.createLinearGradient(0, y - 20, 0, y + 20);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y - 20, this.width, 40);
    }

    drawHeader() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('SHA-256 哈希算法可视化', this.width / 2, 35);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(`阶段 ${this.currentPhaseIndex + 1}/6: ${this.phaseNames[this.currentPhaseIndex]}`, this.width / 2, 60);
        
        this.drawProgressBar();
    }

    drawProgressBar() {
        const ctx = this.ctx;
        const barWidth = 400;
        const barHeight = 6;
        const startX = (this.width - barWidth) / 2;
        const startY = 75;
        
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(startX, startY, barWidth, barHeight);
        
        const progress = (this.currentPhaseIndex + this.animationProgress) / this.phaseNames.length;
        const gradient = ctx.createLinearGradient(startX, startY, startX + barWidth * progress, startY);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#34d399');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, startY, barWidth * progress, barHeight);
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, barWidth, barHeight);
    }

    drawPhase1_MessagePadding() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('原始消息', 200, 130);
        
        const originalBits = this.inputMessage.slice(0, 32);
        this.drawBitStream(50, 150, 300, 30, originalBits, 'rgba(16, 185, 129, 0.8)');
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('填充后消息', 200, 220);
        
        const paddedBits = originalBits + '1' + '0'.repeat(Math.floor(this.animationProgress * 20)) + '...';
        this.drawBitStream(50, 240, 300, 30, paddedBits, 'rgba(251, 191, 36, 0.8)');
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.fillText('添加 "1" 位 + "0" 填充 + 64位长度', 200, 300);
        
        this.drawPaddingDiagram(400, 120, 350, 200);
    }

    drawBitStream(x, y, width, height, bits, color) {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(30, 30, 50, 0.8)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 5);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = '12px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.fillText(bits, x + 10, y + height / 2 + 4);
    }

    drawPaddingDiagram(x, y, width, height) {
        const ctx = this.ctx;
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        
        const sections = [
            { label: '原始消息', width: 0.4, color: 'rgba(16, 185, 129, 0.3)' },
            { label: '"1"位', width: 0.05, color: 'rgba(251, 191, 36, 0.5)' },
            { label: '"0"填充', width: 0.35, color: 'rgba(107, 114, 128, 0.3)' },
            { label: '长度', width: 0.2, color: 'rgba(139, 92, 246, 0.3)' }
        ];
        
        let currentX = x;
        sections.forEach((section, i) => {
            const sectionWidth = width * section.width * this.animationProgress;
            
            ctx.fillStyle = section.color;
            ctx.fillRect(currentX, y, sectionWidth, height);
            
            if (sectionWidth > 30) {
                ctx.font = '10px monospace';
                ctx.fillStyle = '#e5e7eb';
                ctx.textAlign = 'center';
                ctx.fillText(section.label, currentX + sectionWidth / 2, y + height / 2 + 4);
            }
            
            currentX += width * section.width;
        });
    }

    drawPhase2_MessageBlocks() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('512位消息块分割', this.width / 2, 130);
        
        const blockSize = 80;
        const numBlocks = 4;
        const startX = (this.width - numBlocks * (blockSize + 10)) / 2;
        const startY = 160;
        
        for (let i = 0; i < numBlocks; i++) {
            const x = startX + i * (blockSize + 10);
            const progress = Math.max(0, Math.min(1, this.animationProgress * 4 - i));
            
            ctx.globalAlpha = progress;
            
            const gradient = ctx.createLinearGradient(x, startY, x + blockSize, startY + blockSize);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, startY, blockSize, blockSize, 8);
            ctx.fill();
            ctx.stroke();
            
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#10b981';
            ctx.textAlign = 'center';
            ctx.fillText(`M${i}`, x + blockSize / 2, startY + blockSize / 2 + 5);
            
            ctx.font = '10px monospace';
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('512 bits', x + blockSize / 2, startY + blockSize + 20);
            
            ctx.globalAlpha = 1;
        }
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText('每个块包含 16 个 32位字 (W0-W15)', this.width / 2, 300);
        
        this.drawWordExpansion(this.width / 2 - 200, 320, 400, 150);
    }

    drawWordExpansion(x, y, width, height) {
        const ctx = this.ctx;
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('消息调度 W[0-63]', x, y);
        
        const wordWidth = width / 16 - 4;
        const wordHeight = 25;
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 16; col++) {
                const index = row * 16 + col;
                const wx = x + col * (wordWidth + 4);
                const wy = y + 20 + row * (wordHeight + 5);
                
                const progress = Math.max(0, Math.min(1, this.animationProgress * 2 - index / 64));
                
                if (progress > 0) {
                    const hue = 160 + index * 2;
                    ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${progress * 0.8})`;
                    ctx.fillRect(wx, wy, wordWidth, wordHeight);
                    
                    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${progress})`;
                    ctx.strokeRect(wx, wy, wordWidth, wordHeight);
                }
            }
        }
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'left';
        ctx.fillText('W[0-15]: 原始消息字', x, y + height + 10);
        ctx.fillText('W[16-63]: 通过σ函数扩展', x, y + height + 25);
    }

    drawPhase3_MessageSchedule() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('消息调度生成 (σ函数)', this.width / 2, 130);
        
        this.drawSigmaFunction(this.width / 2 - 250, 150, 500, 200);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText('W[t] = σ1(W[t-2]) + W[t-7] + σ0(W[t-15]) + W[t-16]', this.width / 2, 380);
    }

    drawSigmaFunction(x, y, width, height) {
        const ctx = this.ctx;
        
        const inputs = ['W[t-16]', 'W[t-15]', 'W[t-7]', 'W[t-2]'];
        const inputX = x + 50;
        const inputSpacing = 50;
        
        inputs.forEach((label, i) => {
            const iy = y + 30 + i * inputSpacing;
            
            ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.strokeStyle = '#10b981';
            ctx.beginPath();
            ctx.roundRect(inputX, iy, 80, 30, 5);
            ctx.fill();
            ctx.stroke();
            
            ctx.font = '11px monospace';
            ctx.fillStyle = '#e5e7eb';
            ctx.textAlign = 'center';
            ctx.fillText(label, inputX + 40, iy + 20);
            
            const targetX = x + width / 2;
            ctx.strokeStyle = `rgba(16, 185, 129, ${this.animationProgress})`;
            ctx.beginPath();
            ctx.moveTo(inputX + 80, iy + 15);
            ctx.lineTo(targetX - 60, y + height / 2);
            ctx.stroke();
        });
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('σ 运算', centerX, centerY + 5);
        
        const outputX = x + width - 130;
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.roundRect(outputX, centerY - 20, 80, 40, 5);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = '11px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.fillText('W[t]', outputX + 40, centerY + 5);
        
        ctx.strokeStyle = `rgba(139, 92, 246, ${this.animationProgress})`;
        ctx.beginPath();
        ctx.moveTo(centerX + 50, centerY);
        ctx.lineTo(outputX, centerY);
        ctx.stroke();
    }

    drawPhase4_CompressionFunction() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('压缩函数 - 64轮迭代', this.width / 2, 130);
        
        this.drawRoundVisualization(this.width / 2, 280, 200);
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`当前轮次: ${Math.floor(this.currentRound)}/64`, this.width / 2, 430);
        
        this.drawWorkingVariables(100, 460, 800, 100);
    }

    drawRoundVisualization(centerX, centerY, radius) {
        const ctx = this.ctx;
        
        for (let i = 0; i < 64; i++) {
            const angle = (i / 64) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const isActive = i <= this.currentRound;
            const isCurrent = Math.floor(this.currentRound) === i;
            
            if (isCurrent) {
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
                ctx.fill();
                
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (isActive) {
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(107, 114, 128, 0.3)';
                ctx.fill();
            }
        }
        
        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.currentRound).toString(), centerX, centerY + 12);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('轮次', centerX, centerY + 35);
    }

    drawWorkingVariables(x, y, width, height) {
        const ctx = this.ctx;
        
        const vars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const varWidth = width / 8 - 10;
        
        vars.forEach((v, i) => {
            const vx = x + i * (varWidth + 10);
            
            const hue = 160 + i * 20;
            ctx.fillStyle = `hsla(${hue}, 70%, 30%, 0.8)`;
            ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 1)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(vx, y, varWidth, height - 20, 8);
            ctx.fill();
            ctx.stroke();
            
            ctx.font = 'bold 16px monospace';
            ctx.fillStyle = '#e5e7eb';
            ctx.textAlign = 'center';
            ctx.fillText(v, vx + varWidth / 2, y + 25);
            
            const value = this.initialHash[i];
            ctx.font = '10px monospace';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(value.toString(16).padStart(8, '0'), vx + varWidth / 2, y + 50);
        });
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'center';
        ctx.fillText('工作变量 (a-h)', x + width / 2, y + height);
    }

    drawPhase5_AvalancheEffect() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('雪崩效应 - 微小输入变化导致巨大输出差异', this.width / 2, 130);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.fillText('输入1: "Hello"', 240, 170);
        ctx.fillText('输入2: "Hella" (仅改变1个字符)', 660, 170);
        
        this.drawHashComparison(40, 190, 400, 150, this.avalancheSource, '原始');
        this.drawHashComparison(480, 190, 400, 150, this.avalancheTarget, '改变后');
        
        this.drawAvalancheParticles(this.width / 2, 450, 150);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#f87171';
        ctx.textAlign = 'center';
        ctx.fillText('约50%的输出位发生翻转！', this.width / 2, 620);
    }

    drawHashComparison(x, y, width, height, hash, label) {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(30, 30, 50, 0.8)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 10);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'left';
        ctx.fillText(label + ':', x + 10, y + 25);
        
        const hashLines = hash.match(/.{1,32}/g) || [];
        hashLines.forEach((line, i) => {
            ctx.font = '11px monospace';
            ctx.fillStyle = '#e5e7eb';
            ctx.textAlign = 'left';
            ctx.fillText(line, x + 10, y + 50 + i * 25);
        });
    }

    drawAvalancheParticles(centerX, centerY, radius) {
        const ctx = this.ctx;
        
        const numParticles = 100;
        const changedRatio = 0.5;
        
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2;
            const r = radius * (0.3 + Math.random() * 0.7);
            const x = centerX + r * Math.cos(angle + this.animationProgress * Math.PI);
            const y = centerY + r * Math.sin(angle + this.animationProgress * Math.PI);
            
            const isChanged = i < numParticles * changedRatio;
            
            if (isChanged) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(248, 113, 113, ${0.5 + Math.random() * 0.5})`;
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + Math.random() * 0.3})`;
                ctx.fill();
            }
        }
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText('位变化分布', centerX, centerY + radius + 30);
    }

    drawPhase6_FinalHash() {
        const ctx = this.ctx;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('最终哈希值', this.width / 2, 130);
        
        this.drawFinalHashDisplay(this.width / 2 - 300, 160, 600, 200);
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText('256位 (32字节) 输出', this.width / 2, 400);
        
        this.drawHashProperties(50, 430, 800, 150);
    }

    drawFinalHashDisplay(x, y, width, height) {
        const ctx = this.ctx;
        
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 15);
        ctx.fill();
        ctx.stroke();
        
        const hash = this.finalHash.length > 0 ? this.finalHash.join('') : this.generateFakeHash();
        const hashLines = hash.match(/.{1,16}/g) || [];
        
        hashLines.forEach((line, i) => {
            const progress = Math.max(0, Math.min(1, this.animationProgress * 4 - i * 0.5));
            
            ctx.globalAlpha = progress;
            ctx.font = 'bold 18px monospace';
            ctx.fillStyle = '#10b981';
            ctx.textAlign = 'center';
            ctx.fillText(line, x + width / 2, y + 50 + i * 35);
            ctx.globalAlpha = 1;
        });
    }

    drawHashProperties(x, y, width, height) {
        const ctx = this.ctx;
        
        const properties = [
            { icon: '🔒', label: '单向性', desc: '无法从哈希值反推原始数据' },
            { icon: '🎯', label: '确定性', desc: '相同输入总是产生相同输出' },
            { icon: '❄️', label: '雪崩效应', desc: '微小输入变化导致巨大输出差异' },
            { icon: '🛡️', label: '抗碰撞', desc: '难以找到两个不同输入产生相同哈希' }
        ];
        
        const propWidth = width / 4 - 20;
        
        properties.forEach((prop, i) => {
            const px = x + i * (propWidth + 20);
            
            ctx.fillStyle = 'rgba(30, 30, 50, 0.8)';
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.beginPath();
            ctx.roundRect(px, y, propWidth, height, 10);
            ctx.fill();
            ctx.stroke();
            
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#e5e7eb';
            ctx.textAlign = 'center';
            ctx.fillText(prop.icon, px + propWidth / 2, y + 35);
            
            ctx.font = 'bold 12px monospace';
            ctx.fillStyle = '#10b981';
            ctx.fillText(prop.label, px + propWidth / 2, y + 60);
            
            ctx.font = '10px monospace';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(prop.desc, px + propWidth / 2, y + 85);
        });
    }

    generateFakeHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    updateAnimation() {
        if (this.isComplete || !this.isPlaying) return false;
        
        this.animationProgress += 0.008 * this.speed;
        
        if (this.animationProgress >= 1) {
            this.animationProgress = 0;
            this.currentPhaseIndex++;
            
            if (this.currentPhaseIndex >= this.phaseNames.length) {
                this.currentPhaseIndex = this.phaseNames.length - 1;
                this.animationProgress = 1;
                this.isComplete = true;
                this.stop();
                return false;
            }
        }
        
        if (this.currentPhaseIndex === 3) {
            this.currentRound = this.animationProgress * 64;
        }
        
        return true;
    }

    draw() {
        this.clear();
        this.drawBackground();
        this.drawHeader();
        
        switch (this.currentPhaseIndex) {
            case 0:
                this.drawPhase1_MessagePadding();
                break;
            case 1:
                this.drawPhase2_MessageBlocks();
                break;
            case 2:
                this.drawPhase3_MessageSchedule();
                break;
            case 3:
                this.drawPhase4_CompressionFunction();
                break;
            case 4:
                this.drawPhase5_AvalancheEffect();
                break;
            case 5:
                this.drawPhase6_FinalHash();
                break;
        }
    }

    animate() {
        if (!this.isPlaying) return;
        
        const shouldContinue = this.updateAnimation();
        this.draw();
        if (shouldContinue) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    start(message) {
        this.inputMessage = message || 'Hello World';
        this.avalancheSource = this.generateFakeHash();
        this.avalancheTarget = this.generateFakeHash();
        this.finalHash = [this.generateFakeHash()];
        this.currentPhaseIndex = 0;
        this.animationProgress = 0;
        this.currentRound = 0;
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

function showSHA256Animation(message) {
    let modal = document.getElementById('sha256-animation-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sha256-animation-modal';
        modal.className = 'fixed inset-0 bg-black/95 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto border border-emerald-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-emerald-400">SHA-256 哈希算法动画</h3>
                    <button id="close-sha256-animation-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div class="bg-gray-800 rounded-lg p-3 mb-4">
                    <div class="flex items-center gap-3 flex-wrap">
                        <button id="restart-sha256-btn" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs font-medium transition-colors">
                            重新播放
                        </button>
                        <button id="pause-sha256-btn" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-xs font-medium transition-colors">
                            暂停
                        </button>
                        <div class="flex items-center gap-1.5">
                            <span class="text-gray-400 text-xs">速度:</span>
                            <button class="sha256-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="0.5">0.5x</button>
                            <button class="sha256-speed-btn px-2 py-1 bg-emerald-600 rounded text-white text-xs transition-colors" data-speed="1">1x</button>
                            <button class="sha256-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="1.5">1.5x</button>
                            <button class="sha256-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="2">2x</button>
                            <button class="sha256-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="3">3x</button>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 rounded-lg p-2">
                    <canvas id="sha256-animation-canvas" width="900" height="700"></canvas>
                </div>
                <div class="mt-4 text-gray-400 text-sm">
                    <p><strong>SHA-256 特性：</strong></p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><strong>雪崩效应</strong>：输入的微小变化会导致输出约50%的位发生翻转</li>
                        <li><strong>64轮迭代</strong>：每轮使用不同的轮常数和工作变量更新</li>
                        <li><strong>256位输出</strong>：无论输入多长，输出始终是256位</li>
                        <li><strong>确定性</strong>：相同输入永远产生相同输出</li>
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-sha256-animation-modal').addEventListener('click', () => {
            const canvas = document.getElementById('sha256-animation-canvas');
            const animator = canvas._animator;
            if (animator) animator.stop();
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const canvas = document.getElementById('sha256-animation-canvas');
                const animator = canvas._animator;
                if (animator) animator.stop();
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
    
    const canvas = document.getElementById('sha256-animation-canvas');
    const animator = new SHA256Animator(canvas);
    canvas._animator = animator;
    animator.start(message);
    
    const pauseBtn = document.getElementById('pause-sha256-btn');
    
    pauseBtn.onclick = function() {
        if (animator.isComplete) {
            animator.stop();
            animator.start(message);
            this.textContent = '暂停';
        } else if (animator.isPlaying) {
            animator.pause();
            this.textContent = '继续';
        } else {
            animator.resume();
            this.textContent = '暂停';
        }
    };
    
    document.getElementById('restart-sha256-btn').onclick = () => {
        animator.stop();
        animator.start(message);
        pauseBtn.textContent = '暂停';
    };
    
    document.querySelectorAll('.sha256-speed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const speed = parseFloat(this.dataset.speed);
            animator.speed = speed;
            
            document.querySelectorAll('.sha256-speed-btn').forEach(b => {
                b.classList.remove('bg-emerald-600');
                b.classList.add('bg-gray-700');
            });
            this.classList.remove('bg-gray-700');
            this.classList.add('bg-emerald-600');
        });
    });
}

export { SHA256Animator, showSHA256Animation };

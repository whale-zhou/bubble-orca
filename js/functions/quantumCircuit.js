// 量子电路可视化模块
// 使用 Canvas 绘制 Shor 算法的量子电路图

class QuantumCircuitVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gateWidth = 60;
        this.gateHeight = 40;
        this.wireSpacing = 50;
        this.startX = 80;
        this.startY = 40;
    }

    // 清空画布
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制量子线
    drawWire(y, label, length) {
        const ctx = this.ctx;
        
        // 绘制标签
        ctx.font = '14px monospace';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'right';
        ctx.fillText(label, this.startX - 10, y + 5);
        
        // 绘制量子线
        ctx.beginPath();
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.moveTo(this.startX, y);
        ctx.lineTo(this.startX + length, y);
        ctx.stroke();
        
        // 绘制初始状态 |0⟩
        ctx.fillStyle = '#22c55e';
        ctx.textAlign = 'left';
        ctx.fillText('|0⟩', this.startX + 5, y + 5);
    }

    // 绘制 Hadamard 门
    drawHadamard(x, y) {
        const ctx = this.ctx;
        const size = this.gateHeight;
        
        // 绘制方框
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.rect(x - size/2, y - size/2, size, size);
        ctx.stroke();
        
        // 填充背景
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();
        
        // 绘制 H 标签
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#3b82f6';
        ctx.textAlign = 'center';
        ctx.fillText('H', x, y + 6);
    }

    // 绘制受控门（控制点）
    drawControlPoint(x, y) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.fillStyle = '#ef4444';
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制受控门（目标点 - XOR 符号）
    drawTargetPoint(x, y) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制竖线
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
        
        // 绘制横线
        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        ctx.lineTo(x + 12, y);
        ctx.stroke();
    }

    // 绘制受控 U 门
    drawControlledU(x, controlY, targetY, label) {
        const ctx = this.ctx;
        
        // 绘制连接线
        ctx.beginPath();
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.moveTo(x, controlY);
        ctx.lineTo(x, targetY);
        ctx.stroke();
        
        // 绘制控制点
        this.drawControlPoint(x, controlY);
        
        // 绘制目标门框
        const boxHeight = 30;
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.rect(x - 20, targetY - boxHeight/2, 40, boxHeight);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fill();
        
        // 绘制标签
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, targetY + 4);
    }

    // 绘制测量门
    drawMeasurement(x, y) {
        const ctx = this.ctx;
        const size = this.gateHeight;
        
        // 绘制方框
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.rect(x - size/2, y - size/2, size, size);
        ctx.stroke();
        
        // 填充背景
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fill();
        
        // 绘制测量符号（类似仪表盘）
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.arc(x, y + 2, 10, Math.PI, 0, false);
        ctx.stroke();
        
        // 指针
        ctx.beginPath();
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x + 5, y - 5);
        ctx.stroke();
    }

    // 绘制 QFT（量子傅里叶变换）块
    drawQFTBlock(x, startY, numQubits, width) {
        const ctx = this.ctx;
        const height = (numQubits - 1) * this.wireSpacing + 40;
        
        // 绘制背景框
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.rect(x, startY - 20, width, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 填充背景
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fill();
        
        // 绘制标签
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('QFT†', x + width/2, startY + height/2 + 5);
    }

    // 绘制完整的 Shor 算法电路
    drawShorCircuit(N, a, numQubits) {
        this.clear();
        
        const ctx = this.ctx;
        const totalQubits = numQubits * 2; // 输入寄存器 + 输出寄存器
        const circuitLength = 700;
        
        // 设置画布大小
        this.canvas.width = 900;
        this.canvas.height = totalQubits * this.wireSpacing + 80;
        
        // 绘制标题
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#e5e7eb';
        ctx.textAlign = 'center';
        ctx.fillText(`Shor 算法量子电路 (N=${N}, a=${a})`, this.canvas.width / 2, 20);
        
        // 绘制寄存器标签
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'left';
        ctx.fillText('输入寄存器', this.startX, this.startY - 10);
        ctx.fillText('输出寄存器', this.startX, this.startY + numQubits * this.wireSpacing - 10);
        
        // 绘制量子线
        for (let i = 0; i < totalQubits; i++) {
            const label = i < numQubits ? `q${i}` : `r${i - numQubits}`;
            this.drawWire(this.startY + i * this.wireSpacing, label, circuitLength);
        }
        
        // 阶段1：Hadamard 门（输入寄存器）
        let currentX = this.startX + 60;
        for (let i = 0; i < numQubits; i++) {
            this.drawHadamard(currentX, this.startY + i * this.wireSpacing);
        }
        
        // 阶段2：受控模幂运算 U_a
        currentX += 80;
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText('受控模幂运算', currentX + 40, this.startY - 25);
        
        for (let i = 0; i < numQubits; i++) {
            const controlY = this.startY + i * this.wireSpacing;
            const targetY = this.startY + numQubits * this.wireSpacing + 20;
            
            // 绘制控制点
            this.drawControlPoint(currentX + i * 30, controlY);
            
            // 绘制到目标的连接线
            ctx.beginPath();
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            ctx.moveTo(currentX + i * 30, controlY);
            ctx.lineTo(currentX + i * 30, targetY);
            ctx.stroke();
        }
        
        // 绘制 U^a 框
        const uBoxX = currentX + 20;
        const uBoxWidth = numQubits * 30;
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.rect(uBoxX, this.startY + numQubits * this.wireSpacing - 10, uBoxWidth, 60);
        ctx.stroke();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.fill();
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`U${a} mod ${N}`, uBoxX + uBoxWidth/2, this.startY + numQubits * this.wireSpacing + 25);
        
        // 阶段3：逆量子傅里叶变换 (QFT†)
        currentX += uBoxWidth + 60;
        this.drawQFTBlock(currentX, this.startY, numQubits, 120);
        
        // 在 QFT 块中绘制小的 Hadamard 和受控相位门
        for (let i = 0; i < numQubits; i++) {
            const y = this.startY + i * this.wireSpacing;
            this.drawHadamard(currentX + 30, y);
            
            // 绘制受控相位门（简化表示）
            for (let j = i + 1; j < numQubits; j++) {
                const targetY = this.startY + j * this.wireSpacing;
                ctx.beginPath();
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.moveTo(currentX + 30 + (j - i) * 15, y);
                ctx.lineTo(currentX + 30 + (j - i) * 15, targetY);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
        
        // 阶段4：测量
        currentX += 180;
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#8b5cf6';
        ctx.textAlign = 'center';
        ctx.fillText('测量', currentX + 20, this.startY - 25);
        
        for (let i = 0; i < numQubits; i++) {
            this.drawMeasurement(currentX, this.startY + i * this.wireSpacing);
        }
        
        // 绘制经典输出线
        currentX += 60;
        for (let i = 0; i < numQubits; i++) {
            const y = this.startY + i * this.wireSpacing;
            
            // 双线表示经典信息
            ctx.beginPath();
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 3;
            ctx.moveTo(currentX, y);
            ctx.lineTo(currentX + 40, y);
            ctx.stroke();
            
            // 输出标签
            ctx.font = '12px monospace';
            ctx.fillStyle = '#8b5cf6';
            ctx.textAlign = 'left';
            ctx.fillText(`c${i}`, currentX + 50, y + 5);
        }
        
        // 绘制图例
        this.drawLegend();
    }

    // 绘制图例
    drawLegend() {
        const ctx = this.ctx;
        const legendX = this.startX;
        const legendY = this.canvas.height - 30;
        
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        
        // H 门
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('H: Hadamard', legendX, legendY);
        
        // 受控门
        ctx.fillStyle = '#ef4444';
        ctx.fillText('●: 控制', legendX + 120, legendY);
        
        // U 门
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('U: 模幂', legendX + 200, legendY);
        
        // QFT
        ctx.fillStyle = '#10b981';
        ctx.fillText('QFT†: 逆傅里叶', legendX + 280, legendY);
        
        // 测量
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText('M: 测量', legendX + 410, legendY);
    }
}

// 生成量子电路图并显示在弹窗中
function showQuantumCircuit(N, a) {
    // 创建弹窗
    let modal = document.getElementById('quantum-circuit-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quantum-circuit-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto border border-white/10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold gradient-text">Shor 算法量子电路图</h3>
                    <button id="close-circuit-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 overflow-auto">
                    <canvas id="quantum-circuit-canvas"></canvas>
                </div>
                <div class="mt-4 text-gray-400 text-sm">
                    <p><strong>电路说明：</strong></p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>上半部分为输入寄存器（量子位 q0-q{n-1}），用于存储周期查找的结果</li>
                        <li>下半部分为输出寄存器（量子位 r0-r{n-1}），用于存储模幂运算的结果</li>
                        <li>Hadamard 门创建叠加态，使量子位同时处于 |0⟩ 和 |1⟩ 状态</li>
                        <li>受控模幂运算计算 a^x mod N，这是 Shor 算法的核心</li>
                        <li>逆量子傅里叶变换 (QFT†) 提取周期信息</li>
                        <li>最终测量得到周期 r 的相关信息</li>
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        document.getElementById('close-circuit-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
    
    // 绘制电路图
    const canvas = document.getElementById('quantum-circuit-canvas');
    const visualizer = new QuantumCircuitVisualizer(canvas);
    
    // 计算需要的量子位数（log2(N^2)）
    const numQubits = Math.ceil(Math.log2(N * N));
    
    visualizer.drawShorCircuit(N, a, numQubits);
}

// 导出函数
export { QuantumCircuitVisualizer, showQuantumCircuit };

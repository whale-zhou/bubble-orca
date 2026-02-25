import { isPrimeBigInt, pollardsRhoBigInt, fermatFactor, sqrtBigInt, gcdBigInt, factorizeBigInt } from './factorize.js';

class FactorizationPipelineVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.steps = [];
        this.currentStep = 0;
        this.animationId = null;
        this.speed = 1;
        this.isPlaying = true;
        this.isComplete = false;
        this.totalSteps = 5;
        this.stepProgress = 0;
        this.pipelineData = null;
        this.timeoutIds = [];
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const ctx = this.ctx;
        
        const gradient = ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, 'rgba(30, 41, 59, 0.9)');
        gradient.addColorStop(0.5, 'rgba(51, 65, 85, 0.9)');
        gradient.addColorStop(1, 'rgba(30, 41, 59, 0.9)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }

    drawNode(x, y, width, height, title, status, result, color) {
        const ctx = this.ctx;
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        let bgColor;
        switch (status) {
            case 'active':
                bgColor = color;
                break;
            case 'completed':
                bgColor = 'rgba(34, 197, 94, 0.3)';
                break;
            case 'skipped':
                bgColor = 'rgba(100, 116, 139, 0.3)';
                break;
            default:
                bgColor = 'rgba(51, 65, 85, 0.5)';
        }
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 10);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.strokeStyle = status === 'active' ? color : 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = status === 'active' ? 3 : 2;
        ctx.stroke();
        
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + width / 2, y + 25);
        
        const statusIcon = status === 'completed' ? '✓' : status === 'skipped' ? '⊘' : status === 'active' ? '▶' : '○';
        ctx.font = '16px sans-serif';
        ctx.fillStyle = status === 'completed' ? '#22c55e' : status === 'skipped' ? '#64748b' : '#f59e0b';
        ctx.fillText(statusIcon, x + width - 20, y + 25);
        
        if (result) {
            ctx.font = '12px monospace';
            ctx.fillStyle = '#e5e7eb';
            ctx.textAlign = 'center';
            
            const maxLen = 20;
            const displayResult = result.length > maxLen ? result.substring(0, maxLen) + '...' : result;
            ctx.fillText(displayResult, x + width / 2, y + height - 15);
        }
    }

    drawArrow(x1, y1, x2, y2, isActive) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.strokeStyle = isActive ? '#3b82f6' : 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.setLineDash(isActive ? [] : [5, 5]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        if (isActive) {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            ctx.beginPath();
            ctx.fillStyle = '#3b82f6';
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6), y2 - 10 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6), y2 - 10 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        }
    }

    drawIOBox(x, y, width, height, label, value, isInput) {
        const ctx = this.ctx;
        const color = isInput ? '#3b82f6' : '#22c55e';
        
        ctx.fillStyle = `${color}20`;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(label, x + width / 2, y + 20);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#f1f5f9';
        const maxLen = 15;
        const displayValue = value.length > maxLen ? value.substring(0, maxLen) + '...' : value;
        ctx.fillText(displayValue, x + width / 2, y + height - 15);
    }

    drawPipeline(pipelineData) {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.clear();
        this.drawBackground();
        
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const nodeWidth = 160;
        const nodeHeight = 80;
        const spacing = 30;
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`质数分解流水线 - ${pipelineData.input}`, centerX, 30);
        
        this.drawIOBox(centerX - 60, 50, 120, 50, '输入', pipelineData.input, true);
        
        const algorithms = [
            { name: '试除法', key: 'trialDivision', color: '#3b82f6', desc: '检查小质数因子' },
            { name: 'Miller-Rabin', key: 'millerRabin', color: '#8b5cf6', desc: '质数测试' },
            { name: '费马分解', key: 'fermat', color: '#f59e0b', desc: '因子接近√n' },
            { name: "Pollard's Rho", key: 'pollardsRho', color: '#ec4899', desc: '随机游走找因子' },
            { name: 'Brent优化', key: 'brent', color: '#14b8a6', desc: '加速Rho算法' }
        ];
        
        const startY = 130;
        const leftX = 80;
        const rightX = this.width - nodeWidth - 80;
        
        algorithms.forEach((algo, index) => {
            const step = pipelineData.steps[algo.key];
            const isLeft = index % 2 === 0;
            const x = isLeft ? leftX : rightX;
            const y = startY + Math.floor(index / 2) * (nodeHeight + spacing) + (isLeft ? 0 : nodeHeight + spacing) * (index % 2);
            
            this.drawNode(
                x, y, nodeWidth, nodeHeight,
                algo.name,
                step?.status || 'pending',
                step?.result || '',
                algo.color
            );
            
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = isLeft ? 'left' : 'right';
            ctx.fillText(algo.desc, isLeft ? x + nodeWidth + 10 : x - 10, y + nodeHeight / 2 + 5);
        });
        
        this.drawFlowArrows(pipelineData);
        
        const outputY = this.height - 80;
        this.drawIOBox(centerX - 80, outputY, 160, 50, '输出', pipelineData.output || '等待中...', false);
        
        this.drawLegend();
    }

    drawFlowArrows(pipelineData) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(centerX, 100);
        ctx.lineTo(centerX, 130);
        ctx.stroke();
        ctx.setLineDash([]);
        
        const stepKeys = ['trialDivision', 'millerRabin', 'fermat', 'pollardsRho', 'brent'];
        for (let i = 0; i < stepKeys.length - 1; i++) {
            const currentStep = pipelineData.steps[stepKeys[i]];
            
            if (currentStep?.status === 'completed' || currentStep?.status === 'skipped') {
                const isActive = currentStep?.status === 'completed';
                this.drawArrow(centerX - 50, 170 + i * 60, centerX - 50, 210 + i * 60, isActive);
            }
        }
        
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.moveTo(centerX, this.height - 130);
        ctx.lineTo(centerX, this.height - 80);
        ctx.stroke();
    }

    drawLegend() {
        const ctx = this.ctx;
        const legendX = 20;
        const legendY = this.height - 40;
        
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        
        const items = [
            { icon: '▶', text: '执行中', color: '#f59e0b' },
            { icon: '✓', text: '完成', color: '#22c55e' },
            { icon: '⊘', text: '跳过', color: '#64748b' },
            { icon: '○', text: '等待', color: '#94a3b8' }
        ];
        
        let x = legendX;
        items.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillText(item.icon, x, legendY);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(item.text, x + 20, legendY);
            x += 80;
        });
    }

    animatePipeline(pipelineData, callback) {
        this.pipelineData = pipelineData;
        this.currentStep = 0;
        this.isComplete = false;
        this.isPlaying = true;
        this.timeoutIds = [];
        
        const stepOrder = ['trialDivision', 'millerRabin', 'fermat', 'pollardsRho', 'brent'];
        
        stepOrder.forEach(key => {
            pipelineData.steps[key]._finalResult = pipelineData.steps[key].result;
            pipelineData.steps[key]._finalStatus = pipelineData.steps[key].status;
            pipelineData.steps[key].status = 'pending';
            pipelineData.steps[key].result = '等待执行...';
        });
        pipelineData.output = '等待分析...';
        this.drawPipeline(pipelineData);
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            if (this.currentStep < stepOrder.length) {
                const stepKey = stepOrder[this.currentStep];
                
                pipelineData.steps[stepKey].status = 'active';
                pipelineData.steps[stepKey].result = '正在执行...';
                
                const stepNames = {
                    trialDivision: '正在执行试除法...',
                    millerRabin: '正在进行质数测试...',
                    fermat: '正在尝试费马分解...',
                    pollardsRho: '正在执行Pollard\'s Rho...',
                    brent: '正在执行Brent优化...'
                };
                pipelineData.output = stepNames[stepKey] || '处理中...';
                
                this.drawPipeline(pipelineData);
                
                const delay = 1000 / this.speed;
                
                const timeoutId = setTimeout(() => {
                    if (!this.isPlaying) return;
                    
                    pipelineData.steps[stepKey].result = pipelineData.steps[stepKey]._finalResult || '';
                    pipelineData.steps[stepKey].status = pipelineData.steps[stepKey]._finalStatus || 'completed';
                    
                    this.currentStep++;
                    
                    if (this.currentStep >= stepOrder.length) {
                        pipelineData.output = pipelineData.finalResult;
                        this.isComplete = true;
                        this.drawPipeline(pipelineData);
                        if (callback) callback();
                    } else {
                        animate();
                    }
                }, delay);
                
                this.timeoutIds.push(timeoutId);
            }
        };
        
        const startDelay = 500 / this.speed;
        const startTimeoutId = setTimeout(animate, startDelay);
        this.timeoutIds.push(startTimeoutId);
    }

    stop() {
        this.isPlaying = false;
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.timeoutIds = [];
    }
}

function collectPipelineData(input) {
    const n = BigInt(input);
    const steps = {
        trialDivision: { status: 'pending', result: '' },
        millerRabin: { status: 'pending', result: '' },
        fermat: { status: 'pending', result: '' },
        pollardsRho: { status: 'pending', result: '' },
        brent: { status: 'pending', result: '' }
    };
    
    const factors = [];
    let current = n;
    
    steps.trialDivision.status = 'active';
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n];
    const trialFactors = [];
    
    for (let p of smallPrimes) {
        while (current % p === 0n) {
            trialFactors.push(p);
            current = current / p;
        }
    }
    
    if (trialFactors.length > 0) {
        steps.trialDivision.status = 'completed';
        steps.trialDivision.result = `找到 ${trialFactors.length} 个因子`;
        factors.push(...trialFactors);
    } else {
        steps.trialDivision.status = 'skipped';
        steps.trialDivision.result = '无小质数因子';
    }
    
    if (current === 1n) {
        return {
            input: input,
            steps: steps,
            output: formatFactors(factors),
            finalResult: formatFactors(factors)
        };
    }
    
    steps.millerRabin.status = 'active';
    if (isPrimeBigInt(current)) {
        steps.millerRabin.status = 'completed';
        steps.millerRabin.result = '是质数';
        factors.push(current);
        return {
            input: input,
            steps: steps,
            output: formatFactors(factors),
            finalResult: formatFactors(factors)
        };
    } else {
        steps.millerRabin.status = 'completed';
        steps.millerRabin.result = '是合数';
    }
    
    steps.fermat.status = 'active';
    const fermatFactorResult = fermatFactor(current);
    if (fermatFactorResult && fermatFactorResult !== current) {
        steps.fermat.status = 'completed';
        steps.fermat.result = `找到因子 ${fermatFactorResult}`;
        factors.push(fermatFactorResult);
        current = current / fermatFactorResult;
    } else {
        steps.fermat.status = 'skipped';
        steps.fermat.result = '因子不接近√n';
    }
    
    if (current === 1n) {
        return {
            input: input,
            steps: steps,
            output: formatFactors(factors),
            finalResult: formatFactors(factors)
        };
    }
    
    steps.pollardsRho.status = 'active';
    const rhoFactor = pollardsRhoBigInt(current);
    if (rhoFactor && rhoFactor !== current) {
        steps.pollardsRho.status = 'completed';
        steps.pollardsRho.result = `找到因子 ${rhoFactor}`;
        factors.push(rhoFactor);
        current = current / rhoFactor;
    } else {
        steps.pollardsRho.status = 'skipped';
        steps.pollardsRho.result = '尝试Brent优化';
    }
    
    if (current === 1n) {
        return {
            input: input,
            steps: steps,
            output: formatFactors(factors),
            finalResult: formatFactors(factors)
        };
    }
    
    steps.brent.status = 'active';
    const brentFactor = pollardsRhoBigInt(current);
    if (brentFactor && brentFactor !== current) {
        steps.brent.status = 'completed';
        steps.brent.result = `找到因子 ${brentFactor}`;
        factors.push(brentFactor);
        current = current / brentFactor;
        if (current > 1n) {
            factors.push(current);
        }
    } else {
        steps.brent.status = 'completed';
        steps.brent.result = '分解完成';
        if (current > 1n) {
            factors.push(current);
        }
    }
    
    return {
        input: input,
        steps: steps,
        output: formatFactors(factors),
        finalResult: formatFactors(factors)
    };
}

function formatFactors(factors) {
    if (factors.length === 0) return '无法分解';
    
    const sorted = factors.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    
    const count = {};
    sorted.forEach(f => {
        count[f.toString()] = (count[f.toString()] || 0) + 1;
    });
    
    const terms = [];
    for (const [factor, c] of Object.entries(count)) {
        if (c === 1) {
            terms.push(factor);
        } else {
            terms.push(`${factor}^${c}`);
        }
    }
    
    return terms.join(' × ');
}

function showFactorizationPipeline(input, pipelineData = null, animate = true) {
    let modal = document.getElementById('factorization-pipeline-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'factorization-pipeline-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto border border-white/10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold gradient-text">经典质数分解流水线</h3>
                    <button id="close-pipeline-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div id="pipeline-loading" class="bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <div class="animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent mb-4"></div>
                    <p id="pipeline-loading-message" class="text-gray-400">正在分析分解过程...</p>
                </div>
                <div id="pipeline-controls-container" class="hidden">
                    <div class="bg-gray-800 rounded-lg p-3 mb-4">
                        <div class="flex items-center gap-3 flex-wrap">
                            <button id="restart-pipeline-btn" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs font-medium transition-colors">
                                重新播放
                            </button>
                            <button id="pause-pipeline-btn" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-medium transition-colors">
                                暂停
                            </button>
                            <div class="flex items-center gap-1.5">
                                <span class="text-gray-400 text-xs">速度:</span>
                                <button class="pipeline-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="0.5">0.5x</button>
                                <button class="pipeline-speed-btn px-2 py-1 bg-purple-600 rounded text-white text-xs transition-colors" data-speed="1">1x</button>
                                <button class="pipeline-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="1.5">1.5x</button>
                                <button class="pipeline-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="2">2x</button>
                                <button class="pipeline-speed-btn px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors" data-speed="3">3x</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 overflow-auto">
                        <canvas id="factorization-pipeline-canvas" width="800" height="600"></canvas>
                    </div>
                </div>
                <div class="mt-4 text-gray-400 text-sm">
                    <p><strong>算法说明：</strong></p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><strong>试除法</strong>：检查小质数因子（2, 3, 5, 7, 11...）</li>
                        <li><strong>Miller-Rabin</strong>：概率性质数测试，判断是否为质数</li>
                        <li><strong>费马分解</strong>：适用于因子大小接近√n的半质数</li>
                        <li><strong>Pollard's Rho</strong>：使用随机游走寻找因子</li>
                        <li><strong>Brent优化</strong>：改进的Rho算法，减少GCD计算次数</li>
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-pipeline-modal').addEventListener('click', () => {
            const canvas = document.getElementById('factorization-pipeline-canvas');
            const visualizer = canvas._visualizer;
            if (visualizer) visualizer.stop();
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const canvas = document.getElementById('factorization-pipeline-canvas');
                const visualizer = canvas._visualizer;
                if (visualizer) visualizer.stop();
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
    
    const loadingDiv = document.getElementById('pipeline-loading');
    const controlsContainer = document.getElementById('pipeline-controls-container');
    const loadingMessage = document.getElementById('pipeline-loading-message');
    
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (controlsContainer) controlsContainer.classList.add('hidden');
    
    if (pipelineData) {
        requestAnimationFrame(() => {
            if (loadingDiv) loadingDiv.classList.add('hidden');
            if (controlsContainer) controlsContainer.classList.remove('hidden');
            
            const canvas = document.getElementById('factorization-pipeline-canvas');
            const visualizer = new FactorizationPipelineVisualizer(canvas);
            canvas._visualizer = visualizer;
            
            if (animate) {
                visualizer.animatePipeline(pipelineData);
            } else {
                visualizer.drawPipeline(pipelineData);
            }
            
            const pauseBtn = document.getElementById('pause-pipeline-btn');
            
            pauseBtn.onclick = function() {
                if (visualizer.isComplete) {
                    visualizer.stop();
                    visualizer.animatePipeline(pipelineData);
                    this.textContent = '暂停';
                } else if (visualizer.isPlaying) {
                    visualizer.stop();
                    this.textContent = '继续';
                } else {
                    visualizer.isPlaying = true;
                    this.textContent = '暂停';
                }
            };
            
            document.getElementById('restart-pipeline-btn').onclick = () => {
                visualizer.stop();
                visualizer.animatePipeline(pipelineData);
                pauseBtn.textContent = '暂停';
            };
            
            document.querySelectorAll('.pipeline-speed-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const speed = parseFloat(this.dataset.speed);
                    visualizer.speed = speed;
                    
                    document.querySelectorAll('.pipeline-speed-btn').forEach(b => {
                        b.classList.remove('bg-purple-600');
                        b.classList.add('bg-gray-700');
                    });
                    this.classList.remove('bg-gray-700');
                    this.classList.add('bg-purple-600');
                });
            });
        });
        return;
    }
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            try {
                if (loadingMessage) loadingMessage.textContent = '收集算法执行数据...';
                
                const data = collectPipelineData(input);
                
                if (loadingMessage) loadingMessage.textContent = '生成可视化图表...';
                
                requestAnimationFrame(() => {
                    if (loadingDiv) loadingDiv.classList.add('hidden');
                    if (controlsContainer) controlsContainer.classList.remove('hidden');
                    
                    const canvas = document.getElementById('factorization-pipeline-canvas');
                    const visualizer = new FactorizationPipelineVisualizer(canvas);
                    
                    visualizer.animatePipeline(data);
                });
            } catch (error) {
                console.error('Pipeline visualization error:', error);
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <div class="text-red-400 text-center">
                            <p class="text-lg mb-2">生成可视化失败</p>
                            <p class="text-sm text-gray-500">${error.message}</p>
                        </div>
                    `;
                }
            }
        }, 50);
    });
}

export { FactorizationPipelineVisualizer, showFactorizationPipeline, collectPipelineData };

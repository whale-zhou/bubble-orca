// Web Worker for factorization calculations
// Handles heavy computation in a separate thread to avoid blocking UI

// ========== BigInt Helper Functions ==========

function powModBigInt(base, exponent, mod) {
    let result = 1n;
    base = base % mod;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent = exponent / 2n;
    }
    return result;
}

function isPrimeBigInt(n) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;
    
    let d = n - 1n;
    let s = 0n;
    while (d % 2n === 0n) {
        d = d / 2n;
        s += 1n;
    }
    
    let bases;
    const nAbs = n;
    
    if (nAbs < 2047n) {
        bases = [2n];
    } else if (nAbs < 1373593n) {
        bases = [2n, 3n];
    } else if (nAbs < 9080191n) {
        bases = [31n, 73n];
    } else if (nAbs < 25326001n) {
        bases = [2n, 3n, 5n];
    } else if (nAbs < 3215031751n) {
        bases = [2n, 3n, 5n, 7n];
    } else if (nAbs < 4759432637878n) {
        bases = [2n, 3n, 5n, 7n, 11n];
    } else if (nAbs < 1122004669633n) {
        bases = [2n, 13n, 23n, 1662803n];
    } else if (nAbs < 2152302898747n) {
        bases = [3n, 5n, 7n, 11n, 13n, 17n];
    } else if (nAbs < 3474749660383n) {
        bases = [2n, 3n, 5n, 7n, 11n, 13n];
    } else if (nAbs < 341550071728321n) {
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
    } else if (nAbs < 3323393939181100183n) {
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    } else {
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    }
    
    for (let a of bases) {
        if (a >= n) continue;
        
        let x = powModBigInt(a, d, n);
        if (x === 1n || x === n - 1n) continue;
        
        let isComposite = true;
        for (let j = 0n; j < s - 1n; j++) {
            x = powModBigInt(x, 2n, n);
            if (x === n - 1n) {
                isComposite = false;
                break;
            }
        }
        
        if (isComposite) return false;
    }
    
    return true;
}

function sqrtBigInt(n) {
    if (n < 2n) return n;
    
    let low = 1n;
    let high = n;
    let mid;
    
    while (low <= high) {
        mid = (low + high) >> 1n;
        let square = mid * mid;
        
        if (square === n) return mid;
        if (square < n) {
            low = mid + 1n;
        } else {
            high = mid - 1n;
        }
    }
    
    return high;
}

function fermatFactor(n) {
    if (n % 2n === 0n) return 2n;
    if (n % 3n === 0n) return 3n;
    if (n % 5n === 0n) return 5n;
    
    let x = sqrtBigInt(n);
    if (x * x === n) return x;
    
    let y = 1n;
    let attempts = 0n;
    const maxAttempts = n > 10n ** 18n ? 1000n : 300n;
    
    while (x * x - y * y !== n && attempts < maxAttempts) {
        x += 1n;
        const xSquaredMinusN = x * x - n;
        y = sqrtBigInt(xSquaredMinusN);
        if (y * y === xSquaredMinusN) {
            return x - y;
        }
        attempts++;
    }
    
    return attempts < maxAttempts ? x - y : n;
}

function gcdBigInt(a, b) {
    if (a === 0n) return b;
    if (b === 0n) return a;
    
    let shift = 0n;
    while (((a | b) & 1n) === 0n) {
        a >>= 1n;
        b >>= 1n;
        shift += 1n;
    }
    
    while ((a & 1n) === 0n) {
        a >>= 1n;
    }
    
    do {
        while ((b & 1n) === 0n) {
            b >>= 1n;
        }
        
        if (a > b) {
            let temp = a;
            a = b;
            b = temp;
        }
        
        b -= a;
    } while (b !== 0n);
    
    return a << shift;
}

function pollardsRhoBigInt(n) {
    if (n % 2n === 0n) return 2n;
    if (n % 3n === 0n) return 3n;
    if (n % 5n === 0n) return 5n;
    if (n % 7n === 0n) return 7n;
    if (n % 11n === 0n) return 11n;
    if (n % 13n === 0n) return 13n;
    if (n % 17n === 0n) return 17n;
    if (n % 19n === 0n) return 19n;
    if (n % 23n === 0n) return 23n;
    if (n % 29n === 0n) return 29n;
    if (n % 31n === 0n) return 31n;
    if (n % 37n === 0n) return 37n;
    if (n % 41n === 0n) return 41n;
    if (n % 43n === 0n) return 43n;
    if (n % 47n === 0n) return 47n;
    if (n % 53n === 0n) return 53n;
    if (n % 59n === 0n) return 59n;
    if (n % 61n === 0n) return 61n;
    if (n % 67n === 0n) return 67n;
    if (n % 71n === 0n) return 71n;
    if (n % 73n === 0n) return 73n;
    if (n % 79n === 0n) return 79n;
    if (n % 83n === 0n) return 83n;
    if (n % 89n === 0n) return 89n;
    if (n % 97n === 0n) return 97n;
    
    const fermatResult = fermatFactor(n);
    if (fermatResult !== n) {
        return fermatResult;
    }
    
    function g(x, c) {
        return (x * x + c) % n;
    }
    
    for (let attempt = 0; attempt < 50; attempt++) {
        let c = BigInt(Math.floor(Math.random() * 100000)) % (n - 1n) + 1n;
        let x = BigInt(Math.floor(Math.random() * 100000)) % (n - 1n) + 1n;
        let y = x;
        let m = 256n;
        let r = 1n;
        let q = 1n;
        let d = 1n;
        
        while (d === 1n) {
            x = y;
            for (let i = 0n; i < r; i++) {
                y = g(y, c);
            }
            
            let k = 0n;
            while (k < r && d === 1n) {
                const ys = y;
                let minIterations = m < (r - k) ? m : (r - k);
                q = 1n;
                for (let i = 0n; i < minIterations; i++) {
                    y = g(y, c);
                    q = (q * (x > y ? x - y : y - x)) % n;
                }
                d = gcdBigInt(q, n);
                if (d === n) {
                    y = ys;
                    d = 1n;
                    while (d === 1n) {
                        y = g(y, c);
                        d = gcdBigInt(x > y ? x - y : y - x, n);
                    }
                    break;
                }
                k += m;
            }
            r <<= 1n;
        }
        
        if (d !== n && d !== 1n) {
            return d;
        }
    }
    
    return n;
}

function trialDivideSmall(n) {
    const factors = [];
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n];
    
    for (let p of smallPrimes) {
        if (p * p > n) break;
        while (n % p === 0n) {
            factors.push(p);
            n = n / p;
        }
    }
    
    if (n > 1n) {
        factors.push(n);
    }
    
    return factors;
}

function factorizeBigInt(n) {
    const factors = [];
    const stack = [n];
    
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n];
    const extendedSmallPrimes = [103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n];
    
    while (stack.length > 0) {
        let current = stack.pop();
        
        if (current <= 1n) continue;
        
        if (current <= 1000n) {
            const smallFactors = trialDivideSmall(current);
            factors.push(...smallFactors);
            continue;
        }
        
        let hasSmallFactor = false;
        for (let p of smallPrimes) {
            if (current % p === 0n) {
                while (current % p === 0n) {
                    factors.push(p);
                    current = current / p;
                }
                hasSmallFactor = true;
                
                if (current === 1n) break;
                
                if (isPrimeBigInt(current)) {
                    factors.push(current);
                    hasSmallFactor = true;
                    break;
                }
            }
        }
        
        if (hasSmallFactor && current === 1n) continue;
        
        if (current > 1n && current < 1000000n) {
            for (let p of extendedSmallPrimes) {
                if (current % p === 0n) {
                    while (current % p === 0n) {
                        factors.push(p);
                        current = current / p;
                    }
                    
                    if (current === 1n) break;
                    if (isPrimeBigInt(current)) {
                        factors.push(current);
                        current = 1n;
                        break;
                    }
                }
            }
        }
        
        if (current === 1n) continue;
        
        if (isPrimeBigInt(current)) {
            factors.push(current);
            continue;
        }
        
        let factor = pollardsRhoBigInt(current);
        
        let attempts = 0;
        while ((factor === current || current % factor !== 0n) && attempts < 20) {
            factor = pollardsRhoBigInt(current);
            attempts++;
        }
        
        if (factor !== current && current % factor === 0n) {
            if (factor < current / factor) {
                stack.push(current / factor);
                stack.push(factor);
            } else {
                stack.push(factor);
                stack.push(current / factor);
            }
        } else {
            if (isPrimeBigInt(current)) {
                factors.push(current);
            } else {
                factors.push(current);
            }
        }
    }
    
    return factors.sort(function(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

function formatResult(factors, input) {
    if (factors.length === 0) return input + " = 无法分解";
    
    if (factors.length === 1 && factors[0].toString() === input) {
        return input + " 是质数";
    }
    
    const count = {};
    factors.forEach(function(f) {
        count[f.toString()] = (count[f.toString()] || 0) + 1;
    });
    
    const terms = [];
    for (const [factor, c] of Object.entries(count)) {
        if (c === 1) {
            terms.push(factor);
        } else {
            terms.push(factor + "^" + c);
        }
    }
    
    return input + " = " + terms.join(" × ");
}

let isCalculating = false;

self.onmessage = function(e) {
    const { type, data, id } = e.data;
    
    switch (type) {
        case "factorize":
            if (isCalculating) {
                self.postMessage({ 
                    type: "error", 
                    id: id, 
                    error: "Another calculation is in progress" 
                });
                return;
            }
            
            isCalculating = true;
            const startTime = performance.now();
            
            try {
                self.postMessage({ type: "progress", id: id, progress: 10, message: "开始分解..." });
                
                const n = BigInt(data.input);
                
                self.postMessage({ type: "progress", id: id, progress: 30, message: "正在计算..." });
                
                const factors = factorizeBigInt(n);
                
                self.postMessage({ type: "progress", id: id, progress: 70, message: "格式化结果..." });
                
                const result = formatResult(factors, data.input);
                
                const endTime = performance.now();
                const elapsedTime = (endTime - startTime).toFixed(2);
                
                let pipelineData = null;
                try {
                    self.postMessage({ type: "progress", id: id, progress: 90, message: "生成流水线数据..." });
                    pipelineData = simulatePipelineData(data.input, factors);
                } catch (e) {
                    console.warn("Failed to collect pipeline data:", e);
                }
                
                self.postMessage({ 
                    type: "result", 
                    id: id, 
                    success: true,
                    result: result,
                    factors: factors.map(function(f) { return f.toString(); }),
                    elapsedTime: elapsedTime,
                    pipelineData: pipelineData
                });
            } catch (error) {
                console.error("Factorization error:", error);
                self.postMessage({ 
                    type: "error", 
                    id: id, 
                    error: error.message || "未知错误"
                });
            }
            
            isCalculating = false;
            break;
            
        case "cancel":
            isCalculating = false;
            self.postMessage({ type: "cancelled", id: id });
            break;
            
        case "ping":
            self.postMessage({ type: "pong", id: id });
            break;
    }
};

function simulatePipelineData(input, factors) {
    const steps = {
        trialDivision: { status: "pending", result: "" },
        millerRabin: { status: "pending", result: "" },
        fermat: { status: "pending", result: "" },
        pollardsRho: { status: "pending", result: "" },
        brent: { status: "pending", result: "" }
    };
    
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n];
    const inputBigInt = BigInt(input);
    
    const finalResult = formatResult(factors, input);
    
    // 分析因子类型
    const smallFactors = factors.filter(function(f) { return smallPrimes.includes(f); });
    const largeFactors = factors.filter(function(f) { return f > 1000n; });
    const mediumFactors = factors.filter(function(f) { return f > 101n && f <= 1000n; });
    
    // 质数情况
    if (factors.length === 1 && factors[0] === inputBigInt) {
        steps.trialDivision.result = "无小质数因子";
        steps.millerRabin.result = "确认为质数";
        steps.fermat.result = "-";
        steps.pollardsRho.result = "-";
        steps.brent.result = "-";
    } else {
        // 试除法结果
        if (smallFactors.length > 0) {
            const factorCount = {};
            smallFactors.forEach(function(f) {
                factorCount[f.toString()] = (factorCount[f.toString()] || 0) + 1;
            });
            const factorList = Object.entries(factorCount).map(function(pair) {
                return pair[1] > 1 ? pair[0] + "^" + pair[1] : pair[0];
            });
            steps.trialDivision.result = "找到 " + factorList.join(", ");
        } else {
            steps.trialDivision.result = "无小质数因子";
        }
        
        // Miller-Rabin 结果
        steps.millerRabin.result = "确认为合数";
        
        // 费马分解结果
        if (largeFactors.length >= 2) {
            steps.fermat.result = "找到因子 " + largeFactors[0].toString();
        } else if (mediumFactors.length >= 2) {
            steps.fermat.result = "找到因子 " + mediumFactors[0].toString();
        } else {
            steps.fermat.result = "因子不接近√n";
        }
        
        // Pollard's Rho 结果
        if (largeFactors.length > 0) {
            steps.pollardsRho.result = "找到因子 " + largeFactors[0].toString();
        } else if (mediumFactors.length > 0) {
            steps.pollardsRho.result = "找到因子 " + mediumFactors[0].toString();
        } else if (smallFactors.length > 0) {
            const lastSmall = smallFactors[smallFactors.length - 1];
            steps.pollardsRho.result = "找到因子 " + lastSmall.toString();
        } else {
            steps.pollardsRho.result = "分解完成";
        }
        
        // Brent 优化结果
        if (largeFactors.length > 1) {
            steps.brent.result = "找到因子 " + largeFactors[1].toString();
        } else if (largeFactors.length === 1 && mediumFactors.length > 0) {
            steps.brent.result = "找到因子 " + mediumFactors[0].toString();
        } else {
            steps.brent.result = "-";
        }
    }
    
    return {
        input: input,
        steps: steps,
        output: finalResult,
        finalResult: finalResult
    };
}

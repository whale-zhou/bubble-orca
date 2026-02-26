// 数学工具函数模块

// 质数判断函数（优化版）
export function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    const smallPrimes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    for (let p of smallPrimes) {
        if (num % p === 0) return false;
    }
    
    for (let i = 103; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
}

// 快速计算最大公约数
export function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 小质数列表
const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];

// 检查小质数因子
function checkSmallPrimeFactor(n) {
    for (let p of SMALL_PRIMES) {
        if (n % p === 0) return p;
    }
    return null;
}

// Pollard's Rho算法 - 用于快速找到大数字的因子
export function pollardsRho(n) {
    const smallFactor = checkSmallPrimeFactor(n);
    if (smallFactor) return smallFactor;
    
    let x = Math.floor(Math.random() * (n - 2)) + 2;
    let c = Math.floor(Math.random() * (n - 1)) + 1;
    let y = x;
    let d = 1;
    
    function f(x) {
        return (x * x + c) % n;
    }
    
    for (let i = 0; i < 10000 && d === 1; i++) {
        x = f(x);
        y = f(f(y));
        d = gcd(Math.abs(x - y), n);
    }
    
    if (d === n) {
        for (let attempt = 0; attempt < 10; attempt++) {
            c = Math.floor(Math.random() * (n - 1)) + 1;
            x = Math.floor(Math.random() * (n - 2)) + 2;
            y = x;
            d = 1;
            
            for (let i = 0; i < 10000 && d === 1; i++) {
                x = f(x);
                y = f(f(y));
                d = gcd(Math.abs(x - y), n);
            }
            
            if (d !== n && d !== 1) break;
        }
    }
    
    return d === 1 ? n : d;
}

// BigInt版本的Pollard's Rho算法
export function pollardsRhoBigInt(n) {
    const smallFactor = checkSmallPrimeFactor(n);
    if (smallFactor) return BigInt(smallFactor);
    
    let x = BigInt(Math.floor(Math.random() * Number(n > 1000000n ? 1000000 : Number(n - 2n))) + 2);
    let c = BigInt(Math.floor(Math.random() * Number(n > 1000000n ? 1000000 : Number(n - 1n))) + 1);
    let y = x;
    let d = 1n;
    
    function f(x) {
        return (x * x + c) % n;
    }
    
    for (let i = 0; i < 10000 && d === 1n; i++) {
        x = f(x);
        y = f(f(y));
        const diff = x > y ? x - y : y - x;
        d = gcd(diff, n);
    }
    
    if (d === n) {
        for (let attempt = 0; attempt < 10; attempt++) {
            c = BigInt(Math.floor(Math.random() * Number(n > 1000000n ? 1000000 : Number(n - 1n))) + 1);
            x = BigInt(Math.floor(Math.random() * Number(n > 1000000n ? 1000000 : Number(n - 2n))) + 2);
            y = x;
            d = 1n;
            
            for (let i = 0; i < 10000 && d === 1n; i++) {
                x = f(x);
                y = f(f(y));
                const diff = x > y ? x - y : y - x;
                d = gcd(diff, n);
            }
            
            if (d !== n && d !== 1n) break;
        }
    }
    
    return d === 1n ? n : d;
}

// BigInt平方根
export function sqrtBigInt(n) {
    if (n < 0n) throw new Error("负数没有平方根");
    if (n < 2n) return n;
    
    let x = n;
    let y = (x + 1n) / 2n;
    
    while (y < x) {
        x = y;
        y = (x + n / x) / 2n;
    }
    
    return x;
}

// Miller-Rabin质数测试
export function millerRabin(n, k = 5) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;
    
    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        r++;
        d /= 2n;
    }
    
    for (let i = 0; i < k; i++) {
        const a = BigInt(2 + Math.floor(Math.random() * (Number(n) - 3)));
        let x = modPow(a, d, n);
        
        if (x === 1n || x === n - 1n) continue;
        
        let composite = true;
        for (let j = 0; j < r - 1n; j++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) {
                composite = false;
                break;
            }
        }
        
        if (composite) return false;
    }
    
    return true;
}

// 模幂运算
export function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    
    return result;
}

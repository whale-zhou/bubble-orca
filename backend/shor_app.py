from flask import Flask, render_template, request, jsonify
import os
import random
import math

# Shor 算法核心函数
def gcd(a, b):
    """计算最大公约数"""
    while b != 0:
        a, b = b, a % b
    return a

def is_prime(n):
    """判断一个数是否为素数"""
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def find_period(a, N):
    """经典模拟量子部分，寻找 a 的阶 r"""
    if gcd(a, N) != 1:
        return gcd(a, N)
    
    # 递归分解函数，获取完整素数分解
def get_prime_factors(n):
    """递归获取完整素数分解"""
    if n <= 1:
        return []
    elif n == 2:
        return [2]
    elif n % 2 == 0:
        return [2] + get_prime_factors(n//2)
    elif is_prime(n):
        return [n]
    
    # 使用Shor算法寻找一个因子
    while True:
        a = random.randint(2, n-1)
        d = gcd(a, n)
        if d > 1:
            return get_prime_factors(d) + get_prime_factors(n//d)
        
        r = find_period(a, n)
        if r % 2 == 0 and pow(a, r//2, n) != n-1:
            d1 = gcd(pow(a, r//2) - 1, n)
            d2 = gcd(pow(a, r//2) + 1, n)
            if d1 > 1 and d1 < n:
                return get_prime_factors(d1) + get_prime_factors(n//d1)
            elif d2 > 1 and d2 < n:
                return get_prime_factors(d2) + get_prime_factors(n//d2)

# Shor 算法主函数
def shor_algorithm(N):
    """Shor 算法主函数"""
    # 处理特殊情况
    if N <= 1:
        return "输入必须大于1"
    elif N == 2:
        return "2 是素数"
    elif is_prime(N):
        return f"{N} 是素数"
    
    # 获取完整素数分解
    factors = get_prime_factors(N)
    # 排序并格式化输出
    factors.sort()
    # 去重并计数
    factor_counts = {}
    for f in factors:
        factor_counts[f] = factor_counts.get(f, 0) + 1
    
    # 格式化结果
    result = []
    for f, count in sorted(factor_counts.items()):
        if count == 1:
            result.append(str(f))
        else:
            result.append(f"{f}^{count}")
    
    return f"{N} 的素数分解为: {' × '.join(result)}"

app = Flask(__name__)

# 简单的 HTML 模板
html_template = '''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shor 算法演示</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        form {
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
        }
        input[type="number"] {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .result h2 {
            color: #333;
        }
        .error {
            color: red;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Shor 算法整数分解演示</h1>
        <form id="shor-form">
            <label for="number">请输入要分解的整数：</label>
            <input type="number" id="number" name="number" min="2" placeholder="例如：15, 21, 35, 49, 121">
            <button type="submit">分解</button>
        </form>
        <div id="result" class="result" style="display: none;">
            <h2>分解结果</h2>
            <p><strong>输入整数：</strong><span id="input-number"></span></p>
            <p><strong>分解结果：</strong><span id="output-result"></span></p>
        </div>
    </div>
    <script>
        document.getElementById('shor-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const number = document.getElementById('number').value;
            
            fetch('/shor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ number })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    document.getElementById('result').style.display = 'block';
                    document.getElementById('input-number').textContent = data.number;
                    document.getElementById('output-result').textContent = data.result;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('分解失败，请重试');
            });
        });
    </script>
</body>
</html>
'''

@app.route('/')
def home():
    return html_template

@app.route('/shor', methods=['POST'])
def shor():
    number = request.form.get('number', '').strip()
    
    try:
        N = int(number)
        result = shor_algorithm(N)
        
        return jsonify({
            'number': N,
            'result': result
        })
    except ValueError:
        return jsonify({'error': '请输入有效的整数'})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
from flask import Flask, render_template, request, jsonify
import os
import random
import math
import struct

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
    
    # 经典方法寻找周期
    r = 1
    while pow(a, r, N) != 1:
        r += 1
    return r

def recursive_factorization(n):
    """递归分解整数得到所有质数因子"""
    factors = []
    
    # 处理特殊情况
    if n <= 1:
        return factors
    
    # 提取所有2的因子
    while n % 2 == 0:
        factors.append(2)
        n = n // 2
    
    # 检查是否为质数
    if is_prime(n):
        factors.append(n)
        return factors
    
    # 寻找其他因子
    while True:
        a = random.randint(2, n-1)
        d = gcd(a, n)
        
        if d > 1:
            factors.extend(recursive_factorization(d))
            factors.extend(recursive_factorization(n//d))
            return factors
        
        r = find_period(a, n)
        
        if r % 2 == 0 and pow(a, r//2, n) != n-1:
            d1 = gcd(pow(a, r//2) - 1, n)
            d2 = gcd(pow(a, r//2) + 1, n)
            
            if d1 > 1 and d1 < n:
                factors.extend(recursive_factorization(d1))
                factors.extend(recursive_factorization(n//d1))
                return factors
            elif d2 > 1 and d2 < n:
                factors.extend(recursive_factorization(d2))
                factors.extend(recursive_factorization(n//d2))
                return factors

def shor_algorithm(N):
    """Shor 算法主函数 - 递归分解得到所有质数因子"""
    # 处理特殊情况
    if N <= 1:
        return "输入必须大于1"
    elif N == 2:
        return "2 是素数"
    
    # 检查是否为素数
    if is_prime(N):
        return f"{N} 是素数"
    
    # 递归分解得到所有质数因子
    factors = recursive_factorization(N)
    
    if not factors:
        return f"无法分解 {N}"
    
    # 排序并统计每个因子的指数
    factors.sort()
    factor_counts = {}
    for f in factors:
        factor_counts[f] = factor_counts.get(f, 0) + 1
    
    # 构建结果字符串
    result_parts = []
    for f, count in factor_counts.items():
        if count > 1:
            result_parts.append(f"{f}^{count}")
        else:
            result_parts.append(str(f))
    
    return f"{N} = {' × '.join(result_parts)}"

app = Flask(__name__)

# 设置模板目录
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app.template_folder = template_dir

@app.route('/')
def home():
    """首页路由"""
    return render_template('index.html')

@app.route('/convert_ascii_to_base', methods=['POST'])
def convert_ascii_to_base():
    """ASCII字符转进制功能"""
    char = request.form.get('char', '').strip()
    if not char or len(char) != 1:
        return jsonify({'error': '请输入单个ASCII字符'})
    
    # 计算各进制结果
    decimal = ord(char)
    binary = bin(decimal)[2:]
    binary_32 = binary.zfill(32)  # 补零到32位
    hex_upper = hex(decimal)[2:].upper()
    
    result = {
        'char': char,
        'decimal': decimal,
        'binary': binary,
        'binary_32': binary_32,
        'hex': hex_upper
    }
    
    return jsonify(result)

@app.route('/convert_base_to_ascii', methods=['POST'])
def convert_base_to_ascii():
    """进制数值转ASCII字符功能"""
    base_type = request.form.get('base_type', '').strip()
    value = request.form.get('value', '').strip()
    
    try:
        # 转换为十进制
        if base_type == 'binary':
            decimal = int(value, 2)
        elif base_type == 'decimal':
            decimal = int(value)
        elif base_type == 'hex':
            decimal = int(value, 16)
        else:
            return jsonify({'error': '无效的进制类型'})
        
        # 检查ASCII范围
        if 0 <= decimal <= 127:
            char = chr(decimal)
            binary_8 = bin(decimal)[2:].zfill(8)  # 补零到8位
            hex_upper = hex(decimal)[2:].upper()
            
            result = {
                'value': value,
                'base_type': base_type,
                'decimal': decimal,
                'char': char,
                'binary_8': binary_8,
                'hex': hex_upper
            }
            
            return jsonify(result)
        else:
            return jsonify({'error': f'ASCII码只能是0-127，你的输入对应十进制是{decimal}，超范围啦～'})
    except ValueError:
        if base_type == 'binary':
            err_msg = '二进制只能包含0和1哦～'
        elif base_type == 'hex':
            err_msg = '十六进制只能包含0-9和A-F/a-f哦～'
        else:
            err_msg = '请输入纯数字～'
        return jsonify({'error': err_msg})

@app.route('/bit_operation', methods=['POST'])
def bit_operation():
    """位运算可视化功能 - 支持多种进制输入"""
    operation = request.form.get('operation', '').strip()
    num1 = request.form.get('num1', '').strip()
    num2 = request.form.get('num2', '').strip()
    num1_base = request.form.get('num1_base', 'decimal').strip()
    num2_base = request.form.get('num2_base', 'decimal').strip()
    
    # 根据进制类型解析数字的辅助函数
    def parse_number(num_str, base_type):
        if not num_str:
            raise ValueError("数字不能为空")
        
        try:
            if base_type == 'binary':
                # 移除可能的0b前缀
                if num_str.startswith('0b'):
                    num_str = num_str[2:]
                return int(num_str, 2)
            elif base_type == 'hex':
                # 移除可能的0x前缀
                if num_str.startswith('0x'):
                    num_str = num_str[2:]
                return int(num_str, 16)
            else:  # decimal
                return int(num_str, 10)
        except ValueError:
            if base_type == 'binary':
                raise ValueError("二进制数字只能包含0和1")
            elif base_type == 'hex':
                raise ValueError("十六进制数字只能包含0-9和A-F/a-f")
            else:
                raise ValueError("请输入有效的十进制数字")
    
    try:
        if operation == '~':  # 一元运算符（非运算）
            if not num1:
                return jsonify({'error': '请输入数字'})
            
            num = parse_number(num1, num1_base)
            result = ~num & 0xFFFFFFFF  # 强制32位无符号
            
            # 补零到32位，方便对比
            num_binary = bin(num)[2:].zfill(32)
            result_binary = bin(result)[2:].zfill(32)
            
            result_data = {
                'operation': operation,
                'num1': num,
                'num1_binary': num_binary,
                'result': result,
                'result_binary': result_binary,
                'result_hex': f'{result:08X}'
            }
            
            return jsonify(result_data)
        else:  # 二元运算符（与/或/异或/移位）
            if not num1 or not num2:
                return jsonify({'error': '请输入两个数字'})
            
            num_1 = parse_number(num1, num1_base)
            num_2 = parse_number(num2, num2_base)
            
            # 移位操作单独检查位数（0-31，符合32位运算规则）
            if operation in ['<<', '>>']:
                if not (0 <= num_2 <= 31):
                    return jsonify({'error': '32位运算里，移位位数只能是0-31哦～'})
            
            # 计算结果并强制32位
            if operation == '&':
                result = num_1 & num_2
            elif operation == '|':
                result = num_1 | num_2
            elif operation == '^':
                result = num_1 ^ num_2
            elif operation == '<<':
                result = num_1 << num_2
            elif operation == '>>':
                result = num_1 >> num_2
            elif operation == 'circular_left':
                # 循环左移：将左边移出的位补到右边
                shift = num_2 % 32  # 确保移位位数在0-31之间
                result = ((num_1 << shift) | (num_1 >> (32 - shift))) & 0xFFFFFFFF
            elif operation == 'circular_right':
                # 循环右移：将右边移出的位补到左边
                shift = num_2 % 32  # 确保移位位数在0-31之间
                result = ((num_1 >> shift) | (num_1 << (32 - shift))) & 0xFFFFFFFF
            else:
                return jsonify({'error': '无效的运算符'})
            
            result = result & 0xFFFFFFFF  # 确保不超出32位
            
            # 补零到32位，对齐显示
            num1_binary = bin(num_1)[2:].zfill(32)
            num2_binary = bin(num_2)[2:].zfill(32)
            result_binary = bin(result)[2:].zfill(32)
            
            result_data = {
                'operation': operation,
                'num1': num_1,
                'num1_binary': num1_binary,
                'num2': num_2,
                'num2_binary': num2_binary,
                'result': result,
                'result_binary': result_binary,
                'result_hex': f'{result:08X}'
            }
            
            return jsonify(result_data)
    except ValueError as e:
        return jsonify({'error': str(e)})

@app.route('/shor_algorithm', methods=['POST'])
def shor_algorithm_route():
    """Shor 算法分解整数"""
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

# 预处理 
def preprocess(input_data): 
    if isinstance(input_data,str): 
        data = input_data.encode('utf-8') 
    elif isinstance(input_data,bytes): 
        data = input_data 
    else: 
        raise TypeError("Sorry,Please re-input") 
    original_bit_len = len(data) * 8 
    data += b'\x80' 
    while len(data) % 64 != 56: 
        data += b'\x00' 
    data += struct.pack('>Q',original_bit_len) 
    return data 
# 初始哈希值：前8个质数的平方根小数部分前32位（2、3、5、7、11……） 
INIT_HASH =[ 
           0x6a09e667,0xbb67ae85, 
           0x3c6ef372,0xa54ff53a, 
           0x510e527f,0x9b05688c, 
           0x1f83d9ab,0x5be0cd19 
] 
# 64个常量：前64个质数的立方根小数部分前32位 
K = [ 
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 
] 
#循环右移:7,18/17,19/2,13,22/6,11,25逻辑右移:3/10 
#& = 与，| = 或，~ = 非, ^ = 异或, rotr = 循环右移，>> = 逻辑右移 
#与：双1则1，否则为0.或：有一则一，否则为0.非：0变1，1变0，异或：相同为0，不同为1 
def rotr(x,n): 
    return((x >> n) | (x << (32 - n))) & 0xFFFFFFFF 
def Ch(x,y,z):# Select function:[Ch] 
    return(x & y) ^ ((~x & 0xFFFFFFFF) & z)# &运算，防负数 
def Maj(x,y,z): # Most functions:[Maj] 
    return(x & y) ^ (x & z) ^ (y & z) 
def sigma0(x): # sigma zero σ 
    return rotr(x, 7) ^ rotr(x, 18) ^ (x >> 3) 
def sigma1(x): 
    return rotr(x, 17) ^ rotr(x, 19) ^ (x >>10) 
def capsigma0(x): 
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22) 
def capsigma1(x): 
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25) 
def sha256(input_data): 
    preprocess_data = preprocess(input_data) 

    h0,h1,h2,h3,h4,h5,h6,h7 = INIT_HASH 

    # 分块处理 
    block_count = len(preprocess_data) // 64 # 向下除'64'取整，舍小数 
    for i in range(block_count): 
        block = preprocess_data[i*64 : (i+1)*64] 

        w = [0] * 64 
        for j in range(16): 
            w[j] = struct.unpack('>I',block[j*4 : (j+1)*4])[0] 
        for j in range(16,64): 
            s0 = sigma0(w[j-15]) 
            s1 = sigma1(w[j-2]) 
            w[j] = (w[j-16] + s0 + w[j-7] + s1) & 0xFFFFFFFF 
        #压缩循环 
        a,b,c,d,e,f,g,h_temp = h0,h1,h2,h3,h4,h5,h6,h7 
        for j in range(64): 
            S1 = capsigma1(e) 
            ch = Ch(e,f,g) 
            temp1 = (h_temp + S1 + ch + K[j] + w[j]) & 0xFFFFFFFF 
            S0 = capsigma0(a) 
            maj = Maj(a,b,c) 
            temp2 = (S0 + maj) & 0xFFFFFFFF 

            h_temp = g 
            g = f 
            f = e 
            e = (d + temp1) & 0xFFFFFFFF 
            d = c 
            c = b 
            b = a 
            a = (temp1 + temp2) & 0xFFFFFFFF 

        h0 = (h0 + a) & 0xFFFFFFFF 
        h1 = (h1 + b) & 0xFFFFFFFF 
        h2 = (h2 + c) & 0xFFFFFFFF 
        h3 = (h3 + d) & 0xFFFFFFFF 
        h4 = (h4 + e) & 0xFFFFFFFF 
        h5 = (h5 + f) & 0xFFFFFFFF 
        h6 = (h6 + g) & 0xFFFFFFFF 
        h7 = (h7 + h_temp) & 0xFFFFFFFF 

    #最终打印(2025/9/28暂时注释，想用随时打开不影响) 
    final_hash = f'{h0:08X}{h1:08X}{h2:08X}{h3:08X}{h4:08X}{h5:08X}{h6:08X}{h7:08X}' 
    return final_hash.lower()

@app.route('/sha256_encrypt', methods=['POST'])
def sha256_encrypt():
    """SHA-256加密功能"""
    
    text = request.form.get('text', '').strip()
    
    try:
        # 使用自定义的SHA-256实现计算哈希值
        hash_result = sha256(text)
        
        return jsonify({
            'text': text,
            'hash': hash_result
        })
    except Exception as e:
        return jsonify({'error': f'加密失败: {str(e)}'})

if __name__ == '__main__':
    # 设置为开发模式运行，便于调试，使用5002端口避免冲突
    # 监听所有网络接口，允许外部访问
    app.run(debug=True, port=5002, host='0.0.0.0')
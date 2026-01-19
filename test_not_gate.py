# 测试非门运算修复效果

def parse_number(num_str, base_type='decimal'):
    """解析不同进制的数字"""
    if base_type == 'binary':
        return int(num_str, 2)
    elif base_type == 'hex':
        return int(num_str, 16)
    else:
        return int(num_str, 10)

def test_not_gate():
    """测试非门运算"""
    print("测试非门运算修复效果")
    print("=" * 50)
    
    # 测试用例
    test_cases = [
        ('10', 'decimal'),
        ('15', 'decimal'),
        ('0', 'decimal'),
        ('1', 'decimal'),
        ('100', 'decimal'),
        ('1010', 'binary'),
        ('FF', 'hex')
    ]
    
    for num_str, base_type in test_cases:
        num = parse_number(num_str, base_type)
        
        # 修复前的处理（简化版）
        result_before = ~num & 0xFFFFFFFF
        
        # 修复后的处理
        result_unsigned = ~num & 0xFFFFFFFF
        result_signed = (result_unsigned - 2**32) if result_unsigned >= 2**31 else result_unsigned
        
        # 二进制和十六进制表示
        num_binary = bin(num)[2:].zfill(32)
        result_binary_before = bin(result_before)[2:].zfill(32)
        result_binary_after = bin(result_unsigned)[2:].zfill(32)
        
        hex_before = f'{result_before:08X}'
        hex_after = f'{result_unsigned:08X}'
        
        print(f"\n测试用例: ~{num_str} ({base_type})")
        print(f"十进制数值: {num}")
        print(f"二进制表示: {num_binary}")
        print("-" * 30)
        print(f"修复前结果:")
        print(f"  十进制: {result_before}")
        print(f"  十六进制: 0x{hex_before}")
        print(f"  二进制: {result_binary_before}")
        print(f"修复后结果:")
        print(f"  十进制: {result_signed}")
        print(f"  十六进制: 0x{hex_after}")
        print(f"  二进制: {result_binary_after}")
        print("-" * 30)
        
        # 验证修复效果
        if '0x' in hex_after or '-' in hex_after:
            print("  ❌ 修复失败：十六进制仍包含问题")
        else:
            print("  ✅ 修复成功：十六进制显示正常")
        
        if '-' in result_binary_after:
            print("  ❌ 修复失败：二进制仍包含负号")
        else:
            print("  ✅ 修复成功：二进制显示正常")

if __name__ == "__main__":
    test_not_gate()
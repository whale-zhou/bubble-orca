def get_valid_input(prompt, valid_options):
    """获取有效输入"""
    while True:
        user_input = input(prompt).strip()
        if user_input in valid_options:
            return user_input
        else:
            print("请不要给虎鲸投喂椰子🥥(无效输入,请重试)")

def show_welcome_menu():
    """显示欢迎菜单"""
    print("\n" + "="*50)
    print("🐋 欢迎来到泡泡鲸进制转换程序!")
    print("🐋注：此程序最后修改日期为25年9/23日，洲哥独立开发，请勿侵权~")
    print("="*50)
    print("1. ASCII字符 → 进制转换")
    print("2. 进制数值 → ASCII字符")  
    print("3. 🆕 位运算可视化工具")
    print("4. 退出程序")
    return get_valid_input("请选择功能(1-4): ", ["1", "2", "3", "4"])

def convert_ascii_to_base():
    """ASCII转进制（优化：循环输入+32位二进制显示）"""
    print("\n" + "-"*30)
    print("🐋 ASCII字符 → 进制转换")
    print("-"*30)
    while True:
        char = input("请输入一个ASCII字符: ")
        if len(char) != 1:
            print("泡泡鲸一次只能吞掉一只鲑鱼哦🐟(请输入单字符，重新试试～)")
            continue
        # 计算各进制结果
        decimal = ord(char)
        binary_32 = bin(decimal)[2:].zfill(32)  # 补零到32位，适配SHA-256需求
        hex_upper = hex(decimal)[2:].upper()
        # 输出结果
        print(f"\n🐋 字符 '{char}' 的转换结果:")
        print(f"十进制: {decimal}")
        print(f"二进制: 0b{bin(decimal)[2:]} (32位补零: {binary_32})")
        print(f"十六进制: 0x{hex_upper}")
        break

def convert_base_to_ascii():
    """进制转ASCII（优化：细化错误提示+8位ASCII二进制显示）"""
    print("\n" + "-"*30)
    print("🐋 进制数值 → ASCII字符")
    print("-"*30)
    # 选择进制类型
    base_choice = get_valid_input(
        "请选择输入类型:\n1. 二进制(如 1100001)\n2. 十进制(如 97)\n3. 十六进制(如 61)\n选择(1-3): ", 
        ["1", "2", "3"]
    )
    base_name = ["二进制", "十进制", "十六进制"][int(base_choice)-1]
    num_str = input(f"请输入{base_name}数值: ").strip()

    try:
        # 转换为十进制
        if base_choice == "1":
            decimal = int(num_str, 2)
        elif base_choice == "2":
            decimal = int(num_str)
        else:
            decimal = int(num_str, 16)
        
        # 检查ASCII范围
        if 0 <= decimal <= 127:
            char = chr(decimal)
            binary_8 = bin(decimal)[2:].zfill(8)  # 补零到8位，符合ASCII字节标准
            hex_upper = hex(decimal)[2:].upper()
            print(f"\n🐋 转换结果:")
            print(f"输入({base_name}): {num_str}")
            print(f"十进制: {decimal}")
            print(f"ASCII字符: '{char}'")
            print(f"二进制(8位): 0b{binary_8}")
            print(f"十六进制: 0x{hex_upper}")
        else:
            print(f"泡泡鲸提示：ASCII码只能是0-127，你的{base_name}对应十进制是{decimal}，超范围啦～")
    except ValueError:
        # 按进制类型细化错误原因
        if base_choice == "1":
            err_msg = "二进制只能包含0和1哦～"
        elif base_choice == "3":
            err_msg = "十六进制只能包含0-9和A-F/a-f哦～"
        else:
            err_msg = "请输入纯数字～"
        print(f"🐋 泡泡鲸用鳍摸了摸头脑：{err_msg}")

def visualize_bit_operation():
    """位运算可视化工具（优化：32位限制+移位范围检查）"""
    print("\n" + "-"*30)
    print("🔢 位运算可视化工具（32位无符号整数）")
    print("-"*30)
    print("支持的操作: &(与), |(或), ^(异或), ~(非), <<(左移), >>(右移)")
    
    # 选择运算符
    op = get_valid_input("请选择运算符: ", ["&", "|", "^", "~", "<<", ">>"])

    if op == "~":  # 一元运算符（非运算）
        num = int(input("请输入数字(十进制): "))
        result = ~num & 0xFFFFFFFF  # 强制32位无符号
        # 补零到32位，方便对比
        num_binary = bin(num)[2:].zfill(32)
        result_binary = bin(result)[2:].zfill(32)
        print(f"\n🐋 位运算可视化:")
        print(f"操作: ~{num}（32位非运算）")
        print(f"原数二进制: {num_binary}")
        print(f"结果二进制: {result_binary}")
        print(f"十六进制: 0x{result:08X}")  # 8位十六进制，适配32位
    else:  # 二元运算符（与/或/异或/移位）
        num1 = int(input("请输入第一个数字(十进制): "))
        # 移位操作单独检查位数（0-31，符合32位运算规则）
        if op in ["<<", ">>"]:
            while True:
                num2 = int(input("请输入移位位数(0-31，32位运算限制): "))
                if 0 <= num2 <= 31:
                    break
                print("泡泡鲸提醒：32位运算里，移位位数只能是0-31哦～")
        else:
            num2 = int(input("请输入第二个数字(十进制): "))
        
        # 计算结果并强制32位
        if op == "&":
            result = num1 & num2
        elif op == "|":
            result = num1 | num2
        elif op == "^":
            result = num1 ^ num2
        elif op == "<<":
            result = num1 << num2
        elif op == ">>":
            result = num1 >> num2
        result = result & 0xFFFFFFFF  # 确保不超出32位

        # 补零到32位，对齐显示
        num1_binary = bin(num1)[2:].zfill(32)
        num2_binary = bin(num2)[2:].zfill(32)
        result_binary = bin(result)[2:].zfill(32)
        print(f"\n🐋 位运算可视化:")
        print(f"操作: {num1} {op} {num2}（32位运算）")
        print(f"数字1二进制: {num1_binary}")
        print(f"数字2二进制: {num2_binary}")
        print(f"结果二进制: {result_binary}")
        print(f"十六进制: 0x{result:08X}")

def main():
    """主程序（优化：修正用词+友好继续提示）"""
    while True:
        choice = show_welcome_menu()
        
        if choice == "1":
            convert_ascii_to_base()
        elif choice == "2":
            convert_base_to_ascii()
        elif choice == "3":
            visualize_bit_operation()
        elif choice == "4":
            print("🐋 感谢使用泡泡鲸转换工具，再见！")
            break
        # 更友好的继续提示
        input("\n按回车键和泡泡鲸继续玩耍～")

if __name__ == "__main__":
    main()
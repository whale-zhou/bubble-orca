// 测试SHA-256修复后的功能
function testSHA256() {
    // 测试用例
    const testCases = [
        ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
        ["1", "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"],
        ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
        ["Hello, World!", "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"]
    ];

    console.log("=== SHA-256测试 ===");
    let allPassed = true;

    for (const [text, expected] of testCases) {
        const result = sha256(text);
        const passed = result === expected;
        allPassed = allPassed && passed;
        
        console.log(`\n输入: '${text}'`);
        console.log(`预期: ${expected}`);
        console.log(`结果: ${result}`);
        console.log(`状态: ${passed ? '✓ 通过' : '✗ 失败'}`);
    }

    console.log(`\n=== 测试总结 ===`);
    console.log(`所有测试 ${allPassed ? '✓ 通过' : '✗ 失败'}`);
    return allPassed;
}

// 在浏览器中运行测试
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        console.log("页面加载完成，开始测试SHA-256...");
        testSHA256();
    });
}

// 导出测试函数以便在其他地方使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testSHA256 };
}
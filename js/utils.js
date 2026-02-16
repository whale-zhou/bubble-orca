// 工具函数模块

// 更新按钮样式的辅助函数
function updateButtonStyles(buttons, activeButton) {
    buttons.forEach(btn => {
        btn.classList.remove('bg-primary/80');
        btn.classList.add('bg-white/5');
    });
    activeButton.classList.remove('bg-white/5');
    activeButton.classList.add('bg-primary/80');
}

// 导出函数
export { updateButtonStyles };
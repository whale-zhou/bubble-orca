const base64 = 'eyJwYXNzd29yZCI6IjIwMjYiLCJyZWRlZW1Db2RlIjoiIiwicmVkcGFja2V0TGluayI6Imh0dHBzOi8vdXIuYWxpcGF5LmNvbS9fMzZHbkNLYzZudlpDU0JZcXdaZW80MCIsImtvdWxpbmciOiIyMDI2bmV3eWVhciIsInRpdGxlIjoi5rOh5rOh6bK456Wd5oKo5paw5bm05b+r5LmQIiwiYmxlc3NpbmciOiLpmaTlpJXlv6vkuZAtLea0siJ9';

function base64Decode(base64) {
    try {
        return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
        console.error('Base64解码失败:', e);
        return null;
    }
}

const decoded = base64Decode(base64);
console.log('解码结果:', decoded);

const config = JSON.parse(decoded);
console.log('暗号:', config.password);

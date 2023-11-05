// 获取元素
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const button = document.getElementById('button');
const image = document.getElementById('image');
const audio = document.getElementById('audio');

// 弹窗确认按钮点击事件
button.addEventListener('click', () => {
    // 隐藏弹窗
    popup.style.display = 'none';

    // 背景渐变为白色
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    
    // 图片渐变出现
    image.style.display = 'block';
    setTimeout(() => {
        image.style.opacity = 1;
    }, 100);

    // 播放音频
    audio.play();

    // 延迟1.4秒后开始图片渐变消失
    setTimeout(() => {
        let opacity = 1;
        const fadeOutInterval = setInterval(() => {
            image.style.opacity = opacity;
            opacity -= 0.02;
            if (opacity <= 0) {
                clearInterval(fadeOutInterval);
            }
        }, 50);
    }, 1400);

    // 延迟5.4秒后跳转到指定网页
    setTimeout(() => {
        window.location.href = 'a.html'; // 跳转到指定的网页
    }, 5400);
});

// 显示弹窗
popup.style.display = 'block';

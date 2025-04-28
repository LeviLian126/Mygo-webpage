// Global variable to track slogan animation timeout
let sloganAnimationTimeout = null;

// Function to animate the slogan
function animateSlogan() {
    const slogan = document.querySelector('.slogan-ja');
    if (slogan) {
        // Clear any existing timeout to prevent overlap
        if (sloganAnimationTimeout) {
            clearTimeout(sloganAnimationTimeout);
        }

        // Reset slogan state
        slogan.style.display = 'none';
        slogan.style.opacity = '0';
        slogan.style.transform = 'translate(-50%, 20px)';

        // Schedule the animation
        sloganAnimationTimeout = setTimeout(() => {
            slogan.style.display = 'block';
            // Small delay to ensure transition is applied
            setTimeout(() => {
                requestAnimationFrame(() => {
                    slogan.style.opacity = '1';
                    slogan.style.transform = 'translate(-50%, 0)';
                });
            }, 10); // 10ms delay to ensure transition is registered
        }, 1200); // 1.2s delay
    }
}

function switchLanguage(lang) {
    // 切换介绍文本的显示
    const introTexts = document.querySelectorAll('.intro-text p');
    let visibleContainer = null;
    introTexts.forEach(el => {
        if (el.getAttribute('data-lang') === lang) {
            el.style.display = 'block';
            visibleContainer = el;
        } else {
            el.style.display = 'none';
        }
    });

    // 切换标题文本
    const translatableElements = document.querySelectorAll('[data-lang-text]');
    translatableElements.forEach(el => {
        const translations = JSON.parse(el.getAttribute('data-lang-text'));
        if (translations[lang]) {
            el.textContent = translations[lang];
        }
    });

    // 更新按钮的激活状态
    const langButtons = document.querySelectorAll('.language-switcher .lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Trigger slogan animation
    animateSlogan();

    // 更新 html 标签的 lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // 手动触发可见容器的动画（包括标题和介绍文本）
    if (visibleContainer) {
        triggerTextAnimation(visibleContainer);
        triggerTitleAnimation();
    }
}

// 文字动画触发函数（仅处理介绍文本）
function triggerTextAnimation(container) {
    const textSpans = container.querySelectorAll('.reveal-text');
    // 重置介绍文字状态
    textSpans.forEach(span => {
        span.style.opacity = '0';
        span.classList.remove('animate-text');
    });
    // 延迟应用介绍文字动画
    requestAnimationFrame(() => {
        textSpans.forEach((span, i) => {
            setTimeout(() => {
                span.style.opacity = '1';
                span.classList.add('animate-text');
            }, i * 100); // 每个 span 延迟 100ms
        });
    });
}

// 标题动画触发函数
function triggerTitleAnimation() {
    const titleChars = document.querySelectorAll('.dancing-script .title-char');
    // 重置标题字符状态
    titleChars.forEach(char => {
        char.style.opacity = '0';
        char.classList.remove('animate-text');
    });
    // 应用动画，第一个字符 'M' 更慢
    requestAnimationFrame(() => {
        titleChars.forEach((char, i) => {
            const delay = i === 0 ? 500 : 500 + (i * 100); // 'M' 延迟 300ms，后续字符从 300ms 开始每 100ms 一个
            setTimeout(() => {
                char.style.opacity = '1';
                char.classList.add('animate-text');
                if (i === 0) {
                    char.style.transition = 'opacity 1s ease-out, transform 1s ease-out'; // 'M' 动画持续 1s
                } else {
                    char.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // 其他字符保持 0.6s
                }
            }, delay);
        });
    });
}

// 页面加载时的动画设置
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 触发介绍文本和标题动画
                if (entry.target.matches('.intro-text p')) {
                    triggerTextAnimation(entry.target);
                    triggerTitleAnimation();
                    animateSlogan();
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 观察 intro-text 容器
    const introTextContainers = document.querySelectorAll('.intro-text p');
    introTextContainers.forEach(container => {
        const spans = container.querySelectorAll('.reveal-text');
        spans.forEach(span => span.style.opacity = '0'); // Initialize spans as hidden
        observer.observe(container);
    });

    // 初始加载时检查默认可见的段落并触发动画
    const visibleIntro = document.querySelector('.intro-text p[style*="display: block"], .intro-text p:not([style*="display: none"])');
    if (visibleIntro) {
        // Check if it's actually in the viewport on load
        const bounding = visibleIntro.getBoundingClientRect();
        if (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
            triggerTextAnimation(visibleIntro);
            triggerTitleAnimation();
            animateSlogan();
        }
    }

    // Set initial active language button based on html lang attribute
    const initialLang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    const langButtons = document.querySelectorAll('.language-switcher .lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === initialLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});
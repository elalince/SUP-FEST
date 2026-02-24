
import { i18n } from './i18n/index.js'

const favicon = document.querySelector('#favicon');

function updateFavicon() {
    const theme = document.documentElement.dataset.theme; // или body.dataset.theme

    if (theme === 'melbet') {
        favicon.href = 'images/favicon-melbet.png';
    } else {
        favicon.href = 'images/favicon-1xbet.png';
    }
}

updateFavicon();


const header = document.querySelector('.header');

document.querySelectorAll('.header a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        // плавный скролл
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // закрыть меню хедера
        header.classList.remove('header--nav-open');
    });
});

const navLink = document.querySelector('.header__nav-link');
navLink.addEventListener('click', () => {
    header.classList.toggle('header--nav-open');
});

const body = document.body
const switcher = document.getElementById('langSwitcher')
const currentBtn = switcher.querySelector('.lang-switcher__current')
const currentLabel = switcher.querySelector('.lang-switcher__label')
const options = switcher.querySelectorAll('.lang-switcher__option')

const STORAGE_KEY = 'lang'

// init
const savedLang = localStorage.getItem(STORAGE_KEY) || 'en'
applyLang(savedLang)

// toggle dropdown
currentBtn.addEventListener('click', () => {
  switcher.classList.toggle('lang-switcher--open')
})

// select language
options.forEach(option => {
  option.addEventListener('click', () => {
    applyLang(option.dataset.lang)
    switcher.classList.remove('lang-switcher--open')
  })
})

// close outside
document.addEventListener('click', e => {
  if (!switcher.contains(e.target)) {
    switcher.classList.remove('lang-switcher--open')
  }
})

function applyLang(lang) {
  const option = [...options].find(o => o.dataset.lang === lang)
  if (!option) return

  body.setAttribute('data-lang', lang)

  // label
  currentLabel.textContent = option.dataset.label

  // selected class
  options.forEach(o => o.classList.remove('lang-switcher__option--selected'))
  option.classList.add('lang-switcher__option--selected')

  // localStorage
  localStorage.setItem(STORAGE_KEY, lang)
    // update i18n module
    try {
        i18n.setLanguage(lang)
    } catch (e) {
        // ignore if DOM not ready
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // init i18n once DOM is ready
    try { i18n.init() } catch (e) {}
  const progressBar = document.getElementById('progressBar');
  let isScrolling = false;
  
  function updateProgressBar() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = Math.min((scrolled / windowHeight) * 100, 100);
    
    progressBar.style.width = `${progress}%`;
    isScrolling = false;
  }
  
  // Оптимизация с помощью requestAnimationFrame
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(updateProgressBar);
    }
  });
  
  // Обновляем при изменении размера окна
  window.addEventListener('resize', updateProgressBar);
  
  updateProgressBar();
});

document.addEventListener('DOMContentLoaded', function() {
    // Функция для форматирования чисел с разделителями
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Функция анимации счетчика
    function animateCounter(element, target, duration = 1000, suffix = '') {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Используем ease-out для более естественной анимации
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            // Форматируем число если оно больше 1000
            const displayValue = target >= 1000 ? formatNumber(current) : current;
            element.textContent = displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // В конце анимации устанавливаем точное значение
                const finalValue = target >= 1000 ? formatNumber(target) : target;
                element.textContent = finalValue + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Функция для анимации процентов (особый случай)
    function animatePercent(element, target, duration = 1000) {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            element.textContent = current + '%';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target + '%';
            }
        }
        
        requestAnimationFrame(update);
    }

    // Инициализация счетчиков
    function initCounters() {
        const digitItems = document.querySelectorAll('.top-block__digits-item');
        
        // Ждем немного чтобы страница полностью загрузилась
        setTimeout(() => {
            // Первый элемент (30+)
            const firstElement = digitItems[0].querySelector('div');
            const firstValue = parseInt(firstElement.getAttribute('data-counter') || '30');
            animateCounter(firstElement, firstValue, 800, '+');
            
            // Второй элемент (0%)
            const secondElement = digitItems[1].querySelector('div');
            const secondValue = parseInt(secondElement.getAttribute('data-counter') || '0');
            animatePercent(secondElement, secondValue, 600);
            
            // Третий элемент (5,000,000+)
            const thirdElement = digitItems[2].querySelector('div');
            const thirdValue = parseInt(thirdElement.getAttribute('data-counter') || '5000000');
            animateCounter(thirdElement, thirdValue, 1200, '+');
        }, 300);
    }

    // Запускаем анимацию
    initCounters();
    
    // Опционально: перезапуск анимации при появлении в viewport
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Если нужно перезапускать анимацию при скролле
                // initCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const digitsBlock = document.querySelector('.top-block__digits');
    if (digitsBlock) {
        observer.observe(digitsBlock);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.instruction__block, .instruction__title'
    );

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    animatedElements.forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
    const lists = document.querySelectorAll(
        '.crypto__list, .security__list, .cta__list'
    );

    if (!lists.length) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.3
        }
    );

    lists.forEach(list => {
        const items = list.querySelectorAll(
            '.crypto__item, .security__item, .cta__item'
        );

        items.forEach((item, index) => {
            item.style.setProperty('--i', index);
        });

        observer.observe(list);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll(
        '.features__top, .features__list, .comparison__top, .comparison__tr, .security__top, .faq__top, .faq__item, .cta__top', 
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    elements.forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {

        item.addEventListener('click', () => {
            const isOpen = item.classList.contains('faq__item--open');
            if (!isOpen) {
                item.classList.add('faq__item--open');
            }

            else {
                item.classList.remove('faq__item--open');
            }
        });
    });
});

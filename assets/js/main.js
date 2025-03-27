/**
 * main.js - メインJavaScriptファイル
 * 
 * 論文解説ウェブサイトの主要な機能を実装
 */

document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションのスムーススクロール
    setupSmoothScroll();
    
    // パフォーマンスチャートの初期化
    initPerformanceChart();
    
    // 用語集のポップアップ初期化
    setupTermPopups();
    
    // ページのスクロールに応じたアニメーション
    setupScrollAnimations();
    
    // コードのシンタックスハイライト
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
});

/**
 * スムーススクロールの設定
 */
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // ナビゲーションバーの高さを考慮してスクロール位置を調整
                const navHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // URLのハッシュを更新（オプション）
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * パフォーマンスチャートの初期化
 */
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    
    if (!ctx) return;
    
    // パフォーマンスデータ
    const data = {
        labels: ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k'],
        datasets: [
            {
                label: '提案手法',
                data: [0, 10, 22, 35, 48, 62, 75, 82, 88, 90, 92],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: '従来のハイブリッド手法',
                data: [0, 5, 12, 21, 30, 42, 52, 60, 68, 74, 78],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: '純粋なRL',
                data: [0, 2, 5, 12, 19, 28, 37, 48, 57, 62, 65],
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: '純粋な記号的プランニング',
                data: [0, 8, 17, 25, 32, 38, 40, 40, 40, 40, 40],
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };
    
    // チャートオプション
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: '環境相互作用数',
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: '成功率 (%)',
                    font: {
                        size: 14
                    }
                },
                min: 0,
                max: 100
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    },
                    title: function(context) {
                        return `${context[0].label} 相互作用後`;
                    }
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    };
    
    // チャートの作成
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * 用語集のポップアップ設定
 */
function setupTermPopups() {
    const terms = document.querySelectorAll('.glossary-list dt');
    
    terms.forEach(term => {
        // 用語集にある全ての用語を探す
        const termText = term.textContent.trim();
        const description = term.nextElementSibling.textContent.trim();
        
        // 本文内の用語を検索してポップアップを追加
        const contentElements = document.querySelectorAll('.content-card p');
        
        contentElements.forEach(element => {
            // termTextと一致する部分を検索し、ツールチップ用のspanで囲む
            // ※ここでは単純な文字列置換をしていますが、実際には単語の境界を考慮する必要があります
            const regex = new RegExp(`(${termText})(?![^<]*>)`, 'g');
            
            if (regex.test(element.innerHTML)) {
                element.innerHTML = element.innerHTML.replace(regex, `<span class="term-highlight" data-bs-toggle="tooltip" data-bs-placement="top" title="${description}">$1</span>`);
            }
        });
    });
    
    // BootstrapのTooltipを初期化
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * スクロールに応じたアニメーション設定
 */
function setupScrollAnimations() {
    // アニメーション対象の要素
    const animElements = document.querySelectorAll('.content-card, .abstract-card, .key-points-card, .chart-card');
    
    // 交差オブザーバーの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 要素を監視リストに追加
    animElements.forEach(element => {
        observer.observe(element);
    });
}

// トップに戻るボタンの表示・非表示
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});
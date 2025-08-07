// Dark Mode Toggle Functionality
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.themeToggleBtn = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.themeToggleBtn = document.getElementById('theme-toggle');
            this.setupThemeToggle();
            this.applyTheme(this.currentTheme);
        });
    }

    setupThemeToggle() {
        if (!this.themeToggleBtn) return;

        // Set initial button icon
        this.updateToggleButton();

        // Add click event listener
        this.themeToggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add keyboard support
        this.themeToggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.storeTheme(this.currentTheme);
        this.updateToggleButton();

        // Add smooth transition effect
        this.addTransitionEffect();
    }

    applyTheme(theme) {
        const body = document.body;

        if (theme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    updateToggleButton() {
        if (!this.themeToggleBtn) return;

        const isDark = this.currentTheme === 'dark';
        this.themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        this.themeToggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        this.themeToggleBtn.setAttribute('aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = theme === 'dark' ? '#16181e' : '#ffffff';
    }

    addTransitionEffect() {
        // Add a smooth transition class temporarily
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        // Remove transition after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('cinesou-theme', theme);
        } catch (e) {
            // Handle cases where localStorage is not available
            console.warn('Could not save theme preference:', e);
        }
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('cinesou-theme');
        } catch (e) {
            // Handle cases where localStorage is not available
            console.warn('Could not load theme preference:', e);
            return null;
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.storeTheme(theme);
            this.updateToggleButton();
        }
    }
}

// System theme detection
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Listen for system theme changes
function setupSystemThemeListener(themeManager) {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const storedTheme = themeManager.getStoredTheme();
            if (!storedTheme) {
                const systemTheme = e.matches ? 'dark' : 'light';
                themeManager.setTheme(systemTheme);
            }
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Setup system theme detection if no stored preference
document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = themeManager.getStoredTheme();
    if (!storedTheme) {
        const systemTheme = detectSystemTheme();
        themeManager.setTheme(systemTheme);
    }

    setupSystemThemeListener(themeManager);
});

// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', () => {
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .theme-btn:focus {
            outline: 2px solid var(--accent-green);
            outline-offset: 2px;
        }

        .theme-btn:focus:not(:focus-visible) {
            outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                transition: none !important;
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export theme manager for global access
window.themeManager = themeManager;

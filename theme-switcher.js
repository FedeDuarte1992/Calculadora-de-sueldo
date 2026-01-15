/**
 * Theme Switcher - Maneja el cambio entre modo claro y oscuro
 */

class ThemeSwitcher {
    constructor() {
        this.THEME_KEY = 'calculadora-theme';
        this.LIGHT = 'light';
        this.DARK = 'dark';
        this.init();
    }

    init() {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        
        // Determinar tema inicial
        const initialTheme = savedTheme || (prefersDark ? this.DARK : this.LIGHT);
        
        // Aplicar tema
        this.setTheme(initialTheme);
        
        // Crear y agregar botón
        this.createThemeButton();
        
        // Escuchar cambios de preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.THEME_KEY)) {
                this.setTheme(e.matches ? this.DARK : this.LIGHT);
            }
        });
    }

    setTheme(theme) {
        const html = document.documentElement;
        
        if (theme === this.DARK) {
            html.setAttribute('data-theme', this.DARK);
            localStorage.setItem(this.THEME_KEY, this.DARK);
        } else {
            html.removeAttribute('data-theme');
            localStorage.setItem(this.THEME_KEY, this.LIGHT);
        }
        
        // Actualizar icono del botón si existe
        this.updateButtonIcon();
    }

    createThemeButton() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        // Crear botón de tema
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.type = 'button';
        button.title = 'Cambiar tema (claro/oscuro)';
        button.setAttribute('aria-label', 'Cambiar tema');
        
        nav.appendChild(button);
        
        // Agregar evento
        button.addEventListener('click', () => this.toggleTheme());
    }

    updateButtonIcon() {
        const button = document.querySelector('.theme-toggle');
        if (!button) return;

        const isDark = document.documentElement.getAttribute('data-theme') === this.DARK;
        button.textContent = isDark ? '☀️' : '🌙';
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === this.DARK ? this.LIGHT : this.DARK;
        
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || this.LIGHT;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeSwitcher();
    });
} else {
    new ThemeSwitcher();
}

let locals = localStorage.getItem('theme'), themeToSet = locals;

if (!locals) {
  themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

document.documentElement.setAttribute('data-theme', themeToSet);
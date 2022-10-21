let boxEl = document.querySelector('.container');
let menuEl = document.querySelector('nav');

boxEl.addEventListener('change', () => {
    menuEl.classList.toggle('aberto');
});

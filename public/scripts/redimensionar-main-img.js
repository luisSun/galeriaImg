function changeImageSize(size) {
    var img = document.querySelector('.img-main');
    if (size === 'original') {
        // Define a largura e altura originais da imagem
        img.style.width = 'auto';
        img.style.height = 'auto';
    } else {
        img.style.width = size + '%';
        img.style.height = size + '%';
    }
}

// Ajusta o tamanho da imagem para 80% ao carregar a página
window.onload = function() {
    changeImageSize(80);
};

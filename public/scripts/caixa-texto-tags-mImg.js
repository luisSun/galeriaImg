function addTextInput() {
    // Verifica se já existe uma caixa de texto
    if (!document.querySelector('.container-tags input')) {
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Digite algo...";
        document.querySelector('.container-tags').appendChild(input);
        input.focus(); // Coloca o foco no novo campo de texto
    }
}
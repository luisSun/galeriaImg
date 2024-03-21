function toggleEditForm(button) {
    const container = button.parentElement;
    const editForm = container.querySelector('.edit-form');
    const tagsNonEditable = container.querySelector('.tags-non-editable');
    
    if (editForm.style.display === 'none' || editForm.style.display === '') {
        tagsNonEditable.style.display = 'none';
        editForm.style.display = 'block';
    } else {
        tagsNonEditable.style.display = 'block';
        editForm.style.display = 'none';
    }
}

function editTags(button) {
const container = button.parentElement;
const editForm = container.querySelector('.edit-form');
const p = container.querySelector('.tags-non-editable');
const textarea = editForm.querySelector('.tags-editable');
const tags = p.textContent.replace('TAGS: ', '');

// Separa as tags existentes por tipo (series, char, misc)
const tagLines = {
    series: [],
    char: [],
    misc: []
};

tags.split(';').forEach(tag => {
    const [type, value] = tag.trim().split(':');
    if (type === 'series') {
        tagLines.series.push(value.trim());
    } else if (type === 'char') {
        tagLines.char.push(value.trim());
    } else if (type === 'misc') {
        tagLines.misc.push(value.trim());
    }
});

// Processa a primeira linha separadamente
const lines = textarea.value.split('\n');
if (lines.length > 0) {
    const firstLineValues = lines[0].split(',').map(value => value.trim());
    firstLineValues.forEach(value => {
        if (!tagLines.series.includes(value)) {
            tagLines.series.push(value);
        }
    });
}

// Formata as linhas para a textarea
const formattedLines = [];
for (const key in tagLines) {
    if (tagLines[key].length > 0) {
        formattedLines.push(tagLines[key].map(value => `${value}`).join(', '));
    }
}

// Define o valor da textarea com as linhas formatadas
textarea.value = formattedLines.join('\n');
editForm.style.display = 'block';
p.style.display = 'none';
}

function saveTags(button) {
const container = button.parentElement;
const editForm = container.querySelector('.edit-form');
const textarea = editForm.querySelector('.tags-editable');
let formattedTags = '';

// Trata a primeira linha como séries
const series = textarea.value.split('\n')[0].split(',').map(tag => `serie:${tag.trim()}`).join('; ');

// Trata a segunda linha como personagens
const characters = textarea.value.split('\n')[1].split(',').map(tag => `char:${tag.trim()}`).join('; ');

// Trata a terceira linha como miscelânea
const misc = textarea.value.split('\n')[2].split(',').map(tag => `misc:${tag.trim()}`).join('; ');

// Monta a string final
formattedTags = `${series}; ${characters}; ${misc}`;

console.log('Formatted tags:', formattedTags);
// Aqui você pode enviar 'formattedTags' para onde desejar

// Exemplo de como enviar os dados via POST para um endpoint '/save-tags'
fetch('/save-tags', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tags: formattedTags })
}).then(response => {
    if (!response.ok) {
        throw new Error('Erro ao salvar as tags.');
    }
    return response.json();
}).then(data => {
    console.log('Tags salvas com sucesso:', data);
    // Aqui você pode adicionar lógica adicional após salvar as tags, se necessário
}).catch(error => {
    console.error('Erro ao salvar as tags:', error.message);
    // Aqui você pode lidar com o erro de forma adequada, como exibir uma mensagem de erro ao usuário
});
}
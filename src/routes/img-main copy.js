<%- include('partials/head.ejs') %>
<main>
    <%- include('partials/aside.ejs') %>
    <section>
        <div class="container">
            <div class="container-head">Esse seria o Header
                <a>Posts</a>
                <p>Outras coisas</p>
                <button onclick="changeImageSize(60)">60%</button>
                <button onclick="changeImageSize(80)">80%</button>
                <button onclick="changeImageSize(100)">100%</button>
                <button onclick="changeImageSize('original')">Tamanho original</button>
            </div>
            <h2>Recebe Cards</h2>
            <div class="container-body">

            <% for (let i = 0; i < result.length; i++) { %>
                    <img class="img-main" src="/<%= result[i].path %>" style="width: 60%; height: 60%;">
                    <!-- FIM Adicionar o EJS de iteração-->
            </div>
            <div class="tags">
                <form action="/update-tags/<%= result[0].id %>" method="post">
                    <div class="tags">
                        <h4>Adicionar Tags:</h4>
                        <div class="container-tags" onclick="toggleTags(this)">
                            <p class="tags-non-editable">TAGS: <%= result[0].tags %></p>
                            <br>
                            <div class="tag-input-container">
                                <input type="text" id="tagInput" name="tags" class="tags-editable" style="display: none; width: 100%;" onclick="stopPropagation(event);" oninput="getTagSuggestions(this)">
                                <div id="tagSuggestions"></div>
                            </div>
                            <button class="save-button" style="display: none;" onclick="saveTags(this)" data-id="<%= result[0].id %>">Salvar</button>
                        </div>
                    </div>
                    <input type="submit" style="display: none;"> <!-- Add a hidden submit button to submit the form -->
                </form>
            </div>


            <div class="container-footer">
                <a href="<%= result[i].id - 1 %>"><</a>
                <h4>Texto placeholder</h4>
                <a href="<%= result[i].id + 1 %>">></a>
            </div>
            <% } %>
            <div class="footer">
                recebe o footer, paginação
            </div>
        </div>
    </section>
    
</main>
<footer>
    <p>Footer</p>
</footer>
<script>
    function toggleTags(container) {
        const p = container.querySelector('.tags-non-editable');
        const textarea = container.querySelector('.tags-editable');
        const button = container.querySelector('.save-button');
        if (p.style.display === 'none' || p.style.display === '') {
            p.style.display = 'block';
            textarea.style.display = 'none';
            button.style.display = 'none';
        } else {
            p.style.display = 'none';
            textarea.style.display = 'block';
            button.style.display = 'block';
        }
    }
    
    function stopPropagation(event) {
        event.stopPropagation(); // Impede a propagação do evento de clique para o elemento pai
    }
    
    function addDefaultTags(textarea) {
    if (textarea.value.trim() === '') {
        textarea.value = 'series: ;char: ;author: ;misc:';
    }
}

function removeDefaultTags(textarea) {
    if (textarea.value === 'series: ;char: ;author: ;misc:') {
        textarea.value = '';
    }
}

function saveTags(button) {
    const form = button.parentElement; // Get the parent container
    const id = button.getAttribute('data-id'); // Get the id from the button's data-id attribute
    const textarea = form.querySelector('.tags-editable');
    const p = form.querySelector('.tags-non-editable');

    // Check if textarea is empty and add default tags if necessary
    if (textarea.value.trim() === '') {
        textarea.value = 'series: ;char: ;author: ;misc:';
    }

    p.textContent = textarea.value; // Update the paragraph's content with the textarea's value
    textarea.style.display = 'none'; // Hide the textarea
    p.style.display = 'block'; // Show the paragraph

    // Use 'id' to construct the correct action URL
    form.action = `/update-tags/${id}`;

    // Submit the form
    form.submit(); 
}


function getTagSuggestions(input) {
    const tagInput = input.value.toLowerCase().trim();
    if (!tagInput) {
        document.getElementById('tagSuggestions').innerHTML = '';
        return;
    }

    fetch(`/get-tag-suggestions?tag=${tagInput}`)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.suggestions;
            const suggestionDiv = document.getElementById('tagSuggestions');
            suggestionDiv.innerHTML = '';
            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('div');
                suggestionElement.textContent = suggestion;
                suggestionElement.addEventListener('click', () => {
                    // Adiciona a sugestão ao final do texto existente
                    input.value += (input.value ? '; ' : '') + suggestion;
                    suggestionDiv.innerHTML = '';
                });
                suggestionDiv.appendChild(suggestionElement);
            });
        });
}


</script>
<%- include('partials/endBody.ejs') %>

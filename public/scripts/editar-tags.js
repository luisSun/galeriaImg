function editTag(event) {
    if (event.target.tagName === 'SPAN') {
        var tagValue = event.target.textContent.trim();
        var input = document.createElement("input");
        input.type = "text";
        input.value = tagValue;
        input.addEventListener('blur', function() {
            var newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = input.value;
            newTag.setAttribute('onclick', 'deleteTag(event)');
            event.target.replaceWith(newTag);
        });
        event.target.replaceWith(input);
        input.focus();
    }
}
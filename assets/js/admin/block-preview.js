document.addEventListener("mouseover", function (e) {
    const previewContainer = document.querySelector('.block-editor-inserter__preview-content-missing');

    if (!previewContainer) {
        return;
    }

    if (e.target.closest('.block-editor-block-types-list__item')) {
        const hoveredBlock = e.target.closest('.block-editor-block-types-list__item');
        const blockClasses = hoveredBlock.className.split(' ');
        const blockClass = blockClasses.find(cls => cls.startsWith("editor-block-list-item-acf-"));

        if (blockClass) {
            const blockName = blockClass.replace("editor-block-list-item-acf-", "");

            const imageUrl = `${theme_path.url}/blocks/${blockName}/preview.png`;

            if (imageUrl) {
                previewContainer.style.background = `url(${imageUrl}) no-repeat center`;
                previewContainer.style.backgroundSize = 'contain';
                previewContainer.style.fontSize = '0px';
            } else {
                previewContainer.style.background = '';
                previewContainer.style.backgroundSize = '';
                previewContainer.style.fontSize = '';
            }
        }
    }
});
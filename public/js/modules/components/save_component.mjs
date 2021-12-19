
const classes = {
    save_item: 'save-selector__save',
    save_item_image: 'save-selector__save__image',
    save_item_title: 'save-selector__save__title'
}

export function createSaveComponent(parent, save_data, callback=null) {
    const save_node = document.importNode(document.getElementById('templateSave').content.querySelector('div'), true);
    save_node.dataset.id = save_data.id
    save_node.querySelector('img').src = save_data.image
    save_node.querySelector('span').innerText = save_data.title


    save_node.addEventListener('click', (event) => {
        if (callback.call) {
            callback(save_node)
        }
    })

    parent.appendChild(save_node)
}
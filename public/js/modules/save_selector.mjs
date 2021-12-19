import { ipcRenderer, clipboard } from "../main.mjs";
import {createSaveComponent} from './components/save_component.mjs'
import {dragElement} from './draggable.mjs'

const saves = {}
const defaults = {
    save_image: './svg/defaults/no_image.svg'
}

const classes = {
    save: 'save-selector__save',
    save_image: 'save-selector__save__image',
    save_title: 'save-selector__save__title',
    modal_visible: 'save-modal--visible'
}

var selected_set_id = '';

ipcRenderer.on('save-sets', (event, arg) => {
    const save_selector = document.getElementById('saveSelector');
    save_selector.innerHTML = '';
    let save_sets = arg;
    console.log(save_sets)
    for (const save_data of save_sets) {
        if (!save_data.image) {
            save_data.image = defaults.save_image;
        }
        saves[save_data.id] = save_data;
        createSaveComponent(save_selector, save_data, saveClickCallback);
    }
})

function saveClickCallback(element) {
    const modal = document.getElementById('saveModal');
    modal.classList.add(classes.modal_visible);
    let save_data = saves[element.dataset.id];

    if (save_data.id !== selected_set_id) {
        selected_set_id = save_data.id;

        const modal_image = document.getElementById('saveModalImage');
        console.log(modal_image)

        modal_image.style.animation = 'animate-image-out .25s ease 0s 1';

        modal_image.addEventListener('animationend', () => {
            modal_image.src = save_data.image;
            modal_image.style.animation = 'animate-image-in .25s linear 0s 1';
        })
        document.getElementById('saveModalID').innerText = `Set ID: ${save_data.id}`;
        document.getElementById('saveModalTitle').innerText = save_data.title;
        document.getElementById('saveModalDescription').value = save_data.description;
    }
}

function updateSave(save_data) {
    saves[save_data.id] = save_data;
    console.log(save_data)
    const event = new CustomEvent('save-update', {detail: {id: save_data.id}});
    window.dispatchEvent(event);
}

window.addEventListener('load', (event) => {
    document.getElementById('saveModalCloseButton').addEventListener('click', () => {
        document.getElementById('saveModal').classList.remove(classes.modal_visible);
    })

    dragElement(document.getElementById('saveModal'), document.getElementById('saveModalHeaderDrag'));
})

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Escape':
            document.activeElement.blur()
            document.getElementById('saveModal').classList.remove(classes.modal_visible)
            break;
    }
})

document.getElementById('saveModalID').addEventListener('mouseenter', (event) => {
    document.getElementById('cursorAttached').style.visibility = 'visible'
})

document.getElementById('saveModalID').addEventListener('mouseleave', (event) => {
    document.getElementById('cursorAttached').style.visibility = 'hidden'
})

document.getElementById('saveModalID').addEventListener('mousemove', (event) => {
    let attached = document.getElementById('cursorAttached');
    let font_size = parseInt(window.getComputedStyle(attached).fontSize, 10);
    console.log(window.getComputedStyle(attached).fontSize)
    attached.style.left = `${event.clientX+font_size}px`;
    attached.style.top = `${event.clientY+font_size}px`;
})

document.getElementById('saveModalID').addEventListener('click', () => {
    clipboard.writeText(saves[selected_set_id].id)
})

document.getElementById('saveModalTitle').addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            let save = saves[selected_set_id];
            save.title = event.target.innerText;
            updateSave(save);
            break;
        case 'Escape':
            event.preventDefault();
            break;
    }
})

document.getElementById('saveModalTitle').addEventListener('blur', (event) => {
    let save = saves[selected_set_id];
    save.title = event.target.innerText;
    updateSave(save);
})

document.getElementById('saveModalDescription').addEventListener('blur', (event) => {
    let save = saves[selected_set_id];
    save.description = event.target.value;
    updateSave(save);
})

document.getElementById('saveModalOpenFolder').addEventListener('click', () => {
    ipcRenderer.send('open-folder', selected_set_id);
})


window.addEventListener('save-update', (event) => {
    let upped_save = saves[event.detail.id]

    console.log('save: ' + upped_save)

    let save_selector = document.getElementById('saveSelector');
    let save = save_selector.querySelector(`[data-id="${upped_save.id}"]`)

    if (save) {
        save.querySelector(`.${classes.save_image}`).src = upped_save.image;
        save.querySelector(`.${classes.save_title}`).innerText = upped_save.title;
    }

    ipcRenderer.send('save', 'update', upped_save)

})

document.getElementById('add').addEventListener('click', (event) => {
    ipcRenderer.send('save', 'create')
})

ipcRenderer.on('save', (event, arg) => {
    const save_selector = document.getElementById('saveSelector');
    const save_data = arg;
    if (!save_data.image) {
        save_data.image = defaults.save_image;
    }
    saves[save_data.id] = save_data;
    createSaveComponent(save_selector, save_data, saveClickCallback);
})


export {
    saves
}
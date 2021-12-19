import { ipcRenderer } from "../main.mjs";

function handleButtonClick() {
    console.log(this.id)
    ipcRenderer.send('window-button',this.id.replace("title", ""))
}

window.addEventListener('load', function(){
    [document.getElementById('titleMinimizeButton'), 
    document.getElementById('titleMaxRestButton'), 
    document.getElementById('titleCloseButton')].forEach((element) => {
        element.addEventListener('click', handleButtonClick)
    })

    this.document.getElementById('titleWindowTitle').innerText = document.title
})

ipcRenderer.on('window-state', (event, arg) => {
    console.log(arg)
    const window_state = arg;
    let maximized_icon = document.getElementById('titleMaxRestButton').querySelector('.title-bar__btn__icon')
    if (window_state.maximized) {
        maximized_icon.className = maximized_icon.className.replace('title-bar__btn__icon--max', 'title-bar__btn__icon--rest')
    } else {
        maximized_icon.className = maximized_icon.className.replace('title-bar__btn__icon--rest', 'title-bar__btn__icon--max')
    }
})
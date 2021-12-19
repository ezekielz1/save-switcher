const {ipcRenderer, clipboard} = require('electron')

ipcRenderer.on('window-prefs', (event, arg) => {
    let prefs = arg;
    let color = '#'+prefs.accentColor.substring(0,6)
    document.documentElement.style.setProperty('--system-accent-color', `${color}`);
    document.documentElement.style.setProperty('--body-background', `linear-gradient(0deg, ${color}7F, ${color}FF) 50%`);
    document.documentElement.style.setProperty('--modal-button-play-background', `linear-gradient(45deg, ${color}7F, ${color}FF)`)
    document.documentElement.style.setProperty('--add-button-background', `linear-gradient(45deg, ${color}7F, ${color}FF)`)
    document.documentElement.style.setProperty('--modal-background', `linear-gradient(0deg, ${color}00, ${color}4F)`)
})

export {ipcRenderer, clipboard}
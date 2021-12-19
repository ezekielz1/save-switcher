const {app, BrowserWindow, ipcMain, systemPreferences, dialog, shell} = require('electron');
const path = require('path');
const messages = require('./modules/messages');
const filehandler = require('./modules/file_handler')


function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 800,
        minWidth: 800,
        minHeight: 800,
        frame: false,
        // transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, '/public/png/icon.png')
    })
    window.loadFile("public/index.html")

    window.on('maximize', () => maxState(window))
    window.on('unmaximize', () => maxState(window))

    window.webContents.on('dom-ready', () => {
        window.webContents.send('window-prefs', messages.getWindowPrefs())
        try {
            window.webContents.send('save-sets', messages.getSaveData())
        } catch(err) {
            app.quit();
        }
    })

    function maxState(window) {
        window.webContents.send('window-state', messages.getWindowState(window))
    }
}

systemPreferences.on('accent-color-changed', () => {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('window-prefs', messages.getWindowPrefs())
    })
})

app.whenReady().then( () => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window-button', (event, arg) => {
    const window = BrowserWindow.getFocusedWindow()
    switch (arg) {
        case 'MinimizeButton': 
            window.minimize();
            break;
        case 'MaxRestButton':
            if (window.isMaximized()) {
                window.unmaximize();
            } else if (window.isMaximizable()) {
                window.maximize()
            }
            break;
        case 'CloseButton': 
            window.close();
            break;
    }
})

ipcMain.on('save', (event, arg, arg2) => {
    console.log(arg)
    switch(arg) {
        case 'create':
            dialog.showMessageBox({
                title: "Are you sure?",
                message: "Currently sets must be removed manually\n\nAre you sure you want to continue?",
                type: 'question',
                buttons: ['OK', 'Cancel'],
                defaultId: 0,
                cancelId: 1
            }).then((res) => {
                console.log(res)
                if (res.response === 0) {
                    event.sender.send('save', messages.newSave())
                }
            })
            break;
        case 'update':
            filehandler.updateSaveSet(arg2);
            break;
    }
})

ipcMain.on('open-folder', (event, arg) => {
    shell.openPath(path.join(filehandler.getSaveSetsPath(), arg))
})


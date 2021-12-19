const {systemPreferences} = require('electron')
const { randomUUID } = require('crypto');
const file_handler = require('./file_handler')

function getWindowState(window) {

    const windowSize = window.getSize();
    return {
        width: windowSize[0],
        height: windowSize[1],
        maximized: window.isMaximized()
    }
}

function getWindowPrefs() {
    return {
        accentColor: systemPreferences.getAccentColor(),
    }
}

function getSaveData() {
    return file_handler.getSaveSets()
}

function newSave() {
    let save_data = {
        id: randomUUID(),
        image: null,
        title: "Set Title",
        description: ""
    }

    file_handler.createSaveSet(save_data);
    return save_data;
}

module.exports = {
    getWindowState,
    getWindowPrefs,
    getSaveData,
    newSave
}
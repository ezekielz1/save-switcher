const { randomUUID } = require('crypto');
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path')

function getUserRootFolder() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getSaveSetsPath() {
    let save_path = path.join(getUserRootFolder(), 'Documents', 'Save Sets')
    try {
        fs.accessSync(save_path, fs.constants.F_OK | fs.constants.W_OK)
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                fs.accessSync(path.dirname(save_path), fs.constants.F_OK | fs.constants.W_OK)
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    dialog.showErrorBox('Access Prohibited', `No write access for:\n${path.dirname(save_path)}`)
                    throw 'Access Prohibited';
                }
            }
            try {
                fs.mkdirSync(save_path, {recursive: true})
            } catch (err) {
                dialog.showErrorBox("An Error Occurred",err)
                throw err;
            }
        } else {
            dialog.showErrorBox('Access Prohibited', `No write access for:\n${save_path}`)
            throw 'Access Prohibited';
        }
    }

    return save_path;
}

function createSaveSet(save_data) {
    const set_path = path.join(getSaveSetsPath(), save_data.id);
    fs.mkdirSync(path.join(set_path, 'saves'), {recursive: true});
    fs.writeFile(path.join(set_path, '.meta.json'), JSON.stringify(save_data), (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function updateSaveSet(save_data) {
    const set_path = path.join(getSaveSetsPath(), save_data.id);
    fs.writeFile(path.join(set_path, '.meta.json'), JSON.stringify(save_data), (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function getSaveSets() {
    const file_path = getSaveSetsPath()
    const files = fs.readdirSync(file_path, {withFileTypes: true})
    const save_sets = [];
    for (const file of files) {
        console.log(file)
        if (file.isDirectory()) {
            try {
                const save_data = JSON.parse(fs.readFileSync(path.join(file_path, file.name, '.meta.json')))
                let image_path = path.join(file_path, file.name, 'image.png');
                save_data.image = fs.existsSync(image_path) ? image_path : null;
                save_sets.push(save_data);
            } catch(err) {
                console.log(err);
            }
        }
    }

    return save_sets;
}

module.exports = {
    getSaveSets,
    getSaveSetsPath,
    createSaveSet,
    updateSaveSet
}
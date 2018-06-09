import { fileFormats } from '../views/base';

export default class FolderList {
    constructor() {
        this.folders = [];
    }

    parseFolders(data) {
        let newFolders = [];
        data.forEach(el => {
            if (el.indexOf('.') === -1) {
                newFolders.push(el);
            }
        });
        this.folders = newFolders;
    }

    addFolder(name) {
        this.folders.push(name);
    }

    removeFolder(name) {
        const ix = this.folders.findIndex(el => el === name);
        this.folders.splice(ix, 1);
    }
}
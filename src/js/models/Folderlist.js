import * as request from '../request';

export default class FolderList {
    constructor() {
        this.folders = [];
        this.currentFolder = '/';
    }

    setCurrentFolder(name) {
        this.currentFolder = name;
    }

    parseFolders(data) {
        const newFolders = [];
        //Check if folder
        data.forEach(el => {
            if (el.indexOf('.') === -1) {
                newFolders.push(el);
            }
        });
        this.folders = newFolders;
    }

    async addFolder(username, name) {
        try {
            await request.addRemoteFolder(username, name);
            this.folders.push(name);
        } catch (err) {
            console.log(err);
        }
    }

    async removeFolder(username, name) {
        try {
            await request.removeRemoteFolder(username, name);
            const ix = this.folders.findIndex(el => el === name);
            this.folders.splice(ix, 1);
        } catch(err) {
            console.log(err);
        }
    }
}

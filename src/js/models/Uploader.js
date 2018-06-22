import * as request from '../request';

export default class Uploader {
    constructor(files) {
        this.files = [...files];
    }

    async uploadFiles(username, folder, tracklist) {
        let formData = new FormData();

        const filesToDelete = [];

        this.files.forEach(elem => {
            if (!tracklist.tracks.includes(elem.name)) {
                formData.append('uploads[]', elem, elem.name);
                tracklist.addTrack(elem.name);
            } else {
                filesToDelete.push(elem);
            }
        });

        filesToDelete.forEach(elem => {
            this.removeFile(elem);
        });
        
        try {
            await request.uploadFiles(username, folder, formData);
        } catch (error) {
            console.log(error);
        }
    }

    getFileNames() {
        const names = this.files.map(elem => elem.name);
        return names;
    }

    removeFile(file) {
        const ix = this.files.findIndex(el => el.name === file.name);
        this.files.splice(ix, 1);
    }
}
import * as request from '../request';

export default class Uploader {
    constructor(files) {
        this.files = [...files];
    }

    async uploadFiles(username, folder) {
        let formData = new FormData();

        this.files.forEach(elem => {
            formData.append('uploads[]', elem, elem.name);
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
}
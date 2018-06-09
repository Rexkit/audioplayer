import axios from 'axios';
import { serverURL } from '../settings';

export default class Login {
    constructor(username) {
        this.username = username;
    }

    async getData() {
        try {
            const res = await axios(`${serverURL}uploads/${this.username}`);
            return res.data;
        } catch (error) {
            console.log(error);
        } 
    }

    logout() {
        this.username = '';
    }
}
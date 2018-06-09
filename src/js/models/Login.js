import axios from 'axios';
import { serverURL } from '../settings';

export default class Login {
    constructor(username) {
        this.username = username;
    }

    logout() {
        this.username = '';
    }
}
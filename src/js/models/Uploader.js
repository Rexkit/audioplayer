import axios from 'axios';
import { serverURL } from '../settings';

export default class Uploader {
    constructor(files) {
        this.files = [...files];
    }
}
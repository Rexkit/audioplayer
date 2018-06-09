import axios from 'axios';
import { serverURL } from './settings';

export const getUserFolderData = async (username, folder) => {
    try {
        const res = await axios(`${serverURL}uploads/${username}/${folder !== undefined ? folder : ''}`);
        return res.data;
    } catch (error) {
        console.log(error);
    } 
}
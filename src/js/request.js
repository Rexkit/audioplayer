import axios from 'axios';
import { serverURL } from './settings';
import { progressRender } from './views/tracklistView';

const uploadConfig = {
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log(percentCompleted);
      progressRender(percentCompleted);
    }
}

export const uploadFiles = async (username, folder, data) => {
    try {
        const res = await axios.post(`${serverURL}uploads/${username}/${folder}/upld`, data, uploadConfig);
    } catch (error) {
        console.log(error);
    }
}

export const getUserFolderData = async (username, folder) => {
    try {
        const res = await axios.get(`${serverURL}uploads/${username}/${folder !== undefined ? folder : ''}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const removeRemoteFolder = async (username, folder) => {
    try {
        const res = await axios.delete(`${serverURL}uploads/${username}/${folder}`);
    } catch (error) {
        console.log(error);
    }
}

export const addRemoteFolder = async (username, folder) => {
    try {
        const res = await axios.post(`${serverURL}uploads/${username}/${folder}`);
    } catch (error) {
        console.log(error);
    }
}

export const removeRemoteTrack = async (username, folder, track) => {
    try {
        const res = await axios.delete(`${serverURL}uploads/${username}/${folder}/${track}`);
    } catch (error) {
        console.log(error);
    }
}
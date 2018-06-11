import '../sass/main.scss';
import { elements } from './views/base';
import Login from './models/Login';
import Uploader from './models/Uploader';
import Folderlist from './models/Folderlist';
import Tracklist from './models/Tracklist';
import * as loginView from './views/loginView';
import * as uploaderView from './views/uploaderView';
import * as folderlistView from './views/folderlistView';
import * as tracklistView from './views/tracklistView';
import * as request from './request';

/**
 * Global app state
 */
const state = {};

/**
 * Login controller
 */
const controlLogin = async type => {
    if (type === 'login') {
        const username = loginView.getUsername();
        state.login = new Login(username);
        console.log(state.login);
        loginView.clearLogin();
        loginView.renderLogin(type, username);
        try {
            const data = await request.getUserFolderData(username);
            console.log(data); // TODO
            controlFolderList(data);
        } catch (error) {
            console.log(error);
        }
    } else if (type === 'logout') {
        loginView.clearLogin();
        loginView.renderLogin(type);
        state.login.logout();
    }
};

elements.headerLogin.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.matches('.login__btn, .login__btn *')) {
        controlLogin('login');
    } else if (e.target.matches('.logout__btn, .logout__btn *')) {
        controlLogin('logout');
    }
});

/**
 * Uploader controller
 */
const controlUploader = async () => {
    state.uploader = new Uploader(files);
};

/**
 * FolderList controller
 */
const controlFolderList = data => {
    state.folderList = new Folderlist();
    state.folderList.parseFolders(data);
    folderlistView.renderItems(state.folderList.folders);
};

elements.folderAddBtn.addEventListener('click', e => {
    e.preventDefault();
    if (state.folderList) {
        const folderName = elements.folderField.value;
        state.folderList.addFolder(state.login.username, folderName);
        folderlistView.renderItem(folderName);
    }
});

elements.folders.addEventListener('click', e => {
    if (e.target.matches('.playlists-list__item--close')) {
        let folderName = e.target.parentElement.textContent;
        folderName = folderName.substring(0, folderName.length - 1);
        state.folderList.removeFolder(state.login.username, folderName);
        folderlistView.removeItem(e.target);
    } else if (e.target.matches('.playlists-list__item')) {
        let folderName = e.target.textContent;
        folderName = folderName.substring(0, folderName.length - 1);
        state.folderList.setCurrentFolder(folderName);
        controlTrackList(state.folderList.currentFolder);
    }
});

/**
 * Tracklist controller
 */
const controlTrackList = async (folder) => {
    try {
        tracklistView.removeItems();
        const data = await request.getUserFolderData(state.login.username, folder);
        state.tracklist = new Tracklist(folder);
        state.tracklist.parseTracks(data);
        console.log(state.tracklist);
        tracklistView.renderItems(state.tracklist.tracks);
    } catch (error) {
        console.log(error);  
    }
};

elements.tracks.addEventListener('click', e => {
    if (e.target.matches('.tracks__item--close')) {
        let trackName = e.target.parentElement.textContent;
        trackName = trackName.substring(0, trackName.length - 1);
        state.tracklist.removeTrack(state.login.username, trackName);
        tracklistView.removeItem(e.target);
    } else if (e.target.matches('.tracks__item')) {
        //TODO
    }
});

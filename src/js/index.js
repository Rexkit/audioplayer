import '../sass/main.scss';
import { elements } from './views/base';
import Login from './models/Login';
import Uploader from './models/Uploader';
import Folderlist from './models/Folderlist';
import * as loginView from './views/loginView';
import * as uploaderView from './views/uploaderView';
import * as folderlistView from './views/folderlistView';
import * as request from './request';

/**
 * Global app state
 */
const state = {};

/**
 * Login controller
 */
const controlLogin = async (type) => {
    if (type == 'login') {
        const username = loginView.getUsername();
        state.login = new Login(username);
        console.log(state.login);
        loginView.clearLogin();
        loginView.renderLogin(type, username);
        try {
            const data = await request.getUserFolderData(username);
            console.log(data); //TODO
            controlFolderList(data);
        } catch (error) {
            console.log(error);
        }
    } else if (type == 'logout') {
        loginView.clearLogin();
        loginView.renderLogin(type);
        state.login.logout();
    }
}

elements.headerLogin.addEventListener('click', (e) => {
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
}

/**
 * FolderList controller
 */
const controlFolderList = async (data) => {
    state.folderList = new Folderlist();
    state.folderList.parseFolders(data);
    folderlistView.renderItems(state.folderList.folders);
}

elements.folderAddBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(state.folderList) {
        const folderName = elements.folderField.value;
        state.folderList.addFolder(folderName);
        folderlistView.renderItem(folderName);
    }
});

elements.folders.addEventListener('click', (e) => {
    if (e.target.matches('.playlists-list__item--close')) {
        let folderName = e.target.parentElement.textContent;
        folderName = folderName.substring(0, folderName.length - 1);
        console.log(folderName);
        state.folderList.removeFolder(folderName);
        e.target.parentElement.removeChild(e.target);
    }
});
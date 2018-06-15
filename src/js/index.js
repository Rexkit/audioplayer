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
        loginView.clearLogin();
        loginView.renderLogin(type, username);
        loginView.initialRender(type);
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
        loginView.initialRender(type);
        if (state.folderList) {
            folderlistView.removeItems();
            tracklistView.removeItems();
        }
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
const controlUploader = async (files) => {
    state.uploader = new Uploader(files);
    uploaderView.renderFileLength(files);
};

document.querySelector('.download-box__upload').addEventListener('change', e => {
    controlUploader(e.target.files);
});

//Upld handler
const handleUpload = async () => {
    try {
        if (state.uploader) {
            await state.uploader.uploadFiles(state.login.username, state.tracklist.currentPlaylist);
            tracklistView.renderItems(state.uploader.getFileNames());
            uploaderView.renderFileLength(state.uploader.files, true);
        }
    } catch (error) {
        console.log(error);
    }
}

elements.uploadFilesBtn.addEventListener('click', e => {
    handleUpload();
});

// Util evt listener for triggering file input elem
elements.selectFilesBtn.addEventListener('click', e => {
    const elem = document.querySelector('.download-box__upload');
    let evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	let canceled = !elem.dispatchEvent(evt);
});



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
        // clear tracklist if it contains tracks from removed folder
        if (state.tracklist && state.tracklist.currentPlaylist === folderName) {
            tracklistView.removeItems();
        }  
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

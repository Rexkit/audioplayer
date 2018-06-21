import '../sass/main.scss';
import { elements } from './views/base';
import Login from './models/Login';
import Uploader from './models/Uploader';
import Folderlist from './models/Folderlist';
import Tracklist from './models/Tracklist';
import Audioplayer from './models/Audioplayer';
import * as loginView from './views/loginView';
import * as uploaderView from './views/uploaderView';
import * as folderlistView from './views/folderlistView';
import * as tracklistView from './views/tracklistView';
import * as audioplayerView from './views/audioplayerView';
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
            controlTrackList('Main');
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
            tracklistView.renderItems(state.uploader.getFileNames(), state.tracklist.currentPlaylist, state.login.username);
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
    } else if (e.target.matches('.playlists-box__return, .playlists-box__return *')) {
        controlTrackList('Main');
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
        tracklistView.renderItems(state.tracklist.tracks, folder, state.login.username);
    } catch (error) {
        console.log(error);  
    }
};

elements.tracks.addEventListener('click', e => {
    if (e.target.matches('.tracks__item--close')) {
        let trackName = e.target.parentElement.dataset.src;
        trackName = trackName.substring(trackName.lastIndexOf('/')+1);
        console.log(trackName);
        state.tracklist.removeTrack(state.login.username, trackName);
        tracklistView.removeItem(e.target);
    } else if (e.target.matches('.tracks__item')) {
        //TODO
        let trackSrc = e.target.dataset.src;
        controlPlayer(elements.volumebar.value, trackSrc);
    }
});


/**
 * Audioplayer controller
 */
const controlPlayer = async (volume, src) => {
    state.player = new Audioplayer(volume, src);
    elements.playerSrc.src = state.player.getSrc();
    elements.player.load();
    elements.volumebar.value = elements.player.volume;
    console.log(state.player);
}

    
elements.player.onloadedmetadata = (e) => {
    state.player.duration = elements.player.duration;
    elements.timebar.max = elements.player.duration;
    console.log(state.player);
};

elements.play.addEventListener('click', () => {
    if (state.player) {
        elements.player[elements.player.paused ? 'play' : 'pause']();  //TODO
        // elements.play.toggleClass("fa-pause", !player.paused);
        // elements.play.toggleClass("fa-play", player.paused);
    }
});

elements.player.addEventListener("timeupdate", () => {
    audioplayerView.updateProgbar(elements.timebar, elements.player.currentTime);
    audioplayerView.updateTime(document.getElementById('time-current'), elements.player.currentTime);
});

elements.timebar.addEventListener('click', function(e) {
    let x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop,  // or e.offsetY
        clickedValue = x * this.max / this.offsetWidth;

    audioplayerView.updateProgbar(elements.timebar, clickedValue);
    if (state.player) {
        elements.player.currentTime = elements.player.duration / this.max * clickedValue;
        console.log(elements.player.currentTime);
    }
    
    console.log(x, y, clickedValue);
});

elements.volumebar.addEventListener('click', function(e) {
    let x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop,  // or e.offsetY
        clickedValue = x * this.max / this.offsetWidth;

    audioplayerView.updateProgbar(elements.volumebar, clickedValue);
    if(state.player) {
        state.player.setVolume(clickedValue);
        elements.player.volume = clickedValue / this.max;
    }
    console.log(x, y, clickedValue);
    console.log(state.player);
});
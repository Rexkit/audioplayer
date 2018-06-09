import '../sass/main.scss';
import { elements } from './views/base';
import Login from './models/Login';
import Uploader from './models/Uploader';
import * as loginView from './views/loginView';
import * as uploaderView from './views/uploaderView';

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
            const data = await state.login.getData();
            console.log(data); //TODO
        } catch (error) {
            console.log(error);
        }
    } else if (type == 'logout') {
        loginView.clearLogin();
        loginView.renderLogin(type);
        state.login.logout();
    }
}

/**
 * Uploader controller
 */
const controlUploader = async () => {
    state.uploader = new Uploader(files);
}

elements.headerLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.matches('.login__btn, .login__btn *')) {
        controlLogin('login');
    } else if (e.target.matches('.logout__btn, .logout__btn *')) {
        controlLogin('logout');
    }
});
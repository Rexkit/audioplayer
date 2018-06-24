import { elements } from './base';

export const getUsername = () => {
    return document.querySelector('.login__field').value;
};

export const renderLogin = (type, username) => {
    let markup;
    if (type == 'logout') {
        markup = `
            <form class="login">
                <input type="text" class="login__field" placeholder="Enter Your Username">
                <button class="btn login__btn">
                    <span>Log In</span>
                </button>
            </form>
        `;
    } else if (type == 'login') {
        markup = `
            <div class="logged-box">
                <p class="logged-box__greetings">Logged as ${username}</p>
                <button class="btn logout__btn">
                    <span>Log Out</span>
                </button>
            </div>
        `;
    }
    elements.headerLogin.insertAdjacentHTML('beforeend', markup);
};

export const clearLogin = (type) => {
    elements.headerLogin.innerHTML = '';
};

export const initialRender = (type) => {
    if (type === 'logout') {
        elements.main.style.display = 'none';
    } else if (type === 'login') {
        elements.main.style.display = 'initial';
    }
};
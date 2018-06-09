import { elements } from './base';

export const renderItem = (item) => {
    const markup = `
    <li class="playlists-list__item">${item}<span class="playlists-list__item--close">X</span></li>
    `;
    elements.userFolders.insertAdjacentHTML('beforeend', markup);
}

export const renderItems = (items) => {
    items.forEach(el => {
        renderItem(el);
    });
}

import { elements } from './base';
import { serverURL } from '../settings';

export const formatName = (item) => {
    const newItem = item.substring(0, item.lastIndexOf('.'));
    return newItem;
}

export const progressRender = (str) => {
    if (str >= 100) {
        elements.progress.textContent = 'tracks';
    } else {
        elements.progress.textContent = `${str}%`;
    }
}

export const renderItem = (item, folder, username, selected) => {
    const src = `${serverURL}uploads/${username}/${folder}/${item}`;
    const markup = `
        <li class="tracks__item" data-src="${src}">${formatName(item)}<span class="tracks__item--close">X</span></li>
        `;
        // ${src === elements.playerSrc.src ? 'selected' : ''}
    elements.tracks.insertAdjacentHTML('beforeend', markup);
};

export const renderItems = (items, folder, username, currentPlaying) => {
    items.forEach((el) => {
        renderItem(el, folder, username);
    });
};

export const removeItem = (item) => {
    item.parentElement.parentElement.removeChild(item.parentElement);
};

export const removeItems = () => {
    elements.tracks.innerHTML = '';
}
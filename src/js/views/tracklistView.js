import { elements } from './base';

export const renderItem = (item) => {
    const markup = `
        <li class="tracks__item">${item}<span class="tracks__item--close">X</span></li>
        `;
    elements.tracks.insertAdjacentHTML('beforeend', markup);
};

export const renderItems = (items) => {
    items.forEach((el) => {
        renderItem(el);
    });
};

export const removeItem = (item) => {
    item.parentElement.parentElement.removeChild(item.parentElement);
};

export const removeItems = () => {
    elements.tracks.innerHTML = '';
}
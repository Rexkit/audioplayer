import { elements } from './base';

export const updateProgbar = (bar, val) => {
    bar.value = val;
}

export const updateTime = (el, time) => {
    el.text = getTime(time);
}

export const getTime = (t) => {
    let m = ~~(t / 60), s = ~~(t % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}
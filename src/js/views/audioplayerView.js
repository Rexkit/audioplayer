import { elements } from './base';

export const updateProgbar = (bar, val) => {
    bar.value = val;
}

export const updateTime = (el, time) => {
    el.textContent = getTime(time);
}

export const playerPauseToogle = () => {
    elements.player[elements.player.paused ? 'play' : 'pause']();  //TODO
    if (elements.player.paused) {
        elements.play.textContent = 'play_arrow';
    } else {
        elements.play.textContent = 'pause';
    }
}

export const defaultState = () => {
    elements.play.textContent = 'play_arrow';
    elements.curTime.textContent = '00:00';
    elements.allTime.textContent = '00:00';
    elements.mute.textContent = 'volume_up';
    elements.timebar.value = '0';
    elements.volumebar.value = '1';
};

export const getTime = (t) => {
    let m = ~~(t / 60), s = ~~(t % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}
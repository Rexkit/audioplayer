import { runInThisContext } from "vm";

export default class Audioplayer {
    constructor(volume, src) {
        this.src = src;
        this.duration = 0;
        this.volume = volume;
    }

    setMetaData(dur) {
        this.duration = duration;
    }

    setVolume(vol) {
        this.volume = vol;
    }

    getSrc() {
        return this.src;
    }
}
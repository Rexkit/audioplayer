import * as request from '../request';

export default class TrackList {
    constructor(curFolder) {
        this.currentPlaylist = curFolder;
        this.tracks = [];
        this.currentElement;
    }

    parseTracks(data) {
        const newTracks = [];
        //Check if track
        data.forEach(el => {
            if (el.indexOf('.') !== -1) {
                newTracks.push(el);
            }
        });
        this.tracks = newTracks;
        console.log(this.tracks);
    }

    addTrack(name) {
        this.tracks.push(name);
    }

    async removeTrack(username, name) {
        try {
            await request.removeRemoteTrack(username, this.currentPlaylist, name);
            const ix = this.tracks.findIndex(el => el === name);
            this.tracks.splice(ix, 1);
        } catch (error) {
            console.log(error);
        }
    }
}
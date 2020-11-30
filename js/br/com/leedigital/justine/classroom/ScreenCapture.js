
/**
 * @author araujo921
 */
export default class ScreenCapture {

    /**
     * @type {MediaRecorder}
     */
    mediaRecorder = null;

    /**
     * @type {HTMLAnchorElement}
     */
    anchor = document.querySelector('a[data-ld-title="download-anchor-element"]');

    /**
     * @type {HTMLVideoElement}
     */
    video = document.querySelector('video[data-ld-src="cam-video-element"]');

    paused = false;

    capture = false;

    /**
     * @type {Map<String, Array<Function>>}
     */
    #map = new Map();

    constructor() {
        this.enableCamera = false;
    }

    /**
     * 
     * @param {Function} handler 
     */
    addStopHandler(handler) {
        const map = this.#map;
        const handlers = map.get("stop");
        if (handlers) {
            handlers.push(handler);
        } else {
            map.set("stop", [handler]);
        }
    }

    /**
     * 
     * @param {String} evt 
     */
    fireEvent(evt) {
        const handlers = this.#map.get(evt);
        if (handlers) {
            for (let i = handlers.length - 1; i >= 0; i--) {
                const handler = handlers[i];
                handler(this);
            }
        }
    }


    async start() {
        if (!this.capture) {
            const anchor = this.anchor;
            anchor.style.display = "none";
            this.capture = true;
            const enableCamera = this.enableCamera;
            const cameraAndAudioStream = await navigator.mediaDevices.getUserMedia({ video: enableCamera, audio: { echoCancellation: true } });
            const desktopMediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            this.video.srcObject = cameraAndAudioStream;
            this.video.muted = true;
            const context = new AudioContext();
            const destination = context.createMediaStreamDestination();
            const sourceAudio = context.createMediaStreamSource(cameraAndAudioStream);
            const gain = context.createGain();
            gain.gain.value = 1;
            sourceAudio.connect(gain).connect(destination);
            // if (desktopMediaStream.getAudioTracks().length > 0) {
            //     const sourceDesktopAudio = context.createMediaStreamSource(desktopMediaStream);
            //     const gain2 = context.createGain();
            //     gain2.gain.value = 1;
            //     sourceDesktopAudio.connect(gain2).connect(destination);
            // }
            const tracks = [
                ...desktopMediaStream.getVideoTracks(),
                ...destination.stream.getAudioTracks()

            ];
            const stream = new MediaStream(tracks);
            this.mediaRecorder = new MediaRecorder(stream);
            stream.getVideoTracks()[0].onended = () => {
                this.stop();
            };
            const chunks = [];
            this.mediaRecorder.ondataavailable = function (evt) {
                chunks.push(evt.data);
            };
            this.mediaRecorder.onstop = () => {
                console.log("stopping capture");
                let tracks = desktopMediaStream.getTracks();
                tracks.forEach(track => track.stop());
                tracks = cameraAndAudioStream.getTracks();
                tracks.forEach(track => track.stop());
                this.video.srcObject = null;
                const blob = new Blob(chunks, { mimeType: 'video/mp4' });
                chunks.length = 0;
                // const anchor = this.anchor;
                anchor.href = window.URL.createObjectURL(blob);
                anchor.download = "video.mp4";
                anchor.click();
                this.mediaRecorder = null;
            };

            this.mediaRecorder.onpause = () => {
                this.paused = true;
            };

            this.mediaRecorder.onresume = () => {
                this.paused = false;
            };
            this.mediaRecorder.start();
        }
    }

    pause() {
        if (this.capture) {
            this.mediaRecorder.pause();
        }
    }

    async resume() {
        if (this.capture) {
            this.mediaRecorder.resume();
        }
    }

    stop() {
        if (this.capture) {
            this.capture = false;
            this.mediaRecorder.stop();
            this.anchor.style.display = "inline-block";
            this.fireEvent("stop");
        }
    }

    reset() {
        this.capture = false;
    }

    get capturing() {
        return this.capture;
    }

    get paused() {
        return this.paused;
    }
}

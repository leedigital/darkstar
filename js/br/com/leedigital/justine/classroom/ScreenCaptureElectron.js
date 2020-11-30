import ScreenCapture from "./ScreenCapture.js";

/**
 * @author araujo921
 */
export default class ScreenCaptureElectron extends ScreenCapture {

    #constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop'
            }
        }
    };

    constructor() {
        super();
    }

    async start() {
        if (!this.capture) {
            this.capture = true;
            const anchor = this.anchor;
            anchor.style.display = "none";
            const enableCamera = this.enableCamera;
            const { desktopCapturer } = require('electron');
            desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
                for (const source of sources) {
                    if (source.name === document.title) {
                        const desktopMediaStream = await navigator.mediaDevices.getUserMedia(this.#constraints);
                        const cameraAndAudioStream = await navigator.mediaDevices.getUserMedia({ video: enableCamera, audio: { echoCancellation: true } });
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
                        break;
                    }
                }
            });
        }
    }

}

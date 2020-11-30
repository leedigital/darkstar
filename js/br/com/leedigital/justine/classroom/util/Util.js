/**
 * @type {HTMLDivElement}
 */
const progressBar = document.querySelector('div[data-ld-src="progress-bar"]');

/**
 * @type {HTMLDivElement}
 */
const statusBarElement = document.querySelector('div[data-ld-src="status-bar-panel"]');

const timer = {};

const statusBarFunction = function () {
    const tmp = timer.now;
    const now = Date.now();
    const delta = now - tmp;
    const divisor = 1000 * 7;
    const time = Math.floor(delta / divisor);
    // console.log(time, delta/divisor);
    if (time < 1 || Number.parseFloat(statusBarElement.style.opacity) > 0) {
        statusBarElement.style.opacity = `${1 - delta / divisor}`;
        requestAnimationFrame(statusBarFunction);
    }
};

/**
 * @author araujo021
 */
class Util {

    constructor() {
    }

    showStatusBar(message) {
        statusBarElement.style.opacity = '1';
        statusBarElement.textContent = message;
        timer.now = Date.now();
        requestAnimationFrame(statusBarFunction);
    }

    alert(message) {
        window.alert(message);
    }

    showProgressBar() {
        progressBar.style.display = "inline-block";
    }

    hiddenProgressBar() {
        progressBar.style.display = "none";
    }

    getHexColorFrom(element) {
        const rgb = window.getComputedStyle(element).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        const hex = `${Number.parseInt(rgb[1]).toString(16)}${Number.parseInt(rgb[2]).toString(16)}${Number.parseInt(rgb[3]).toString(16)}`;
        return `#${hex.length === 3 ? hex + hex : hex}`;
    }

    get desktop() {
        return !!window.process;
    }

    get web() {
        return !window.process;
    }

    get userAgent() {
        return navigator.userAgent.toLowerCase();
    }

    get linux() {
        return this.userAgent.indexOf('linux') !== -1;
    }

    get windows() {
        return this.userAgent.indexOf('windows') !== -1;
    }

    get mobile() {
        return this.userAgent.indexOf('mobile') !== -1;
    }

    get x64() {
        if (this.windows) {
            return this.userAgent.indexOf('x64') !== -1;
        } else if (this.linux) {
            return this.userAgent.indexOf('x86_64') !== -1;
        }
        return navigator.platform.toLowerCase().indexOf('64') !== -1;
    }

    get x32() {
        return navigator.platform.toLowerCase().indexOf('32') !== -1;
    }

    async isMicrophoneDenied() {
        const permissionStatus = await navigator.permissions.query(
            // { name: 'camera' }
            { name: 'microphone' }
            // { name: 'geolocation' }
            // { name: 'notifications' } 
            // { name: 'midi', sysex: false }
            // { name: 'midi', sysex: true }
            // { name: 'push', userVisibleOnly: true }
            // { name: 'push' } // without userVisibleOnly isn't supported in chrome M45, yet
        );

        // granted, denied, prompt
        return permissionStatus.state === "denied";
    }

}

export const UTIL = new Util;

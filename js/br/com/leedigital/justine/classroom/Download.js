import { UTIL } from "./util/Util.js";

/**
 * @author araujo921
 */
export default class Download {

    constructor() {
        const doc = document;
        const downloadJustineElementPanel = doc.querySelector('label[data-ld-src="download-justine-panel"]');
        /**
         * @type {HTMLAnchorElement}
         */
        const downloadJustineElement = doc.querySelector('a[data-ld-src="download-justine-element"]');
        downloadJustineElementPanel.onclick = function (evt) {
            const target = evt.target;
            const dataLdSrc = target.getAttribute('data-ld-src');
            if (dataLdSrc === 'download-justine-panel') {
                downloadJustineElementPanel.style.display = 'none';
            } else if (dataLdSrc === 'download-justine-element') {
                downloadJustineElement.click();
            }
        };
        if (!UTIL.mobile) {
            if (UTIL.linux || UTIL.windows) {
                downloadJustineElementPanel.style.display = 'inline-block';
                if (UTIL.linux) {
                    if (UTIL.x64) {
                        downloadJustineElement.href = 'http://justine.linux64.leedigital.com.br';
                    } else if (UTIL.x32) {
                        downloadJustineElement.href = 'http://justine.linux32.leedigital.com.br';
                    }
                } else {
                    if (UTIL.windows) {
                        if (UTIL.x64) {
                            downloadJustineElement.href = 'http://justine.windows64.leedigital.com.br';
                        } else if (UTIL.x32) {
                            downloadJustineElement.href = 'http://justine.windows32.leedigital.com.br';
                        }
                    }
                }
            }
        }
    }


}

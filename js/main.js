import ContentPanel from "./ContentPanel.js";
import { UTIL } from "./br/com/leedigital/justine/classroom/util/Util.js";
import Download from "./br/com/leedigital/justine/classroom/Download.js";

{
    const contentPanel = new ContentPanel();
    window.onresize = function (evt) {
        // handlerResize();
    };

    const handlerResize = function () {
        const boundingClientRect = contentPanel.headerElement.getBoundingClientRect();
        const height = window.innerHeight - boundingClientRect.height;
        contentPanel.contentElement.style.height = `${height}px`;
    };

    setInterval(handlerResize, 1000);
    // handlerResize();
    document.oncontextmenu = () => {
        return false;
    };
    if (UTIL.desktop) {
        const remote = require('electron').remote;
        const currentWindow = remote.getCurrentWindow();
        // currentWindow.webContents.openDevTools();
        window.addEventListener("keydown", (evt) => {
            const keyCode = evt.keyCode;
            const q = 81,
                f = 70;
            if (evt.ctrlKey) {
                switch (keyCode) {
                    case q:
                        currentWindow.close();
                        break;
                    case f:
                        currentWindow.setFullScreen(!currentWindow.isFullScreen());
                        break;
                }
            }
        });
    } else if (UTIL.web) {
        // console.log(navigator.userAgent);
        // new Download;
    }
    // require('electron').remote.getCurrentWindow().webContents.openDevTools();

    const ready = () => {
        if (document.readyState == "complete") {
            UTIL.hiddenProgressBar();
        } else {
            setTimeout(ready, 1000);
        }
    };

    setTimeout(ready, 1000);
}

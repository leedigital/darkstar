import PDF from "./br/com/leedigital/justine/classroom/PDF.js";
import Document from "./br/com/leedigital/justine/classroom/Document.js";
import { UTIL } from "./br/com/leedigital/justine/classroom/util/Util.js";
import ImageFile from "./br/com/leedigital/justine/classroom/ImageFile.js";
import ScreenCapture from "./br/com/leedigital/justine/classroom/ScreenCapture.js";
import ScreenCaptureElectron from "./br/com/leedigital/justine/classroom/ScreenCaptureElectron.js";

let recentColorIndex = 1;
let recentColorElement = null;

/**
 * @author araujo921
 */
export default class ContentPanel {
    constructor() {
        /**
         * @type {HTMLElement}
         */
        this.headerElement =
            this.contentElement =
            this.tooltipElement =
            this.pageElement =
            this.pageEndElement =
            this.lineWidthSliderThumbElement =
            this.eraserSliderThumbElement =
            this.opacityColorSliderThumbElement = null;
        /**
         * @type {HTMLInputElement}
         */
        this.zoomSliderElement =
            this.pageStartElement =
            this.handEditElement =
            this.arrowEditElement =
            this.dashedArrowElement =
            this.lineEditElement =
            this.dashedLineEditElement =
            this.lineWidthSliderElement =
            this.colorPickerElement =
            this.eraserElement =
            this.eraserSliderElement =
            this.opacityColorSliderElement = null;
        /**
         * @type {Document}
         */
        this.document = null;
        const headerElement = document.querySelector('div[data-ld-src="hdr-mst-pnl"');
        /**@type {HTMLDivElement} */
        const contentElement = document.querySelector('div[data-ld-src="cvs-pnl"]');
        const tooltipElement = document.querySelector('label[data-ld-src="zoom-tooltip"]');
        const pageElement = document.querySelector('div[data-ld-src="page-element"]');
        const zoomSliderElement = headerElement.querySelector('input[data-ld-src="sld-zoom"]');
        const lineWidthSliderThumbElement = document.querySelector('label[data-ld-src="line-width-slider-thumb"]');
        /**
         * @type {HTMLInputElement}
         */
        const pageStartElement = pageElement.querySelector('input[data-ld-src="page-start"]');
        const pageEndElement = pageElement.querySelector('label[data-ld-src="page-end"]');
        const handEditElement = headerElement.querySelector('input[data-ld-src="input-hand-draw-edit"]');
        const arrowEditElement = headerElement.querySelector('input[data-ld-src="input-arrow-draw-edit"]');
        const lineEditElement = headerElement.querySelector('input[data-ld-src="input-line-draw-edit"]');
        const dashedLineEditElement = headerElement.querySelector('input[data-ld-src="dashed-line-draw-edit"]');
        const lineWidthSliderElement = document.querySelector('input[data-ld-src="line-width-slider"]');
        const colorPickerElement = document.querySelector('input[data-ld-src="color-picker"]');
        const eraserElement = document.querySelector('input[data-ld-src="input-eraser-edit"]');
        const eraserSliderElement = document.querySelector('input[data-ld-src="eraser-slider"]');
        const eraserSliderThumbElement = document.querySelector('label[data-ld-src="eraser-slider-thumb"]');
        const opacityColorSliderElement = headerElement.querySelector('input[data-ld-src="opacity-color-slider"]');
        const opacityColorSliderThumbElement = headerElement.querySelector('label[data-ld-src="opacity-color-slider-thumb"]');
        Object.defineProperties(this, {
            headerElement: {
                get() {
                    return headerElement;
                }
            },
            contentElement: {
                get() {
                    return contentElement;
                }
            },
            tooltipElement: {
                get() {
                    return tooltipElement;
                }
            },
            pageElement: {
                get() {
                    return pageElement;
                }
            },
            pageStartElement: {
                /**
                 * @returns {HTMLInputElement}
                 */
                get() {
                    return pageStartElement;
                }
            },
            pageEndElement: {
                get() {
                    return pageEndElement;
                }
            },
            zoomSliderElement: {
                get() {
                    return zoomSliderElement;
                }
            },
            handEditElement: {
                get() {
                    return handEditElement;
                }
            },
            arrowEditElement: {
                get() {
                    return arrowEditElement;
                }
            },
            lineEditElement: {
                get() {
                    return lineEditElement;
                }
            },
            dashedLineEditElement: {
                get() {
                    return dashedLineEditElement;
                }
            },
            lineWidthSliderThumbElement: {
                get() {
                    return lineWidthSliderThumbElement;
                }
            },
            lineWidthSliderElement: {
                get() {
                    return lineWidthSliderElement;
                }
            },
            colorPickerElement: {
                get() {
                    return colorPickerElement;
                }
            },
            eraserElement: {
                get() {
                    return eraserElement;
                }
            },
            eraserSliderElement: {
                get() {
                    return eraserSliderElement;
                }
            },
            eraserSliderThumbElement: {
                get() {
                    return eraserSliderThumbElement;
                }
            },
            opacityColorSliderElement: {
                get() {
                    return opacityColorSliderElement;
                }
            },
            opacityColorSliderThumbElement: {
                get() {
                    return opacityColorSliderThumbElement;
                }
            }
        });
        headerElement.onclick = this.clickHandler.bind(this);
        contentElement.onmouseenter = (evt) => {
            evt.target.focus();
        };
        contentElement.onscroll = this.scrollHandler.bind(this);
        pageStartElement.onkeyup = this.pageStartHandler.bind(this);
        this.zoomSliderElement.oninput = this.zoomHandler.bind(this);
        this.lineWidthSliderElement.oninput = this.lineWidthSliderHandler.bind(this);
        this.colorPickerElement.oninput = this.colorPickerHandler.bind(this);
        this.eraserSliderElement.oninput = this.eraserSliderHandler.bind(this);
        this.opacityColorSliderElement.oninput = this.opacityColorSliderHandler.bind(this);

        this.zoomTooltipHandler();
        this.lineWidthSliderHandler();
        this.eraserSliderHandler();
        this.opacityColorSliderHandler();
        /**
         * @type {HTMLInputElement[]}
         */
        this.recentColorsArray = document.querySelectorAll('input[name="recent-color"]');
        for (let i = 0, len = this.recentColorsArray.length; i < len; i++) {
            this.recentColorsArray[i].oninput = this.recentColorHandler.bind(this);
        }
        recentColorElement = this.recentColorsArray[0].nextElementSibling;
        const clearElement = headerElement.querySelector('span[data-ld-src="clear-page-panel"]');
        clearElement.onclick = () => {
            this.document.clear();
        };
        this.screenCapture = UTIL.desktop ? new ScreenCaptureElectron : new ScreenCapture();
        /**
         * @type {HTMLInputElement}
         */
        const enableCameraElement = headerElement.querySelector('input[id="cam"]');
        const recInnerPanelElement = headerElement.querySelector('span[data-ld-src="rec-inner-panel"]');
        const startCaptureElement = headerElement.querySelector('button[data-ld-src="rec-start-button"]');
        const pauseCaptureElement = headerElement.querySelector('button[data-ld-src="rec-pause-button"]');
        const stopCaptureElement = headerElement.querySelector('button[data-ld-src="rec-stop-button"]');
        pauseCaptureElement.paused = false;
        const defaultStartCaptureElementText = startCaptureElement.textContent;
        startCaptureElement.onclick = async () => {
            if ((await UTIL.isMicrophoneDenied())) {
                UTIL.showStatusBar("Para gravar um vídeo, você precisa permite acesso ao microfone");
                return;
            }
            this.screenCapture.enableCamera = enableCameraElement.checked;
            enableCameraElement.disabled = true;
            try {
                await this.screenCapture.start();
                startCaptureElement.textContent = "Gravando";
                // recInnerPanelElement.style.left = "-430px";
            } catch (error) {
                enableCameraElement.disabled = false;
                this.screenCapture.reset();
                startCaptureElement.textContent = defaultStartCaptureElementText;
                UTIL.showStatusBar(error);
                console.error(error);
            }
        };
        pauseCaptureElement.onclick = () => {
            if (this.screenCapture.capturing) {
                if (!pauseCaptureElement.paused) {
                    this.screenCapture.pause();
                    pauseCaptureElement.textContent = "Retomar";
                    pauseCaptureElement.paused = true;
                } else {
                    this.screenCapture.resume();
                    pauseCaptureElement.paused = false;
                    pauseCaptureElement.textContent = "Pausar";
                }
            }
        };
        stopCaptureElement.onclick = () => {
            this.screenCapture.stop();
        };
        this.screenCapture.addStopHandler(() => {
            enableCameraElement.disabled = false;
            startCaptureElement.textContent = defaultStartCaptureElementText;
            recInnerPanelElement.style.left = null;
        });
        document.addEventListener("keydown", (evt) => {
            if (evt.altKey && evt.key.toLowerCase() === 'enter') {
                document.body.requestFullscreen();
            }
        });
    }


    /**
     * 
     * @param {KeyboardEvent} evt 
     */
    pageStartHandler(evt) {
        const target = evt.target;
        const document = this.document;
        const keyCode = evt.keyCode;
        if (target && document && keyCode === 13) {
            document.changePage(target.value - 1);
        }
    }

    /**
     * 
     * @param {Event} evt 
     */
    scrollHandler(evt) {
        evt.preventDefault();
        /**
         * @type {HTMLDivElement}
         */
        const target = evt.target;
        this.document.pageManager(target);
    }


    /**
     * 
     * @param {MouseEvent} evt 
     */
    clickHandler(evt) {
        /**
         * @type {HTMLElement}
         */
        const target = evt.target;
        const dataLdSrc = target.getAttribute('data-ld-src');
        if (dataLdSrc === 'open-file-lbl') {
            this.openFileHandler(target.nextElementSibling);
        }
        // /*
        else if (dataLdSrc === 'zoom-out') {
            const zoomElement = this.zoomSliderElement;
            const minValue = Number.parseFloat(zoomElement.min);
            const step = Number.parseFloat(zoomElement.step);
            const value = zoomElement.valueAsNumber;
            const tmp = (value - step);
            if (tmp >= minValue) {
                zoomElement.value = tmp;
                this.zoomHandler(evt);
            }
        } else if (dataLdSrc === 'zoom-in') {
            const zoomElement = this.zoomSliderElement;
            const maxValue = Number.parseFloat(zoomElement.max);
            const step = Number.parseFloat(zoomElement.step);
            const value = zoomElement.valueAsNumber;
            const tmp = (value + step);
            if (tmp <= maxValue) {
                zoomElement.value = tmp;
                this.zoomHandler(evt);
            }
        }//*/
    }

    /**
     *Handler the zoom tooltip. 
     */
    zoomTooltipHandler() {
        const tooltipElement = this.tooltipElement;
        const zoomSliderElement = this.zoomSliderElement;
        const maxValue = Number.parseFloat(zoomSliderElement.max);
        const minValue = Number.parseFloat(zoomSliderElement.min);
        // const stepValue = Number.parseFloat(zoomSliderElement.step);
        const value = (74 / (maxValue - minValue) * (zoomSliderElement.valueAsNumber));
        // console.log(zoomSliderElement.getBoundingClientRect().width, maxValue, value);
        tooltipElement.style.left = `${value}px`;
        tooltipElement.textContent = zoomSliderElement.value;
    }

    lineWidthSliderHandler() {
        const lineWidthSliderThumbElement = this.lineWidthSliderThumbElement;
        const lineWidthSliderElement = this.lineWidthSliderElement;
        const maxValue = Number.parseFloat(lineWidthSliderElement.max);
        const minValue = Number.parseFloat(lineWidthSliderElement.min);
        const value = 91 / (maxValue - minValue) * lineWidthSliderElement.valueAsNumber;
        lineWidthSliderThumbElement.style.left = `${value}px`;
        lineWidthSliderThumbElement.textContent = lineWidthSliderElement.value;
    }

    eraserSliderHandler() {
        const eraserSliderThumbElement = this.eraserSliderThumbElement;
        const eraserSliderElement = this.eraserSliderElement;
        const maxValue = Number.parseFloat(eraserSliderElement.max);
        const minValue = Number.parseFloat(eraserSliderElement.min);
        const value = 91 / (maxValue - minValue) * eraserSliderElement.valueAsNumber;
        eraserSliderThumbElement.style.left = `${value}px`;
        eraserSliderThumbElement.textContent = eraserSliderElement.value;
    }

    opacityColorSliderHandler() {
        const opacityColorSliderThumbElement = this.opacityColorSliderThumbElement;
        const opacityColorSliderElement = this.opacityColorSliderElement;
        const maxValue = Number.parseFloat(opacityColorSliderElement.max);
        const minValue = Number.parseFloat(opacityColorSliderElement.min);
        const value = 91 / (maxValue - minValue) * opacityColorSliderElement.valueAsNumber;
        opacityColorSliderThumbElement.style.left = `${value}px`;
        opacityColorSliderThumbElement.textContent = opacityColorSliderElement.value;
    }

    /**
     * 
     * @param {InputEvent} evt 
     */
    zoomHandler(evt) {
        this.zoomTooltipHandler();
        if (this.document) {
            const target = evt.target;
            this.document.update();
            const pageNumber = this.pageStartElement.valueAsNumber;
            setTimeout(() => {
                this.document.changePage(pageNumber - 1);
                const el = target.parentElement.querySelector('input[data-ld-src="sld-zoom"]');
                el.focus();
            }, 1000);
        }
    }


    /**
     * 
     * @param {HTMLInputElement} element 
     */
    openFileHandler(element) {
        element.click();
        element.onchange = (evt) => {
            /**
             * @type {HTMLInputElement}
             */
            const element = evt.target;
            // const value = element.value;
            const file = element.files[0];
            const type = file.type;
            const regex = /(png|jpg|jpeg)$/gi;
            const thiz = this;
            const fileName = file.name;
            let fileReader = null;
            if (type.endsWith("/pdf")) {
                fileReader = new FileReader();
                fileReader.onload = function () {
                    UTIL.showProgressBar();
                    thiz.document = new PDF(new Uint8Array(this.result), thiz);
                    thiz.document.title = fileName;
                };
            } else if (regex.test(type)) {
                fileReader = new FileReader();
                fileReader.onload = function () {
                    UTIL.showProgressBar();
                    thiz.document = new ImageFile(new Uint8Array(this.result), thiz, type);
                    thiz.document.title = fileName;
                };

            }
            if (fileReader) {
                fileReader.readAsArrayBuffer(file);
            }
            element.value = "";
        };
    }

    /**
     * 
     * @param {InputEvent} evt 
     */
    colorPickerHandler(evt) {
        /**
         * @type {HTMLInputElement}
         */
        const target = evt.target;
        const value = target.value;
        const inputElement = this.recentColorsArray[recentColorIndex++];
        inputElement.checked = true;
        const element = inputElement.nextElementSibling;
        recentColorElement = element;
        element.style.backgroundColor = value;
        if (recentColorIndex > 6) {
            recentColorIndex = 1;
        }
    }

    recentColorHandler(evt) {
        recentColorElement = evt.target.nextElementSibling;
    }

    get currentColor() {
        return window.getComputedStyle(recentColorElement).backgroundColor;
    }

    get zoom() {
        return this.zoomSliderElement.value;
    }

    get eraser() {
        return this.eraserElement.checked;
    }

    get opacityColorValue() {
        return this.opacityColorSliderElement.valueAsNumber / 100;
    }

    reset() {
        this.zoomSliderElement.value = 1;
        this.zoomTooltipHandler();
    }

}

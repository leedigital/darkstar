import ContentPanel from "../../../../../ContentPanel.js";
import Page from "./Page.js";
import { UTIL } from "./util/Util.js";

/**
 * @author araujo921
 */
export default class Document {

    /**
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @param {ContentPanel} contentPanel
     */
    constructor(arrayBuffer, contentPanel) {
        /**
         * @type {ContentPanel}
         */
        this.contentPanel = null;
        this.title = "";
        this.scrollTop = 0;
        /**
         * @type {Page[]}
         */
        this.pages = [];

        Object.defineProperties(this, {
            contentPanel: {
                get() {
                    return contentPanel;
                }
            }
        });
        this.init(arrayBuffer, contentPanel);
        window.onkeydown =
            /**
             * @param {KeyboardEvent} evt
             */
            (evt) => {
                if (evt.ctrlKey) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                    const currentPage = this.currentPage;
                    const s = 83;
                    const arrowRight = 39;
                    const arrowLeft = 37;
                    const keyCode = evt.keyCode;
                    if (evt.shiftKey) {
                        if (s === keyCode) {
                            this.saveAll();
                        }
                    } else {
                        if (currentPage) {
                            const z = 90;
                            const y = 89;
                            const printScreen = 44;
                            switch (keyCode) {
                                case z:
                                    currentPage.undo();
                                    break;
                                case y:
                                    currentPage.redo();
                                    break;
                                case s:
                                    this.save();
                                    break;
                                case printScreen:
                                    currentPage.screenshot.capture();
                                    break;
                                case arrowRight:
                                    this.changePage(currentPage.number);
                                    break;
                                case arrowLeft:
                                    this.changePage(currentPage.number - 2);
                                    break;
                            }
                        }
                    }
                }
            };
    }

    /** 
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @param {ContentPanel} contentPanel
     */
    init(arrayBuffer, contentPanel) {
    }

    get headerElement() {
        return this.contentPanel.headerElement;
    }

    get contentElement() {
        return this.contentPanel.contentElement;
    }

    /**
     * @returns {HTMLDivElement}
     */
    get innerContentElementPanel() {
        return this.contentElement.firstElementChild;
    }

    /**
     * @returns {HTMLInputElement}
     */
    get pageStartElement() {
        return this.contentPanel.pageStartElement;
    }

    get pageHeight() {
        const element = this.innerContentElementPanel;
        return Math.floor(element.scrollHeight / this.pages.length);
    }

    get currentPage() {
        const index = this.contentPanel.pageStartElement.valueAsNumber - 1;
        if (index >= 0 && index < this.pages.length) {
            return this.pages[index];
        }
        return null;
    }

    update() { }

    /**
     * @param {HTMLDivElement} element
     */
    pageManager(element = null) {
        this.contentPanel.pageEndElement.textContent = this.pages.length;
        if (element) {
            const scroll = element.scrollTop;
            const pageIndex = Math.floor(scroll / this.pageHeight) + 1;
            const pageHeight = this.pageHeight * pageIndex - this.contentElement.offsetHeight;
            this.pageStartElement.valueAsNumber = pageIndex;
            const pageLenth = this.pages.length;
            const previousIndex = pageIndex - 2;
            const currentIndex = pageIndex - 1;
            const nextIndex = pageIndex;
            if (previousIndex >= 0 && previousIndex < pageLenth) {
                if (scroll > this.pageHeight * previousIndex) {
                    this.pages[previousIndex].hidden();
                }
            }
            if (currentIndex >= 0 && currentIndex < pageLenth) {
                this.pages[currentIndex].show();
            }
            if (element.scrollTop > pageHeight) {
                if (nextIndex >= 0 && nextIndex < pageLenth) {
                    this.pages[nextIndex].show();
                }
            } else {
                if (nextIndex > 0 && nextIndex < pageLenth) {
                    this.pages[nextIndex].hidden();
                }
            }
        }
    }

    /**
     * 
     * @param {Number} number 
     */
    changePage(number) {
        if (number >= 0 && number < this.pages.length) {
            this.pages[number].focus();
        } else {
            UTIL.alert("Número de página inválido ");
            this.pageManager(this.contentElement);
        }
    }

    /**
     * @returns {boolean}
     */
    get isHandEdit() {
        return this.contentPanel.handEditElement.checked;
    }

    /**
     * @returns {boolean}
     */
    get isArrowEdit() {
        return this.contentPanel.arrowEditElement.checked;
    }

    /**
     * @returns {boolean}
     */
    get isLineEdit() {
        return this.contentPanel.lineEditElement.checked;
    }

    /**
     * @returns {boolean}
     */
    get isDashedLineEdit() {
        return this.contentPanel.dashedLineEditElement.checked;
    }

    /**
     * @return {Number}
     */
    get lineWidth() {
        return this.contentPanel.lineWidthSliderElement.valueAsNumber;
    }

    get currentColor() {
        return this.contentPanel.currentColor;
    }

    get eraser() {
        return this.contentPanel.eraser;
    }

    get eraserLength() {
        return this.contentPanel.eraserSliderElement.valueAsNumber;
    }

    get opacityColorValue() {
        return this.contentPanel.opacityColorValue;
    }

    clear() {
        const page = this.currentPage;
        if (page) {
            page.clear();
            page.clearCache();
        }
    }

    save() {
        const currentPage = this.currentPage;
        currentPage.save();
        UTIL.showStatusBar("Página atual foi salva com sucesso");
        console.log("saved current page");
    }

    saveAll() {
        const pages = this.pages;
        for (const page of pages) {
            page.save();
        }
        UTIL.showStatusBar("Todas as páginas foram salvas com sucesso");
        console.log("saved all pages");
    }

}

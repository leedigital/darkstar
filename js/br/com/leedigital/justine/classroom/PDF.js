import Document from "./Document.js";
import ContentPanel from "../../../../../ContentPanel.js";
import Page from "./Page.js";
import { UTIL } from "./util/Util.js";

/**
 * @author araujo921
 */
export default class PDF extends Document {
    /**
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @param {ContentPanel} contentPanel
     */
    constructor(arrayBuffer, contentPanel) {
        super(arrayBuffer, contentPanel);
    }

    /**
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @param {ContentPanel} contentPanel 
     * @override
     */
    init(arrayBuffer, contentPanel) {
        const pages = this.pages;
        const thiz = this;
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const innerContentElementPanel = this.innerContentElementPanel;
        const width = window.outerWidth;
        const height = window.outerHeight;
        const scale = Math.max(width / height, height / width);//2.5;
        // console.log(scale, window.outerWidth, window.outerHeight);
        innerContentElementPanel.innerHTML = null;
        const frag = document.createDocumentFragment();
        loadingTask.promise.then(function (pdf) {
            const numPages = pdf.numPages;
            thiz.pageStartElement.min = 1;
            thiz.pageStartElement.max = numPages;
            for (let i = 1; i <= numPages; i++) {
                pdf.getPage(i).then(function (pageObject) {
                    const page = new Page(thiz, pageObject);
                    page.title = thiz.title;
                    pages.push(page);
                    page.render(scale);
                    frag.appendChild(page.pageElement);
                    page.restore();
                    if (i === numPages) {
                        setTimeout(() => {
                            innerContentElementPanel.appendChild(frag);
                            thiz.contentPanel.reset();
                            thiz.pageManager(contentPanel.contentElement);
                            UTIL.hiddenProgressBar();
                        }, 100);
                    }
                });
            }
            // console.log(pdf.numPages);
            // console.log(pdf);
        });
    }

    update() {
        const scale = this.contentPanel.zoom;
        for (const page of this.pages) {
            page.scale = scale;
            const canvas = page.context2d.canvas;
            const canvasLayer = page.context2dLayer.canvas;
            canvas.style.width = canvasLayer.style.width = `${canvas.width * scale}px`;
        }
        // this.currentPage.focus();
    }

}

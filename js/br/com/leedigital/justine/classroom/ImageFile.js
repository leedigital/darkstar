import Document from "./Document.js";
import Page from "./Page.js";
import { UTIL } from "./util/Util.js";
import ContentPanel from "../../../../../ContentPanel.js";

/**
 * @author araujo921
 */
export default class ImageFile extends Document {

    /**
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @param {ContentPanel} contentPanel
     */
    constructor(arrayBuffer, contentPanel, type) {
        super(arrayBuffer, contentPanel);
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.type = type;
    }

    /**
     * 
     * @param {*} arrayBuffer 
     * @param {ContentPanel} contentPanel 
     */
    init(arrayBuffer, contentPanel) {
        const blob = new Blob([arrayBuffer], { type: this.type });
        const url = URL.createObjectURL(blob);
        const image = new Image;
        const pages = this.pages;
        const thiz = this;
        const scale = 3;
        const innerContentElementPanel = this.innerContentElementPanel;
        innerContentElementPanel.innerHTML = null;
        image.onload = function (evt) {
            thiz.pageStartElement.min = 1;
            thiz.pageStartElement.max = 1;
            const page = new Page(thiz, {
                pageNumber: thiz.pageNumber,
                pageIndex: thiz.pageIndex,
                getViewport() {
                    return {
                        width: image.width,
                        height: image.height,
                    };
                },
                /**
                 * 
                 * @param {{canvasContext:,viewport:}} renderingContext 
                 */
                render(renderingContext) {
                    /**
                     * @type {CanvasRenderingContext2D}
                     */
                    const context2d = renderingContext.canvasContext;
                    context2d.drawImage(image, 0, 0);
                }
            });
            page.title = thiz.title;
            pages.push(page);
            page.render(scale);
            thiz.pageManager(contentPanel.contentElement);
            innerContentElementPanel.appendChild(page.pageElement);
            thiz.contentPanel.reset();
            UTIL.hiddenProgressBar();
            page.restore();
        };
        image.src = url;
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

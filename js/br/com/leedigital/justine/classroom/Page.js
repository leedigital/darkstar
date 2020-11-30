import Document from "./Document.js";
import { MOUSE } from "./util/Mouse.js";
import { UTIL } from "./util/Util.js";
import Screenshot from "./Screenshot.js";

const point = { x: 0, y: 0 };
const arrrowObject = {
    x: 0,
    y: 0,
    start: false
};

let lock = false;

/**
 * @author araujo921
 */
export default class Page {

    /**
     * 
     * @param {Document} document 
     * @param {Object} pageObject
     */
    constructor(document, pageObject) {
        this.title = "";
        /**@type {Document} */
        this.document = null;
        /**
         * @type {HTMLDivElement}
         */
        this.pageElement = null;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.context2d = this.context2dLayer = null;
        this.pageObject = null;
        this.number = 0;
        this.height = 0;
        this.width = 0;
        this.drag = false;
        const doc = window.document;
        const pageElement = doc.createElement('div');
        pageElement.tabIndex = -1;
        pageElement.setAttribute('data-ld-src', `page-panel-${pageObject.pageNumber}`);
        const canvasContainer = doc.createElement('span');
        canvasContainer.style = `position: relative; display:inline-block`;
        const canvas = doc.createElement('canvas');
        canvas.setAttribute('data-ld-src', `canvas-render-${pageObject.pageNumber}`);
        const context2d = canvas.getContext('2d');
        const canvasLayer = doc.createElement('canvas');
        canvasLayer.ontouchstart = (evt) => {
            const touch = evt.touches[0];
            evt.preventDefault();
            this.focus();
            canvasLayer.dispatchEvent(new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            }));
        };

        canvasLayer.ontouchmove = (evt) => {
            const touch = evt.touches[0];
            evt.preventDefault();
            canvasLayer.dispatchEvent(new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            }));
        };

        canvasLayer.ontouchend = (evt) => {
            evt.preventDefault();
            canvasLayer.dispatchEvent(new MouseEvent("mouseup", {}));
        };
        canvasLayer.onmousedown = this.onmousedown.bind(this);
        canvasLayer.onmouseup = this.onmouseup.bind(this);
        canvasLayer.onmousemove = this.onmousemove.bind(this);
        canvasLayer.onmouseleave = this.onmouseleave.bind(this);
        canvasLayer.setAttribute('data-ld-src', `canvas-render-${pageObject.pageNumber}`);
        canvasLayer.style = `position:absolute; left:0px; top: 0px;`;
        const context2dLayer = canvasLayer.getContext('2d');
        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(canvasLayer);
        pageElement.appendChild(canvasContainer);
        Object.defineProperties(this, {
            document: {
                get() {
                    return document;
                }
            },
            pageElement: {
                get() {
                    return pageElement;
                }
            },
            context2d: {
                get() {
                    return context2d;
                }
            },
            context2dLayer: {
                get() {
                    return context2dLayer;
                }
            },
            pageObject: {
                get() {
                    return pageObject;
                }
            },
            number: {
                get() {
                    return pageObject.pageNumber;
                }
            },
            pageIndex: {
                get() {
                    return pageObject.pageIndex;
                }
            },
            height: {
                get() {
                    return canvas.height;
                }
            },
            width: {
                get() {
                    return canvas.width;
                }
            }
        });

        this.scale = 1;
        /**
         * @type {History}
         */
        this.history = null;
        this.undoStartFlag = false;
        this.undoClearFlag = false;
        /**
         * @type {Array<History}
         */
        this.undoHistory = [];
        /**
         * @type {Array<History}
         */
        this.redoHistory = [];
        this.screenshot = new Screenshot(this);
        this.hidden();
    }

    show() {
        // this.pageElement.style.opacity = 1;
    }

    hidden() {
        // this.pageElement.style.opacity = 0;
    }

    focus() {
        this.pageElement.focus();
    }

    render(scale) {
        const page = this.pageObject;
        this.scale = scale = Math.max(
            window.outerWidth / page.getViewport({ scale: 1 }).width,
            page.getViewport({ scale: 1 }).width / window.outerWidth
        );
        const viewport = page.getViewport({ scale: scale.toFixed(1) * .99, });
        const context = this.context2d;
        const canvas = context.canvas;
        const canvasLayer = this.context2dLayer.canvas;
        canvasLayer.height = canvas.height = viewport.height;
        canvasLayer.width = canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    }

    redo() {
        const redo = this.redoHistory;
        if (redo.length > 0) {
            if (lock)
                return;
            lock = true;
            const history = redo.pop();
            this.undoHistory.push(history);
            history.run();
            lock = false;
        } else {
            UTIL.alert("Não existem ações a serem refeitas");
        }
    }

    undo() {
        const undoHistory = this.undoHistory;
        if (undoHistory.length > 0) {
            if (lock)
                return;
            lock = true;
            if (this.undoClearFlag) {
                this.undoClearFlag = false;
            }
            const history = undoHistory.pop();
            if (!(history instanceof Clean)) {
                this.clear();
                this.redoHistory.push(history);
                this.undoStartFlag = true;
            }
            for (const history of undoHistory) {
                history.run();
            }
            lock = false;
        } else {
            UTIL.alert("Não existem ações a serem desfeitas");
        }
    }

    getCanvasPoint(x1, y1) {
        const canvas = this.context2d.canvas;
        const contentElement = this.document.contentElement;
        const headerElement = this.document.headerElement;
        let x = x1 + contentElement.scrollLeft - canvas.offsetParent.parentElement.offsetLeft - canvas.offsetParent.offsetLeft - canvas.offsetLeft;
        let y = y1 + contentElement.scrollTop - canvas.offsetParent.parentElement.offsetTop - canvas.offsetParent.offsetTop - canvas.offsetTop - headerElement.offsetHeight;// - contentElement.firstElementChild.getBoundingClientRect().y;
        point.x = x * canvas.width / canvas.clientWidth;
        point.y = y * canvas.height / canvas.clientHeight;
        return point;
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    onmousedown(evt) {
        const point = this.getCanvasPoint(evt.clientX, evt.clientY);
        const x = point.x;
        const y = point.y;
        // console.log(x, y);
        this.startPaint(x, y);
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    onmousemove(evt) {
        const point = this.getCanvasPoint(evt.clientX, evt.clientY);
        const x = point.x;
        const y = point.y;
        this.paint(x, y);
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    onmouseup(evt) {
        this.closePaint(evt);
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    onmouseleave(evt) {
        this.closePaint(evt);
    }

    startPaint(x, y) {
        if (this.undoStartFlag) {
            this.undoStartFlag = false;
            this.redoHistory.length = 0;
        }
        if (this.undoClearFlag) {
            this.undoClearFlag = false;
            this.redoHistory.length = 0;
            this.undoHistory.length = 0;
        }
        const doc = this.document;
        this.drag = true;
        const context2d = this.context2dLayer;
        const history = this.history = new History(context2d);
        context2d.save();
        context2d.beginPath();
        const lineColor = context2d.strokeStyle = this.lineColor;
        const lineWidth = context2d.lineWidth = this.lineWidth;
        const lineJoin = context2d.lineJoin = this.lineJoin;
        const lineCap = context2d.lineCap = this.lineCap;
        const globalAlpha = context2d.globalAlpha = this.opacityColorValue;
        this.history.addMethod(`this.context2d.save();\n`);
        this.history.addMethod(`this.context2d.beginPath();\n`);
        history.addProperty("this.context2d.strokeStyle", `'${lineColor}'`);
        history.addProperty("this.context2d.lineWidth", `'${lineWidth}'`);
        history.addProperty("this.context2d.lineJoin", `'${lineJoin}'`);
        history.addProperty("this.context2d.lineCap", `'${lineCap}'`);
        history.addProperty("this.context2d.globalAlpha", globalAlpha);
        if (doc.isHandEdit) {
            this.startHandPaint(x, y);
        } else if (doc.isArrowEdit) {
            this.startArrowPaint(x, y);
        } else if (doc.isLineEdit) {
            this.startLinePaint(x, y);
        } else if (doc.isDashedLineEdit) {
            this.startDashedLinePaint(x, y);
        } else if (this.eraser) {
            this.startEraserPaint(x, y);
        }
        // console.log(x, y);
    }

    paint(x, y) {
        if (this.drag) {
            const doc = this.document;
            if (doc.isHandEdit) {
                this.handPaint(x, y);
            } else if (this.eraser) {
                this.eraserPaint(x, y);
                // console.log(this.drag)
            }
            // console.log(x, y);
        }
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    closePaint(evt) {
        if (this.drag) {
            const context2d = this.context2dLayer;
            const doc = this.document;
            // const point = this.getCanvasPoint(evt.clientX, evt.clientY);
            const x = point.x;
            const y = point.y;
            if (doc.isHandEdit) {
                this.closeHandPaint(x, y);
            } else if (doc.isArrowEdit) {
                this.closeArrowPaint(x, y);
            } else if (doc.isLineEdit) {
                this.closeLinePaint(x, y);
            } else if (doc.isDashedLineEdit) {
                this.closeDashedLinePaint(x, y);
            } else if (this.eraser) {
                this.closeEraserPaint(x, y);
            }
            context2d.closePath();
            context2d.restore();
            this.history.addMethod(`this.context2d.closePath();\n`);
            this.history.addMethod(`this.context2d.restore();\n`);
            if (this.history) {
                this.history.run = Function(this.history.str);
                this.undoHistory.push(this.history);
                // redo.push(this.history);
                this.history = null;
            }
        }
        this.drag = false;
    }



    startHandPaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.lineTo(x, y);
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
    }

    handPaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.lineTo(x, y);
        context2d.stroke();
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
        this.history.addMethod(`this.context2d.stroke();\n`);

    }

    closeHandPaint(x, y) {
    }

    startLinePaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.lineTo(x, y);
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
    }

    closeLinePaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.lineTo(x, y);
        context2d.stroke();
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
        this.history.addMethod(`this.context2d.stroke();\n`);
    }

    startDashedLinePaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.setLineDash([this.lineWidth, this.lineWidth * 2]);
        context2d.lineTo(x, y);
        this.history.addMethod(`this.context2d.setLineDash([${this.lineWidth}, ${this.lineWidth * 2}]);\n`);
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
    }

    closeDashedLinePaint(x, y) {
        const context2d = this.context2dLayer;
        context2d.lineTo(x, y);
        context2d.stroke();
        context2d.setLineDash([]);
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
        this.history.addMethod(`this.context2d.stroke();\n`);
        this.history.addMethod(`this.context2d.setLineDash([]);\n`);
    }

    startArrowPaint(x, y) {
        const context2d = this.context2dLayer;
        arrrowObject.x = x;
        arrrowObject.y = y;
        arrrowObject.start = true;
        context2d.lineTo(x, y);
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
    }

    closeArrowPaint(x, y) {
        if (!arrrowObject.start) {
            return;
        }
        const context2d = this.context2dLayer;
        const headlen = this.lineWidth * 5; // length of head in pixels
        const dx = x - arrrowObject.x;
        const dy = y - arrrowObject.y;
        const angle = Math.atan2(dy, dx);
        context2d.lineTo(x, y);
        context2d.lineTo(x - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
        context2d.moveTo(x, y);
        context2d.lineTo(x - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
        context2d.stroke();
        this.history.addMethod(`this.context2d.lineTo(${x},${y});\n`);
        this.history.addMethod(`this.context2d.lineTo(${x - headlen * Math.cos(angle - Math.PI / 6)}, ${y - headlen * Math.sin(angle - Math.PI / 6)});\n`);
        this.history.addMethod(`this.context2d.moveTo(${x},${y});\n`);
        this.history.addMethod(`this.context2d.lineTo(${x - headlen * Math.cos(angle + Math.PI / 6)}, ${y - headlen * Math.sin(angle + Math.PI / 6)});\n`);
        this.history.addMethod(`this.context2d.stroke();\n`);
        arrrowObject.start = false;
    }

    startEraserPaint(x, y) {
        const context2d = this.context2dLayer;
        const len = this.eraserLength;
        context2d.clearRect(x, y, len, len);
        this.history.addMethod(`this.context2d.clearRect(${x}, ${y}, ${len}, ${len});\n`);
    }

    eraserPaint(x, y) {
        const context2d = this.context2dLayer;
        const len = this.eraserLength;
        context2d.clearRect(x, y, len, len);
        this.history.addMethod(`this.context2d.clearRect(${x}, ${y}, ${len}, ${len});\n`);

    }

    closeEraserPaint(x, y) {

    }

    get lineColor() {
        return this.document.currentColor;
    }

    get lineWidth() {
        return this.document.lineWidth;
    }

    get lineCap() {
        return "round";
    }
    get lineJoin() {
        return "round";
    }

    get eraser() {
        return this.document.eraser;
    }

    get eraserLength() {
        return this.document.eraserLength * 10;
    }

    get opacityColorValue() {
        return this.document.opacityColorValue;
    }

    clear() {
        const context2d = this.context2dLayer;
        context2d.save();
        context2d.clearRect(0, 0, this.width, this.height);
        context2d.restore();
    }

    clearCache() {
        this.undoClearFlag = true;
        this.redoHistory.length = 0;
        this.undoHistory.push(new Clean);
    }

    save() {
        const localStorage = window.localStorage;
        const json = JSON.stringify(this.undoHistory);
        localStorage.setItem(this.documentTitle, json);
    }

    restore() {
        const localStorage = window.localStorage;
        const json = localStorage.getItem(this.documentTitle);
        /** @type {Array<History>} */
        const tmp = JSON.parse(json);
        if (tmp) {
            for (let i = 0, len = tmp.length; i < len; i++) {
                const value = tmp[i];
                const history = new History(this.context2dLayer);
                history.str = value.str;
                history.run = Function(history.str);
                this.undoHistory.push(history);
                history.run();
            }
        }
    }

    get documentTitle() {
        return `${this.title}_${this.number}`;
    }


}

class History {
    constructor(context2d) {
        this.context2d = context2d;
        this.run = null;
        this.str = "";
    }

    addProperty(param, value) {
        this.str = this.str.concat(`${param}=${value};\n`);
    }

    addMethod(value) {
        this.str = this.str.concat(`${value}\n`);
    }

}

class Clean {

}

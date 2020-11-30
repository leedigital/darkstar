import Page from './Page.js';
/**
 * @author araujo921
 */
export default class Screenshot {

    /**
     * 
     * @param {Page} page 
     */
    constructor(page) {
        const a = document.createElement('a');
        this.capture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = page.width;
            canvas.height = page.height;
            const context2d = canvas.getContext('2d');
            context2d.drawImage(page.context2d.canvas, 0, 0);
            context2d.drawImage(page.context2dLayer.canvas, 0, 0);
            canvas.toBlob((blob) => {
                a.href = URL.createObjectURL(blob);
                a.download = 'screenshot.png';
                a.click();
            });
        };
    }

}

/**
 * @author araujo921
 */
class Mouse {
    constructor() {
        // document.onmousemove =
        //     document.ontouchmove =
        //     document.ontouchstart =
        //     document.ontouchend =
        //     /**
        //      * @param {MouseEvent | TouchEvent} evt
        //      */
        //     (evt) => {
        //         evt.stopImmediatePropagation();
        //         if (evt instanceof TouchEvent) {
        //             const touch = evt.touches[0];
        //             this.x = touch.clientX;
        //             this.y = touch.clientY;
        //         } else if (evt instanceof MouseEvent) {
        //             this.x = evt.clientX;
        //             this.y = evt.clientY;
        //         }
        //     };
    }
}

export const MOUSE = new Mouse;

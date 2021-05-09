import PDF from"./br/com/leedigital/justine/classroom/PDF.js";import Document from"./br/com/leedigital/justine/classroom/Document.js";import{UTIL}from"./br/com/leedigital/justine/classroom/util/Util.js";import ImageFile from"./br/com/leedigital/justine/classroom/ImageFile.js";import ScreenCapture from"./br/com/leedigital/justine/classroom/ScreenCapture.js";import ScreenCaptureElectron from"./br/com/leedigital/justine/classroom/ScreenCaptureElectron.js";import{Board}from"./br/com/leedigital/justine/classroom/Board.js";let recentColorIndex=1,recentColorElement=null;const attachImage=document.createElement("input");attachImage.type="file",attachImage.accept="image/*";export default class ContentPanel{constructor(){this.headerElement=this.contentElement=this.tooltipElement=this.pageElement=this.pageEndElement=this.lineWidthSliderThumbElement=this.eraserSliderThumbElement=this.opacityColorSliderThumbElement=this.boardElement=this.boardElementGearSettings=null,this.zoomSliderElement=this.pageStartElement=this.handEditElement=this.arrowEditElement=this.dashedArrowElement=this.lineEditElement=this.dashedLineEditElement=this.lineWidthSliderElement=this.colorPickerElement=this.eraserElement=this.eraserSliderElement=this.opacityColorSliderElement=null,this.document=null;const headerElement=document.querySelector('div[data-ld-src="hdr-mst-pnl"'),contentElement=document.querySelector('div[data-ld-src="cvs-pnl"]'),tooltipElement=document.querySelector('label[data-ld-src="zoom-tooltip"]'),pageElement=document.querySelector('div[data-ld-src="page-element"]'),zoomSliderElement=headerElement.querySelector('input[data-ld-src="sld-zoom"]'),lineWidthSliderThumbElement=document.querySelector('label[data-ld-src="line-width-slider-thumb"]'),pageStartElement=pageElement.querySelector('input[data-ld-src="page-start"]'),pageEndElement=pageElement.querySelector('label[data-ld-src="page-end"]'),handEditElement=headerElement.querySelector('input[data-ld-src="input-hand-draw-edit"]'),arrowEditElement=headerElement.querySelector('input[data-ld-src="input-arrow-draw-edit"]'),lineEditElement=headerElement.querySelector('input[data-ld-src="input-line-draw-edit"]'),dashedLineEditElement=headerElement.querySelector('input[data-ld-src="dashed-line-draw-edit"]'),lineWidthSliderElement=document.querySelector('input[data-ld-src="line-width-slider"]'),colorPickerElement=document.querySelector('input[data-ld-src="color-picker"]'),eraserElement=document.querySelector('input[data-ld-src="input-eraser-edit"]'),eraserSliderElement=document.querySelector('input[data-ld-src="eraser-slider"]'),eraserSliderThumbElement=document.querySelector('label[data-ld-src="eraser-slider-thumb"]'),opacityColorSliderElement=headerElement.querySelector('input[data-ld-src="opacity-color-slider"]'),opacityColorSliderThumbElement=headerElement.querySelector('label[data-ld-src="opacity-color-slider-thumb"]'),boardElement=headerElement.querySelector('span[data-ld-src="new-board"]'),boardElementGearSettings=document.querySelector('span[data-ld-src="gear-settings-master-panel"]');boardElementGearSettings.onclick=evt=>this.clickHandler(evt),Object.defineProperties(this,{headerElement:{get:()=>headerElement},contentElement:{get:()=>contentElement},tooltipElement:{get:()=>tooltipElement},pageElement:{get:()=>pageElement},pageStartElement:{get:()=>pageStartElement},pageEndElement:{get:()=>pageEndElement},zoomSliderElement:{get:()=>zoomSliderElement},handEditElement:{get:()=>handEditElement},arrowEditElement:{get:()=>arrowEditElement},lineEditElement:{get:()=>lineEditElement},dashedLineEditElement:{get:()=>dashedLineEditElement},lineWidthSliderThumbElement:{get:()=>lineWidthSliderThumbElement},lineWidthSliderElement:{get:()=>lineWidthSliderElement},colorPickerElement:{get:()=>colorPickerElement},eraserElement:{get:()=>eraserElement},eraserSliderElement:{get:()=>eraserSliderElement},eraserSliderThumbElement:{get:()=>eraserSliderThumbElement},opacityColorSliderElement:{get:()=>opacityColorSliderElement},opacityColorSliderThumbElement:{get:()=>opacityColorSliderThumbElement},boardElement:{get:()=>boardElement},boardElementGearSettings:{get:()=>boardElementGearSettings}}),headerElement.onclick=this.clickHandler.bind(this),contentElement.onmouseenter=evt=>{evt.target.focus()},contentElement.onscroll=this.scrollHandler.bind(this),pageStartElement.onkeyup=this.pageStartHandler.bind(this),this.zoomSliderElement.oninput=this.zoomHandler.bind(this),this.lineWidthSliderElement.oninput=this.lineWidthSliderHandler.bind(this),this.colorPickerElement.oninput=this.colorPickerHandler.bind(this),this.eraserSliderElement.oninput=this.eraserSliderHandler.bind(this),this.opacityColorSliderElement.oninput=this.opacityColorSliderHandler.bind(this),boardElementGearSettings.querySelector('input[id="width"]').oninput=evt=>{this.board.resize(evt.target.valueAsNumber)},boardElementGearSettings.querySelector('input[id="height"]').oninput=evt=>{this.board.resize(null,evt.target.valueAsNumber)},boardElementGearSettings.querySelector('input[id="backgroundColor"]').oninput=evt=>{this.board.changeBackgroundColor(evt.target.value)},boardElementGearSettings.querySelector('input[id="gridWidth"]').oninput=evt=>{this.board.changeGridSize(evt.target.valueAsNumber)},boardElementGearSettings.querySelector('input[id="gridHeight"]').oninput=evt=>{this.board.changeGridSize(null,evt.target.valueAsNumber)},boardElementGearSettings.querySelector('input[id="gridColor"]').oninput=evt=>{this.board.changeGridColor(evt.target.value)},boardElementGearSettings.querySelector('input[id="opacity"]').oninput=evt=>{this.board.changeOpacity(evt.target.valueAsNumber)},attachImage.onchange=evt=>{const fileList=evt.target.files,file=fileList[0];/.(png|gif|jpg|jpeg)$/.test(file.type)&&(this.board.attachImage(URL.createObjectURL(file)),attachImage.value=null)},this.zoomTooltipHandler(),this.lineWidthSliderHandler(),this.eraserSliderHandler(),this.opacityColorSliderHandler(),this.recentColorsArray=document.querySelectorAll('input[name="recent-color"]');for(let i=0,len=this.recentColorsArray.length;i<len;i++)this.recentColorsArray[i].oninput=this.recentColorHandler.bind(this);recentColorElement=this.recentColorsArray[0].nextElementSibling;const clearElement=headerElement.querySelector('span[data-ld-src="clear-page-panel"]');clearElement.onclick=()=>{this.document&&this.document.clear(),this.board.isShowing()&&this.board.clear()},this.screenCapture=UTIL.desktop?new ScreenCaptureElectron:new ScreenCapture;const enableCameraElement=headerElement.querySelector('input[id="cam"]'),recInnerPanelElement=headerElement.querySelector('span[data-ld-src="rec-inner-panel"]'),startCaptureElement=headerElement.querySelector('button[data-ld-src="rec-start-button"]'),pauseCaptureElement=headerElement.querySelector('button[data-ld-src="rec-pause-button"]'),stopCaptureElement=headerElement.querySelector('button[data-ld-src="rec-stop-button"]');pauseCaptureElement.paused=!1;const defaultStartCaptureElementText=startCaptureElement.textContent,defaultStopCaptureElementText=pauseCaptureElement.textContent;startCaptureElement.onclick=async()=>{if(await UTIL.isMicrophoneDenied())UTIL.showStatusBar("Para gravar um vídeo, você precisa permite acesso ao microfone");else{this.screenCapture.enableCamera=enableCameraElement.checked,enableCameraElement.disabled=!0;try{await this.screenCapture.start(),startCaptureElement.textContent="Gravando"}catch(error){enableCameraElement.disabled=!1,this.screenCapture.reset(),startCaptureElement.textContent=defaultStartCaptureElementText,UTIL.showStatusBar(error),console.error(error)}}},pauseCaptureElement.onclick=()=>{this.screenCapture.capturing&&(pauseCaptureElement.paused?(this.screenCapture.resume(),pauseCaptureElement.paused=!1,pauseCaptureElement.textContent="Pausar"):(this.screenCapture.pause(),pauseCaptureElement.textContent="Retomar",pauseCaptureElement.paused=!0))},stopCaptureElement.onclick=()=>{this.screenCapture.stop()},this.screenCapture.addStopHandler(()=>{enableCameraElement.disabled=!1,startCaptureElement.textContent=defaultStartCaptureElementText,pauseCaptureElement.textContent=defaultStopCaptureElementText,recInnerPanelElement.style.left=null}),document.addEventListener("keydown",evt=>{evt.altKey&&"enter"===evt.key.toLowerCase()&&document.body.requestFullscreen()}),this.board=new Board(this),this.board.resize(boardElementGearSettings.querySelector('input[id="width"]').valueAsNumber,boardElementGearSettings.querySelector('input[id="height"]').valueAsNumber)}pageStartHandler(evt){const target=evt.target,document=this.document,key=evt.key.toLowerCase();target&&document&&"enter"===key&&document.changePage(target.value-1)}scrollHandler(evt){if(!this.document)return;evt.preventDefault();const target=evt.target;this.document.pageManager(target)}clickHandler(evt){const target=evt.target,dataLdSrc=target.getAttribute("data-ld-src");if("open-file-lbl"===dataLdSrc)this.openFileHandler(target.nextElementSibling);else if("zoom-out"===dataLdSrc){const zoomElement=this.zoomSliderElement,minValue=Number.parseFloat(zoomElement.min),step=Number.parseFloat(zoomElement.step),value=zoomElement.valueAsNumber,tmp=value-step;tmp>=minValue&&(zoomElement.value=tmp,this.zoomHandler(evt))}else if("zoom-in"===dataLdSrc){const zoomElement=this.zoomSliderElement,maxValue=Number.parseFloat(zoomElement.max),step=Number.parseFloat(zoomElement.step),value=zoomElement.valueAsNumber,tmp=value+step;tmp<=maxValue&&(zoomElement.value=tmp,this.zoomHandler(evt))}else if("new-board-new"===dataLdSrc){const newBoardElement=this.boardElement.querySelector('span[data-ld-src="new-board-new"]');this.board.isShowing()?(this.board.hide(),newBoardElement.setAttribute("data-ld-title","Abrir Lousa"),newBoardElement.textContent="Abrir Lousa",this.boardElement.querySelector('span[data-ld-src="new-board-gear"]').innerHTML=null):(this.board.show(),newBoardElement.setAttribute("data-ld-title","Fechar Lousa"),newBoardElement.textContent="Fechar Lousa",this.boardElement.querySelector('span[data-ld-src="new-board-gear"]').innerHTML="&nbsp;&nbsp;⚙")}else if("new-board-gear"===dataLdSrc){const style=this.boardElementGearSettings.style;"none"===style.display||0===style.display.length?style.display="inline-block":style.display="none"}else if("gear-settings-checkbox-panel-grd"===dataLdSrc){const checkBox=target.querySelector("input[type=checkbox]");checkBox.checked?(checkBox.checked=!1,this.board.hideGrid()):(checkBox.checked=!0,this.board.showGrid())}else"gear-settings-input-panel-img"===dataLdSrc&&attachImage.click()}zoomTooltipHandler(){const tooltipElement=this.tooltipElement,zoomSliderElement=this.zoomSliderElement,maxValue=Number.parseFloat(zoomSliderElement.max),minValue=Number.parseFloat(zoomSliderElement.min),value=74/(maxValue-minValue)*zoomSliderElement.valueAsNumber;tooltipElement.style.left=`${value}px`,tooltipElement.textContent=zoomSliderElement.value}lineWidthSliderHandler(){const lineWidthSliderThumbElement=this.lineWidthSliderThumbElement,lineWidthSliderElement=this.lineWidthSliderElement,maxValue=Number.parseFloat(lineWidthSliderElement.max),minValue=Number.parseFloat(lineWidthSliderElement.min),value=91/(maxValue-minValue)*lineWidthSliderElement.valueAsNumber;lineWidthSliderThumbElement.style.left=`${value}px`,lineWidthSliderThumbElement.textContent=lineWidthSliderElement.value}eraserSliderHandler(){const eraserSliderThumbElement=this.eraserSliderThumbElement,eraserSliderElement=this.eraserSliderElement,maxValue=Number.parseFloat(eraserSliderElement.max),minValue=Number.parseFloat(eraserSliderElement.min),value=91/(maxValue-minValue)*eraserSliderElement.valueAsNumber;eraserSliderThumbElement.style.left=`${value}px`,eraserSliderThumbElement.textContent=eraserSliderElement.value}opacityColorSliderHandler(){const opacityColorSliderThumbElement=this.opacityColorSliderThumbElement,opacityColorSliderElement=this.opacityColorSliderElement,maxValue=Number.parseFloat(opacityColorSliderElement.max),minValue=Number.parseFloat(opacityColorSliderElement.min),value=91/(maxValue-minValue)*opacityColorSliderElement.valueAsNumber;opacityColorSliderThumbElement.style.left=`${value}px`,opacityColorSliderThumbElement.textContent=opacityColorSliderElement.value}zoomHandler(evt){if(this.zoomTooltipHandler(),this.document){const target=evt.target;this.document.update();const pageNumber=this.pageStartElement.valueAsNumber;setTimeout(()=>{this.document.changePage(pageNumber-1);const el=target.parentElement.querySelector('input[data-ld-src="sld-zoom"]');el.focus()},1e3)}}openFileHandler(element){element.click(),element.onchange=evt=>{this.board.isShowing()&&this.boardElement.querySelector('span[data-ld-src="new-board-new"]').click();const element=evt.target,file=element.files[0],type=file.type,regex=/\.(png|jpg|jpeg)$/gi,thiz=this,fileName=file.name;let fileReader=null;type.endsWith("/pdf")?(fileReader=new FileReader,fileReader.onload=function(){UTIL.showProgressBar(),thiz.document=new PDF(new Uint8Array(this.result),thiz),thiz.document.title=fileName}):regex.test(type)&&(fileReader=new FileReader,fileReader.onload=function(){UTIL.showProgressBar(),thiz.document=new ImageFile(new Uint8Array(this.result),thiz,type),thiz.document.title=fileName}),fileReader&&fileReader.readAsArrayBuffer(file),element.value=""}}colorPickerHandler(evt){const target=evt.target,value=target.value,inputElement=this.recentColorsArray[recentColorIndex++];inputElement.checked=!0;const element=inputElement.nextElementSibling;recentColorElement=element,element.style.backgroundColor=value,recentColorIndex>6&&(recentColorIndex=1)}recentColorHandler(evt){recentColorElement=evt.target.nextElementSibling}get currentColor(){return window.getComputedStyle(recentColorElement).backgroundColor}get zoom(){return this.zoomSliderElement.value}get eraser(){return this.eraserElement.checked}get opacityColorValue(){return this.opacityColorSliderElement.valueAsNumber/100}reset(){this.zoomSliderElement.value=1,this.zoomTooltipHandler(),setTimeout(()=>{},250)}}
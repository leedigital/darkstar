const progressBar=document.querySelector('div[data-ld-src="progress-bar"]'),statusBarElement=document.querySelector('div[data-ld-src="status-bar-panel"]'),timer={},statusBarFunction=function(){const e=timer.now,t=Date.now()-e;(Math.floor(t/7e3)<1||Number.parseFloat(statusBarElement.style.opacity)>0)&&(statusBarElement.style.opacity=""+(1-t/7e3),setTimeout(statusBarFunction,1/60))};class Util{constructor(){}showStatusBar(e){statusBarElement.style.opacity="1",statusBarElement.textContent=e,timer.now=Date.now(),requestAnimationFrame(statusBarFunction)}success(){this.showStatusBar("Operação realizada com sucesso")}alert(e){window.alert(e)}showProgressBar(){progressBar.style.display="inline-block"}hiddenProgressBar(){progressBar.style.display="none"}getHexColorFrom(e){const t=window.getComputedStyle(e).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),r=`${Number.parseInt(t[1]).toString(16)}${Number.parseInt(t[2]).toString(16)}${Number.parseInt(t[3]).toString(16)}`;return`#${3===r.length?r+r:r}`}get desktop(){return!!window.process}get web(){return!window.process}get userAgent(){return navigator.userAgent.toLowerCase()}get linux(){return-1!==this.userAgent.indexOf("linux")}get windows(){return-1!==this.userAgent.indexOf("windows")}get mobile(){return-1!==this.userAgent.indexOf("mobile")}get x64(){return this.windows?-1!==this.userAgent.indexOf("x64"):this.linux?-1!==this.userAgent.indexOf("x86_64"):-1!==navigator.platform.toLowerCase().indexOf("64")}get x32(){return-1!==navigator.platform.toLowerCase().indexOf("32")}async isMicrophoneDenied(){return"denied"===(await navigator.permissions.query({name:"microphone"})).state}closeElectronWindow(){if(UTIL.desktop){require("electron").remote.getCurrentWindow().close()}}openDevToolsFromElectronWindow(){if(UTIL.desktop){require("electron").remote.getCurrentWindow().webContents.openDevTools()}}fullscreenFromElectronWindow(){if(UTIL.desktop){const e=require("electron").remote.getCurrentWindow();e.setFullScreen(!e.isFullScreen())}}}export const UTIL=new Util;
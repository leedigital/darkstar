import{UTIL}from"./util/Util.js";export default class Download{constructor(){const doc=document,downloadJustineElementPanel=doc.querySelector('label[data-ld-src="download-justine-panel"]'),downloadJustineElement=doc.querySelector('a[data-ld-src="download-justine-element"]');downloadJustineElementPanel.onclick=function(evt){const target=evt.target,dataLdSrc=target.getAttribute("data-ld-src");"download-justine-panel"===dataLdSrc?downloadJustineElementPanel.style.display="none":"download-justine-element"===dataLdSrc&&downloadJustineElement.click()},(UTIL.linux||UTIL.windows)&&(downloadJustineElementPanel.style.display="inline-block",UTIL.linux?UTIL.x64?downloadJustineElement.href="http://justine.linux64.leedigital.com.br":UTIL.x32&&(downloadJustineElement.href="http://justine.linux32.leedigital.com.br"):UTIL.windows&&(UTIL.x64?downloadJustineElement.href="http://justine.windows64.leedigital.com.br":UTIL.x32&&(downloadJustineElement.href="http://justine.windows32.leedigital.com.br")))}}
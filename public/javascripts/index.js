'use strict'
//提示出現1秒就消失
const flash = document.querySelector("#flash-message");
setTimeout(() => {
  flash.remove();
}, 1000);

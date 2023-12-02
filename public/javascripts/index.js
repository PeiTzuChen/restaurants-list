'use strict'
//提示出現2秒就消失
const flash = document.querySelector("#flash-message");
setTimeout(() => {
  flash.remove();
}, 1000);

const baseSize=100
function setRem() {
  const scale=document.documentElement.clientWidth/750;
  document.documentElement.style.fontSize=(baseSize*scale)+'px';
  rem=baseSize*scale;
}
setRem();
window.onresize=function () {
  setRem();
}

export default{
    getUrlParam(name) {
    const  reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    const r = window.location.search.substr(1).match(reg); //匹配目标参数
    if(r != null) return unescape(r[2]);
    return null; //返回参数值
  },
  setCookie(name, value){//写cookies
    let exp = new Date();
    exp.setTime(exp.getTime() + 2* 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
},
  getCookie(name) {//读取cookies
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg))
      return decodeURI(arr[2]);
    else
      return null;
  },
  delCookie(name) {//删除cookies
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if(cval != null)
      document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
  },
  addEvent(element, event, listener) {
  if (element.addEventListener) {
    element.addEventListener(event, listener, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, listener);
  } else {
    element['on' + event] = listener;
  }
}
}


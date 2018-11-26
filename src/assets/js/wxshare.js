import Vue from 'vue'
import wx from 'weixin-js-sdk'
import fun from '@/assets/js/fun'
const wxshare = {
  options:{
    title:"河北广电微信电视",
    logourl:"http://wxtv.96888.net.cn/hbtn-wechat/img/logo.png",
    info:"【微信电视，让手机连接电视，给您带来丰富的视频与互动体验！】",
    debug:false
  },
  ready_: function() {
      wx.ready(()=>{
        wx.onMenuShareTimeline({
          title: this.options.sharetitle,
          link: this.options.urltem,
          imgUrl:this.options.shareimgurl
        });
        wx.onMenuShareAppMessage({
          title: this.options.sharetitle,
          desc: this.options.sharedesc,
          link: this.options.urltem,
          imgUrl: this.options.shareimgurl
        });
      })
  },
  error_: function() {
    wx.error(()=>{

    })
  },
  init: function(name){
    const url=window.location.href.split('#')[0];
    Vue.http.get('/server/wx-ser/wxtv/jsapiTicket',{
      params: { url: url }
    }).then(({data})=>{
          this.options.appId=data.appid
          if(name.indexOf('detail')==-1){
            this.weixinshare_(this.options.title,this.options.logourl,this.options.info);
          }
          wx.config({
            debug: this.options.debug,
            appId: data.appid, // 公众号的唯一标识
            timestamp: data.timestamp, // 生成签名的时间戳
            nonceStr: data.nonceStr, // 生成签名的随机串
            signature: data.signature, // 签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode'] // 需要使用的JS接口列表
          });
  })
  },
  weixinshare_: function(sharetitle, shareimgurl, sharedesc) {
    const appId = this.options.appId,code=fun.getUrlParam('code');
    let url=encodeURIComponent(window.location.href.replace('&code=' + code, '').replace('&state=STATE', '').replace('&appid='+appId, ''));
    if(url.indexOf('https://open.weixin.qq.com/connect/oauth2/authorize') == -1 && appId ) {
      url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri="+url+"&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=wxd4b23b85dd28a3ae#wechat_redirect";
    }else{
      url = decodeURIComponent(url);
    }
    this.options.urltem=url;
    this.options.sharedesc=sharedesc
    this.options.sharetitle=sharetitle
    this.options.shareimgurl=shareimgurl?shareimgurl.split("!")[0]:''
    this.ready_();
    this.error_();
  }
}

export {wxshare}


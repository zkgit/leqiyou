// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/css/base.css'
import '@/assets/css/my-minit.scss'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import wx from 'weixin-js-sdk'
import http from '@/assets/js/http'
import tipshow from '@/components/tipshow'
Vue.use(http)
Vue.use(tipshow)
import VueViewload from 'vue-viewload'
import rem from '@/assets/js/rem'

console.log('wx',wx)
Vue.use(mint)

Vue.use(VueViewload,{
  threshold:-200,
  effectFadeIn: true
})
Vue.config.productionTip = false

// Vue.prototype.$http = axios;
Vue.directive('tag',{
  bind(el,binding){
    let arr=binding.value.split(';'),str='类型：',count=0;
    for(let i=0;i<arr.length;i++){
      if(arr[i]&&count<3){
        count++
        str+='<span>'+arr[i]+'</span>'
      }
    }
   el.innerHTML=str
  }
})

Vue.directive('scan',{
  bind(el,binding){
    Vue.prototype.fun.addEvent(el,'click',function () {
      console.log('scanclick')
      wx.scanQRCode({
        needResult:0,
        desc: '扫描设备码',
        success: function (res) {
        }
      });
    })
  }
})
/* eslint-disable no-new */
var app=new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

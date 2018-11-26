import Vue from 'vue'
import Router from 'vue-router'
import fun from '@/assets/js/fun'
import {wxshare} from '@/assets/js/wxshare'
import logina from '@/components/login'
Vue.use(Router)
Vue.prototype.fun=fun;
Vue.prototype.wxshare=wxshare;

let global={},store;
const code=fun.getUrlParam('code'),
router=new Router({
  routes: [
    {
      path: '/index_home',
      name: 'index_home',
      // component: require('../components/index_home.vue').default,
      component:resolve => require(['@/components/index_home.vue'], resolve),
      alias:'/'
    },
    {
      path:'/login',
      name:'login',
      // component:require('@/components/login').default
      component:logina
    },
    {
      path:'/search',
      name:'search',
      // component:require('@/components/search').default
      component: () => import('@/components/search')
    },
    {
      path:'/mine_history',
      name:'mine_history',
      component:require('@/components/mine_history').default
    },
    {
      path:'/mine_message',
      name:'mine_message',
      component:require('@/components/mine_message').default
    },
    {
      path:'/mine_help',
      name:'mine_help',
      component:require('@/components/mine_help').default
    },
    {
      path:'/mine_set',
      name:'mine_set',
      component:require('@/components/mine_set').default
    },
    {
      path:'/detail',
      name: 'detail',
      component: require('@/components/detail').default,
      meta: {
        keepAlive:'no' // 不需要被缓存
      }
    },
    {
      path:'/detail_zb',
      name: 'detail_zb',
      component: require('@/components/detail_zb').default,
      meta: {
        keepAlive:'no'
      }
    },
    {
      path:'/list',
      name: 'list',
      component: require('@/components/list').default,
      meta: {
        keepAlive:'no' // 不需要被缓存
      }
    },
    {
      path:'/index_live',
      name: 'index_live',
      component: require('@/components/index_live').default
    },

    {
      path:'/index_db',
      name: 'index_db',
      component: require('@/components/index_db').default
    },
    {
      path:'/index_mine',
      name: 'index_mine',
      component: require('@/components/index_mine').default
    },
    {
      path:'/classify',
      name: 'classify',
      component: require('@/components/classify').default
    },
    {
      path:'/channel_back',
      name: 'channel_back',
      component: require('@/components/channel_back').default
    },

    {
      path: '*',
      redirect:'/'
    }
  ]
}),
  noreg=function (next) {
  fun.setCookie('noregister', 1);
  global.noregister=1;
  store.commit('setglobal',global);
  next();
},
login=function(next){
  Vue.http.get(`/apiurl/user/open/wxlogin.json?unionid=${global.unionid}`).then(({data})=>{
    if(data.code == '200'&&data.data){
      fun.setCookie('token', data.data);
      global.token = data.data;
      store.commit('setglobal',global);
    Vue.http.post(`/apiurl/user/device/current/${data.data}.json`).then(({data})=>{
        if(data.code == 200 && data.data && data.data.deviceId){
          fun.setCookie('boxId',data.data.deviceId);
          global.boxId = data.data.deviceId;
          store.commit('setglobal',global);
        }
      })
    Vue.http.get(`/apiurl/user/info/${data.data}.json`).then(({data})=>{
        if (data.code == '200'){
          fun.setCookie('phone', data.data.phone);
          global.phone=data.data.phone;
          store.commit('setglobal',global);
        }
      })
      // if(callback){
      //   callback();
      // }
    }else if(data.code == '10009'){//用户没有注册
      noreg(next)
    }
  }).catch(function (){
    noreg(next)
  })
}

router.beforeEach(function (to,from,next) {
  store=router.app.$store;
  switch(to.name){
    case 'index_home': case 'index_db':
    store.commit('setheadNav','indexhead');break;
    case 'index_mine':
      store.commit('setheadNav','minehead');break;
    default:
      store.commit('setheadNav','')
  }

  if(store.state.wxshareflag){
    store.commit('setwxshare');
    wxshare.init(to.name);
  }
  if(to.name.indexOf('index_')>=0){
    store.commit('setbotNav',to)
  }else{
    store.commit('setbotNav',false);
  }

   global=store.state.global;
  console.log('code',code)
   if(global.unionid||global.noregister==1){
     next()
   }else if(fun.getCookie('unionid')){
       global={
         nickname:fun.getCookie('nickname'),
         openid:fun.getCookie('openid'),
         unionid:fun.getCookie('unionid'),
         headimgurl:fun.getCookie('headimgurl'),
         token:fun.getCookie('token'),
         boxId:fun.getCookie('boxId'),
         phone:fun.getCookie('phone')
       };
      store.commit('setglobal',global);
     next();
    }else{
      if(code&& code != "null"&&(!global.unionid||global.unionid=='undefined'||global.unionid== "null")&&(to.name!='/login')){//init没有调用或没有返回结果时
        Vue.http.post(`/server/wx-ser/wxtv/init?code=${code}`).then(({data})=>{
          if(data){
            store.commit('setglobal',data);
            global=store.state.global;
            console.log('init',data);
            fun.setCookie('nickname', encodeURIComponent(data.nickname));
            fun.setCookie('openid', data.openid);
            fun.setCookie('unionid', data.unionid);
            fun.setCookie('headimgurl', data.headimgurl);
            login(next);
          }else{
            noreg(next)
          }
        }).catch(function (){
          noreg(next)
        })
      }
      else if((global.unionid&&global.unionid!='undefined'&&global.unionid!= "null")&&(!global.token||global.token=='undefined'||global.token== "null")&&(to.name!='/login')){//没有token并且有unionid时,
        login(next);
      }else if(global.token&&!global.boxId){
        Vue.http.post(`/apiurl/user/device/current/${global.token}.json`).then(({data})=>{
          if(data.code == 200&&data.data&&data.data.deviceId){
            fun.setCookie('boxId',data.data.deviceId);
            global.boxId = data.data.deviceId;
            store.commit('setglobal',global);
          }
        })
      }else {
        next()
      }
    }

})

export default router

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store=new Vuex.Store({
  state:{
    global:{},
    wxshareflag:true,
    hidetip:false,
    count:0,
    arr:['adf','gfh'],
    headnav:'',
    botnav:{nav:'',name_en:''},
    livenav:'channel',
    dbnav:'Tv',
    listpage:{

    },
    classify:''
  },
  getters:{
    botnav:state=>state.botnav,
    arr:state=>state.arr,
    arrlen:(state,getters)=>getters.arr.length
  },

  mutations:{
    setglobal(state,obj){
      state.global=obj
    },
    setwxshare(state){
      state.wxshareflag=false;
    },
    setHidetip(state,flag){
      state.hidetip=flag
    },
    setheadNav(state,nav){
      state.headnav=nav;
    },
    setbotNav(state,to){
      if(!to){
        state.botnav=false
      }else if(to.query&&to.query.name_en){
        state.botnav={
          nav:to.name,
          name_en:to.query.name_en
        }
      }else{
        state.botnav={
          nav:to.name,
          name_en:''
        }
      }

    },
    setdbNav(state,nav){
      state.dbnav=nav;
    },
    addcount(state,num){
      state.count+=num;
    },
    setliveNav(state,nav){
      state.livenav=nav
    },
    setlistpage(state,obj){
      state.listpage[obj.coltype]=obj
    },
    setClassify(state,obj){
      state.classify=obj;
    }
  }
})
export default store

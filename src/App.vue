<template>
  <div id="app">
    <Head/>
    <router-view v-if="$route.meta.keepAlive=='no'"></router-view>
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive!='no'"></router-view>
    </keep-alive>
    <Bot v-if="botnav"/>
    <bindtip v-if="!hide&&!global.boxId"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Head from '@/components/header/head'
import Bot from '@/components/header/bot'
import bindtip from '@/components/bindtip'
export default {
  name: 'App',
  computed:{
    hide:{
      get:function () {
        const hidetip=this.$store.state.hidetip;
        if(!hidetip&&this.fun.getCookie('hidetip')){
          console.log('hidet',hidetip)
          return this.fun.getCookie('hidetip')
        }else{
          return hidetip;
        }
      },
      set:function () {

      }
    },
    ...mapState(['botnav','global'])
},

  components:{
    Head,Bot,bindtip
  }
}
</script>

<style lang="scss">
#app{
  width:7.5rem;
  height:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: .28rem;
  line-height: .48rem;
  color:#333;
}
</style>

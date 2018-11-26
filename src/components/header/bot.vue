<template>
  <mt-tabbar v-model="botnav" fixed class="c66">
    <mt-tab-item  v-for="(v,key,index) in arr" :id="key" :key="index">
      <img slot="icon" v-show="botnav!=key"  :src="`static/bot_${key}.png`" alt="">
      <img slot="icon" v-show="botnav==key"  :src="`static/bot_${key}_press.png`" alt="">
      {{v}}
    </mt-tab-item>
  </mt-tabbar>
</template>
<script>
    export default {
        name: "bot",
      data(){
        return {
           arr:{"index_home":'首页',"index_live":'直播',"index_db":'点播',"index_mine":'我的'}
        }
      },
      computed:{
        botnav:{
          get:function () {
             return this.$store.getters.botnav.nav
          },
          set:function (nav) {
             this.$store.commit('setbotNav',{name:nav,query:''})
          }
        }
      },
      watch:{
        botnav:function (val,oldVal) {
          if(!this.$store.getters.botnav.name_en){
            this.$router.push({path: '/'+val});
          }
        }
      }
    }
</script>

<style>

</style>

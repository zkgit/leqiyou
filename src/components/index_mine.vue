<template>
<div class="index_mine pt88 pb60">
   <div class="mine_head bdb5 flex">
     <img src="../assets/img/default.png" alt="" class="headimg">
      <div class="mine_head_right c66">
          <router-link to="login" tag="p" v-show="!global.phone" class="mb08">点击登录</router-link>
           <p v-show="global.phone" class="mb08">{{global.phone}}9</p>
        <p v-show="global.boxId">已绑定设备：{{global.boxId}}<span @click="unbind" class="devicebtn  minebtn fs24 cff">解绑</span></p>
        <span v-show="!global.boxId" class="devicebtn minebtn fs24 cff" v-scan>绑定机顶盒</span>
      </div>
   </div>
    <div class="bdb5">
      <mt-cell title="观看历史" to="mine_history" is-link>
        <img slot="icon" src="../assets/img/mine_his.png" width="24" height="24">
      </mt-cell>
      <mt-cell title="我的收藏" to="mine_history" is-link>
        <img slot="icon" src="../assets/img/mine_col.png" width="24" height="24">
      </mt-cell>
      <mt-cell title="我的消息" to="mine_message" is-link>
        <img slot="icon" src="../assets/img/mine_msg.png" width="24" height="24">
      </mt-cell>
    </div>
  <div class="bdb5">
    <mt-cell title="我的预约" to="mine_history" is-link>
      <img slot="icon" src="../assets/img/mine_order.png" width="24" height="24">
    </mt-cell>
    <mt-cell title="分享" to="mine_history" is-link>
      <img slot="icon" src="../assets/img/mine_share.png" width="24" height="24">
    </mt-cell>
  </div>
  <div>
    <mt-cell title="帮助" to="mine_set" is-link>
      <img slot="icon" src="../assets/img/mine_help.png" width="24" height="24">
    </mt-cell>
    <mt-cell title="反馈" to="mine_history" is-link>
      <img slot="icon" src="../assets/img/mine_feedback.png" width="24" height="24">
    </mt-cell>
    <mt-cell title="设置" to="mine_set" is-link>
      <img slot="icon" src="../assets/img/mine_set.png" width="24" height="24">
    </mt-cell>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
    export default {
        name: "",
      data(){
        return{
          phone:'',
          boxId:''
        }
      },
      computed:mapState(['global']),
      methods:{
        unbind:function () {
          this.$http.post(`/apiurl/user/device/delete/${this.global.token}.json`).then(({data})=>{
            if(data&&data.code == "200"){
              this.fun.setCookie(boxId,'');
              this.global.boxId='';
              this.$store.commit('setglobal',this.global)
            }
          })
        }
      }


    }
</script>

<style lang="scss" scoped>
  .mb08{margin-bottom: .08rem;}
.index_mine{
  .mine_head{padding:.6rem .3rem .6rem .3rem;
    .headimg{width:1.2rem;height: 1.2rem;}
    .mine_head_right{padding: .04rem .2rem;
    .devicebtn{padding:0 .3rem;border-radius: .4rem;}}
  }
}
</style>

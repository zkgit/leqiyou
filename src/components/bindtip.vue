<template>
  <div class="chosetv ptr">
    <div class="cff fs30 pl20 pr20 pta" style="top:50%;margin-top: -2.48rem">
      <p class="alic">【欢迎使用乐奇柚微信电视】</p>
      <p>【1】</p>
      <p>打开机顶盒“微信电视”，找到“微信电视”绑定二维码。</p>
      <p>【2】</p>
      <p>进入“个人中心”，先“点击登录”后，再“绑定机顶盒”完成机顶盒绑定。</p>
      <p>【3】</p>
      <p class="pb20">绑定成功后就可以进行视频推送和遥控操作了哦~</p>
      <div class="alic"><p class="dsib pl30 pr30 cff tipbtn" @click="hidebox">我知道了</p></div>
    </div>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "",
        computed:mapState(['hidetip']),
        methods:{
          hidebox:function (){
            this.fun.setCookie('hidetip',true)
            this.$store.commit('setHidetip',true)
          }
        }
    }
</script>

<style scoped>
.tipbtn{background: #1886ff;}
</style>

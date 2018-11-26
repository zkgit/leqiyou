<template>
<div class="login">
  <nav class="headline headline-title headline-fixed alic bdb wp100 bgcff">
    <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
    <p class="fs36 c33">手机号绑定</p>
  </nav>
  <ul class="fs28 c33">
     <li class="pl30  ptr ovh"><input type="text" @change="changephone" v-model="phone" maxlength="11" placeholder="请输入手机号码"><p class="pta pl20 pr30 r0 t0 bgcff cblue" @click="getcode">{{flag?num:'获取验证码'}}</p></li>
     <li class="pl30 "><input type="text" v-model="code" maxlength="4" placeholder="请输入短信验证码"></li>
  </ul>
  <p class="minebtn cff fs28 wp100 alic bindbtn" @click="bind">绑定</p>
</div>
</template>

<script>
  import {mapState} from 'vuex'
  let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
    export default {
        name: "",
        data(){
          return{
            phone:'',
            code:'',
            verifycode:'',
            verifyphone:'',
            flag:false,
            num:30
          }
        },
      computed:{...mapState(['global'])},
      methods:{
         changephone:function(){
           console.log('phone',this.phone)
         },
        getcode:function (){
          if(!this.flag){
            if(!this.phone){
              this.$tipshow({
                'msg': '请输入电话号码',
                'type': 'warning'
              })
              return;
            }else if(!phonereg.test(this.phone)){
              this.$tipshow({
                'msg': '输入的电话号码不正确',
                'type': 'warning'
              })
              return;
            }
            this.flag=true;
          let timer=setInterval(()=>{
            this.num=this.num-1;
            if(this.num<=0){
              clearInterval(timer);
              this.flag=false;
              this.num=30;
            }
          },1000)
          this.$http.get(`/apiurl/user/verify/${this.phone}.json`).then(({data})=>{
              if(data.code==200){
              this.verifycode=data.data.code;
              this.verifyphone=this.phone;
            }else{
              Toast(data.msg);
            }
          }).catch(()=>{
              Toast(data.msg);
          })
        }
      },
         bind:function () {
           console.log('global',this.global.noregister)
           if(!this.phone){
             this.$tipshow({
               'msg': '请输入电话号码',
               'type': 'warning'
             })
             return;
           }else if(!phonereg.test(this.phone)){
             this.$tipshow({
               'msg': '输入的电话号码不正确',
               'type': 'warning'
             })
             return;
           }else if(this.verifyphone!=this.phone||this.verifycode!=this.code){
             this.$tipshow({
               'msg': '验证码错误',
               'type': 'warning'
             })
             return;
           }else if(!this.global.unionid){
             this.$tipshow({
               'msg': '登录失败',
               'type': 'warning'
             })
             return;
           }

           this.$http.get(`/apiurl/user/open/register.json?unionId=${this.global.unionid}&phone=${this.phone}&code=${this.verifycode}&passWord=111111`).then(({data})=>{
             if(data.code==200){
             this.$tipshow({
               'msg': '手机绑定成功',
               'type': 'success'
             })
               this.fun.setCookie('phone',this.phone);
               this.global.phone=this.phone;
               this.$store.commit('global',this.global)
               this.$router.go(-1)
             }else{
             this.$tipshow({
               'msg': '登录失败',
               'type': 'warning'
             })
             }
           }).catch(()=>{
             this.$tipshow({
             'msg': '登录失败',
             'type': 'warning'
           })
           })
         }
       }
    }
</script>

<style scoped lang="scss">
.login{width:5.4rem;margin: 2.68rem auto 0;
  ul li{height:.84rem;line-height: .8rem;margin-bottom: .48rem;border:1px solid #ccc;border-radius: .48rem;
     input{height:.8rem;line-height: .8rem;border:none;}
  }
  .bindbtn{height:.8rem;line-height: .8rem;}
}
</style>

<template>
  <div>
    <!--
<div class="index_mine pt88 pb60">
 <div class="mine_info bdb5 flex">
   <img src="../../assets/img/default.png" alt="">
   <div class="nickname c66 fs28">
     <router-link to="login" v-show="!phone" class="phone" tag="p">点击登录</router-link>
     <p v-show="phone" class="phone">{{phone}}</p>
     <p  v-show="boxId" class="flex">
       <span class="mr20">已绑定设备：{{boxId}}</span>
       <span @click="delDeivce" class="btn cff fs24">解绑</span>
     </p>
     <span class="btn cff  fs24" v-show="!boxId"  scan>绑定机顶盒</span>
     <span @click="wxpay"  class="btn cff fs24" v-show="openid=='obYE90wGjbfqLDkzS5SjcAsBycJI'">订购</span>
   </div>
 </div>
</div>
-->
    <mt-navbar v-model="headnav" fixed>
      <mt-tab-item id="1">选项一</mt-tab-item>
      <mt-tab-item id="2">选项二</mt-tab-item>
      <mt-tab-item id="3">选项三</mt-tab-item>
    </mt-navbar>
    <!--<mt-cell title="当前选中" :value="headnav"></mt-cell>-->
    <mt-cell title="当前选中了" islink>{{headnav}}</mt-cell>

    <!--改变headnav的值，与<-->
    <mt-tab-container v-model="headnav">
       <mt-tab-container-item id="1">
           <mt-cell v-for="v in 10" title="tab-contain1"></mt-cell>
       </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell v-for="v in 10" title="tab-contain2"></mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <mt-cell v-for="v in 10" title="tab-contain3"></mt-cell>
      </mt-tab-container-item>
   </mt-tab-container>

    <mt-search  v-model="value" show cancel-text="取消"  :result="filterRes"  placeholder="请输入内容">
    </mt-search>
    <mt-cell-swipe
      title="标题文字"
      icon="back"
      to="/hello"
      value="Mark us"
      label="litile"
      is-link
      :left="[
      {
      content:'修改',
      style:{background:'#ccc',color:'#fff'},
     handler: () => this.$messagebox('修改')
      }
      ]"
      :right="[
      {
      content:'修改',
      style:{background:'#ccc',color:'#fff'},
     handler: () => this.$messagebox('修改')
      },
    {
      content: 'Delete',
      style: { background: 'red', color: '#fff' },
      handler: () => this.$messagebox('delete')
    }
  ]"></mt-cell-swipe>

    <mt-button type="primary" size="large" @click="addc(5)">add-{{count}}</mt-button>

    <mt-tabbar v-model="botnav" fixed>
      <mt-tab-item id="index">
        <img slot="icon" v-show="botnav!='index'" src="../assets/img/bot_home.png" alt="">
        <img slot="icon" v-show="botnav=='index'" src="../assets/img/bot_home_press.png" alt="">
        首页
      </mt-tab-item>
      <mt-tab-item id="live">
        <img slot="icon" src="../assets/img/bot_zb.png" alt="">
        直播
      </mt-tab-item>
      <mt-tab-item id="db">
        <img  slot="icon" src="../assets/img/bot_db.png" alt="">
         点播
      </mt-tab-item>
      <mt-tab-item id="find">
        <img slot="icon" src="../assets/img/bot_find.png" alt="">
          发现
      </mt-tab-item>
      <mt-tab-item id="mine">
        <img slot="icon" src="../assets/img/bot_person.png" alt="">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import {mapGetters} from 'vuex'
  import {mapMutations} from 'vuex'
    export default {
        name: "header",
        data(){
          return{
            value:'',
            headnav:'1',
            result: [
              'Apple',
              'Banana',
              'Orange',
              'Durian',
              'Lemon',
              'Peach',
              'Cherry',
              'Berry',
              'Core',
              'Fig',
              'Haw',
              'Melon',
              'Plum',
              'Pear',
              'Peanut',
              'Other'
            ]
          }
        },
      computed:{
        filterRes(){
          return this.result.filter(value=>value.match(new RegExp(this.value,'i')))
          //return this.result.filter(value=>value.length==4)
        },
        botnav:{
            get:function () {
              return this.$store.getters.botnav
            },
          set:function (nav) {
            console.log('nav',nav)
            this.$store.commit('setbotNav',nav);
            this.$router.push({path:'/'+nav})
          }
        },
        ...mapState(['count'])
      },
      methods:{
        ...mapMutations({
        addc:'addcount'//将this.addc(5)映射为 this.$store.commit('addcount',5)
      })
      }
      /*computed:{...mapGetters(['arr','arrlen'])}*/
  /* computed:mapGetters(['arr'])*/
      /* computed:mapState([
        'count',
        'arr'
      ])*/
  /*computed:{
          count(){
            return this.$store.state.count
          },
          arr(){
            return this.$store.getters.arr
          },
          arrlen(){
            return this.$store.getters.arrlen;
          }
        }*/
    }
</script>

<style>
  .index_mine{
  .mine_info{
    padding: .6rem .3rem;
    height:2.4rem;
  img{height:.12rem;width:.12rem;border-radius: 50%;}
  .nickname{padding:.04rem .2rem
    .phone{margin-bottom: .08rem;}
  .btn{display:inline-block;padding:0 .3rem;border-radius:.4rem;background: url('../assets/img/r_rectangle.png') no-repeat;background-size: 100% 100%; }
  }
  }
  }
</style>

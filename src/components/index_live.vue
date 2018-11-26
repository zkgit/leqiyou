<template>
  <div class="live">
    <nav class="headline wp100 fixed l0 t0 bgcff">
      <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
      <mt-navbar v-model="livenav" class="livehead">
        <mt-tab-item  v-for="(v,k,index) in navs" :id="v.nameEn" :key="index"  >{{v.nameZh}}</mt-tab-item>
      </mt-navbar>
    </nav>
    <mt-tab-container v-model="livenav" :class="{'pl20 pr20':livenav=='watch'}" id="imglazy">
      <mt-tab-container-item id="channel">
        <ul class="leftbar c33 alic"><li v-for="v in channels.leftbar" :class="v.nameEn==channels.activeJson.nameEn?'active':''">{{v.nameZh}}</li></ul>
        <ul
          v-infinite-scroll="channelBot"
          infinite-scroll-disabled="channels.loading"
          infinite-scroll-distance="5" class="righttab">
          <li v-for="v in channels.list" class="bdb">
            <router-link :to="{path:'detail_zb',query:{channelID:v.channelID}}">
              <img v-view="v.imageReal" alt="" class="fl">
              <div class="dt">
                <p class="ellipsis lh36">{{v.channelName}}</p>
                <p class="fs24 c99 ellipsis lh44">{{v.epgs[0]?v.epgs[0].startTime:'暂无'}}</p>
                <p class="fs24 c99 ellipsis lh36">{{v.epgs[0]?v.epgs[0].title:'暂无'}}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </mt-tab-container-item>
      <mt-tab-container-item id="realtime">
        <div class="listbox ovh">
          <router-link class="item" v-for="(v,index) in realtimes.list"  :to="{path:'detail_zb',query:{channelID:v.channelId}}">
            <p class="size-cover ptr ovh">
              <img v-view:imglazy="v.epgs[0].imageLink" alt="" class="J_img wp100 hp100 pta l0 t0">
               <span class="zb_channel alic pta">
                   <img :src="v.channel_icon_small" alt="">
               </span>
            </p>
            <mt-progress :value="v.epgs[0].playProgress" :bar-height="3"></mt-progress>
            <p class="J_til fs28 ellipsis alic">{{v.epgs[0].seriestitle}}</p>
          </router-link>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="watch" class="watch">
        <mt-cell title="今晚看什么" class="bdb">
          <img slot="icon" src="../assets/img/seetv.jpg" width="34" height="34">
        </mt-cell>
        <div
          v-infinite-scroll="watchBot"
          infinite-scroll-disabled="watchs.loading"
          infinite-scroll-distance="5" class="watchlist">
          <ul  v-for="(v,k) in watchs.list" class="ul">
            <div class="time flex" v-if="k"><span class="time_left"></span><span class="c66 fs32">{{k}}</span></div>
            <router-link  :to="{path:'detail_zb',query:{channelID:vv.channelId}}" class="ovh" tag="li" v-for="vv in v">
              <div class="wp40 ptr bdr5 ovh">
                <div class="size-cover ptr ovh wp100">
                  <img v-view:imglazy="vv.image" alt="" class="wp100 hp100 pta l0 t0">
                  <!--<img v-view=`../assets/img/see${vv.type}.png` class="wp50  pta r0 t0" alt="">-->
                </div>
              </div>
              <div class="dt">
                <p class="ellipsis c33 pb20">{{vv.subName}}</p>
                <p class="channel ovh pb10 flex"><img :src="vv.iconSmall" alt="" ><span class="ellipsis fs24 c33">{{vv.channelZh}}</span></p>
                <p class="fs24 c33">{{vv.startTime}} 播出</p>
                <p class="gobtn bdr5 mt20 cff fs28 alic">立即进入</p>
              </div>
            </router-link>
          </ul>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="liveback" class="liveback">
           <ul class="wp100 ovh flex">
             <router-link  :to="{path:'detail_zb',query:{channelID:v.backId}}" class="wp20 p10 alic" tag="li" v-for="v in livebacks.channelList">
                <p class="channelbg ptr">
                  <img v-view:imglazy="v.iconSmall" alt="" class="wp100 pta l0 t0">
                </p>
               <p class="ellipsis fs24 c66">{{v.backName}}</p>
             </router-link>
           </ul>
        <router-link  to="channel_back" class="alic moreChannel" tag="p" >更多频道</router-link>
        <div class="list">
          <div class="topline fs32">回看推荐</div>
          <div class="listbox ovh">
            <router-link class="item" v-for="(v,index) in livebacks.list"  :to="{path:'detail',query:{videoType:v.videoType,id:v.seriesId,back:1}}">
              <p class="size-cover ptr ovh">
                <img v-view="v.image" alt="" class="J_img wp100 hp100 pta l0 t0">
              </p>
              <p class="J_til fs28 ellipsis alic">{{v.epgName}}</p>
              <p class="J_til fs24 c88 ellipsis alic">{{v.channelName}}</p>
            </router-link>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>

  </div>

</template>
<script>
  import { Indicator } from 'mint-ui'
  export default {
    name: "live",
    data(){
      return {
        selected:'1',
        navs:[],
        channels:{
          leftbar:[],
          activeJson:[],
          page:1,
          list:[],
          loading:true,
          firstLoad:false,
          loadtext:'正在玩命加载...'
        },
        realtimes:{
          page:1,
          list:[],
          firstLoad:false,
          loadtext:'正在玩命加载...'
        },
        watchs:{
          page:1,
          json:{},
          list:{},
          loading:true,
          firstLoad:false,
          loadtext:'正在玩命加载...'
        },
        livebacks:{
          channelList:[],
          list:[],
          firstLoad:false
        }
      }
    },
    computed:{
      livenav:{
        get:function () {
          const nav=this.$store.state.livenav;
          console.log('computedget',nav)
          return nav
        },
        set:function (nav) {
          console.log('computedset',nav,this.livenav)
          if(this.livenav!=nav){
            this.$store.commit('setliveNav',nav)
            if(!eval('this.'+nav+'s.firstLoad')){
              console.log('set',nav)
              eval('this.'+nav+'()')
            }
          }
        }
      }
    },

    activated(){
      if(this.$route.query.name_en){
        this.$store.commit('setliveNav',this.$route.query.name_en)
      }
      const nav=this.$store.state.livenav;
       if(!eval('this.'+nav+'s.firstLoad')){
          console.log(' activatedset',nav)
          eval('this.'+nav+'()')
       }
    },
    created(){
      Indicator.open('加载中...');
      this.topnav();
    },
    methods:{
      topnav:function () {
        this.$http.get(`/apiurl/epg/liveNavigation.json?token=1&appKey=1&parentId=1`).then(({data}) => {
          Indicator.close()
        this.navs=data.data;
      })
      },
      channel:function () {
        this.$http.get(`/apiurl/epg/liveNavigation.json?token=1&appKey=1&parentId=2`).then(({data}) => {
          Indicator.close()
        console.log('电视台导航', data);
        this.channels.leftbar=data.data;
        console.log('query',this.$route.query.leftbar)
        if(this.$route.query.leftbar){
          var leftbar=this.$route.query.leftbar.toUpperCase();
          for(var i=0;i<data.data.length;i++){
            if(data.data[i].nameEn==leftbar){
              this.channels.activeJson=data.data[i]
              break;
            }
          }
        }else{
          this.channels.activeJson=data.data[0]
        }
        this.channelEpg()
      })
      },
      channelEpg:function () {
        this.$http.get(`/apiurl/epg/channel.json?token=1&appKey=1&parentId=${this.channels.activeJson.parentId}&nameEn=${this.channels.activeJson.nameEn}&page=${this.channels.page}&pageSize=10`).then(({data}) => {
          Indicator.close()
        var data=data.data;
        this.channels.firstLoad=true;
        if(data&&data.list.length){
          this.channels.list=this.channels.list.concat(data.list);
          console.log('epg', this.channels.list)
          if (data.list.length ==10){
            this.channels.loadtext = '正在玩命加载...';
            this.channels.loading=false;
          } else {
            this.channels.loadtext = '已加载全部数据';
            this.channels.loading=true;
          }
        }
      })
      },
      channelBot:function (){
        if(!this.channels.loading&&this.livenav=='channel'){
          this.channels.page++;
         this.channelEpg()
        }
        this.channels.loading=true;
      },
      realtime:function () {
        this.$http.get(`/apiurl/epg/realtime.json?token=1&appKey=1&parentId=1&page=${this.realtimes.page}&pageSize=15`).then(({data}) => {
          Indicator.close()
        var data=data.data;
        this.realtimes.firstLoad=true;
        if(data&&data.list.length){
          this.realtimes.list=data.list;
          console.log('热门直播',this.realtimes.list)
          if(data.list.length){
            this.realtimes.loadtext = '已加载全部数据';
          }else {
            this.realtimes.loadtext = '抱歉暂无数据';
          }
        }
       })
      },
      watch:function () {
        this.$http.get(`/apiurl/epg/tonight.json?page=${this.watchs.page}&pageSize=10`).then(({data}) => {
          Indicator.close();
         var data=data.data;
        if(data&&data.list.length){
          var list=data.list;
          this.watchs.firstLoad=true;
          for(var i=0;i<list.length;i++){
            var str=list[i].dateTime+' '+list[i].startTime;
            var d=new Date(str.replace(/-/g,'/'));
            var time=d.getHours()+':00';
            if(this.watchs.json[time]==undefined){
              this.watchs.json[time]=[];
            }
            this.watchs.json[time].push(list[i])
          }
          this.watchs.list=Object.assign({},this.watchs.json);
          console.log('watch.list=',this.watchs.list)
          if(data.list.length==10){
            this.watchs.loadtext = '正在玩命加载...';
            this.watchs.loading=false;
          }else{
            this.watchs.loadtext = '已加载全部数据';
            this.watchs.loading=true;
          }
        }
       })
      },
      watchBot:function () {
        if(!this.watchs.loading&&this.livenav=='watch'){
          console.log('watchs=',this.watchs.loading)
          this.watchs.page++;
          this.watch()
        }
        this.watchs.loading=true;
      },
      liveback:function () {
        this.livebacks.firstLoad=true;
        this.$http.get(`/apiurl/epg/backChannelRecommend.json?openid=default&order=sort`).then(({data}) => {
          console.log('back',data)
          if(data.code==200){
             this.livebacks.channelList=data.data;
          }
        })
        this.$http.get(`/apiurl/epg/backRecommend.json?page=1&pageSize=6`).then(({data}) => {
          if(data.code==200){
            this.livebacks.list=data.data.list;
          }
       })
      }
    }
  }
</script>

<style scoped lang="scss">
  .headline{padding-left:.72rem;z-index: 10}
  .righttab{margin-left: 22%;width:78%;padding: 0 .2rem .1rem;
  li{padding: .16rem 0;height:1.48rem;
  img{
    width:1.92rem;height:1.16rem;background:url("../assets/img/tvlive_tvbg.png") no-repeat;background-size: auto 1.16rem; background-position: center;
  }
  .dt{
    padding: 0 .1rem 0 2.02rem;
  }}
  }
  .watchlist{padding-top: .3rem;
     ul{padding-bottom: .3rem;
       .time{
          padding:0 .2rem .3rem;
         .time_left{margin-right: .3rem;width:.48rem;height:.48rem;border-radius:.28rem;border:2px solid #bbb;position:relative;margin-right:.3rem;
           &:before{width:.24rem;height:.24rem;border-radius: .12rem;background: #bbb;content: "";display: block;position: absolute;
            left:0;right:0;top:0;bottom:0;margin: auto;}
         }
       }
     li{padding: 0 .4rem .4rem .78rem;display:flex;justify-content: space-between;
      .dt{width: 60%;padding-left:.3rem;line-height: .6rem;
      .channel{
         img{width:.6rem;height: .6rem;margin-right: .2rem;}
      }
      .gobtn{width: 80%;height:.6rem;background: #0B78E3 }
      }
     }
     }
  }
  .liveback{
    ul{flex-wrap:wrap;
      .channelbg{
        background: url("../assets/img/zb_backbg.png") no-repeat;background-size: 100%;width: 100%;padding-bottom: 100%;
      img{padding:.14rem;}
      }
    }
   .moreChannel{border:1px solid #888;height: .56rem;line-height: .56rem;margin: .1rem;}
  }

</style>
<style>
  .live .mint-tab-container{padding:1rem 0;height:calc(100vh);overflow: scroll}
</style>

<template>
  <div class="home pt88 pb60">
    <div class="swipe ptr" >
      <mt-swipe :auto="4000" @change="swiperChange">
        <mt-swipe-item v-for="v in poster"><router-link  :to="{path:'detail',query:{videoType:v.videoType,id:v.vodId}}"><img v-view="v.image" alt=""></router-link></mt-swipe-item>
      </mt-swipe>
      <p class="pta b0 wp100 title cff" v-if="poster.length">{{poster[swipeIndex].title}}</p>
    </div>
    <div class="column fs24 bdb5 alic">
      <router-link v-for="v in classfiy" :to="{path:'list',query:{coltype:v.name_en,name:v.name}}" v-if="v.name_en=='tv'||v.name_en=='film'||v.name_en=='arts'||v.name_en=='anime'||v.name_en=='documentary'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'index_live',query:{name_en:'channel',leftbar:v.name_en=='cctv'?'cctv':''}}" v-if="v.name_en=='live'||v.name_en=='cctv'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'index_live',query:{name_en:'liveback'}}" v-if="v.name_en=='huikan'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'classify'}" v-if="v.name_en=='more'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
    </div>
    <div class="bdb5 list">
      <router-link to="live_hot" class="topline fs32">热播频道 <span class="fr c66 fs24">更多</span></router-link>
      <div class="listbox ovh">
         <router-link class="item" v-for="(v,index) in hotlist"  :to="{path:'detail_zb',query:{channelID:v.channelId,typeId:v.typeId,providerId:v.providerId,channelSpareOther:v.channel_spareOther1}}">
             <p class="size-cover ptr ovh">
               <img v-view="v.epgs[0].imageLink" alt="" class="J_img wp100 hp100 pta l0 t0">
               <span class="zb_channel alic pta">
                   <img :src="v.channel_icon_small" alt="">
               </span>
             </p>
               <mt-progress :value="v.epgs[0].playProgress" :bar-height="3"></mt-progress>
               <p class="J_til fs28 ellipsis alic">{{v.epgs[0].seriestitle}}</p>
         </router-link>
       </div>
    </div>
    <div class="bdb5 list">
      <div class="topline fs32">为你推荐 <span class="fr c66 fs24"  @click="getRec">换一批</span></div>
      <div class="listbox ovh">
        <router-link class="item" v-for="(v,index) in recomList"  :to="{path:'detail',query:{videoType:v.videoType,id:v.id}}">
          <p class="size-cover ptr ovh">
            <img v-view="v.image" :key="v.image" alt="" class="J_img wp100 hp100 pta l0 t0">
          </p>
          <p class="J_til fs28 ellipsis alic">{{v.title}}</p>
        </router-link>
      </div>
    </div>
    <div class="bdb5 list" v-for="v in classifyList" v-if="classifyList.length">
      <router-link :to="{path:'list',query:{coltype:v.videoType,name:v.currentEpisode}}" class="topline fs32">{{v.currentEpisode}} <span class="fr c66 fs24">更多</span></router-link>
      <router-link :to="{path:'detail',query:{coltype:v.videoType,id:v.vodId}}" class="wp100 pb20 " tag="div">
        <p class="topimg ovh"><img class="wp100" v-view="v.image" alt=""></p>
        <p class="ellipsis pl10 pr10">{{v.title}}</p>
      </router-link>

      <div class="listbox ovh" v-if="v.list.length">
        <router-link class="item" v-for="vv in v.list" :to="{path:'detail',query:{coltype:vv.videoType,id:vv.vodId}}">
          <p class="size-cover ptr ovh">
            <img v-view="vv.image"  alt="" class="J_img wp100 hp100 pta l0 t0">
          </p>
          <p class="J_til fs28 ellipsis alic">{{vv.title}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "index_home",
      data(){
        return {
          poster:[],
          swipeIndex:0,
          classfiy:[],
          hotlist:[],
          recomList:[],
          classifyList:[]
        }
      },

       beforeMount(){
         this.getRec();
         this.$http.get('/server/recommend/index/picture.json').then(({data})=>{
           if(data.code=='200'){
            this.poster=data.data;
           }
           console.log('海报', this.poster);
         });

         if(!this.$store.state.classify){
           this.$http.get('/server/recommend/index/videoTypes.json').then(({data})=>{
             if(data.code=='200'){
             this.classfiy=data.data;
             this.$store.commit('setClassify',data.data)
           }
           console.log('分类', this.classfiy);
          })
         }else{
           this.classfiy=this.$store.state.classify
         }


         this.$http.get('/apiurl/epg/realtime.json?appKey=1&token=1&page=1&pageSize=6').then(({data})=>{
           if(data.code=='200'){
           this.hotlist=data.data.list.slice(0,6);
         }
         console.log('热门频道', this.hotlist);
       })

         this.$http.get('/server/recommend/index/index.json').then(({data})=>{
           if(data.code=='200'){
             this.classifyList=data.data;
           }
         console.log('点播推荐', this.classifyList);
       })
       },
      methods:{
        swiperChange(index){
           this.swipeIndex=index;
        },
        getRec(){
          this.$http.get('/apiurl/vod/recommend/index/app/mix/itu.json?appKey=1&token=1&terminalId=').then(({data})=>{
            if(data.code=='200'){
            this.recomList=data.data;
            console.log('为你推荐', this.recomList);
          }
        })
      }
    }
    }
</script>

<style scoped lang="scss">

  /*.home{background:url("../assets/img/logo.png")}*/
.swipe{height:3.96rem;
img{width: 100%;height:100%;}
.title{background: rgba(0,0,0,0.5);padding:0 .2rem;height:.5rem;line-height:.5rem;}}

</style>

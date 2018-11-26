<template>
   <div class="index_db pt88 pb60">
     <div class="headline bgcff wp100 fixed l0">
       <mt-navbar v-model="dbnav" class="dbhead">
         <mt-tab-item  v-for="(v,index) in  navList" :id="v.type" :key="index"  >{{v.name}}</mt-tab-item>
       </mt-navbar>
     </div>
     <mt-tab-container v-model="dbnav"  class="pt88">
       <mt-tab-container-item :id="v.type"  v-for="v in navList" v-show="(dbnav==v.type)&&classArr[v.type]&&classArr[v.type].length">
           <div :id="v.type" class="dbitem">
         <router-link :to="{path:'detail',query:{coltype:vv.videoType,id:vv.vodId}}" class="wp100 pb20 " tag="div" v-for="(vv,index) in classArr[v.type]" v-if="index==0">
           <img class="wp100" v-view:Tv="vv.image" alt="" v-if="v.type=='Tv'">
           <img class="wp100" v-view:Arts="vv.image" alt="" v-if="v.type=='Arts'" >
           <img class="wp100" v-view:Film="vv.image" alt="" v-if="v.type=='Film'">
           <img class="wp100" v-view:Doc="vv.image" alt="" v-if="v.type=='Doc'">
           <img class="wp100" v-view:Anime="vv.image" alt="" v-if="v.type=='Anime'">
           <p class="ellipsis pt10 pl10">{{vv.title}}</p>
           <p class="ellipsis pl10  fs24">{{vv.shortDesc1}}</p>
         </router-link>
         <div class="bdb5 list" v-for="(vv,index) in classArr[v.type]">
           <router-link :to="{path:'list',query:{coltype:vv.videoType,name:vv.currentEpisode}}" class="topline fs32">{{vv.currentEpisode}}<span class="fr c66 fs24">更多</span></router-link>
           <router-link :to="{path:'detail',query:{videoType:vv.videoType,id:vv.vodId}}" class="wp100 pb20 " tag="div" v-if="index>0">
             <p class="topimg ovh">
               <img class="wp100" v-view:Tv="vv.image" alt="" v-if="v.type=='Tv'">
               <img class="wp100" v-view:Arts="vv.image" alt="" v-if="v.type=='Arts'" >
               <img class="wp100" v-view:Film="vv.image" alt="" v-if="v.type=='Film'">
               <img class="wp100" v-view:Doc="vv.image" alt="" v-if="v.type=='Doc'">
               <img class="wp100" v-view:Anime="vv.image" alt="" v-if="v.type=='Anime'">
             </p>
             <p class="ellipsis pl10 pr10">{{vv.title}}</p>
           </router-link>
           <div class="listbox ovh" v-if="vv.list.length">
             <router-link class="item" v-for="(list,index) in vv.list"  :to="{path:'detail',query:{videoType:list.videoType,id:list.vodId}}">
               <p class="size-cover ptr ovh">
                 <img  v-view:Tv="list.image" alt="" v-if="v.type=='Tv'" class="J_img wp100 hp100 pta l0 t0">
                 <img  v-view:Arts="list.image" alt="" v-if="v.type=='Arts'" class="J_img wp100 hp100 pta l0 t0">
                 <img  v-view:Film="list.image" alt="" v-if="v.type=='Film'" class="J_img wp100 hp100 pta l0 t0">
                 <img  v-view:Doc="list.image" alt="" v-if="v.type=='Doc'" class="J_img wp100 hp100 pta l0 t0">
                 <img  v-view:Anime="list.image" alt="" v-if="v.type=='Anime'" class="J_img wp100 hp100 pta l0 t0">
               </p>
               <p class="J_til fs28 ellipsis alic">{{list.title}}</p>
             </router-link>
           </div>
         </div>
           </div>
       </mt-tab-container-item>
     </mt-tab-container>
   </div>
</template>

<script>
  import { Indicator } from 'mint-ui'
    export default {
        name: "index_db",
      data(){
        return{
          navList:[
          {'name':'电视剧','type':'Tv'},
          {'name':'综艺','type':'Arts'},
          {'name':'电影','type':'Film'},
          {'name':'纪录片','type':'Doc'},
          {'name':'动漫','type':'Anime'}
        ],
          classArr:{
          }
        }
      },
      computed:{
        dbnav:{
          get:function () {
            return this.$store.state.dbnav
          },
          set:function (nav) {
            if(this.dbnav!=nav){
              this.$store.commit('setdbNav',nav)
              console.log('2',this.classArr[nav])
              if(!this.classArr[nav]){
                Indicator.open('加载中...');
              }
              this.getList();
            }
          }
        }
      },
      created(){

         if(!this.classArr[this.dbnav]){
           console.log('1',this.classArr[this.dbnav])
           Indicator.open('加载中...');
         }
          this.getList()
        },
        methods:{
           getList:function () {
             if(this.classArr[this.dbnav]&&this.classArr[this.dbnav].length){return false;}
              this.$http.get(`/server/recommend/index/programType${this.dbnav}.json`).then(({data}) => {
                Indicator.close()
                console.log('点播推荐', data);
               if(data.code==200){
                 this.classArr[this.dbnav]=data.data;
                 this.classArr=Object.assign({},this.classArr)
               }
              })
           }
        }
    }
</script>

<style scoped lang="scss">
.index_db{
  .headline{top:.87rem;z-index: 2}
  .dbitem{height:calc(100vh - 43px - 1.89rem);overflow: scroll}
}
</style>


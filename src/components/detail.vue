<template>
 <div class="detail " :class="{'detail-hid':isshowdec}">
   <div class="detail_info bdb fs24 c88 flex wp100" v-if="detail">
     <div class="wp40 mr20">
      <div class="size-cover info_left ptr">
        <img v-view="detail.image" class="pta t0 l0 wp100 hp100" alt="">
      </div>
     </div>
       <div class="info-right wp50">
          <p class="ellipsis fs34 c33">{{detail.title}}</p>
          <p class="ellipsis pt10"><span class="fs30 c33">导演:</span> {{detail.directors}}</p>
          <div class="ellipsis"><span class="fs30 c33">主演:</span>{{detail.actors}}</div>
         <div class="tag pt10 pb10"><span v-for="(v,index) in detail.tags" class="mr10 cff pl10 pr10 fs24" >{{v}}</span></div>
         <p class="ellipsis"><span class="fs30 c33">年份:</span> {{detail.year}}</p>
       </div>
   </div>
   <div class="detail_btns bdb5 bgcff flex">
     <p class="ovh left">
       <span class="mr20 title ellipsis">{{detail.title}}</span>
       <span class="corange">{{detail.score}}</span>
     </p>
     <ul class="tool fs24 c33 alic flex">
       <li @click="goplay(darma[0])">
         <img src="../assets/img/detail_touping.png" alt=""><p>投屏</p>
       </li>
       <li @click="collect">
         <img src="../assets/img/detail_col.png" alt=""><p>收藏</p>
       </li>
       <li @click="is_showshare=true">
         <img src="../assets/img/detail_share.png" alt=""><p>分享</p>
       </li>
       <li @click="showdec">
         <img src="../assets/img/detail_des.png" alt=""><p>简介</p>
       </li>
     </ul>
   </div>
   <div class="bdb5 actors" v-if="actorlist.length">
     <p class="f34 c33 title">影人作品</p>
       <ul class="actorlist wp100 scrollx nwap" id="actorlist">
         <li v-for="(v,index) in actorlist" class="alic" :class="{'active':starIndex==index}" @click="changeactor(v,index)">
           <img v-view:actorlist="v.image?v.image:'img/mxdefault.png'" alt="" >
           <p class="ellipsis wp100">{{v.name}}</p>
           <div class="a_line ptr">
              <div class="angle">
              </div>
           </div>
         </li>
       </ul>
       <ul class="actorwork wp100 scrollx nwap pl20" id="actorwork" v-if="actorwork.length">
         <router-link :to="{path:'detail',query:{coltype:v.starsWorks[0].videoType,id:v.starsWorks[0].id}}" v-for="v in actorwork" tag="li">
            <p class="size-cover ptr">
              <img v-view:actorwork="v.starsWorks[0].image" alt="" class="pta wp100 hp100 l0 t0">
            </p>
           <p class="ellipsis pl10 pr10">{{v.starsWorks[0].title}}</p>
         </router-link>
       </ul>
   </div>
   <div class="list">
     <div class="topline fs32">猜你喜欢</div>
     <div class="listbox ovh">
       <router-link class="item" v-for="(v,index) in tjlist"  :to="{path:'detail',query:{videoType:v.videoType,id:v.id}}">
         <p class="size-cover ptr ovh">
           <img v-view="v.image" alt="" class="J_img wp100 hp100 pta l0 t0">
         </p>
         <p class="J_til fs28 ellipsis alic">{{v.title}}</p>
       </router-link>
     </div>
   </div>
   <div class="dec_zhan c33 fs24" v-show="isshowdec">
       <p class="fs34 bgcff title">剧集 <img @click="hidedec" class="fr" src="../assets/img/detail_close.png" alt=""></p>
       <p class="pb20 fs28">{{detail.title}} <span class="c66 fs24">{{detail.score}}</span></p>
       <p>导演：{{detail.directors}}</p>
       <p class="ptr" style="padding-left: .8rem;"><span class="pta">主演：</span>{{detail.actors}}</p>
       <p class="d_dec">{{detail.description}}</p>
   </div>
   <sharebox  :show="is_showshare"  @hideshare="hideshare"/>
 </div>
</template>

<script>
  import {mapState} from 'vuex'
  import sharebox from '@/components/header/detail_share.vue'
    export default {
        name: "",
      data(){
        return{
          detail:'',
          tjlist:[],
          actorlist:[],
          starIndex:0,
          actorpage:1,
          actorwork:[],
          isshowdec:false,
          is_collect:false,
          is_showshare:false,
          darma:[]
        }
      },
      computed:{
        ...mapState(['global'])
      },
      components:{
        sharebox
      },
      created(){
    console.log('$children',this.$children )
    console.log('$root',this.$root )
        this.getDetail()
      },
      watch:{
        '$route'(to,from){
          console.log(this.$route.query)
          Object.assign(this.$data, this.$options.data())
          this.getDetail()
        }
      },
      methods:{
        showdec:function () {
          this.isshowdec=true;
        },
        hidedec:function () {
          this.isshowdec=false
        },
        hideshare:function(v){
          console.log('hideshare',v);
          this.is_showshare=false;
        },
        goplay:function (v) {
          if(!this.global.token){
            window.location.href='#/login';
            return;
          }
          if(!this.global.boxId){
            this.$tipshow({
              'msg': '请先绑定设备',
              'type': 'warning'
            });
            return;
          }
          v=v?v:this.detail;
          this.$http.get(`/apiurl/push/video/${this.global.token}.json?boxId=${this.global.boxId}&type=1&vid=${this.$route.query.id}&title=${this.detail.title}&image=${encodeURI(this.detail.image)}&idx=${this.$route.query.videoType=='film'?1:v.idx}&url=${this.$route.query.videoType=='film'?'':v.media}&videoType=${this.$route.query.videoType}`).then(({data})=>{
            if(data.code=="200"){
              this.$tipshow({
                'msg': '推送成功',
                'type': 'success'
              })
            }else{
              this.$tipshow({
                'msg': data.msg,
                'type': 'warning'
              })
            }
          })
          this.addhistory(v)
        },
        addhistory:function(v) {
          if(!this.detail||!this.global.token) {
            return;
          }
          this.$http.get(`/apiurl/user/history/add/${this.global.token}.json?type=1&deviceId=${this.global.boxId?this.global.boxId:''}&title=${this.detail.title}&image=${encodeURI(this.detail.image)}&idx=${this.$route.query.videoType=='film'?1:v.idx}&vid=${this.$route.query.id}`).then(({data})=>{
            console.log('添加历史',data);
          })
        },
        getdm:function() {
            this.$http.get(`/apiurl/videos/movieList.json?token=${this.global.token}&appKey=${this.global.appKey}&videoType=${this.$route.query.videoType}&programId=${this.$route.query.id}&orderby=sort`
            ).then(({data})=>{
              if(data&&data.code=='200'&&data.data.length){
                console.log('剧集信息',data);
                //剧集集数
                this.darma =data.data;
              }else{
                 this.darma=false;
              }
            })
          },
        getDetail:function () {
          this.$http.get(`/apiurl/videos/album.json?appKey=1&token=1&videoType=${this.$route.query.videoType}&id=${this.$route.query.id}`).then(({data})=> {
              if(data.code==200){
                  data.data.directors=data.data.directors?data.data.directors.replace(/;/g, ' / '):'';
                  data.data.actors=data.data.actors?data.data.actors.replace(/;/g, ' / '):'';
                  data.data.tags=data.data.tags?data.data.tags.split(';'):[];
                    let tags=[]
                    for(var i=0;i<data.data.tags.length;i++){
                      if(tags.length==3){break;}
                      if(data.data.tags[i]){
                        tags.push(data.data.tags[i])
                      }
                    }
                   data.data.tags=tags;
                  this.getdm()
                  this.detail=data.data;
                  this.recomList();
                  this.colstate();

            let dec= this.detail.shortDesc||this.detail.description;
            this.wxshare.weixinshare_(this.detail.title,this.detail.image,dec?dec.substr(0, 26) + '···':'');
              }
          })

          this.$http.get(`/apiurl/star/starShow.json?appKey=1&token=1&id=${this.$route.query.id}`).then(({data})=> {
            if(data.code==200&&data.data&&data.data.actor&&data.data.actor.length){
            this.actorlist=data.data.actor;
            this.changeactor(this.actorlist[0],0)
          }
        })
     },
        recomList:function () {
          this.$http.get(`/apiurl/vod/recommend/albumListByITI.json?appKey=1&token=1&page=1&pageSize=6&Type=${this.$route.query.videoType}&albumId=${this.$route.query.id}`).then(({data})=> {
            if(data.data.list.length){
              this.tjlist=data.data.list;
            }
          })
        },
        changeactor:function (v,index) {
          this.starIndex=index;
          this.actorpage=1;
          this.starWork(v.starId)
       },
        starWork:function (starId) {
          this.$http.get(`/apiurl/star/albumListByStar.json?appKey=1&token=1&orderby=sort&starId=${starId}&page=${this.actorpage}&pageSize=15&videoType=${this.$route.query.videoType}&albumId=${this.$route.query.id}`).then(({data})=> {
            if(data.code==200&&data.data&&data.data.list.length){
            this.actorwork=data.data.list;
          }else{
              this.actorwork=[];
            }
        })
      },
      colstate:function (){//收藏状态
            if(global.token){
//              if(!global.boxId){
//                this.$http.post(`/apiurl/user/device/current/${global.token}.json` , {}).success(function(dec) {
//                  if(dec.code==200&&dec.data&&dec.data.deviceId){
//                    setCookie('boxId',dec.data.deviceId)
//                    this.global.boxId=dec.data.deviceId;
//                  }
//                })
//              }
              this.$http.get(`/apiurl/user/status/1/${global.token}.json?vid=${this.detail.id}`, {}).then(({data})=>{
                console.log('节目收藏状态', data);
                if(data&& data.code == 200){
                  this.is_collect = data.data.iscollected ? true : false; //是否收藏
                }
              })
            }
        },
        collect:function(){
          if(!global.token){
            window.location.href='#/login';
            return false;
          }
          if(!this.detail){
            this.$tipshow({
              'msg': '无法添加收藏',
              'type': 'warning'
            });
            return false;
          }
          var urlscy;
          if(!this.is_collect) { //收藏
            urlscy = `/apiurl/user/collect/add/${global.token}.json?deviceId=${global.boxId?global.boxId:''}&title=${this.detail.title}&idx=&vid=${this.detail.id}&type=1&image=${this.detail.image}`;
          } else { //取消收藏
            urlscy = `/apiurl/user/collect/delete/${global.token}.json?ids=${this.detail.id}`;
          }
          this.$http.get(urlscy).then(({data})=>{
            console.log('收藏', data);
            if(data && data.code == "200"){
              this.$tipshow({
                'msg': this.is_collect ? '取消收藏' : '收藏成功',
                'type': 'success'
              })
              this.is_collect = !this.is_collect;
            } else {
              this.$tipshow({
                'msg': this.is_collect ? '取消收藏失败' : '收藏失败',
                'type': 'warning'
              });
            }
          })
        }

      }
    }
</script>

<style scoped lang="scss">
  .detail-hid{height: 100vh;overflow: hidden;}
  .detail{
    .detail_info{padding:.4rem .2rem .3rem;
    .info_left{
      box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.4);
    }
    .info-right{
      .tag span{
        display: inline-block;background: #bcbcbc;line-height: .44rem;
      }
    }
   }

  .actors{
    .title{
      padding: .2rem .3rem;
    }
    .actorlist{
      height: 2.4rem;
      li {
        display: inline-block;
        margin: .16rem;
        width: 1rem;
        img {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border: 2px solid transparent;
          background: url("../assets/img/default.png") no-repeat;background-size: 100%;
        }

  .a_line {
    border-bottom: 1px solid transparent;height:.3rem;
  }
  &.active {
    .a_line {
      border-bottom: 1px solid #3887ff;
      .angle{
        position: absolute;width:0;border:5px solid transparent;border-bottom:5px solid #3887ff; left: 50%;bottom: 0;margin-left: -5px;
        &:before {
           position: absolute;
           content: '';
           margin-left: -5px;
           left: 0;
           width: 0;
           height: 0;
           border: 5px solid transparent;
           border-bottom: 5px solid #fff;
           top: -4px;
         }
      }
    }
    img{border:2px solid #3887ff;}
  }
       }
    }
  .actorwork{
    li{
      width:2.6rem;padding-right:.2rem;display: inline-block;
    }
  }
  }
  .dec_zhan{
    position: fixed;padding:.2rem .3rem;top:calc(.7rem + 0.528 * (100vw - .4rem));bottom: 0;left:0;right:0;background: #fff;z-index:100;transition: all .9s ease-in;overflow-y:auto;
    .title{position:fixed;top:calc(.7rem + 0.528 * (100vw - .4rem));left:0;right:0;padding:.2rem .3rem;
      img{height: .6rem;padding: .15rem .3rem;}
    }
    .d_dec{padding: 0 .3rem;}
  }
  }
</style>

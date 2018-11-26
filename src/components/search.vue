<template>
<div class="search pt88 pb60">
  <nav class="headline  headline-fixed alic wp100 bgcff ptr">
     <p class="pta fs32 searchbtn" @click="$router.go(-1)" v-show="!key">取消</p>
     <p class="pta fs32 searchbtn" @click="clicksearch()" v-show="key">搜索</p>
    <!--<mt-search v-model="key" cancel-text=""  class="bdb" placeholder="请输入片名、主演或导演" autofocus @keyup.enter.native="clicksearch()">-->
      <!--<mt-cell v-for="v in assoList" :title="v" @click.native="keysearch(v)"></mt-cell>-->
    <!--</mt-search>-->
    <input type="text" v-model="na">
      <p>na:{{na}}</p>
  </nav>
  <div class="" v-show="!key">
     <div class="his" v-show="history.length">
        <ul class="">
          <li v-for="v in history" class="ellipsis" @click="keysearch(v)">{{v}}</li>
        </ul>
       <p class="pb20 bdb fs24 c88 alir">清空历史纪录</p>
     </div>
     <div class="hotsearch" v-show="hotlist.length">
        <p class="fs34">热门搜索</p>
       <ul>
         <li v-for="(v,index) in hotlist" @click="keysearch(v.title)"><span>{{index+1}}</span>{{v.title}}</li>
       </ul>
     </div>
  </div>
  <div class="result" v-show="key" :style="{paddingTop:type=='vod'?'1.78rem':'0.98rem'}">
     <div class="bdb5 bgcff typeBox">
         <ul class="lh88 flex sbet c66" ><li v-for="v in typeList" class="wp33 alic" :class="{'cblue':v.type==type}" @click="changeType(v.type)">{{v.k}}</li></ul>
         <ul v-show="type=='vod'" class="vodhead flex" ><li v-for="(v,index) in typeList[0].arr" class="alic" :class="{'cblue':vodtype==index}" :style="{width:100/typeList[0].arr.length+'%'}" @click="changeVod(index,v)">{{v.k}}</li></ul>
     </div>
    <mt-tab-container v-model="type" >
      <mt-tab-container-item id="vod" class="vodList" v-infinite-scroll="vodBot"  infinite-scroll-disabled="activeJson.vod.loading"  infinite-scroll-distance="5">
        <router-link tag="div" class="li bdb flex" v-for="(v,index) in  activeJson.vod.list" :to="{path:'detail',query:{videoType:v.videoType,id:v.id}}">
           <div class="img">
             <p class="size-cover ptr">
               <img v-view="v.image" alt="" class="pta l0 t0 hp100 wp100">
             </p>
           </div>
          <div class="info fs24 ">
             <p class="fs30 ellipsis">{{v.title}}</p>
             <p class="ellipsis">{{v.year}}</p>
             <!--<p class="ellipsis tag">类型：<span v-for="vv in tags(index)">{{vv}}</span></p>-->
             <p class="ellipsis tag" v-tag="v.tags"></p>
             <p class="ellipsis">导演：{{v.directors}}</p>
             <p class="ellipsis">主演：{{v.actors.length>32?v.actors.substr(0,30)+'...':v.actors}}</p>
             <p class="play_btn fs28 cff">立即观看</p>
          </div>
        </router-link>
        <p class="loadtext">{{activeJson.vod.loadtext}}</p>
      </mt-tab-container-item>
      <mt-tab-container-item id="live" class="liveList">
         <div class="item" v-for="v in activeJson.live.list">
           <router-link :to="{path:'detail_zb',query:{channelID:v.channelId}}" tag="p" class="livetitle bdb fs30 flex">
             <img v-view="v.iconBig" alt="" class="mr20">{{v.channelZh}}
           </router-link>
           <ul class="bdb">
              <li v-for="(vv,index) in v.epgs" class="ptr">
                 <p class="fs24">{{vv.date}} {{vv.startTime}}</p>
                 <p class="ellipsis">{{vv.title}}</p>
                 <span class="timer  alic fs24" :class="{'timerActive':vv.isorder}" @click="ordertv(vv,index,v)">{{vv.isorder?'已预约':'预约'}}</span>
              </li>
           </ul>
         </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="review" class="liveList">
        <div class="item" v-for="v in activeJson.review.list">
          <router-link :to="{path:'detail_zb',query:{channelID:v.channelId}}" tag="p" class="livetitle bdb fs30 flex">
            <img v-view="v.iconBig" alt="" class="mr20">{{v.channelZh}}
          </router-link>
          <ul class="bdb">
            <router-link v-for="(vv,index) in v.epgs" :to="{path:'detail_zb',query:{channelID:vv.channelID,data:vv.data,startTime:vv.startTime,endTime:vv.endTime}}" tag="li" class="ptr">
                <p class="fs24">{{vv.date}} {{vv.startTime}}</p>
                <p class="ellipsis">{{vv.title}}</p>
                <span class="timer  alic fs24">回看</span>
            </router-link>
          </ul>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</div>
</template>

<script>
    export default {
        name: "",
      data(){
        return{
          na:1,
          hotlist:[],
          assoList:[],
          loadtext:'正在加载...',
          history:[],
          key:'',
          vodtype:0,
          getresult:false,
          type:'vod',
          typeList:[
            {"k":"点播","arr":[
            {"k": "全部",  "v": ""},
            {"k": "电影",  "v": "film"},
            {"k": "电视剧","v": "tv"},
            {"k": "动漫",  "v": "anime"},
            {"k": "综艺",  "v": "arts"},
            {"k": "纪录片","v": "documentary"}
          ],"type":'vod'},
            {"k": "直播","type":'live'},
            {"k": "回看","type":'review'}],
          activeJson:{
            vod: {list:[],page:1,loading:true,loadtext:'正在加载...'},
            live:{list:[],page:1,loading:true,loadtext:'正在加载...'},
            review:{list:[],page:1,loading:true,loadtext:'正在加载...'},
          },
        }
      },

      created(){
        this.$http.get(`/apiurl/vod/hotRank/hotRanks.json?token=1&appKey=1`).then(({data})=>{
          this.hotlist=data.data;
        })
      },
      methods:{
      /*  tags:function (index) {
          let arr=this.activeJson[this.type].list[index].tags.split(';'),str='',tagarr=[];
          for(let i=0;i<arr.length;i++){
            if(arr[i]&&tagarr.length<3){
              tagarr.push(arr[i])
            }
          }
          return tagarr;
        },*/
        vodBot:function () {
          if(!this.loading){
            this.page++;
            this.getList();
          }
          this.loading=true;
        },
        setlocal:function () {
          if(!this.key){return;}
         let str=window.localStorage.getItem('hissearch'),strarr=[];
          if(str){
              str!=null?strarr=str.split(','):'';
            if((strarr.indexOf(this.key)<0)&&strarr.length){
               str=this.key+','+strarr.join(',').substr(0,200)
            }
          }else{
            str=this.key;
          }
          window.localStorage.setItem('hissearch',str);
          this.history = window.localStorage.getItem('hissearch') ? window.localStorage.getItem('hissearch').split(',').slice(0, 6) : [];
        },
        associate:function (){
          this.$http.get(`/apiurl/search/searchkey.json?token=1&appKey=1&page=1&pageSize=40&key=${this.key.replace(/\s/ig,'')}`).then(({data})=>{
            this.assoList=data.data;
            console.log('联想',data.data)
          })
        },
        keysearch:function (title) {
          this.loadtext='正在加载...';
          this.assoList=[];
          this.activeJson[this.type].loading=false;
          this.getresult=true;
          this.key=title;
          this.init();
        },
        clicksearch:function () {
          if(this.key){
            this.assoList=[];
            this.loading=false;
            this.setlocal();
            this.init();
          }
        },
        changeType:function (type) {
           this.type=type;
          if(!this.activeJson[this.type].list.length){
            this.init();
          }
        },
        changeVod:function (eq){
          this.vodtype=eq;
          this.init();
        },
        init:function (){
          this.activeJson[this.type].page=1;
          this.activeJson[this.type].list=[];
          this.loadtext='正在加载...';
          this.getList();
        },
        getList:function () {
          let url;
          if(this.type=='vod'){
            url=`/apiurl/search/xcxsearch.json?token=1&appKey=1&key=${this.key}&page=${this.activeJson[this.type].page}&pageSize=20&programType=${this.typeList[0].arr[this.vodtype].v}`
         }else{
            url=`/apiurl/search/searchEPGIPhone.json?token=1&appKey=1&key=${this.key}&page=${this.activeJson[this.type].page}&pageSize=20&ishand=${this.type=='live'?0:1}`
          }
          this.$http.get(url).then(({data})=>{
            if(data.code=='200'&&data.data&&data.data.totalrecords){

                this.activeJson[this.type].list=this.activeJson[this.type].list.concat(data.data.list)

              if(data.data.currentPage!=data.data.totalPage){
                this.activeJson[this.type].loadtext='正在加载...';
              }else{
                this.activeJson[this.type].loadtext='已加载全部数据';
              }
           }else{
             this.activeJson[this.type].loadtext='暂无数据';
            }
          Object.assign(this.activeJson,this.activeJson)
          })
        }
      },

      watch:{
        key:function (val,oldval) {
           console.log(val,'=valandoldval=',oldval)
          console.log(this.$options.data().activeJson)
          this.$data.activeJson=this.$options.data().activeJson
           if(this.getresult){this.getresult=false;return;}
           this.associate()
        }
      }
    }
</script>

<style  lang="scss">
 .search {
   .headline{
     /*padding:.09rem .3rem;*/
     .searchbtn{right:.3rem;top:0;line-height: .88rem;z-index: 100;}
   }
   .his{
     padding:.3rem;
     ul{
       li{padding:0 .4rem;height:.6rem;line-height:.6rem;border-radius:.3rem;background:#f6f6f6;margin: 0 .2rem .2rem 0;display: inline-block}
     }
   }
 .hotsearch{padding: .2rem .3rem;
  ul{
   li{height:.9rem;padding:.3rem 0;line-height: .3rem;
    span{font-size: .24rem;display: inline-block;color:#fff;margin-right: .2rem;width:.3rem;height:.3rem;line-height: .3rem;border-radius: 3px;text-align: center;background: #d7d7d7;  }
    &:nth-child(1) span{background: #f82b1a;}
    &:nth-child(2) span{background: #ff6600;}
    &:nth-child(3) span{background: #ff8f00;}
   }
    }
 }
 .result{
   .typeBox{position: fixed;width: 100%;top:.87rem;left:0;background: #fff;z-index: 2;}
   .vodhead{border-top:1px solid #e0e0e0;line-height: .8rem;height:.8rem;}
   .vodList{padding:0 .3rem;
   .li{padding:.3rem .08rem .4rem;
     .img{width:37%;margin-right:.3rem;}
     .info{width:63%;
      .tag span{display: inline-block;margin-right:.1rem;background: #ccc;color:#fff;padding:0 .1rem;}
     .play_btn{
       display:inline-block;margin-top:.08rem;height:.6rem;line-height: .6rem;padding:0 .2rem;background: url("../assets/img/detail_play.png") no-repeat;background-size: 100% 100%;
     }}
     &:last-of-type{border-bottom: none;}
   }
 }
 .liveList{
   .item{
     .livetitle{padding:.1rem 0 .1rem .3rem;line-height: 1rem;height:1.2rem;
     img{height:1rem;}}
     ul{padding:.2rem .3rem;
        li{line-height: .48rem;padding: .1rem 0;
          .timer{width:.9rem;height:.4rem;line-height: .4rem;position: absolute;right:0;top:.15rem;text-align: center;background: #e0e9fe;border-radius: .2rem;}
        }
     }
   }
 }
 }
 }
</style>

<template>
  <div class="detail_zb">
    <nav class="headline headline-title headline-fixed alic  wp100 ">
      <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
      <p class="fs30 alic cff ellipsis" v-show="showtitle">{{activejmitem.videoTitle?activejmitem.videoTitle:''}}</p>
    </nav>
    <div class="video wp100 ptr">
      <div class="pta wp100 hp100 adbox" v-show="!showgd">
        <div class="pta numtime cff alic">{{num}}</div>
        <img class="wp100 hp100" src="../assets/img/ad.png" alt="">
      </div>
      <video v-show="showgd"  ref="video" src=""  autoplay_preload="none" x-webkit-airplay="true" webkit-playsinline="true"  playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" controls="controls"></video>
      <div class="pta back_tishi cff" v-show="isshow_backtishi">
        该频道暂只支持投屏播放，请点击投屏按钮
      </div>
      <div class="pta  back_tishi cff" v-show="noBackurl">
        暂无法手机播放，可以尝试投屏观看
      </div>
    </div>
    <div class="detail_btns bdb bgcff flex">
      <p class="ovh left">
        <img class="channelimg"  :src="info.channel_icon_small?info.channel_icon_small:'/static/channel_bg.jpg'">
        <span class="fs14 c33  ml5 ellipsis" style="width:2.1rem">{{info.channelZh}}</span>
      </p>
      <ul class="tool fs24 c33 alic flex">
        <li @click="goplay">
          <img src="../assets/img/detail_touping.png" alt=""><p>投屏</p>
        </li>
        <li @click="clickchange">
          <img src="../assets/img/detail_tv.png" alt=""><p>换台</p>
        </li>
        <li @click="collect">
          <img src="../assets/img/detail_col.png" alt=""><p>收藏</p>
        </li>
        <li @click="is_showshare=true">
          <img src="../assets/img/detail_share.png" alt=""><p>分享</p>
        </li>
      </ul>
    </div>

    <div class="zb_bot pl20 pr20">
      <p class="jmtime nwap scrollx pt10 pb20 wp100" :scrollLeft.prop="scrollleft" v-show="!is_changeChannel">
        <span class="item fs24"   v-for="(v,index) in jmtime" :class="{'active cff':index==jmtimeeq}" @click="changeday(index,v.timestr)">{{v.day}}</span>
      </p>
      <ul class="jmlist" v-show="!is_changeChannel" :scrollTop.prop="jmtime.length&&jmtime[jmtimeeq].scrolltop">
        <li v-for="(v,index) in jmtime.length&&jmtime[jmtimeeq].jmlist" class="ovh" :class="{'active':v.live_active}">
          <span class="fs24 dsib left fl">{{v.startTime}}</span>
          <span class="ellipsis dsib title fl">{{v.epgTitle}}</span>
          <span   class="timer fr"  v-if="(v.back_active&&todayeq==jmtimeeq)||todayeq>jmtimeeq" @click="goback(v,index)">回看</span>
          <span  class="fr" :class="{'liveTime':v.live_active}" v-if="v.live_active&&todayeq==jmtimeeq" @click="zbclick(v,index)">直播中</span>
          <span  class="timer fr" :class="{'timerActive':v.isorder==1}" v-if="(v.order_active&&todayeq==jmtimeeq)||todayeq<jmtimeeq" @click="ordertv(v,index)">{{v.isorder==1?'已预约':'预约'}}</span>
        </li>
      </ul>
      <div class="chanelbox" v-show="is_changeChannel">
         <ul class="leftbar alic fs34">
            <li v-for="(v,index) in chanel.leftbar" @click="changeleft(index)" :class="{'active':index==chanel.index}">{{v.nameZh}}</li>
         </ul>
        <div  class="righttab bsz">
          <ul class="ovh">
          <li  class="ptr alic fl" :class="{'active':v.channelID==cutId}" v-for="v in chanel.activeList" @click="changeright(v)">
            <a  href="javascript:;" class="item pta">
              <img   v-view="v.iconSmall">
              <p  class="fs24 c33 ellipsis">{{v.channelName}}</p>
            </a>
          </li>
          </ul>
          <p class="alic c88 h88 lh88 wp100" v-show="loadtext">{{loadtext}}</p>
        </div>

      </div>
    </div>
    <sharebox  :show="is_showshare"  @hideshare="hideshare"/>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import sharebox from '@/components/header/detail_share.vue'
  export default{
    name: "detail_zb",
    data(){
      return{
        scrollleft:0,
        showgd:false,
        cutId:'',
        info:{},
        num:5,
        jmtimeeq:null,
        todayeq:null,
        zhiboeq:null,
        jmtime:[],
        activejmitem:{},
        initjmtime:[],
        is_showshare:false,
        is_changeChannel:false,
        isshow_backtishi:false,
        back:false,
        noBackurl:false,
        showtitle:true,
       chanel:{
        leftbar:[],
        index:0,
        page:1,
        list:{}
        },
        loadtext:'正在玩命加载...',
        backjson:{},
        oldchannelId:''

      }
    },
     created(){
      this.cutId=this.$route.query.channelID;
      this.week();
      this.changeChannel();
      this.getjmlist();
    },
    computed:{
      ...mapState(['global'])
    },
    components:{
      sharebox
    },
    methods: {
      hideshare:function(v){
        console.log('hideshare',v);
        this.is_showshare=false;
      },
      week:function () {
        const data=new Date(),
          dayactive=data.getDay();
        data.setDate(data.getDate()-4);
        for(let i=0;i<7;i++){
          data.setDate(data.getDate()+1);
          let obj={};
          if(data.getDay()==dayactive){
            this.jmtimeeq=i;
            this.todayeq=i;
          }
          obj.timestr=data.getFullYear()+'-'+(data.getMonth()+1<10?('0'+(data.getMonth()+1)):(data.getMonth()+1))+'-'+(data.getDate()>=10?data.getDate():('0'+data.getDate()));
          obj.day=(data.getMonth()+1<10?('0'+(data.getMonth()+1)):(data.getMonth()+1))+'月'+(data.getDate()>=10?data.getDate():('0'+data.getDate()))+'日';
          this.jmtime.push(obj);
          this.initjmtime.push({...obj});
//          this.$route.queryrollleft=1.22*window.rem*2;
        }

      },
      zbclick:function () {

      },
      getjmlist:function (v) {
        this.oldchannelId=this.cutId;
        const t=new Date(),
            tstr=this.jmtime[this.jmtimeeq].timestr.replace(/-/ig,'/');
        let jmlist;
        this.back=false
        var com=()=>{
          const len=jmlist.length
          let start,end,gt=0,
          nextdate=new Date(tstr);
          this.jmtime[this.jmtimeeq].scrolltop=0;
          if(t.getDate()==nextdate.getDate()){
            this.todayeq=this.jmtimeeq;
            for(let i=0;i<len;i++){
              //找出回看
              if(v){
                this.back=true;
                if((jmlist[i].channelID==this.$route.query.channelID)&&(jmlist[i].date==this.$route.query.date)&&(jmlist[i].startTime==this.$route.query.startTime)&&(jmlist[i].endTime==this.$route.query.endTime)) {
                  gt = i;
                  this.backjson={
                    'index':i,
                    'date':jmlist[i].date
                  };
                  this.activejmitem=jmlist[gt];
                  break;
                }
              }
              start=new Date(tstr+' '+jmlist[i].startTime).getTime();
              end=new Date(tstr+' '+jmlist[i].endTime).getTime();
              if(start>end){
                nextdate.setDate(nextdate.getDate() + 1);
                let nexttstr= nextdate.getFullYear() + '/' +(nextdate.getMonth() + 1 < 10 ? ('0' + (nextdate.getMonth() + 1)) : (nextdate.getMonth() + 1)) + '/' + (nextdate.getDate() >= 10 ? nextdate.getDate() : ('0' + nextdate.getDate()));
                end=new Date(nexttstr + ' ' + jmlist[i].endTime).getTime();
              }
              if(t<start){
                jmlist[i].order_active=true;
              }else if(t>=start&&t<end){
                this.zhiboeq=i;
                jmlist[i].live_active=true;
                this.activejmitem=jmlist[i];
              }else if(t>start){
                jmlist[i].back_active=true;
              }
            }
            this.jmtime[this.jmtimeeq].scrolltop=(this.zhiboeq-3)*.7* window.rem
          }
          this.jmtime[this.jmtimeeq].jmlist=jmlist;
          this.$set(this.jmtime,this.jmtimeeq,this.jmtime[this.jmtimeeq])
          if(this.global.token){
            this.$http.get(`/apiurl/reserveLive/selectReserveLive.json?token=${this.global.token}`).then(({data})=>{
               if(data.data.code==200&&(typeof data.data=='object')){
                  const orderlist=data.data;
                  for(let i=0;i<len;i++){
                    let start_j=tstr+' '+jmlist[i].startTime+':00',
                    end_j=tstr+' '+jmlist[i].endTime+':00',
                    startime = new Date(tstr + ' ' + jmlist[i].startTime).getTime();
                    if(t<startime){
                       if(orderlist.length){
                         let jInfo='liveStartTime=' + start_j + '&liveEndTime=' + end_j + '&channelId='+this.$route.query.channelID;
                          for(let j=0;j<orderlist.length;j++ ){
                            let oInfo='liveStartTime=' + orderlist[j].liveStartTime + '&liveEndTime=' + orderlist[j].liveEndTime + '&channelId='+orderlist[j].channelId;
                             if(oInfo==jInfo){
                                jmlist[i].isorder=1;
                             }
                          }
                       }
                    }
                    this.jmtime[this.jmtimeeq].jmlist=jmlist;
                    this.$set(this.jmtime,this.jmtimeeq,this.jmtime[this.jmtimeeq])
                  }
               }
            })
          }
          //this.jmtime=Object.assign([], this.jmtime)
        }

        if(this.jmtime[this.jmtimeeq].jmlist){
          jmlist=this.jmtime[this.jmtimeeq].jmlist;
          com();
          return;
        }
        this.$http.get(`/apiurl/epg/depth.json?appKey=1&token=1&channelId=${this.cutId}&date=${this.jmtime[this.jmtimeeq].timestr}`).then(({data})=>{
          jmlist=data.data?data.data.list:[];
        const t=new Date();
        com();
      })

      },
      collect:function(){
        if(!this.global.token){
          window.location.href='#/login';
          return;
        }
       let urlscy;
        if(!this.is_collect){ //收藏
          urlscy =`/apiurl/user/collect/add/${this.global.token}.json?deviceId=${this.global.boxId?this.global.boxId:''}&title=${this.info.channelZh}&idx=&vid=${this.$route.query.channelID}&type=2&image=${this.info.channel_icon_small}`;
        } else{ //取消收藏
          urlscy =`/apiurl/user/collect/delete/${this.global.token}.json?ids=${this.cutId}`;
        }
        this.$http.get(urlscy).then(({data})=>{
          console.log('收藏', data);
          if(data && data.code == "200"){
            var msg = this.is_collect ? '取消收藏' : '收藏成功';
            this.$tipshow({
              'msg': msg,
              'type': 'success'
            })
            this.is_collect = !this.is_collect;
          }else{
            var msg = this.is_collect ? '取消收藏失败' : '收藏失败';
            this.$tipshow({
              'msg': msg,
              'type': 'warning'
            })
          }
        })
      },
      goplay:function (){
        if(!this.global.boxId){
          this.$tipshow({
            'msg': '未绑定，请登录扫码',
            'type': 'warning'
          });
          return;
        }
        if(this.activejmitem.live_active){
          this.$http.get(`/apiurl/push/live/${this.global.token}.json?boxId=${this.global.boxId}&seriesId=${this.info.epgs[0].seriesId}&channelId=${this.info.channelId}&typeId=${this.info.typeId}&providerId=${this.info.providerId}&channelSpareOther=${this.info.channel_spareOther1}&imageLink=${encodeURI(this.info.epgs[0].imageLink)}&url=`, {}).then(({data})=>{
            if(data.code=="200") {
              this.$tipshow({
                'msg': '推送成功',
                'type': 'success'
              });
            }else{
              this.$tipshow({
                'msg': '推送失败',
                'type': 'warning'
              });
            }
          });
        }else if(!this.activejmitem.live_active&&this.activejmitem.back_active){
          this.$http.get(`/apiurl/liveback/playurl.json?token=${this.global.token}&appKey=1&channelId=${this.activejmitem.channelBackID}&startDateTime=${this.activejmitem.startDateTime}&portalId=1&client=${this.global.boxId}&account=${this.global.boxId}`).then(({data})=>{
            if(data.code=="200"&&data.data){
              let start = new Date((this.activejmitem.date + ' ' + this.activejmitem.startTime).replace(/\-/g, "/")).getTime();
              let endt = new Date((this.activejmitem.date + ' ' + this.activejmitem.endTime).replace(/\-/g, "/")).getTime();
              this.$http.get(`/server/wx-ser/remote/play/back?boxId=${this.global.boxId}&startTime=${(start/1000)}&endTime=${(endt/1000)}&url=${encodeURI(data.data)}&title=${encodeURI(this.activejmitem.title)}&openid=${this.global.openid}`).then(({data})=>{
                if(data.code=="200"){
                  this.$tipshow({
                    'msg': '推送成功',
                    'type': 'success'
                  });
                }else{
                  this.$tipshow({
                    'msg': '推送失败',
                    'type': 'warning'
                  });
                }
              });
            }else{
              this.$tipshow({
                'msg': '推送失败',
                'type': 'warning'
              });
            }
          });

        }
        this.addChannel();
      },
      addChannel:function() {
          this.$http.get(`/apiurl/user/history/add/${this.global.token}.json?type=2&deviceId=${this.global.boxId?this.global.boxId:''}&vid=${this.cutId}&title=${this.info.channelZh}&image=${this.info.channel_icon_small}&idx=`).then(({data})=>{
            console.log('添加常看频道',data);
          });
      },
      ordertv:function(data, index){
        if(!this.global.token){
          this.$tipshow({
            'msg': '无法预约',
            'type': 'warning'
          });
          return;
        }
        var  liveStartTime = this.jmtime[this.jmtimeeq].timestr + " " + data.startTime+':00';
        var  liveEndTime = this.jmtime[this.jmtimeeq].timestr + " " + data.endTime+':00';
        let orderUrl,msg=data.isorder?'取消':'';
        if(data.isorder){
          orderUrl = `/apiurl/reserveLive/delReserveLive.json?token=${this.global.token}&channelIdLiveStartTimes=${this.cutId}_${liveStartTime}`;
        }else{
          orderUrl = `/apiurl/reserveLive/addReserveLive.json?token=${this.global.token}&liveStartTime=${liveStartTime}&liveEndTime=${liveEndTime}&channelId=${this.cutId}&channelNameZh=${encodeURI(data.channelZh)}&channelNameEn=${encodeURI(data.channelEn)}&programName=${encodeURI(data.videoTitle?data.videoTitle:data.epgTitle)}&isReserve=1&channelPicUrl=${encodeURI(data.channelIconBig)}&seriesId=${data.videoId}&seriesImage=`;
        }
        this.$http.get(orderUrl).then(({data})=>{
          console.log(`${msg}预约节目`,data);
          if(data&&data.code == 200) {
            data.isorder=!data.isorder;
            this.$tipshow({
              'msg': `${msg}预约成功`,
              'type': 'success'
            })
          } else {
            this.$tipshow({
              'msg': `${msg}预约失败`,
              'type': 'warning'
            })
          }
        })
      },
      goback:function (v,index) {
        this.backjson={
          'index':index,
          'date':v.date
        };
        this.noBackurl=false;
        this.activejmitem=v;
        if(v.channelID=='138'){
          let dateTime=v.date+" "+v.startTime;
          this.$http.get(`/apiurl/liveback/phoneplayurl.json?token=${this.global.token}&appKey=1&guid=5487589938&date=${v.date}&dateTime=${dateTime}`).then(({data})=>{
            if(data&&data.code=='200'&&data.data){
              this.$refs.video.src=data.data;
              this.$refs.video.play();
              document.addEventListener("WeixinJSBridgeReady", function () {
                this.$refs.video.play();
              }, false);
              this.showtitle=false;
            }else{
              this.noBackurl=true;
              this.$refs.video.src='';
            }
          });
        }else{
          this.isshow_backtishi=true;
        }
      },
      zbclick:function(v,index) {
        if(v){//点直播中
          this.isshow_backtishi=false;
          this.activejmitem=v;
          this.backjson={
            'index':index,
            'date':v.date
          };
          if(v.channelID=='138'){
            this.noBackurl=false;
          }
        }
        this.$refs.video.src=this.zbUrl;
        this.$refs.video.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
          this.$refs.video.play();
        }, false);
        this.showtitle=false;
      },
      changeChannel:function () {
        this.getplayUrl();
        this.getInfo();
        if(this.global.token){
          this.colstate()
        }
      },
      changeday:function (eq,timestr) {
        this.jmtimeeq=parseInt(eq);
//        this.$route.queryrolltop=0;
        this.getjmlist();
      },
      getplayUrl:function () {
        this.$http.get(`/server/open-apilive/playlive.json?channelId=${this.cutId}`).then(({data})=> {
          if(data.code==200&&data.data&&data.data[0].m3u8Url){
            this.num=5;
          let timer=setInterval(()=>{
            this.num=--this.num;
            if(this.num<0){
              clearInterval(timer);
              this.showgd=true;
              this.num=0;
              this.$refs.video.src=data.data[0].m3u8Url;
              this.$refs.video.play();
              document.addEventListener("WeixinJSBridgeReady", function () {
                this.$refs.video.play();
              }, false);
              this.showtitle=false;
            }
          },1000)
        }
      })
      },
      getInfo:function () {
        this.$http.get(`/apiurl/epg/currentChannelEpg.json?channelid=${this.cutId}`).then(({data})=>{
          if(data.code==200){
          this.info=data.data;
        }
      })
      },
      clickchange:function (){
        this.is_changeChannel=!this.is_changeChannel;
        if(this.chanel.leftbar&&this.chanel.leftbar.length){
          this.getChanel();
        }else{
          this.getLeftbar();
        }
        if(!this.is_changeChannel&&(this.oldchannelId!=this.cutId)){
          this.jmtime=[]
          for(let i=0;i<this.initjmtime.length;i++){
            this.jmtime.push({...this.initjmtime[i]})
          }
          if(this.$route.query.date&&this.$route.query.startTime&&this.$route.query.endTime){
            this.getjmlist(true); //直播节目单初始化
            this.isshow_backtishi=true;
          }else{
            this.getjmlist(); //直播节目单初始化
          }
        }
      },
      getLeftbar:function () {
        this.$http.get(`/apiurl/epg/liveNavigation.json?parentId=2`).then(({data})=>{
          if(data.code=='200'&&data.data&&data.data.length){
          this.chanel.leftbar=data.data;
          for (let i=0;i<data.data.length;i++){
            this.chanel.list[data.data[i].nameEn]={};
            this.chanel.list[data.data[i].nameEn].list=[]
          }
          this.chanel=this.chanel;
          this.getChanel();
        }
        })
      },
      changeleft:function(eq){
        this.chanel.index=eq;
        this.chanel.page=1;
        this.chanel.activeList=[];
        this.getChanel()
      },
      colstate:function(){
        this.$http.get(`/apiurl/user/status/2/${this.global.token}.json?vid=${this.cutId}`).then(({data})=>{
          if(data&&data.code==200){
            this.is_collect=data.data.iscollected
          }
        })
      },
      changeright:function(v){
        this.cutId=v.channelID;
       /* if(v&&v.channelName){
          this.info={
            channelZh:v.channelName,
            channel_icon_small:v.iconSmall
          }
        }*/
        this.showgd=true;
       this.changeChannel()
      },
      getChanel:function (){
        let curleft=this.chanel.leftbar[this.chanel.index], nameEn=curleft.nameEn;
        if(this.chanel.list[nameEn].loaded||this.chanel.list[nameEn].nodata){
          this.chanel.activeList=this.chanel.list[nameEn].list;
          this.loadtext = '';
          this.chanel=Object.assign({},this.chanel);
          return false;
        }else if(this.chanel.list[nameEn].page){
          this.chanel.page=this.chanel.list[nameEn].page+1;
        }
        this.$http.get(`/apiurl/epg/channel.json?parentId=${curleft.parentId}&nameEn=${curleft.nameEn}&page=${this.chanel.page}&pageSize=20`).then(({data})=>{
          if(data.code=='200'&&data.data&&data.data.list.length){
            this.chanel.list[nameEn].list = this.chanel.list[nameEn].list.concat(data.data.list);
            this.chanel.list[nameEn].page=this.chanel.page;
            this.chanel.activeList= this.chanel.list[nameEn].list;
            if (data.data.list.length==20){
              this.loadtext = '正在玩命加载...';
            } else {
              this.chanel.list[nameEn].loaded=true;
              this.loadtext = '';
            }
          this.chanel=Object.assign({},this.chanel);
          }else{
            if(this.chanel.list[nameEn].list.length){
              this.chanel.list[nameEn].loaded=true;
              this.loadtext = '';
            } else{
              this.loadtext = '暂无数据';
              this.chanel.list[nameEn].nodata=true;
            }
          this.chanel=Object.assign({},this.chanel);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .detail_zb{
  .video{height:4rem;background:#000;
    video {position: absolute;left: 0;top: 0;height: 100%;width: 100%;object-fit: fill;}
    .back_tishi{top:0;left:0;height: 100%;width: 100%;display: flex;align-items: center;justify-content:center;z-index: 10;    background: rgba(0,0,0,.65);}
  .adbox{z-index:4;
  .numtime{background: rgba(0,0,0,0.6);width:.6rem;height:.6rem;border-radius: 4px;line-height: .6rem;right:.2rem;top:.2rem;}
  }
  }
  .zb_bot{
  .jmtime{
    .item{margin:0 .16rem;padding:0 .16rem;display: inline-block;line-height: .44rem;
    &.active{
       background: #0b78e3;border-radius: 4px;
     }}
  }
  .jmlist{height:calc(100vh - 5.7rem - 1px);overflow-y:auto;
  li{height: .7rem;line-height: .7rem;
  .left{width:20%;text-align: left;}
  .title{width:40%;}
  .timer,.liveTime{text-align:center;width:.9rem;height: .4rem;line-height: .4rem;margin-top:.15rem;}
  .timer{background: #e0e9fe;color:#333;border-radius: .2rem;}
  &.active{color:#007aff;}
  }
  }
    .chanelbox{
      .leftbar{
        top:4.96rem;bottom:0;overflow-y: auto;
      }
      .righttab{
        height:calc(100vh - 4.96rem);overflow-y: auto;padding: .1rem 0;
      }
    }
  }

  }
</style>


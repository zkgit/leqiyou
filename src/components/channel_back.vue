<template>
  <div class="channelBack">
    <nav class="headline headline-title headline-fixed alic bdb wp100 bgcff">
      <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
      <p class="fs36 c33">回看频道</p>
    </nav>
    <div class="pt100">
      <ul class="leftbar c33 alic"><li v-for="v in leftbar" :class="v.nameEn==activeJson.nameEn?'active':''" @click="changeleft(v)">{{v.nameZh}}</li></ul>
      <ul class="righttab">
        <li class="ptr alic fl" v-for="v in activeChanList">
          <router-link :to="{path:'detail_zb',query:{channelID:v.channelID}}"  class="item">
            <img v-view="v.iconSmall" alt="">
            <p class="fs24 c33 ellipsis">{{v.channelName}}</p>
          </router-link>
        </li>
       </ul>
    </div>

  </div>

</template>

<script>
    export default {
        name: "",
      data(){
        return{
          leftbar:[],
          activeJson:{},
          chanList:{},
          activeChanList:[],
          page:1,
          loadtext:'正在玩命加载...'
        }
      },
      created(){
        this.$http.get('/apiurl/epg/liveNavigation.json?parentId=4').then(({data})=> {
          console.log('backleftbar', data)
        if (data.code == '200'&&data.data&&data.data.length) {
          this.leftbar = data.data;
          this.activeJson=data.data[0]
          for(var i=0;i<data.data.length;i++){
            this.chanList[data.data[i].nameEn]={};
            this.chanList[data.data[i].nameEn].list=[]
          }
          console.log(this.chanList)
          this.getList()
        }
      })
      },
      methods:{
       changeleft:function (v){
        this.activeJson=v;
         this.page=1;
         this.activeChanList=[];
         this.getList();
      },
        getList:function () {
          const nameEn=this.activeJson.nameEn;
          if(this.chanList[nameEn].loaded||this.chanList[nameEn].nodata){
            this.activeChanList= this.chanList[nameEn].list;
            return false;
          }else if(this.chanList[nameEn].page){
            this.page=this.chanList[nameEn].page+1;
          }
          this.$http.get('/apiurl/epg/back.json?parentId='+this.activeJson.parentId+'&nameEn='+this.activeJson.nameEn+'&page='+this.page+'&pageSize=20').then(({data})=> {
            console.log('backleftbar', data)
          if (data.code == '200'&&data.data&&data.data.list.length) {
            this.chanList[nameEn].list = this.chanList[nameEn].list.concat(data.data.list);
            this.chanList[nameEn].page=this.page;
            this.activeChanList= this.chanList[nameEn].list;
            console.log('this.activeChanList',this.activeChanList)
            if(data.data.list.length==20){
              this.loadtext = '正在玩命加载...';
            }else{
              this.chanList[nameEn].loaded=true
              this.loadtext = '';
            }
          }else{
            if( this.chanList[nameEn].list.length){
              this.chanList[nameEn].loaded=true;
              this.loadtext = '已加载全部数据';
            } else{
              this.loadtext = '暂无数据';
              this.chanList[nameEn].nodata=true;
            }
          }
        })
        }
      }
    }
</script>

<style scoped lang="scss">
 .channelBack {

 }
</style>

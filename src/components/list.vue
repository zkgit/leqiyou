<template>
  <div class="pglist  pb60">
    <nav class="headline headline-title headline-fixed alic bdb wp100 bgcff">
      <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
       <p class="fs36 c33">{{$route.query.name}}</p>
    </nav>
    <div class="chooseBox c66 fs24 bgcff wp100">
      <ul class="wp100" v-for="v in setting.classify">
        <li :class="{'active':setting[vv.tagLabel_en]==(vv.name=='全部'?'':vv.name)}" v-for="(vv,index) in v.items" @click="changeClass(vv.tagLabel_en,vv.name)">{{vv.name}}</li>
      </ul>
    </div>
    <div class="listbox ovh"  v-infinite-scroll="getBot"  infinite-scroll-disabled="loading" infinite-scroll-distance="5">
        <router-link class="item" v-for="(v,index) in setting.list"  :to="{path:'detail',query:{videoType:v.videoType,id:v.id}}">
          <p class="size-cover ptr ovh">
            <img v-view="v.image" alt="" class="J_img wp100 hp100 pta l0 t0">
          </p>
          <p class="J_til fs28 ellipsis alic">{{v.title}}</p>
        </router-link>
    </div>
    <p class="alic fs24 c33 pt10 pb10">{{setting.loadtext}}</p>
  </div>

</template>
<script>
    export default{
        name: "list",
        data(){
           return {
             setting:{
               page:1,
               classify:[],
               list:[],
               loading:true,
               year: "",
               tag: "",
               area:"",
               loadtext: '正在玩命加载...',
               coltype:'',
               scroll:0
             }
           }
        },
        created(){
          console.log(' created')
          const data=this.$store.state.listpage[this.$route.query.coltype];
          if(data){
              this.setting=data;
             if(data.scroll > 0){
                window.scroll(0,data.scroll)
             }
          }else{
            this.$http.get('/apiurl/navigation/classifys.json').then(({data})=>{
              console.log('list', data)
            this.setting.coltype=this.$route.query.coltype
            if (data.code == '200') {
              this.setting.classify = data.data;
              for(var i=0;i<this.setting.classify.length;i++){
                this.getClassify(this.setting.classify[i],i)
              }
            }
          })
          }
        },

      beforeRouteLeave(to, from, next){
        this.loading=true;
        this.setting.scroll=window.scrollY
        this.$store.commit('setlistpage',this.setting);
        next()
      },
        methods: {
          getClassify:function (v,index) {
            this.$http.get('/apiurl/navigation/classify.json?parentId='+v.parentId+'&tagLabel_en='+v.tagLabel_en).then(({data})=> {
              if (data.code == '200') {
                  v.items=data.data;
                this.setting=Object.assign({},this.setting);
              }
              if(index==(this.setting.classify.length-1)){
                this.getAjax();
              }
          })
        },
          getAjax:function () {
            this.$http.get('/apiurl/search/filter.json?token=1&appKey=1&page='+this.setting.page+'&pageSize=15&programType='+this.$route.query.coltype+'&year='+this.setting.year+'&tags='+this.setting.tag+'&area='+this.setting.area).then(({data})=> {
              console.log('ajax', data)
            if(data.code=='200'){
              var data=data.data;
              this.setting.list=this.setting.list.concat(data.list)
              if(this.setting.page==1&&data.list.length==0){
                this.setting.loadtext = '抱歉暂无数据';
                this.setting.loading=true;
              }else if(data.currentPage !=data.totalPage){
                this.setting.loadtext='正在玩命加载...';
                this.setting.loading=false;
              }else{
                this.setting.loadtext='已加载全部数据';
                this.setting.loading=true;
              }
              this.setting=Object.assign({},this.setting);
            }
          })
          },
          getBot:function () {
            console.log('11')
            if(!this.setting.loading){
              console.log('loading=',this.setting.loading)
              this.setting.page++;
              this.getAjax();
            }
            this.setting.loading=true;
          },
          changeClass:function (type,name) {
            name=name=='全部'?'':name;
            if(this.setting[type]!=name){
              this.setting[type]=name;
              this.setting.list=[];
              this.setting.page=1;
              this.setting.loading=true;
              this.setting.loadtext = '正在玩命加载...';
              this.setting=Object.assign({},this.setting);
              this.getAjax();
            }
          }
      }
    }
</script>
<style lang="scss">
  .pglist{
    .chooseBox{padding: 0 .3rem .2rem;position:fixed;top:.87rem;left:0;z-index:1;
    ul{
      white-space: nowrap;overflow-x: auto;height:.6rem;line-height: .6rem;
      li{
        margin-left: .4rem;display: inline-block;
        &:first-child{
          margin-left: 0;
         }
         &.active{
           color:#26a2ff;
          }
      }
    }
  }
  .listbox{
    padding-top: 2.88rem;
  }
  }
</style>

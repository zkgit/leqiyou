<template>
  <div class="classpage pt88  pb60">
  <nav class="headline headline-title headline-fixed alic bdb wp100 bgcff">
    <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
    <p class="fs36 c33">分类</p>
  </nav>
    <div class="column fs24  alic pt10">
      <router-link v-for="v in classfiy" :to="{path:'list',query:{coltype:v.name_en,name:v.name}}" v-if="v.name_en=='tv'||v.name_en=='film'||v.name_en=='arts'||v.name_en=='anime'||v.name_en=='documentary'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'index_live',query:{name_en:'channel',leftbar:v.name_en=='cctv'?'cctv':''}}" v-if="v.name_en=='live'||v.name_en=='cctv'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'index_live',query:{name_en:'liveback'}}" v-if="v.name_en=='huikan'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
      <router-link v-for="v in classfiy" :to="{path:'classify'}" v-if="v.name_en=='more'"><img :src="v.image" alt=""><p>{{v.name}}</p></router-link>
    </div>
</div>
</template>
<script>
    export default{
        name: "classify",
        data(){
          return{
            classfiy:[]
          }
        },
      created(){
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
      },
        methods: {}
    }
</script>

<template>
 <div>
   <indexHead  v-if="headnav=='indexhead'" />
   <mineHead  v-if="headnav=='minehead'" />
 </div>

</template>

<script>
  import {mapState} from 'vuex'
  import indexHead from '@/components/header/indexhead'
  import mineHead from '@/components/header/minehead'
    export default {
        name: "Head",
        computed:{
          ...mapState(['headnav'])
        },
        components:{
          indexHead,mineHead
        }
    }
</script>

<style lang="scss">
.headline{height: .88rem;line-height: .88rem;}
.headline-title{padding: 0 .6rem;}
.headline-fixed{position:fixed;top:0;left:0;z-index:3;}
.headnav{height:.88rem;line-height:.7rem;padding:.09rem .3rem;
img{vertical-align: middle;height:.4rem;}
.logo{height:.7rem;left:.3rem;top:.09rem;}
a{margin-left: .3rem;}
.mineright{right:.3rem;top:.09rem;}
}
</style>

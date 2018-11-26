<template>
  <nav class="headline-fixed headnav wp100 bgcff">
    <img class="logo fl" src="../../assets/img/logo.png" alt="">
    <router-link :to="'mine_message'" class="fr"><img src="../../assets/img/message.png" alt=""></router-link>
    <router-link :to="'mine_history'" class="fr"><img src="../../assets/img/lishi_icon.png" alt=""></router-link>
    <router-link to="search" class="fr"><img src="../../assets/img/search_bk.png" alt=""></router-link>
  </nav>
</template>

<script>
  export default {
    name: ""
  }
</script>

<style lang="scss">
  .headnav{
    height:.88rem;line-height:.7rem;padding:.09rem .3rem;
    img{vertical-align: middle;height:.4rem;}
    .logo{height:.7rem;}
    a{margin-left: .3rem;}
  }
</style>

<template>
<div class="mine_set pt88">
  <nav class="headline headline-title headline-fixed alic bdb wp100 bgcff">
    <img src="static/left-arrow.png" alt="" @click="$router.go(-1)" class="back">
    <p class="fs36 c33">设置</p>
  </nav>
  <div class="mt20">
    <mt-cell title="修改密码" is-link></mt-cell>
    <mt-cell title="关于" is-link></mt-cell>
    <p class="minebtn cff alic  exit">退出登录</p>
  </div>

</div>
</template>

<script>
    export default {
        name: ""
    }
</script>

<style>
.exit{height:.72rem;width:4.56rem;margin: 0 auto;line-height: .72rem;margin: 0 auto;display: block;}
</style>

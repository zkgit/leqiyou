<template>
<div class="chosetv alic" v-show="show">
  <img src="../../assets/img/share_tishi.png" alt="" class="wp100">
  <img src="../../assets/img/share_btn.png" alt="" class="wp25 sharebtn" @click="hideshare">
</div>
</template>
<script>
    export default{
         name: "",
         props:['show'],
      created:function () {
        console.log('parent',this.$parent);
        console.log('share.$root',this.$root )
      },
        methods: {
          hideshare:function () {
            this.$emit('hideshare',false)
          }
        }
    }
</script>
<style scoped>
  .sharebtn{
    margin-top: .4rem;
  }
</style>

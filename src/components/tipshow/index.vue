<template>
  <transition name="fade"  mode="out-in" appear @after-leave="afterleave">
    <div class="tippop"  :class="[{'text':options.type!='black'},options.type]"  v-show="options.visible">
      {{options.msg}}
    </div>
  </transition>
</template>

<script>
    export default {
        name: "",
        data(){
          return{
            options:{
              visible:false,
              type:'',
              msg:''
            }
          }
        },
      methods:{
        afterleave:function () {
          this.options={
            visible:false,
              type:'',
              msg:''
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  .tippop{position:fixed;z-index: 999;top: 50%; left: 50%;height: 60px;width:200px; margin: -30px 0 0 -100px;font-size: 12px; text-align: center;color:#fff;display:flex;flex-wrap:wrap;align-items: center;justify-content: center;
      &.noback{ padding: 15px 30px; height: 100px; line-height: 35px; border-radius:4px;}
      &.warning{ background: #f2dede; border: 1px solid #ebccd1;color: #a94442;}
      &.success{ background: #dff0d8; border: 1px solid #d6e9c6;color: #3c763d;}
      &.black{top: 50%; height: 36px; background:rgba(0,0,0,0.8);border-radius:4px;line-height:36px;left: 50%; width:160px; margin: -18px 0 0 -80px;}
      &.text{padding:10px 20px;}
  }
  .fade-enter-active,.fade-leave-active {
    transition:all 0.3s ease-out;
  }
  .fade-enter {
    opacity: 0;
    transform: scale(1.2);
  }
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }

</style>

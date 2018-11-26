import Tipshow from './index.vue'
export default {
  install(Vue){
     //extend创建的是一个组件构造器，而不是一个具体的组件实例
    const Constructor=Vue.extend(Tipshow);
    //创建 Profile 实例，并挂载到一个元素上。
     const instance=new Constructor();
      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);
    Vue.prototype.$tipshow=(options={})=>{
      const {
        msg,
        type='black',
        duration=1500,
        visible=true
      }=options
      instance.options={msg,type,visible};
      setTimeout(()=>{
        instance.options.visible = false;
    },duration)
    }
  }
}

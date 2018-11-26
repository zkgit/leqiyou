import axios from 'axios'
const host= process.env.NODE_ENV== 'development'?'':'http://wxtv.yuesnm.com';
axios.create({
    baseURL:host
})
export default {
  /**
   * Vue插件 install方法
   * @param Vue
   * @param name Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
   通过 descriptor 创建的属性默认是只读的
   */
  install(Vue, name = '$http') {
    Vue.http=axios;
    Object.defineProperty(Vue.prototype,name,{value:axios})
  }
}

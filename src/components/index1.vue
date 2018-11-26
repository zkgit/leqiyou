<template>
 <div class="index" style="display: none;">
   <input  type="text" v-model="context" placeholder="请输入内容" @keydown.enter="add">
   <input v-focus type="text" v-model="context" placeholder="请输入内容" @keydown.enter="add">
   <ul>
     <li v-for="(v,index) in list" v-border>{{v}} <button @click="removeList(index)">删除</button></li>
   </ul>
   <p v-if="list.length==0" v-task>暂无数据</p>
   <p>{{resersMsg}}</p>
   <div class="nav">
     <p :class="{'active':tab==1,'wp50':true,'fl':true}" @click="changetab(1)">标题一</p>
     <p :class="[tab==2?'active':'','wp50', 'fl']" @click="changetab(2)">标题二</p>
   </div>
   <div class="container">
      <keep-alive>
         <Test1 v-if="tab==1"></Test1>
        <Test2 v-else></Test2>
      </keep-alive>
   </div>
 </div>
</template>

<script>
import Test1 from './test1.vue'
import Test2 from './test2.vue'
export default {
        name: "index",
        data(){
          return{
            tab:1,
            message:'Hello',
            context:'',
            list:[]
          }
        },
      computed:{//计算属性
          resersMsg() {
            return this.message.split('').reverse().join('')
          }
      },
       methods:{
         add(){
//           this.list[0]=this.context;
            this.list.push(this.context);
           this.context='';
         },
         removeList(index){
           this.list.splice(index,1)
         },
         changetab(index){
           this.tab=index;
         }
       },
    beforeCreate(){
      console.log('即将创建beforeCreate')
      console.log('data=',this.$data)
      console.log('el',this.$el)
    },
   created(){
     console.log('创建完毕created')
     console.log('data=',this.$data)
     console.log('el',this.$el)
   },
  beforeMount(){
    console.log('挂载前beforeMount')
    console.log('data=',this.$data)
    console.log('el',this.$el)
  },
  mounted(){
    console.log('挂载完毕mounted')
    console.log('data=',this.$data)
    console.log('el',this.$el)
  },
  directives:{//自定义局部指令
     task:{
        inserted(el){
          el.style.color='red'
        }
     },
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  filters:{

  },
  watch:{

  },
  components:{
     Test1,Test2
  }


}
</script>

<style scoped lang="scss">
.index{width:750px;}
.nav{line-height:109px;
.active{
  color:red;
}
}
</style>

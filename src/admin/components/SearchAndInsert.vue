<!--
该组件，一个查询输入框和查询按钮；
       一个添加输入框（或没有输入框）和添加按钮
       通过props：showAddInput 控制是否显示这个输入框
       查询按钮会向父组件传递一个值，父组件通过给这个子组件注册 @query 事件接收值
       添加按钮也会向父组件传递一个值，父组件通过给子组件注册 @add 事件接收值；当有添加输入框时，传递的是输入框的值；否则，传递布尔值 true
-->
<template>
  <div class="input-and-button">
    <div>
      <el-input v-model="queryStr" class="el-input" clearable  placeholder="关键字" style="width: 200px"></el-input>
      <el-button type="info" class="el-button" @click="query" style="margin-left: 20px">搜索</el-button>
    </div>
    <div >
      <el-input v-model="addStr" class="el-input" clearable  placeholder="快速添加" v-if="showAddInput" style="width: 200px;margin-right: 20px"></el-input>
      <el-button type="info" class="el-button" @click="open" >添加</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onBeforeUnmount, ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  showAddInput:Boolean
});
const emit = defineEmits(['query','add']);

const queryStr = ref('');
const addStr   = ref('');

const query = ()=>{
  let str = queryStr.value
  if (str.length>0){
    if (! /\s+/.test(str)){
      emit('query',str)
    }else {
      ElMessage.warning('请删除查询框中的空格！')
    }
  }
}
const open = ()=>{
  if (props.showAddInput.valueOf()){
    let str = addStr.value
    if (str.length>0){
      if (! /\s+/.test(str)){
        emit('add',str)
      }else {
        ElMessage.warning('请删除快速添加框中的空格！')
      }
    }
  }else {
    emit('add',true)
  }
}
onBeforeUnmount(()=>{
  queryStr.value = '';
  addStr.value = '';
})
</script>

<style scoped>
.input-and-button{
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #3cbc8d;
  margin-bottom: 10px;
}
.el-button{
  border-radius: 0;
  color: #ffffff;
  border-color: #bec2cb;
  background-color: #909399;
}
.el-button:hover{
  background-color: rgb(144, 147, 153,0.6);
}
.el-button:focus{
  background-color: rgb(144, 147, 153,0.4);
}
.el-input{
  --el-input-focus-border: rgb(245, 183, 208);
}
</style>
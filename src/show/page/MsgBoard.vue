<template>
<div style="border: 1px solid #bbbbbb;padding: 10px 15px;min-height: 500px">
  <div style="display:flex;justify-content: space-between;align-items: flex-end;padding: 10px 0  10px 0;border-bottom: 1px solid #b9b9b9">
    <el-input autofocus :rows="1" :maxlength="255" type="textarea" show-word-limit  v-model.trim="newMsg" placeholder="评论内容，必填项"></el-input>
    <el-input :maxlength="10" v-model.trim="nickname" style="width: 160px;margin-left: 10px" placeholder="昵称，可填项"></el-input>
    <el-button style="margin-left: 10px" @click="addMsg">评论</el-button>
  </div>
  <div v-for="(item) in msgs" :key="item.id" style="border-bottom: 1px solid #eeeeee;padding: 10px 0;height: content-box;display: flex;flex-direction: column">
    <div style="display: flex;flex-direction: row;justify-content: space-between;padding-bottom: 10px">
      <div style="font-size: 18px;font-weight: bold;color: #909399;font-family: 楷体">{{item.msg}}</div>
      <div style="font-size: 18px;font-weight: bold;color: #909399;font-family: 楷体">{{item.nickname}}</div>
    </div>
    <div style="align-self: flex-end;color: #999999;font-size: 16px">{{item.datetime}}</div>
  </div>

  <!--    分页-->
  <div style="flex: 1"></div>
  <div style="display: flex;justify-content: flex-end;margin-top: 5px">
    <el-pagination background layout="prev, pager, next"
                   :page-size="pageSize" :current-page="pageNum" :total="total"
                   @current-change="pageNumChange" @size-change="pageSizeChange"
    >
    </el-pagination>
  </div>
</div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {ElMessage} from "element-plus";

const msgs = ref([{id:1,datetime:"2012-12-12",msg:"你好",nickname:"李四"}])

const newMsg = ref("")
const nickname = ref("")

const pageSize = ref(5);
const pageNum  = ref(1);
const total    = ref(1)
//获取评论
const reloadData = (pageSize : number,pageNum :number)=>{
  request.get("/msg-board",{
    params:{
      'pageSize':pageSize,
      'pageNum' :pageNum
    }
  }).then( (res:MyAxiosResponse) => {
    if (res.code===2000){
      msgs.value = res.data
      total.value = res.count
    }
  })
}
//新增评论
const addMsg = ()=>{
  if (!newMsg.value){
    ElMessage.warning("请输入评论内容!");
    return;
  }
  request.post('/msg-board',{
    "msg":newMsg.value,
    "nickname":nickname.value
  }).then( () =>{
    reloadData(pageSize.value,pageNum.value);
    newMsg.value = '';
  }).catch(e =>{
    console.error(e)
  })
}
//自动刷新评论
reloadData(pageSize.value,pageNum.value)
const pageNumChange = (num:number)=>{
  pageNum.value = num
  reloadData(pageSize.value,num)
}
const pageSizeChange = (size:number)=>{
  pageSize.value = size
  reloadData(size,pageNum.value)
}
</script>

<style scoped>

</style>
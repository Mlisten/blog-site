<!--动态-->
<template>
  <div style="border: 1px solid #bbbbbb;padding: 10px 15px;min-height: 500px;display: flex;flex-direction: column">
    <div v-for="comment in commentVOs" :key="comment.id" style="border-bottom: 1px solid #eeeeee;padding: 10px 0;height: content-box">
      <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
        <el-link :href="'/article/'+comment.articleId" style="font-size: 18px">{{comment.content}}</el-link>
        <span style="font-size: 14px;color: #909399">{{comment.username}}</span>
      </div>
      <div style="display: flex;justify-content: space-between">
        <el-link :href="'/article/'+comment.articleId" style="color: #909399">{{comment.title}}</el-link>
        <span style="font-size: 14px;color: #909399">{{comment.createTime}}</span>
      </div>
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
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {ref} from "vue";

const pageSize:any= ref(10)
const pageNum :any= ref(1);
const commentVOs:any = ref([])
const total = ref(0);

const reloadData = (pageSize : number,pageNum :number)=>{
  request.get("/comment",{
    params:{
      'pageSize':pageSize,
      'pageNum' :pageNum
    }
  }).then( (res:MyAxiosResponse) => {
    if (res.code===2000){
      commentVOs.value = res.data
      total.value = res.count
    }
  })
}
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
<!--存档-->
<template>
  <div style="border: 1px solid #bbbbbb;padding: 10px 15px;min-height: 500px">
    <div style="display: flex;align-items: center;border-bottom: 1px solid #eeeeee;padding: 10px 0">
      <el-icon><List /></el-icon>
      <span style="font-size: 18px;font-weight: bold">&nbsp;{{total}}&nbsp;文章</span>
    </div>
    <div class="archives-item" v-for="(time,index) in articleTime" :key="index">
      <el-link class="el-link" :underline="false" @click="showArticleList('byTime',time.date)">
        {{time.date}}&nbsp;&nbsp;({{time.count}})
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {List} from '@element-plus/icons-vue'
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import DateUtil from "../../commons/utils/DateUtil";
const router = useRouter();
const articleTime = ref([]);
const total = ref(0);

const showArticleList = (condition : 'byTime'| 'byTypeId'| 'byTagId' ,value :number|string)=>{
  router.push('/articleList/'+condition+'/'+value)
}

onBeforeMount(()=>{
  request.get('/allOrderByTime').then((res:MyAxiosResponse) =>{
    if (res.code===2000){
      let data = res.data;
      total.value = res.count;
      if (Array.isArray(data)) {
        data.forEach((item:any)=>{
          item.date = DateUtil.format(item.date,"yyyy年MM月dd日");
        })
      }
      articleTime.value = data
    }
  })
})
</script>

<style scoped>
.archives-item{
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}
.archives-item>a:hover{
  color: #3cbc8d;
}
.el-link{
  font-size: 14px;
}
</style>
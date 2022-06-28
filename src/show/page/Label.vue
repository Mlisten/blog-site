<!--标签墙-->
<template>
  <div style="border: 1px solid #bbbbbb;padding: 10px 15px;min-height: 500px">
    <div style="display: flex;align-items: center;border-bottom: 1px solid #eeeeee;padding: 10px 0">
      <el-icon><List /></el-icon>
      <span style="font-size: 18px;font-weight: bold">&nbsp;{{label.length}}&nbsp;标签</span>
    </div>
    <div class="label-box">
      <el-link :underline="false" v-if="label" v-for="(tag,index) in label" :key="index" @click="showArticleList('byTagId',tag.id)">
        {{tag.name}}&nbsp;({{tag.count}})
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {List} from '@element-plus/icons-vue'

import {onBeforeMount, ref} from "vue";
import {useStore} from "vuex";
import { useRouter} from "vue-router";
const label :any= ref([])
const store = useStore()
const router =  useRouter();

const showArticleList = (condition : 'byTime'| 'byTypeId'| 'byTagId' ,value :number|string)=>{
  router.push('/articleList/'+condition+'/'+value)
}
onBeforeMount(()=>{
  label.value = store.state.tags;
})
</script>

<style scoped>
.label-box{
  display: flex;
  flex-wrap: wrap
}
.label-box>a{
  margin: 10px 10px 0 10px;
  padding: 2px 5px;
  border: 1px solid #eee;
  background: #eeeeee;
}
.label-box>a:hover{
  color: #3cbc8d;
  border: 1px solid #ffffff;
}

</style>
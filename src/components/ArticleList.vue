<template>
  <div class="article-item" v-for="article in articles" :key="article.id">
    <div class="article-item-top">
      <div class="article-item-top-title">
        <el-link @click="lookArticle(article.id)">{{article.title}}</el-link>
      </div>
      <div class="article-item-top-time-and-other">
        <div>
          <el-icon><Calendar /></el-icon>
          &nbsp;{{article.createTime}}
        </div>
        <el-link  :underline="false"  @click="lookArticle(article.id,'comment')">
          <el-icon><ChatRound /></el-icon>
          &nbsp;{{article.comments}}&nbsp;评论
        </el-link>
        <el-link  :underline="false" @click="lookArticle(article.id,'views')">
          <el-icon><View /></el-icon>
          &nbsp;{{article.views}}&nbsp;浏览
        </el-link>
      </div>
    </div>
      <div class="article-item-bottom hidden-sm-and-down">
        <div class="article-item-bottom-tags">
          <el-link :underline="false" @click="showArticleList('byTypeId',article.typeId)">
            #所属分类 > {{article.typeName}}
          </el-link>
          <el-link :underline="false" @click="showArticleList('byTagId',article.tagId[index])" v-for="(tagName,index) in article.tagNames" :key="tagName">
            # {{tagName}}
          </el-link>
        </div>
        <el-button plain  @click="lookArticle(article.id)">
          <span>阅读</span>
          <el-icon><DArrowRight /></el-icon>
        </el-button>
      </div>
  </div>
  <el-pagination
      :total="total" :current-page="pageNum" :page-size="pageSize"
      @current-change="pageNumChange" @size-change="pageSizeChange"
      hide-on-single-page background
  ></el-pagination>
</template>

<script setup lang="ts">
import {Calendar,ChatRound,View,DArrowRight} from '@element-plus/icons-vue'
import request from "../commons/utils/request";
import {onBeforeMount, Ref, ref, UnwrapRef, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
const route  = useRoute();
const router = useRouter();
const store  = useStore();
const pageSize= ref(5);
const pageNum = ref(1);
const total   = ref(0);
const articles :Ref<UnwrapRef<any[]>> = ref([]);


const showArticleList = (condition : 'byTime'| 'byTypeId'| 'byTagId'|'byTitle' ,value :number|string)=>{
  router.push('/articleList/'+condition+'/'+value)
}

const reloadData = (pageNum :number,pageSize :number,url = '/allArticles',val? :any) => {
  if (val && url !== '/allArticles'){
    url = '/listArticleVO/'+ url+'/'+val
  }
  request.get(url,{
    params:{
      pageNum: pageNum,
      pageSize: pageSize,
    }
  }).then( (res:any) =>{
    if (res.data.length>0){
      articles.value  = res.data
      total.value = res.count
    }else {
      ElMessage.warning("无数据")
      // router.back();
    }
  })
}
const pageNumChange = (num:number) => {
  reloadData(num,pageSize.value)
}
const pageSizeChange = (size:number) => {
  reloadData(pageSize.value,size)
}
const lookArticle = (articleId : number,scroll?:any)=>{
  if (scroll==='comment'){
    router.push('/article/'+articleId + '#评论')
  }else if (scroll==='views'){
    router.push('/article/'+articleId + '#浏览')
  }else {
    router.push('/article/'+articleId)
  }
}

onBeforeMount(()=>{
  watchEffect(()=>{
    let condition = route.params.condition;
    let val : any = route.params.val;
    if (condition == 'byTime'||condition =='byTypeId'|| condition =='byTagId'||condition =='byTitle'){
      reloadData(pageNum.value,pageSize.value,condition,val)
    }else {
      reloadData(pageNum.value,pageSize.value)
    }
  })

})
</script>

<style scoped>
.article-item{
  border: 1px solid #bbbbbb;
  margin-bottom: 20px;
  padding: 0 20px;
  width: 100%;
}
.article-item-top{
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}
.article-item-top-title>a{
  color: black;
  font-size: 24px;
}
.article-item-top-title>a:hover{
  color: #999;
}
.article-item-top-time-and-other{
  display: flex;
  padding: 10px 0;
}
.article-item-top-time-and-other>*{
  padding-right: 20px;
  color: #aaaaaa;
  font-size: 14px;
}
.article-item-top-time-and-other>a:hover{
  color: #aaaaaa;
}
.article-item-bottom{
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.article-item-bottom-tags>a{
  margin-right: 10px;
  padding: 1px 2px;
  background-color: #bbb;
  border: 1px solid #bbb;
  color: #eee;
}
.article-item-bottom-tags>a:hover{
  background-color: #aaaaaa;
  border: 1px solid #fff;
  color: #c7c7c7;
}

.el-button{
  color: #eeeeee;
  background-color: #3cbc8d;
  border-radius: 0;
  border-color: #3cbc8d;
  padding: 5px;
}

.el-button:hover{
  color: #3cbc8d;
  background-color: #909399;
  border-color: #eeeeee;
}
</style>
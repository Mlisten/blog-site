<template>
<div style="display: flex;border: 1px solid #eee;padding:10px 20px;justify-items: center;flex-direction: column;min-height: 500px" v-cloak>
  <div style="min-height: 200px;display: flex;flex-direction: column">
    <div class="main-article-top">
      <h2>{{article.title}}</h2>
    </div>
    <div class="main-article-content" v-html="article.html"></div>
    <div class="main-article-bottom">
      <div>
        <el-link :underline="false" @click="showArticleList('byTypeId',article.typeId)">
          #分类 > {{article.typeName}}
        </el-link>
        <el-link :underline="false" @click="showArticleList('byTagId',article.tagId[index])" v-for="(tagName,index) in article.tagNames" :key="tagName">
          # {{tagName}}
        </el-link>
        <el-link :underline="false" >
          <el-icon><View /></el-icon>
          {{article.views}}
        </el-link>
      </div>
      <div>
        <span>{{article.createTime}}</span>
        <span>{{article.username}}</span>
      </div>
    </div>
  </div>
  <div>
    <LinkWithSpan name="评论内容" />
    <!-- 展示评论 -->
    <div style="min-height: 200px" class="comment-contain">
      <div v-for="comment in commentVOs" :key="comment.id" style="border-bottom: 1px solid #eeeeee;display: flex;flex-direction: column;padding: 10px 0">
        <div style="display: flex;justify-content: flex-end;margin-bottom: 10px;color: #909399;align-items: flex-end">
          <span style="margin-right: 20px">{{comment.username}}</span>
          <span style="font-size: 14px">{{comment.createTime}}</span>
        </div>
        <span>{{comment.content}}</span>
      </div>
    </div>
    <el-pagination
        background
        :page-size="pageSize" :current-page="pageNum" :total="total" :page-sizes="[5,10,15,20]"
        @size-change="pageSizeChange" @current-change="pageNumChange"
    ></el-pagination>
  </div>
  <div>
    <div>
      <h5 v-if="user.username">用户：<el-button type="text" @click="intoAdmin" title="进入后台">{{user.username}}</el-button></h5>
      <LinkWithSpan name="评论" />
    </div>
    <div style="display: flex;flex-direction: column">
      <br/>
      <el-input type="textarea" v-model.trim="content"
                @keyup.enter="insert"
                placeholder="评论内容"
                maxlength="255"
                :show-word-limit="true"
                :clearable="true"
                rows="4"
      ></el-input>
      <br/>
      <el-button style="width: 60px;align-self: flex-end" @click="insert">提交</el-button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {View} from '@element-plus/icons-vue'

import request from "../commons/utils/request";
import {onBeforeMount, ref, watchEffect} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import LinkWithSpan from "./LinkWithSpan.vue";
import {ElMessage} from "element-plus";

const router = useRouter();
const route  = useRoute();
const store = useStore();
const user = store.state.user

const content:any = ref('')
const commentVOs :any= ref([])
const article :any= ref({});
const pageNum = ref(1);
const pageSize = ref(5);
const total= ref(0);
let scroll :any= ref('')
let articleId  = ref(0);
const pageSizeChange = (size:number) => {
  pageSize.value = size;
  listCommentByArticleId()

}
const pageNumChange = (num:number) => {
  pageNum.value =num;
  listCommentByArticleId()
}
const showArticleList = (condition : 'byTime'| 'byTypeId'| 'byTagId' ,value :number|string)=>{
  router.push('/articleList/'+condition+'/'+value)
}
const getArticleById = (articleId:number)=>{
  request.get('/article/'+ articleId).then( (res)=>{
    //@ts-ignore
    if (res.code === 2000){
      article.value = res.data
    }
  })
};
const listCommentByArticleId = () => {
  request.get('/comment/'+articleId,{
    params:{
      'pageNum':pageNum.value,
      'pageSize':pageSize.value
    }
  }).then( (res)=>{
    //@ts-ignore
    if (res.code === 2000){
      commentVOs.value = res.data;
      //@ts-ignore
      total.value = res.count;
      console.log(total.value)
    }
  })
}
// 添加评论
const insert = ()=>{
  let comment = content.value
  if (comment.length===0|| !articleId){
    return
  }
  let userId = user.id
  if (typeof userId !== 'number' || userId < 0){
    userId = 0;
  }
  request.post('/comment',{
    'userId'   : userId,
    'content'  : comment,
    'articleId': articleId
  }).catch(res=>{
    if (res.code===2000){
      ElMessage.success("添加成功!")
      listCommentByArticleId()
      content.value = ''
    }
  })
}
//登录过时，可以进入后台
const intoAdmin = ()=>{
  router.push('/admin')
}

onBeforeMount(()=>{
  // 路由参数变更时，自动重新获取数据
  watchEffect(()=>{
    let id :any = route.params.articleId + '';
    //确保在本组件
    if (route.path.includes('/article/')){
      try {
        id = parseInt(id)
        articleId  = id;
        //根据文章id查询这个文章的内容信息
        getArticleById(id);
        //根据文章id查询关联的评论
        listCommentByArticleId();
        console.log('articleId',articleId.value)
      }catch (e){
        ElMessage.error('参数转化错误')
      }
    }
    scroll  = route.params.scroll;
    console.log('scroll',scroll)
    if (scroll==='views'){
      //滚动到目标区域
    }else if (scroll==='comment'){
      //滚动到目标区域
    }
  });
})

</script>

<style scoped >
.main-article-top{
  display: flex;
  border-bottom: 1px solid #eeeeee;
}
.main-article-content{
  min-height: 200px;
  padding: .5rem 0;
  border-bottom: 1px solid #909399;
}
.main-article-bottom{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #909399;
}

.main-article-bottom>div:nth-child(1)>a{
  background-color: #bbbbbb;
  margin-left: 20px;
  color: #eeeeee;
  border-radius: 5px;
  padding: 2px 4px;
}
.main-article-bottom>div:nth-child(1)>a:hover{
  color: #cccccc;
}
.main-article-bottom>div:nth-child(2){
  margin-top: 5px;
}
.main-article-bottom>div:nth-child(2)>span{
  margin-left: 20px;
  color: #909399;
}
.comment-contain{
  display: inline-flex;
  flex-direction: column;
  border-bottom: 1px solid #909399;
  width: 100%;
}
</style>
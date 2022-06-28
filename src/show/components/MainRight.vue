<template>
  <div class="main-contain">
    <div class="main-run-time hidden-md-and-down">当前网站运行{{days}}天{{hour}}时{{min}}分{{second}}秒</div>
    <div class="main-tag-name">
      <span>分类</span>
    </div>
    <div class="main-tags">
      <el-tooltip :show-after="showAfter"  :content="type.count+' 篇'" placement="top" v-for="(type,index) in types" :key="index">
        <el-tag @click="showArticleList('byTypeId',type.id)" effect="plain" class="main-tag">{{type.name}}</el-tag>
      </el-tooltip>
    </div>
    <div class="main-tag-name">
      <span>标签</span>
    </div>
    <div class="main-tags">
      <el-tooltip :show-after="showAfter" :content="tag.count+' 篇'" placement="top" v-for="(tag,index) in tags" :key="index">
        <el-tag @click="showArticleList('byTagId',tag.id)" effect="plain" class="main-tag" >{{tag.name}}</el-tag>
      </el-tooltip>
    </div>
    <div class="main-icon-qq">
      <el-tooltip :show-after="showAfter" content="804464376" placement="right-end">
        <a style="text-underline: none" href="#">
          <svg viewBox="0 0 32 32" width="15px" height="15px">
            <path d="M4.821 14.393c-0.125-0.304-0.143-0.607-0.143-0.929 0-0.5 0.321-1.304 0.625-1.679-0.018-0.464 0.179-1.411 0.536-1.714 0-3.304 2.554-7.464 5.536-8.893 1.839-0.875 3.768-1.179 5.786-1.179 1.571 0 3.286 0.375 4.75 0.982 4.196 1.768 5.143 5.054 6.036 9.25l0.018 0.089c0.518 0.786 0.982 1.714 0.982 2.679 0 0.482-0.321 0.964-0.321 1.393 0 0.036 0.107 0.179 0.125 0.214 1.536 2.268 2.929 4.732 2.929 7.554 0 0.625-0.339 2.804-1.339 2.804-0.696 0-1.464-1.696-1.714-2.161-0.018-0.018-0.036-0.018-0.054-0.018l-0.089 0.071c-0.571 1.482-1.196 2.875-2.357 3.982 1.018 0.982 2.661 0.893 2.964 2.589-0.089 0.196-0.054 0.411-0.196 0.607-1.018 1.536-3.75 1.732-5.393 1.732-2.179 0-3.946-0.571-6-1.179-0.429-0.125-1.071-0.054-1.536-0.107-1.089 1.196-3.75 1.518-5.286 1.518-1.357 0-6.607-0.089-6.607-2.411 0-1 0.214-1.286 0.911-1.929 0.554-0.107 0.964-0.411 1.607-0.446 0.089 0 0.161-0.018 0.25-0.036 0.018-0.018 0.036-0.018 0.036-0.071l-0.036-0.054c-1.232-0.286-2.964-3.393-3.232-4.679l-0.089-0.054c-0.125 0-0.179 0.268-0.214 0.357-0.393 0.911-1.321 1.893-2.357 2h-0.018c-0.143 0-0.089-0.143-0.196-0.179-0.25-0.589-0.411-1.125-0.411-1.786 0-3.571 1.714-6.214 4.5-8.321z"></path>
          </svg>
        </a>
      </el-tooltip>
    </div>
    <div class="main-tags" style="display: flex;flex-direction: column;align-items: flex-end">
      <el-link type="info" class="main-link" @click="()=>{$router.push('/index')}">{{count.articlesCount}} <span class="main-link-span">文章</span></el-link>
      <el-link type="info" class="main-link" @click="()=>{$router.push('/dynamic')}">{{count.commentsCount}} <span class="main-link-span">评论</span></el-link>
      <el-link type="info" class="main-link" :underline="false">{{count.viewsCount}} <span class="main-link-span">浏览</span></el-link>
      <el-link type="info" class="main-link" :underline="false">{{count.viewsCount}} <span class="main-link-span">访问</span></el-link>
    </div>
    <div class="main-tag-name">
      <span>最新创建的文章</span>
    </div>
    <div style="border-bottom: #eee solid 1px;">
      <el-tooltip  :show-after="showAfter" placement="right" v-for="article in bestNewArticles" :key="article.id">
        <template #content>
          <span>浏览：{{article.views}}</span>
        </template>
        <div class="main-tag-article">
          <el-link type="info" :underline="false" @click="queryByArticleId(article.id)">{{article.title}}</el-link>
        </div>
      </el-tooltip>
    </div>
    <div class="main-tag-name">
      <span>访问最多的文章</span>
    </div>
    <div style="border-bottom: #eee solid 1px;">
      <el-tooltip :show-after="showAfter" placement="right" v-for="article in bestViewsArticle" :key="article.id">
        <template #content>
          <span>浏览：{{article.views}}</span>
        </template>
        <div class="main-tag-article">
          <el-link type="info" :underline="false" @click="queryByArticleId(article.id)">{{article.title}}</el-link>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {computed, onBeforeMount, onBeforeUnmount, ref} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
const store = useStore()
const route = useRoute();
const router = useRouter();

let intervalId :number|undefined ;
const date = ref('2020/12/08 14:20:21');
const totalSecond = ref(0)
const showAfter = ref(100)
const tags = ref([])
const types = ref([])
const count = ref({
  articlesCount:0,
  viewsCount:0,
  commentsCount:0,
})
//5个最新创建的文章
const bestNewArticles = ref([]);
//5个最多浏览的文章
const bestViewsArticle = ref([]);

//展示文章列表
const showArticleList = (condition : 'byTime'| 'byTypeId'| 'byTagId' ,value :number|string)=>{
  router.push('/articleList/'+condition+'/'+value)
}
//通过文章id查文章
const queryByArticleId = (id :number) => {
  router.push('/article/'+id)
}
//定义获取时间的方法
const getCurrentTime = () => {
  let number = Date.now() - Date.parse(date.value) //毫秒
  totalSecond.value = parseInt((number / 1000)+'')
}
//定义时间中的参数的获取方法
const days = computed(()=>{
  return parseInt((totalSecond.value / (24 * 3600))+'')
})
const hour = computed(()=>{
  return parseInt(((totalSecond.value - days.value * 24 *3600) /3600)+'')
})
const min = computed(()=>{
  return parseInt(((totalSecond.value - days.value * 24 * 3600 - hour.value * 3600) / 60)+'')
})
const second = computed(()=>{
  return (totalSecond.value -  days.value *24*3600 -  hour.value*3600 - min.value *60)
})
//初始化页面的工作
onBeforeMount(()=>{
  request.get('/allTags').then((res:MyAxiosResponse)=>{
    if (res.code === 2000){
      tags.value = res.data
      store.commit('addTags',res.data)
    }
  })

  request.get('/allTypes').then((res:MyAxiosResponse)=>{
    if (res.code === 2000){
      types.value = res.data
    }
  })
  request.get('/allCount').then((res:MyAxiosResponse)=>{
    if (res.code===2000){
      count.value = res.data
    }
  })
  request.get('/bestNewArticles').then((res:MyAxiosResponse)=>{
    bestNewArticles.value = res.data
  })
  request.get('/bestViewsArticles').then((res:MyAxiosResponse)=>{
    bestViewsArticle.value = res.data;
  })
  //开启定时刷新时间
  intervalId = setInterval(()=>{
    getCurrentTime();
  },250);
})
//卸载定时器
onBeforeUnmount(()=>{
  clearInterval(intervalId);
  intervalId = undefined;
})
</script>

<style scoped>
.main-contain{
  display: flex;
  flex-direction: column;
  border: 0 solid #fff;
  width: 100%;
  margin-left: 1rem;
  min-width: 14rem;
}
.main-run-time{
  background-color: #3cbc8d;
  color: #eeeeee;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
  padding: 0 30px;
}
.main-tag-name{
  border-bottom: red solid 1px;
  padding: 20px 20px 5px;
}
.main-tags{
  border-bottom: #eee solid 1px;
  padding: 20px;
}
.main-tag{
  margin-right: 8px;
  margin-bottom: 5px;
  border-radius: 0;
  color: #545c64;
  border-color: #eeeeee;
}
.main-tag:hover{
  color: #3cbc8d;
  cursor: pointer;
  border-color: #3cbc8d;
}
.main-icon-qq{
  border-bottom: red solid 1px;
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
}
.main-icon-qq>a>svg:hover{
  fill: currentColor;

  color: #3cbc8d;
}
.main-link:hover{
  color: #3cbc8d;
}
.main-link-span{
  color: #c7c7c7;
}
.main-tag-article{
  padding: 10px 20px;
}
.main-tag-article>a{
  color: #666;
}
.main-tag-article>a:hover{
  color: #3cbc8d;
}
</style>
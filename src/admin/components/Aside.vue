<template>
  <div class="admin-aside" :style="{width:width}">
    <div class="admin-aside-text" :style="{width:width}">
      <span>网站后台</span>
    </div>
    <div style="display: flex;flex-direction: column;height: calc(100% - 70px);justify-content: space-between;">
      <el-menu
          :default-active="defaultActive"
          class="admin-aside-menu"
          :style="{width:width}"
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#3cbc8d"
          text-color="#eee"
          active-text-color="#ffd04b"
          router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><House /></el-icon>
          <template  #title>仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="/admin" style="width: 100%">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/admin/user" style="min-width: 100px;padding-left: 30%">

            <template  #title>普通用户</template>
          </el-menu-item>
          <el-menu-item index="/admin/sys-user" style="min-width: 100px;padding-left: 30%">

            <template  #title>系统用户</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/article">
          <el-icon><Document /></el-icon>
          <template  #title>文章管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/comment">
          <el-icon><ChatLineRound /></el-icon>
          <template  #title>评论管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/msg-board">
          <el-icon><ChatLineRound /></el-icon>
          <template  #title>留言管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/type">
          <el-icon><FolderOpened /></el-icon>
          <template  #title>分类管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/tag">
          <el-icon><Flag /></el-icon>
          <template  #title>标签管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/setting">
          <el-icon><Tools /></el-icon>
          <template  #title>后台设置</template>
        </el-menu-item>
      </el-menu>
      <div class="admin-aside-backHome" :style="{width:width}">
        <el-button type="info" class="el-button" @click="backHome">回主页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {House,User,Document,ChatLineRound,FolderOpened,Flag,Tools } from '@element-plus/icons-vue'
import { onBeforeMount, ref, toRefs, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route =  useRoute();
const defaultActive = ref('/sea/dashboard')
const width = ref('200px')

const prop = defineProps({
  isCollapse: {
    default:false,
    type : Boolean
  }
})

const backHome = () => {
  router.push('/')
}

onBeforeMount(()=>{
  defaultActive.value = route.path;
})

// 根据  isCollapse的布尔值 去设置侧边栏的宽度
const { isCollapse } = toRefs(prop)
watch(isCollapse,(value)=>{
  if (!value){
    width.value = '200px'
  }else {
    width.value = '100px'
  }
})
</script>

<style scoped>
/* '网站后台' 盒子及字体样式*/
.admin-aside-text{
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: center;
  color: #eeeeee;
  font-size: 20px;
  border-bottom: 1px solid #ffffff;
}
/* 菜单栏 样式*/
.admin-aside{
  height: 100%;
  background-color: #3cbc8d;
}
.admin-aside-menu{
  border-right: 1px solid #3cbc8d;
  padding-left: 20px;
  padding-right: 20px;
}
/* 回主页的盒子的样式*/
.admin-aside-backHome{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  border-top: 1px solid #eeeeee;
}
/* 回主页按钮的样式*/
.el-button{
  background-color: rgba(255,255,255,0.1);
  border: none;
}
.el-button:hover{
  background-color: rgba(255,255,255,0.4);
}
.el-button:focus{
  background-color: rgba(255,255,255,0.4);
}
</style>
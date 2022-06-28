<template>
  <div class="header">
    <div class="header-top" style="background-color: #4d6c64">
      <div style="width: 80%;min-width: 50rem;display: flex;justify-content: space-between;height: 100px;line-height: 100px">
        <div style="display: inline-flex;flex-wrap: wrap;align-items: flex-end;height: 100px;line-height: 100px">
          <span style="font-size: 3rem;font-weight: bold;color: #eeeeee;margin-right: 20px;">一个简单的博客</span>
          <span style="font-size: 2rem;font-weight: bold;color: #eeeeee;padding-top: 0">向着更高处前进</span>
        </div>
        <router-link v-if="!username" to="/login" class="header-top-login-btn">管理登录</router-link>
        <router-link v-else :to="AdminApi.ADMIN" class="header-top-login-btn">{{username}}</router-link>
      </div>
    </div>
    <div class="header-bottom" style="background-color: #3cbc8d">
      <div style="width: 80%;min-width: 50rem;display: flex;align-items: center">
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            background-color="#3cbc8d"
            text-color="#eee"
            style="width: 100%;min-width: 40rem;border: 0"
            active-text-color="#ffd04b"
            @select="handleSelect"
            :router="true"
        >
          <el-menu-item index="/index" >
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/dynamic">
            <el-icon><Refresh /></el-icon>
            <span>动态</span>
          </el-menu-item>
          <el-menu-item index="/label">
            <el-icon><Flag /></el-icon>
            <span>标签墙</span>
          </el-menu-item>
          <el-menu-item index="/archives">
            <el-icon><List /></el-icon>
            <span>存档</span>
          </el-menu-item>
          <el-menu-item index="/msg-board">
            <el-icon><ChatLineSquare /></el-icon>
            <span>留言板</span>
          </el-menu-item>
        </el-menu>
        <el-input
            v-model="queryStr"
            placeholder="搜索"
            :clearable="true"
            style="max-width: 15rem;min-width: 10rem;height: fit-content"
            @keyup.enter="query"
        >
          <template #append>
            <div @click="query" class="el-input">
              <el-icon><Search color="#3cbc8d" /></el-icon>
            </div>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Refresh,House,Flag,List,Search,ChatLineSquare} from '@element-plus/icons-vue'
import {AdminApi} from "../../commons/config/api";
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
const queryStr = ref('')
const route = useRoute()
const store = useStore();
const router = useRouter();
const username = store.state.user.username

const handleSelect = (key:any,keyPath:any)=>{
  console.log(key,keyPath)
}

const query = () => {
  if (queryStr.value.length > 0&& queryStr.value.length <= 10){
    router.push('/articleList/byTitle/'+queryStr.value)
  }
}

const activeIndex = computed({
  get : ()=> route.path || '/index' ,
  set : (value : any)=>  { activeIndex.value = value},
})
</script>

<style scoped>
.header{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;

}
.header-top{
  display: flex;
  justify-content: center;
}
.header-top-login-btn{
  color: #3cbc8d;
  text-decoration-line: blink;
}
.header-top-login-btn:hover{
  color:cornflowerblue;
  text-decoration-line: revert;
}
.header-bottom{
  display: flex;
  justify-content: center;
}
.el-input:hover{
  cursor: pointer;
}
</style>
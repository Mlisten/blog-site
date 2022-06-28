<template>
<!--  前台页面的整个界面-->
<div style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;flex-wrap: nowrap">
  <!-- 头  -->
  <Header></Header>
  <!-- 内容  -->
  <Main></Main>
  <!-- 脚  -->
  <Footer></Footer>
</div>
<!--  回到顶部-->
<el-backtop class="el-tooltip" />
</template>

<script setup lang="ts">
import Footer from "../show/components/Footer.vue";
import Main from "../show/components/Main.vue"
import Header from '../show/components/Header.vue'
</script>

<style scoped>
.el-tooltip{
  color: #3cbc8d;
}
</style>
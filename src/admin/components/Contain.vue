<template>
  <!-- admin(后台页面切换组件的容器) -->
  <div class="admin-main" >
    <router-view/>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.admin-main{
  height: calc(100vh - 70px);
  width: 100%;
  padding: 0 30px;
  background-color: #eeeeee;
  overflow: auto;
}
</style>
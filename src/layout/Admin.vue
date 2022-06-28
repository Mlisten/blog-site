<template>
<!--  后台页面的整个界面-->
  <div style="display: flex;flex-direction: row;height: 100vh;width: 100%;overflow: hidden">
    <Aside :is-collapse="isCollapse"/>
    <div style="flex-direction: column;display: flex;width: 100%" :style="{width:width}">
      <MyHead @return-is-collapse="returnIsCollapse"/>
      <Contain />
    </div>
  </div>

</template>

<script setup lang="ts">
import MyHead from "../admin/components/MyHead.vue";
import Aside from "../admin/components/Aside.vue";
import Contain from "../admin/components/Contain.vue";
import {ref} from "vue";

const isCollapse = ref(false)
const width = ref('calc(100% - 100px)')

const returnIsCollapse = (value) => {
  console.log(value)
  isCollapse.value = value
  if (value){
    width.value = 'calc(100% - 100px)'
  }else {
    width.value = 'calc(100% - 200px)'
  }
}

</script>

<style scoped>

</style>
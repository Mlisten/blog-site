<template>
  <div class="dashboard">
    仪表盘,数据统计板块
    <h3>用户访问量 > 时间</h3>
    <h3>各标签下的文章数</h3>
    <h3>各分类下的文章数</h3>


  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onMounted, ref} from 'vue'
import {useStore} from "vuex";

const store = useStore();
const user = ref({});

onMounted(() => {
  user.value = store.state.user;
})
</script>

<style scoped>

</style>
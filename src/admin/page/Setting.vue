<!---->
<template>
<div class="setting">
  <h3>定时任务1：数据库保存到网盘</h3>
</div>
</template>

<script setup lang="ts">

import {useStore} from "vuex";
import {onBeforeMount, ref} from "vue";

const store = useStore();
const user = ref({});

onBeforeMount(()=>{
  user.value = store.state.user;
})
</script>

<style scoped>

</style>
<template>
<div class="footer">
  <div>© 2021 一个简单的博客 </div>
  <div>作者：李胜旺</div>
  <div>{{year}}-{{month}}-{{day}} {{hour}}:{{min}}:{{second}}</div>
</div>
</template>
<script setup lang="ts">
import {computed, onBeforeMount, onBeforeUnmount, ref} from "vue";

let intervalId = null;
const totalSecond = ref(0)

const addZero =(value)=>{
  if (value.toString().length === 1){
    value = '0' + value
  }
  return  value
}

const year  = computed(()=> new Date(totalSecond.value).getFullYear())
const month = computed(()=> addZero((new Date(totalSecond.value).getMonth()+1)))
const day   = computed(()=> addZero(new Date(totalSecond.value).getDate()))
const hour  = computed(()=> addZero(new Date(totalSecond.value).getHours()))
const min   = computed(()=> addZero(new Date(totalSecond.value).getMinutes()))
const second= computed(()=> addZero(new Date(totalSecond.value).getSeconds()))

onBeforeMount(()=>{
  totalSecond.value = Date.now()
  intervalId = setInterval(()=>{
    totalSecond.value = Date.now()
  },500)
})
onBeforeUnmount(()=>{
  clearInterval(intervalId);
  intervalId = null;
})
</script>

<style scoped>
.footer{
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  padding: 20px 0;
  margin-top: 10px;
  color: #eeeeee;
  background-color: #3cbc8d
}

</style>
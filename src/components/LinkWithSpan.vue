<template>
<div class="link-with-span">
  <a :href="'#'+name" @mouseover="opacity=1" @mouseleave="opacity=0" :style="{opacity:opacity}">#</a>
  <span @mouseover="opacity=1" @mouseleave="opacity=0">{{name}}</span>
</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
defineProps({
  name:{
    type : String,
    required :true
  },
})

const opacity = ref(0)
</script>

<style scoped>
.link-with-span{
  display: flex;
  align-items: flex-end;
  margin-right: 20px;
  padding: .5rem;
  border-bottom: 1px solid #eaecef;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
}
.link-with-span>a{
  color: #3cbc8d;
  position: absolute;
  left: 12.6%;
  border-bottom: 1px solid #eaecef;
}

</style>
<template>
<div>

</div>
</template>

<script setup lang="ts">
defineProps({
  pageSize:{
    type:Number,
    default: 5
  },
  pageNum:{
    type:Number,
    default: 1,
  },
  total:{
    required:true,
    type:Number,
  },
  pageSizes:{
    default:[5,10,15,20],
    type:Array(Number)
  }
})
defineEmits({
  pageSizeChange(){

  },
  pageNumChange(){

  }

})

</script>

<style scoped>

</style>
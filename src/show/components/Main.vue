<template>
  <div style="display: flex;flex-direction: column;width: 100%;flex-wrap: wrap">
    <div style="display: flex;justify-content: center">
      <div style="width: 80%;min-width: 50rem;display: flex;flex-direction: row;margin-top: 1rem">
        <div style="width: 70%;min-width: 35rem">
          <MainLeft/>
        </div>
        <div style="width: 30%;min-width: 15rem">
          <MainRight />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MainRight from "./MainRight.vue";
import MainLeft from "./MainLeft.vue";
export default {
  name:"Main",
  components: {MainRight,MainLeft}
}
</script>

<style scoped>

</style>
<template>
<div class="admin-head">
  <el-button type="info" class="el-button"  @click="returnIsCollapse">{{label}}</el-button>
  <el-button type="info" class="el-button" v-if="!username" @click="login">请登录</el-button>
  <el-dropdown type="info" class="el-dropdown" v-else split-button>
    {{username}}
    <template #dropdown>
      <el-dropdown-menu style="background-color: #a4a8ad;">
        <el-dropdown-item >查看信息</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</div>
</template>

<script setup lang="ts">
import {ShowApi} from "../../commons/config/api";
import {onBeforeMount, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import request from "../../commons/utils/request";

const router = useRouter()
const store = useStore()
const emit = defineEmits(['return-is-collapse'])
const isCollapse = ref(false);
const label = ref('展开')
const userId = store.getters.id;
const username = ref('')

const returnIsCollapse = () => {
  let isCollapseV =  isCollapse.value = ! isCollapse.value
  emit('return-is-collapse',isCollapseV)

}
const login = () => {
  router.push('/login')
}
const logout = ()=> {
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token')
  request.post(ShowApi.LOGOUT)
  router.push('/login')
  store.state.user = null;
}
watch(isCollapse,(value => {
  if (value){
    label.value = '收缩'
  }else {
    label.value = '展开'

  }
}))

onBeforeMount(()=>{
  username.value = store.getters.username;

})
</script>
<!--
<script>
export default {
  name: "MyHead",
  data(){
    return {
      isCollapse:false,
      label:'展开',
      username:'',
    }
  },
  methods:{
    returnIsCollapse(){
      let isCollapse =  this.isCollapse = ! this.isCollapse
      this.$emit('return-is-collapse',isCollapse)
    },
    login(){
      this.$router.push('/login')
    },
    logout(){
      sessionStorage.removeItem('user')
    }
  },
  watch:{
    isCollapse(value){
      if (!value){
        this.label = '展开'
      }else {
        this.label = '收缩'
      }
    }
  },
  created() {
    this.username = this.$store.getters.username;
  }
}
</script>
-->
<style scoped>
.admin-head{
  display: flex;
  justify-content: space-between;
  height: 70px;
  line-height: 70px;
  align-content: center;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  padding: 0 30px;
  background-color: #909399;
}
.el-button{
  border-radius: 0;
  color: #ffffff;
  border-color: #bec2cb;
  background-color: #909399;
}
.el-button:hover{
  background-color: rgba(255,255,255,0.3);
}
.el-button:focus{
  background-color: rgba(255,255,255,0.3);
}
.el-dropdown{
  border: 1px solid #bec2cb;
}
</style>
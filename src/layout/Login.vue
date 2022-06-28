<template>
<!--  登录进后台页面的界面-->
  <div class="image">
    <div class="login-home">
      <el-tooltip placement="bottom" effect="light">
        <template #content>
          <span>回到主页</span>
        </template>
        <el-button class="el-button" round :plain="true" @click="backIndex">
          <el-icon><HomeFilled/></el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <div class="login-form-contain">
      <el-form  style="width: 350px" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-form-item prop="username">
          <el-icon class="icon-user"><UserFilled /></el-icon>
          <input class="input" maxlength="20" v-model="ruleForm.username" placeholder="管理员用户名"  autofocus @keyup.enter="submitForm(ruleFormRef)"  />
        </el-form-item>
        <el-form-item prop="password">
          <el-icon class="icon-lock"><Lock /></el-icon>
          <input class="input" maxlength="20" v-model="ruleForm.password" placeholder="管理员密码" type="password" @keyup.enter="submitForm(ruleFormRef)"  />
        </el-form-item>
        <el-form-item>
          <el-button class="button" style="width: 100%;" @click="submitForm(ruleFormRef)" >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Lock,UserFilled,HomeFilled} from "@element-plus/icons-vue";
import {AdminApi} from '../commons/config/api'
import request from "../commons/utils/request";
import {ElMessage} from "element-plus";
import {reactive, ref } from "vue";
import type { FormInstance } from 'element-plus'

import {useStore} from "vuex";
import { useRouter} from "vue-router";
const store = useStore();
const router = useRouter();

const ruleFormRef = ref<FormInstance>()

const checkUsername = (rule :any, value :any, callback:any) => {
  if (!value || value === ''){
    callback(new Error('请输入用户名！'))
  }else if ( /\s+/.test(value)) {
    callback(new Error('请去除空格！'))
  }
  callback()
}
const checkPassword = (rule:any, value:any, callback:any) => {
  if (!value || value === ''){
    callback(new Error('请输入密码！'))
  }else if (/\s+/.test(value)) {
    callback(new Error('请去除空格！'))
  }
  callback()
}
const ruleForm = reactive({
  username:'',
  password:'',
})
const rules = reactive({
  username:[{validator: checkUsername, trigger: 'blur'}],
  password: [{validator: checkPassword, trigger: 'blur'}],
})
const user = reactive({})
//登录网站的请求  -->2
const loginWebSite = (form :any)=>{
  request.post(AdminApi.LOGIN,form).then((res :any)=>{
    if (res.code === 2000){
      ElMessage.success("欢迎登录")
      store.commit('increment',res.data)
      console.log(res.data)
      router.push(AdminApi.USER);
    }
  })
}
// 回到前台主页面（index）
const backIndex = () => {
  router.push('/')
}
//登录按钮验证参数  -->1
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      loginWebSite(ruleForm);
    } else {
      ElMessage.error('输入框内容验证失败')
      return false
    }
  })
}
</script>


<style scoped>
/*把el-icon图标放入到自定义按钮里面*/
.icon-user{
  display: inline-block;
  position: absolute;
  top: 28%;
  left: 20px;
  font-size: 18px;
}
.icon-lock{
  display: inline-block;
  position: absolute;
  top: 28%;
  left: 20px;
  font-size: 18px;
}
/*背景图片的显示*/
.image{
  background-image: url("../assets/cat-g5f79fa070_1920.jpg") ;
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  flex-direction: column;
  display: flex;
}
/*页面回主页的图标的div样式*/
.login-home{
  padding: 20px 0;
  margin-left: 10rem;
}
/*el-button修改*/
.el-button{
  background-color: rgba(255,255,255,0.2);
  border: none;
  color: #eeeeee;
  font-size: 22px;
  width: 5rem;
}
.el-button:hover{
  background-color: rgba(255,255,255,0.1);
  color: white;
}
/*整个表单输入的div样式*/
.login-form-contain{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
  border: none;
  width: auto;
}
/*自定义输入框样式*/
.input{
  width: 350px;
  height: 45px;
  background-color: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  font-size: 16px;
  padding: 0 50px;
  color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input:focus{
  outline: none;
  background-color: rgba(255,255,255,0.5);
  color: black;
  transition: .5s;
}
.input:hover{
  background-color: rgba(255,255,255,0.8);;
  transition: .5s;
}
/*自定义按钮样式*/
.button{
  height: 45px;
  background-color: rgba(169, 131, 131,0.5);
  border: 1px solid rgba(169, 131, 131,0.5);
  border-radius: 15px;
  color: #eeeeee;
  font-size: 18px;
}
.button:hover{
  background-color: rgba(169, 131, 131, 1);
  border: 1px solid rgba(255,255,255,0);
  transition: 0.5s;
}
.button:focus{
  background-color: rgba(169, 131, 131, 0.8);
  border: 1px solid rgba(255,255,255,0);
  color: #eeeeee;
}
</style>
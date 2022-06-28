<template>
  <div class="contain-item">
    <SearchAndInsert @add="add" @query="query" />
    <!--    表格-->
    <el-table :data="sysUserVOs" border stripe height="100%">
      <el-table-column prop="id"         label="ID"  width="80"/>
      <el-table-column prop="phone"      label="手机号码"  />
      <el-table-column prop="username"   label="用户名"  />
      <el-table-column prop="roleName"   label="权限名称"  />
      <el-table-column prop="gender"     label="性别" width="80"  />
      <el-table-column prop="state"      label="状态" width="80"  />
      <el-table-column prop="createTime" label="创建日期" />
      <el-table-column prop="updateTime" label="更新日期" />
      <el-table-column label="操作"       width="180">
        <template v-slot="scope">
          <el-button size="small"  @click="edited(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="remove(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="flex: 1"></div>
    <!--    分页插件-->
    <el-pagination style="padding-top: 10px;padding-bottom: 30px;display: flex;align-items: center;justify-content: flex-end"
                   :currentPage="pageNum"
                   :page-sizes="[5, 10, 15, 20]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   @size-change="sizeChange"
                   @current-change="currentChange">
    </el-pagination>

    <!-- 弹框 -->
    <el-dialog v-model="isShowVisible" width="400px" title="系统用户">
      <el-form status-icon label-width="auto"
               ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               class="my-form"
      >
        <el-form-item prop="phone">
          <el-input v-model.number="ruleForm.phone" placeholder="请输入手机号码"  clearable style="width: 250px" prefix-icon="Phone"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model.trim="ruleForm.username" placeholder="请输入用户名" clearable style="width: 250px"  prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="ruleForm.password" placeholder="请输入密码" clearable style="width: 250px" prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.sex" name="sex" style="width: 250px" placeholder="请选择性别">
            <el-option :value="1" label="男">男</el-option>
            <el-option :value="2" label="女">女</el-option>
            <el-option :value="3" label="未知">未知</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.roleId" name="roleId" style="width: 250px" placeholder="请设置权限">
            <el-option :value="1" label="超级管理员">超级管理员</el-option>
            <el-option :value="2" label="文章管理员">文章管理员</el-option>
            <el-option :value="3" label="风纪委员">风纪委员</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.status" name="status" style="width: 250px" placeholder="账号状态">
            <el-option :value="1" label="启用">启用
              <slot>
                <span style="color: #b9b9b9;margin-left: 10px;font-size: 12px">账号状态</span>
              </slot>
            </el-option>
            <el-option :value="0" label="禁用">禁用
              <slot>
                <span style="color: #b9b9b9;margin-left: 10px;font-size: 12px">账号状态</span>
              </slot>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import SearchAndInsert from "../../admin/components/SearchAndInsert.vue";
import request from "../../commons/utils/request";
import {AdminApi} from '../../commons/config/api'
import {ElMessage} from "element-plus";
export default {
  name: "SysUser",
  components: {SearchAndInsert},
  data(){
    const checkUserName = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入用户名'))
      } else if (/\s+/.test(value)){
        callback(new Error('请去除空格'))
      }
      callback()
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入密码'))
      } else if (/\s+/.test(value)){
        callback(new Error('请去除空格'))
      }
      callback()
    }
    const checkPhone = (rule, value, callback) => {
      if (! value) {
        callback(new Error('请输入手机号'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        }else if (/0?(13|14|15|17|18)[0-9]{9}/.test(value)){
          callback()
        }else {
          callback(new Error('您输入的手机号格式有误'))
        }
      }, 500)
    }
    return{
      user:{},
      sysUserVOs:[],
      pageNum:1,
      pageSize:5,
      total:0,

      isShowVisible:false,
      ruleForm:{},
      rules: {
        username: [{validator: checkUserName, trigger: 'blur'}],
        password: [{validator: checkPassword, trigger: 'blur'}],
        phone: [{validator: checkPhone, trigger: 'change'}],
      }
    }
  },
  methods:{
    reloadData(){
      request.get(AdminApi.SYS_USER,{
        params:{
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }
      }).then(res=>{
        if (!res.data){
          return
        }
        res.data.forEach(item=>{
          if (item.sex ===1){
            item.gender = '男'
          }else if (item.sex ===2 ){
            item.gender = '女'
          }else if (item.sex ===3 ){
            item.gender = '未知'
          }
          if (item.status === 1){
            item.state =  '启用'
          }else if (item.status === 0){
            item.state =  '禁用'
          }
        })
        this.total = res.count
        this.sysUserVOs = res.data
        this.isShowVisible = false;
        console.log(this.sysUserVOs)
      })
    },
    //添加按钮开启弹出
    add(value){
      this.isShowVisible = value
      this.$nextTick(()=>{
        if (this.$refs.ruleForm){
          this.$refs.ruleForm.resetFields();
          this.ruleForm.status = 1 ;
          this.ruleForm.sex = null;
          this.ruleForm.roleId = null;
        }
      })
    },
    query(str){
      request.get(AdminApi.SYS_USER,{
        params:{
          search:str,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res=>{
        if (res.code === 2000){
          ElMessage.success("查询成功")
          this.reloadData()
        }
      })
    },
    //编辑按钮开启弹窗
    edited(item){
      this.isShowVisible = true
      this.$nextTick(()=>{
        if (this.$refs.ruleForm){
          this.ruleForm = JSON.parse(JSON.stringify(item))
        }
      })
    },
    remove(id){
      request.delete(AdminApi.SYS_USER+"/" +id).then(res=>{
        if (res.code === 2000){
          ElMessage.success("删除成功")
          this.reloadData()
        }
      })
    },
    sizeChange(pageSize){
      this.pageSize = pageSize
      request.get(AdminApi.SYS_USER,{
        params:{
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res=>{
        res.data.forEach(item=>{
          if (item.sex ===1){
            item.gender = '男'
          }else if (item.sex ===2 ){
            item.gender = '女'
          }else if (item.sex ===3 ){
            item.gender = '未知'
          }
          if (item.status===1){
            item.state =  '启用'
          }else if (item.status===0){
            item.state =  '禁用'
          }
        })
        this.sysUserVOs = res.data
      })
    },
    currentChange(pageNum){
      this.pageNum  = pageNum;
      request.get(AdminApi.SYS_USER,{
        params:{
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res=>{
        res.data.forEach(item=>{
          if (item.sex ===1){
            item.gender = '男'
          }else if (item.sex ===2 ){
            item.gender = '女'
          }else if (item.sex ===3 ){
            item.gender = '未知'
          }
          if (item.status===1){
            item.state =  '启用'
          }else if (item.status===0){
            item.state =  '禁用'
          }
        })
        this.sysUserVOs = res.data
      })
    },


    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id){
            request.put(AdminApi.SYS_USER,this.ruleForm).then(res=>{
              if (res.code === 2000){
                this.reloadData()
              }
            })
          }else {
            request.post(AdminApi.SYS_USER,this.ruleForm).then(res=>{
              if (res.code === 2000){
                this.reloadData()
              }
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.status = 1
    },
  },


  created() {
    this.user = this.$store.state.user
    this.reloadData();
  }
}
</script>

<style scoped>
.contain-item{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.my-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
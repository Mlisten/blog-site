<template>
  <div class="contain-item">
    <SearchAndInsert @add="add" @query="query"/>
    <!--    表格-->
    <el-table :data="userVOs" border height="100%" stripe>
      <el-table-column label="ID" prop="id" width="80"/>
      <el-table-column label="手机号码" prop="phone"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="权限名称" prop="roleName"/>
      <el-table-column label="性别" prop="gender" width="80"/>
      <el-table-column label="状态" prop="state" width="80"/>
      <el-table-column label="创建日期" prop="createTime"/>
      <el-table-column label="更新日期" prop="updateTime"/>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="small" @click="edited(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="remove(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="flex: 1"></div>
    <!--    分页插件-->
    <el-pagination
        :currentPage="pageNum"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="padding-top: 10px;padding-bottom: 30px;display: flex;align-items: center;justify-content: flex-end"
        @size-change="sizeChange"
        @current-change="currentChange">
    </el-pagination>

    <el-dialog v-model="isShowVisible" title="普通用户" width="400px">
      <el-form ref="ruleForm" :model="ruleForm"
               :rules="rules"
               class="my-form"
               label-width="auto"
               status-icon
      >
        <el-form-item prop="phone">
          <el-input v-model.number="ruleForm.phone" clearable placeholder="请输入手机号码" prefix-icon="Phone"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model.trim="ruleForm.username" clearable placeholder="请输入用户名" prefix-icon="User"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="ruleForm.password" clearable placeholder="请输入密码" prefix-icon="Lock"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.sex" name="sex" placeholder="请选择性别" style="width: 250px">
            <el-option :value="1" label="男">男</el-option>
            <el-option :value="2" label="女">女</el-option>
            <el-option :value="3" label="未知">未知</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.status" name="status" placeholder="账号状态" style="width: 250px">
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
import {ElMessage} from "element-plus";
import request from "../../commons/utils/request";
import {AdminApi} from "../../commons/config/api";

export default {
  name: "User",
  components: {SearchAndInsert},
  data() {
    const checkUserName = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入用户名'))
      } else if (/\s+/.test(value)) {
        callback(new Error('请去除空格'))
      }
      callback()
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入密码'))
      } else if (/\s+/.test(value)) {
        callback(new Error('请去除空格'))
      }
      callback()
    }
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else if (/0?(13|14|15|17|18)[0-9]{9}/.test(value)) {
          callback()
        } else {
          callback(new Error('您输入的手机号格式有误'))
        }
      }, 500)
    }
    return {
      user: {},
      userVOs: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,

      isShowVisible: false,
      ruleForm: {},
      rules: {
        username: [{validator: checkUserName, trigger: 'blur'}],
        password: [{validator: checkPassword, trigger: 'blur'}],
        phone: [{validator: checkPhone, trigger: 'change'}],
      },
    }
  },
  methods: {
    reloadData() {
      request.get(AdminApi.USER, {
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      }).then(res => {
        res.data.forEach(item => {
          if (item.sex === 1) {
            item.gender = '男'
          } else if (item.sex === 2) {
            item.gender = '女'
          } else if (item.sex === 3) {
            item.gender = '未知'
          }
          if (item.status === 1) {
            item.state = '启用'
          } else if (item.status === 0) {
            item.state = '禁用'
          }
        })
        this.total = res.count
        this.userVOs = res.data
        this.isShowVisible = false;
      })
    },
    //开启弹窗
    add(value) {
      this.isShowVisible = value
      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields();
          this.ruleForm.status = 1;
          this.ruleForm.sex = null;
        }
      })
    },
    query(str) {
      request.get(AdminApi.USER, {
        params: {
          search: str,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.code === 2000) {
          ElMessage.success("查询成功")
          this.reloadData()
        }
      })
    },
    edited(item) {
      this.isShowVisible = true
      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.ruleForm = JSON.parse(JSON.stringify(item))
        }
      })
    },
    remove(id) {
      request.delete(AdminApi.USER + "/" + id).then(res => {
        if (res.code === 2000) {
          ElMessage.success("删除成功")
          this.reloadData()
        }
      })
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize
      request.get(AdminApi.USER, {
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res => {
        res.data.forEach(item => {
          if (item.sex === 1) {
            item.gender = '男'
          } else if (item.sex === 2) {
            item.gender = '女'
          } else if (item.sex === 3) {
            item.gender = '未知'
          }
          if (item.status === 1) {
            item.state = '启用'
          } else if (item.status === 0) {
            item.state = '禁用'
          }
        })
        this.total = res.count
        this.userVOs = res.data
      })
    },
    currentChange(pageNum) {
      this.pageNum = pageNum;
      request.get(AdminApi.USER, {
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res => {
        res.data.forEach(item => {
          if (item.sex === 1) {
            item.gender = '男'
          } else if (item.sex === 2) {
            item.gender = '女'
          } else if (item.sex === 3) {
            item.gender = '未知'
          }
          if (item.status === 1) {
            item.state = '启用'
          } else if (item.status === 0) {
            item.state = '禁用'
          }
        })
        this.userVOs = res.data
        this.total = res.count
      })
    },


    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            request.put(AdminApi.USER, this.ruleForm).then(res => {
              if (res.code === 2000) {
                this.reloadData()
              }
            })
          } else {
            request.post(AdminApi.USER, this.ruleForm).then(res => {
              if (res.code === 2000) {
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
.contain-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.my-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
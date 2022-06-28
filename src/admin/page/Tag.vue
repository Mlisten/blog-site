<template>
<div class="contain-item">
  <SearchAndInsert @add="add" @query="query" :show-add-input="true" />
  <!--    表格-->
  <el-table :data="tableData" border stripe @cell-dblclick="dbclick" :row-key="tableData.index" height="100%">
    <el-table-column prop="id"   column-key="id"   label="ID"  width="80"/>
    <el-table-column prop="name" column-key="name" label="标签名称" >
      <template #default="scope">
        <el-input v-if="current === scope.row.id" v-model.trim="tagName" :maxlength="10" :autofocus="true">
          <template #append>
            <el-button @click="update">提交</el-button>
          </template>
        </el-input>
        <span v-else> {{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" column-key="createTime" label="创建日期"  />
    <el-table-column prop="updateTime" column-key="updateTime" label="更新日期"  />
    <el-table-column label="操作"       width="180">
      <template v-slot="scope">
        <el-button size="small" @click="edited(scope.row.id,scope.row.name)">编辑</el-button>
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
</div>
</template>

<script>
import SearchAndInsert from "../../admin/components/SearchAndInsert.vue";
import request from "../../commons/utils/request";
import {AdminApi} from "../../commons/config/api";
import {ElMessage} from "element-plus";

export default {
  name: "Tag",
  components: {SearchAndInsert},
  data(){
    return{
      user:{},
      tableData:[],
      pageNum:1,
      pageSize:5,
      total:0,
      tagName:'',
      current: -10 ,
    }
  },
  methods:{
    dbclick(row,col){
      if (col.property ==='name'){
        this.current = row.id;
        this.tagName = row.name;
      }else {
        this.current = -10;
      }
    },
    reloadData(){
      request.get(AdminApi.TAG,{
        params:{
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }
      }).then(res=>{
        this.total = res.count
        let data =  res.data
        Array.isArray(data)
        this.tableData =data
      })
    },
    query(value){
      request.get(AdminApi.TAG,{
        params:{
          search: value,
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
    add(value){
      if (0 < value.length < 10){
        request.post(AdminApi.TAG+'/'+ value).then(res=>{
          if (res.code===2000){
            this.reloadData()
          }
        })
      }else {
        ElMessage.warning('标签长度应小于10')
      }
    },
    edited(id,name){
      this.current = id;
      this.tagName = name;
    },
    update(){
      let tagName = this.tagName;
      if (/s+/.test(tagName)){
        ElMessage.warning("请删除空格")
      }else {
        request.put(AdminApi.TAG,{
          id:this.current,
          name: tagName
        }).then(res=>{
          if (res.code===2000){
            this.reloadData()
            this.current = -10;
          }
        })
      }
    },
    remove(id){
      request.delete(AdminApi.TAG+"/" +id).then(res=>{
        if (res.code === 2000){
          this.reloadData()
        }
      })
    },
    sizeChange(pageSize){
      this.pageSize = pageSize
      request.get(AdminApi.TAG,{
        params:{
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res=>{
        this.tableData  = res.data
      })
    },
    currentChange(pageNum){
      this.pageNum  = pageNum;
      request.get(AdminApi.TAG,{
        params:{
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
      }).then(res=>{
        this.tableData  = res.data
      })
    }
  },
  created() {
    this.user = this.$store.state.user
    this.reloadData()
  }
}
</script>

<style scoped>
.contain-item{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
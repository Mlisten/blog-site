<template>
<div class="contain-item">
  <SearchAndInsert  @query="query" />
  <!--    表格-->
  <el-table :data="tableData" border stripe height="100%">
    <el-table-column prop="id"         label="ID"  width="80"/>
    <el-table-column prop="username"   label="发表用户"  />
    <el-table-column prop="articleId"  label="源文章ID"  />
    <el-table-column prop="title"      label="源文章"  width="150" />
    <el-table-column prop="content"    label="发表内容" width="150"  />
    <el-table-column prop="createTime" label="发表日期"  />
    <el-table-column prop="updateTime" label="更新日期"  />
    <el-table-column label="操作"       width="180">
      <template v-slot="scope">
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
<script setup lang="ts">
import SearchAndInsert from "../../admin/components/SearchAndInsert.vue";
import {onBeforeMount, ref} from "vue";
import {useStore} from "vuex";
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {AdminApi} from "../../commons/config/api";
const store = useStore()

const user = store.state.user;
const tableData = ref([]);
const pageNum= ref(1);
const pageSize=ref(5);
const total= ref(0);
const reloadDate = ()=>{
  request.get(AdminApi.COMMENT,{
    params:{
      'pageSize':pageSize.value,
      'pageNum' :pageNum.value,
    }
  }).then((res:MyAxiosResponse)=>{
    tableData.value = res.data
    total.value = res.count
  })
}
const query  = (value:string) =>{
  request.get(AdminApi.COMMENT,{
    params:{
      'pageSize':pageSize.value,
      'pageNum' :pageNum.value,
      'search'  :value
    }
  }).then(res=>{
    tableData.value = res.data
  })
};

const remove = (id:number) =>{
  request.delete(AdminApi.COMMENT+"/"+id).then( ()=>{
    reloadDate();
  })

};
const sizeChange = (pageSize_:number) =>{
  pageSize.value = pageSize_
  request.get(AdminApi.COMMENT,{
    params:{
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    }
  }).then(res=>{
    tableData.value  = res.data
  })
};
const currentChange = (pageNum_:number) =>{
  pageNum.value  = pageNum_;
  request.get(AdminApi.COMMENT,{
    params:{
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    }
  }).then(res=>{
    tableData.value  = res.data
  })
};

onBeforeMount(()=>{
  reloadDate()
})
</script>

<style scoped>
.contain-item{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
<template>
  <div class="contain-item">
    <div style="height: 52px" aria-hidden="true" ></div>
    <!--    表格-->
    <el-table :data="tableData" border stripe height="100%">
      <el-table-column prop="id"       column-key="id"       label="ID"  width="80"/>
      <el-table-column prop="datetime" column-key="datetime" label="评论日期"/>
      <el-table-column prop="nickname" column-key="nickname" label="昵称" />
      <el-table-column prop="msg"      column-key="msg"      label="评论"/>
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
    <!-- 弹框 -->
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {useStore} from "vuex";

const store = useStore();
const user = ref({})
const tableData= ref([])
const pageSize = ref(5);
const pageNum  = ref(1);
const total    = ref(0);

const reloadData = () => {
  request.get('/msg-board',{
    params:{
      pageSize:pageSize.value,
      pageNum:pageNum.value
    }
  }).then((res : MyAxiosResponse) => {
    total.value = res.count
    let data =  res.data
    Array.isArray(data)
    tableData.value =data
  })
}

onMounted(()=>{
  user.value = store.state.user
  reloadData()
})
const remove = (id) => {
  request.delete("/msg-board/" +id).then((res:MyAxiosResponse)=>{
    if (res.code === 2000){
      reloadData()
    }
  })
};
const sizeChange = (pageSize_) => {
  pageSize.value = pageSize_
  request.get('/msg-board',{
    params:{
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    }
  }).then(res=>{
    tableData.value  = res.data
  })
},
currentChange = (pageNum_ :number)=>{
  pageNum.value  = pageNum_;
  request.get('/msg-board',{
    params:{
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    }
  }).then(res=>{
    tableData.value  = res.data
  })
}

</script>

<style scoped>
.contain-item{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
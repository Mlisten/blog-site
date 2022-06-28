<template>
  <div class="contain-item">
    <SearchAndInsert @add="add" @query="query"/>
    <!--    表格-->
    <el-table :data="articleVOs" border height="100%" stripe>
      <el-table-column label="文章ID" prop="id" width="80"/>
      <el-table-column label="文章标题" prop="title"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="创建日期" prop="createTime"/>
      <el-table-column label="更新日期" prop="updateTime"/>
      <el-table-column label="标签名称" prop="tagNames"/>
      <el-table-column label="分类名称" prop="typeName" width="80"/>
      <el-table-column label="是否公开" prop="overtName" width="80"/>
      <el-table-column label="浏览数" prop="views" width="80"/>
      <el-table-column label="评论数" prop="comments" width="80"/>
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
    <!--    弹出框表单提交-->
    <el-dialog v-model="isShowVisible" destroy-on-close top="10vh">
      <template #header>
        <div v-show="isShow" style="display: flex;align-content: center;">
          <el-input v-model="article.title" placeholder="文章标题" style="width:200px;margin-right: 20px"></el-input>
          <el-select v-model="article.typeId" placeholder="请选择分类" style="margin-right: 20px">
            <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="article.tagId" collapse-tags multiple placeholder="请选择标签">
            <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </template>
      <MyEditor :default-content="defaultContent" :is-create="isShowVisible"
                :mode="mode"
                @is-full-screen="isFullScreen"
                @get-content-html="getContentAndHtml"/>
      <template #footer>
        <div v-show="isShow" style="display: flex;align-content: center;justify-content: flex-end">
          <div v-show="!isHidden" style="margin-right: 50px">
            <el-radio-group v-model="article.overt">
              <el-radio-button :label="1">公开</el-radio-button>
              <el-radio-button :label="0">私密</el-radio-button>
            </el-radio-group>
          </div>
          <div class="dialog-footer">
            <el-button @click="isShowVisible = false">取消</el-button>
            <el-button type="primary" @click="addArticle">添加</el-button>
          </div>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import MyEditor from "../../components/MyEditor.vue";
import SearchAndInsert from "../../admin/components/SearchAndInsert.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import request, {MyAxiosResponse} from "../../commons/utils/request";
import {AdminApi} from "../../commons/config/api";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

const store = useStore();
const user = store.state.user;

const isShow = ref(true) //控制弹框头部完全隐藏
const types: any = ref([]);
const tags: any = ref([]);
const articleVOs = ref([]);
const defaultContent = ref([]);
const pageNum = ref(1);
const pageSize = ref(5);
const total = ref(0);
const isShowVisible = ref(false);
const isHidden = ref(false);
const mode = ref('default');
const article: any = ref({
  title: '',
  content: [],
  html: '',
  typeId: -10,
  userId: -10,
  tagId: [],
  overt: 1
});

const reloadData = () => {
  request.get(AdminApi.ARTICLE, {
    params: {
      'pageNum': pageNum.value,
      'pageSize': pageSize.value
    }
  }).then((res: MyAxiosResponse) => {
    articleVOs.value = res.data
    total.value = res.count
  })
};

const getContentAndHtml = (contentV: any, htmlV: any) => {
  article.value.content = contentV
  article.value.html = htmlV
};
const isFullScreen = (b: boolean) => {
  //编辑器全屏时，需要隐藏弹窗中的 el-button
  isHidden.value = b;
  isShow.value = !b
};
const addArticle = () => {
  let articleObj = article.value;
  if (!articleObj.title.length) {
    ElMessage.error("请输入文章标题")
    return;
  } else if (/\s+/.test(articleObj.title)) {
    ElMessage.error("请去除空格")
    return;
  }
  if (!articleObj.userId) {
    ElMessage.error("未识别到用户信息!")
    return;
  }
  if (articleObj.tagId.length === 0) {
    ElMessage.error("请选择标签")
    return;
  }
  if (!articleObj.typeId) {
    ElMessage.error("请选择分类")
    return;
  }
  if (articleObj.overt === 1 || articleObj.overt === 0) {
    if (articleObj.id) {
      request.put(AdminApi.ARTICLE, article.value).then((res: MyAxiosResponse) => {
        if (res.code === 2000) {
          isShowVisible.value = false;
          reloadData()
          ElMessage.success("修改成功")
        }
      })
    } else {
      request.post(AdminApi.ARTICLE, article.value).then((res: MyAxiosResponse) => {
        if (res.code === 2000) {
          isShowVisible.value = false;
          reloadData()
          ElMessage.success("添加成功")
        }
      })
    }
  } else {
    ElMessage.error("请正确设置文章是否公开")
  }
};
const add = (value: boolean) => {
  isShowVisible.value = value
  article.value.overt = 1;
  article.value.typeId = null;
  article.value.tagId = null;
  article.value.title = '';
  defaultContent.value = []
};
const edited = (articleItem: any) => {
  isShowVisible.value = true
  article.value.overt = articleItem.overt;
  article.value.typeId = articleItem.typeId;
  article.value.tagId = articleItem.tagId;
  article.value.title = articleItem.title;
  defaultContent.value = JSON.parse(articleItem.content);
};
const query = (str: string) => {
  request.get(AdminApi.ARTICLE, {
    params: {
      'search': str,
      'pageNum': pageNum.value,
      'pageSize': pageSize.value
    }
  }).then((res: MyAxiosResponse) => {
    if (res.code === 2000) {
      ElMessage.success("查询成功")
      reloadData()
    }
  })
};

const remove = (id: number | string) => {
  request.delete(AdminApi.ARTICLE + '/' + id).then((res: MyAxiosResponse) => {
    if (res.code === 2000) {
      ElMessage.success("删除成功")
      reloadData();
    }
  })
};
const sizeChange = (pageSizeV: any) => {
  pageSize.value = pageSizeV;
  request.get(AdminApi.ARTICLE, {
    params: {
      'pageSize': pageSizeV,
      'pageNum': pageNum.value
    }
  }).then((res: MyAxiosResponse) => {
    articleVOs.value = res.data;
    total.value = res.count;
  })
};
const currentChange = (pageNumV: any) => {
  pageNum.value = pageNumV
  request.get(AdminApi.ARTICLE, {
    params: {
      'pageNum': pageNumV,
      'pageSize': pageNum.value
    }
  }).then((res: MyAxiosResponse) => {
    articleVOs.value = res.data;
    total.value = res.count;
  })
}

const loadType = () => {
  request.get(AdminApi.TYPE, {
    params: {
      'pageNum': -1,
      'pageSize': -1
    }
  }).then((res) => {
    types.value = res.data;
    store.commit("addTypes", res.data)
  });
}
const loadTag = () => {
  request.get(AdminApi.TAG, {
    params: {
      'pageNum': -1,
      'pageSize': -1
    }
  }).then((res) => {
    tags.value = res.data;
    store.commit("addTags", res.data)
  });
}

reloadData()
onBeforeMount(() => {
  article.value.userId = user.id
  setTimeout(() => {  ///该延时任务必须有！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    loadType();
    loadTag();
  }, 20)
})

onUnmounted(() => {
  isShowVisible.value = false ///防止使用鼠标页面返回时，编辑器未正确销毁，导致编辑器菜单区域丢失
})
</script>

<style scoped>
.contain-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
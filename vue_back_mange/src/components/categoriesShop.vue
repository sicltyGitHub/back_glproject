<template>
  <div>
    <!-- 面包写 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary">添加分类</el-button>
      <!-- 使用下载的树形表格 -->
      <!-- 把默认的多选框、展开行使用官方文档隐藏  注：出现大写五 原因是被翻译了-->
      <tree-table
        :data="tableList"
        :columns="columns"
        border
        stripe
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <!-- 使用模板名称 slot接收使用模板名称-->
        <template slot="isok" slot-scope="scoped">
          <!-- 引用图标 -->
          <i icon="el-icon-circle-check" v-if="scoped.row.cat_deleted === false"></i>
          <i icon="el-icon-circle-close" v-else></i>
        </template>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 渲染数据
      tableList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,

      // 树形表格
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // 使用自定义模板
          type: "template",
          // 自定义使用模板的名称
          template: "isok"
        },
        {
          label: "排序",
          prop: "cat_pid"
        }
      ]
    };
  },
  created() {
    // 调用
    this.tableShow();
  },
  methods: {
    // 渲染数据
    async tableShow() {
      // 发起Ajax
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      console.log(res);
      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败！");
      }
      this.tableList = res.data.result;
      this.total = res.data.total;
    }
  }
};
</script>

<style>
.el-button {
  margin-bottom: 25px;
}
</style>

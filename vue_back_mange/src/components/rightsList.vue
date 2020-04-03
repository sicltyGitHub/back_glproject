<template>
  <div>
    <!-- 面包屑头部组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="tableShow">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="authName" label="权限名称"></el-table-column>
        <el-table-column property="path" label="路径"></el-table-column>
        <el-table-column property="level" label="权限等级">
          <!-- 通过插槽获取 -->
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scoped.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="scoped.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 渲染数
      tableShow: []
    };
  },
  created() {
    this.tableShowList();
  },
  // 渲染页面
  methods: {
    async tableShowList() {
      // 发起Ajax 渲染页面
      const { data: res } = await this.$http.get("rights/list");
      // console.log(res);

      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.tableShow = res.data;
    }
  }
};
</script>

<style>
</style>

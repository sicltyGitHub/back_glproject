<template>
  <div>
    <!-- 面包屑头部组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="showList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="TableList" border stripe class="table">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="order_number" label="订单编号"></el-table-column>
        <el-table-column property="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column label="是否付款" width="100">
          <!-- 插槽判断是否发货 -->
          <template slot-scope="scoped">
            <el-tag type="success" v-if="scoped.row.pay_status === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <!-- 使用插槽通过过滤器显示时间 -->
          <template slot-scope="scoped">{{scoped.row.create_time | time}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <!-- 使用插槽写 -->
          <template slot-scope="scoped" :cc="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改物流信息"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              title="物流信息"
              @click="editExpress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 展示物流信息对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="editdialogVisible" width="50%">
      <!-- 步骤条 -->
      <el-steps direction="vertical" :active="0">
        <!-- 循环显示物流状态 -->
        <el-step
          v-for="(item,i) in expressKong"
          :key="i"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 渲染数据、分页
      TableList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,

      // 显示物流地址对话框 -> 隐藏
      editdialogVisible: false,
      // 物流空数组
      expressKong: []
    };
  },
  created() {
    // 调用 刷新页面
    this.showList();
  },
  methods: {
    // 渲染数据
    async showList() {
      // 发起Ajax
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });

      // console.log(res);
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败！");
      }
      // 显示页面条数
      this.total = res.data.total;
      this.TableList = res.data.goods;
    },

    // 分页
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      // 调用 刷新页面
      this.showList();
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      // 调用 刷新页面
      this.showList();
    },

    // 显示物流地址对话框 -> 显示
    async editExpress() {
      this.editdialogVisible = true;
      // 发起Ajax
      const { data: res } = await this.$http.get("/kuaidi/619915933338");
      // console.log(res);
      // 判断是否成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败！");
      }
      this.expressKong = res.data;
    }
  }
};
</script>

<style>
</style>

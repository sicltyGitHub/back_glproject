<template>
  <div>
    <!-- 面包屑头部组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <!-- v-model="queryInfor.query" 把要搜索的绑定 -->
          <!--  @keyup.enter.native="getListofgood"  没有native enter不执行，有这个属性相当于把这个方法交给el 来执行 -->
          <!-- clearable（小错号）    @clear="getListofgood"   点击小错号重新刷新页面-->
          <!-- 查询就是在渲染页面的基础上添加属性 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfor.query"
            @keyup.enter.native="getListofgood"
            clearable
            @clear="getListofgood"
          >
            <el-button slot="append" icon="el-icon-search" @click="getListofgood"></el-button>
          </el-input>
        </el-col>

        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goodsAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150px">
          <!-- 通过插槽  创建过滤器在main.js添加-->
          <template slot-scope="scoped">{{scoped.row.add_time | time}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <!-- 通过插槽  创建编辑 删除 -->
          <template slot-scope="scoped">
            <!-- {{scoped.row}} -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="DeleBtn(scoped.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfor.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.queryInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfor: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 定义一个空数组  商品列表
      goodsList: [],
      // 要显示的数据条数
      total: 0
    };
  },
  created() {
    // 调用
    this.getListofgood();
  },
  methods: {
    async getListofgood() {
      // 渲染数据  发起Ajax
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfor
      });
      // console.log(res);
      // 判断是否  获取数据成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      // 获取到数据  赋值给定义的空数组
      this.goodsList = res.data.goods;
      // 要显示的数据条数
      this.total = res.data.total;
    },

    // 添加商品
    goodsAdd() {
      //  通过编程式导航跳转
      this.$router.push("/goods/add");
    },

    // 删除
    async DeleBtn(id) {
      // const confirmImg = await this.$confirm(
      //   "此操作将永久删除该文件, 是否继续?",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }
      // ).catch(err => err);

      // // 取消删除
      // if (confirmImg !== "confirm") {
      //   return this.$message({
      //     type: "info",
      //     message: "已取消删除"
      //   });
      // }

      // // 发起Ajax 请求
      // const { data: res } = await this.$http.delete(`goods/` + id);
      // console.log(res);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("删除失败");
      // }
      // this.$message.success("删除成功");
      // // 调用
      // this.getListofgood();

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发起Ajax
          const { data: res } = await this.$http.delete("goods/" + id);
          // 判断
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败！");
          }
          // 调用
          this.getListofgood();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页
    handleSizeChange(size) {
      this.queryInfor.pagesize = size;
      // 调用
      this.getListofgood();
    },
    handleCurrentChange(num) {
      this.queryInfor.pagenum = num;
      // 调用
      this.getListofgood();
    }
  }
};
</script>


<style lang="less" scoped>
</style>

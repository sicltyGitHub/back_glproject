<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="handerbox">
        <img src="../assets/img/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="LoginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <!-- 显示隐藏按钮/标志   取反-->
        <div class="toggle_bar" @click="collapse =!collapse">|||</div>
        <!--  :collapse="collapse" :collapse-transition="false" 配合使用   :router="true"  通过路由跳转-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 用户管理   v-for 遍历左边导航名称  必须是绑定-->
          <el-submenu
            :index="item.id + ''"
            v-for="(item,i) in handerList"
            :key="item.id"
            :style="collapse ? 'width:64px':'width:200px'"
          >
            <template slot="title">
              <i :class="['iconfont',iconList[i] ]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 子菜单 item项-->
            <el-menu-item
              :index="'/'+itemtwo.path"
              v-for="itemtwo in item.children"
              :key="itemtwo.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{itemtwo.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import rightsListVue from "../components/rightsList.vue";
export default {
  data() {
    return {
      handerList: [],
      // 所有图标对应类名数组
      iconList: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ],
      collapse: false
    };
  },
  created() {
    // 调用
    this.handerShow();
  },
  methods: {
    // 渲染数据（用户管理）
    async handerShow() {
      const { data: res } = await this.$http.get("menus");
      this.handerList = res.data;
    },

    // 退出
    LoginOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    height: 60px;
    // 设置伸缩盒子
    display: flex;
    // 两边对齐  中间自适应
    justify-content: space-between;
    // 居中3
    align-items: center;
    padding: 0;
    padding-right: 20px;
    .handerbox {
      display: flex;
      color: white;
      font-size: 22px;
      align-items: center;
      // 禁止被用户选中
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    user-select: none;
  }

  .el-main {
    background-color: #eaedf1;
    // 防止用户选中
    user-select: none;
  }
}

i.iconfont {
  margin-right: 10px;
}

.el-menu-item,
.el-submenu__title {
  font-size: 13px;
}

// 显示隐藏按钮
.toggle_bar {
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
  background-color: #4a5064;
  // 防止鼠标选中
  user-select: none;
  // 变小手
  cursor: pointer;
  // 对中文间距生效
  letter-spacing: 2px;
  // // 对英文间距生效
  // word-spacing: 2px;
}
</style>


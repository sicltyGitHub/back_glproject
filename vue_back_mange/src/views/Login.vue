<template>
  <!-- 大的login登录框 -->
  <div class="login">
    <!-- card 组件 -->
    <el-card class="card">
      <!-- 图片 -->
      <div class="avatar">
        <img src="../assets/img/logo.png" />
      </div>
      <!-- from表单  用户名   密码 -->
      <el-form class="login-form" :model="loginruleForm" :rules="loginrules" ref="loginruleFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginruleForm.username">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password">
          <el-input v-model="loginruleForm.password" show-password>
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <span class="dialog-footer right">
          <el-button type="primary" @click="login">登 录</el-button>
          <el-button type="info" @click="clear">重 置</el-button>
        </span>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginruleForm: {
        username: "admin",
        password: "123456"
      },
      loginrules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 重置按钮
    clear() {
      this.$refs.loginruleFormRef.resetFields();
    },
    // 登录
    login() {
      // 预判端
      this.$refs.loginruleFormRef.validate(async one => {
        if (!one) return false;
        // 发起Ajax请求
        const { data: res } = await this.$http.post(
          "login",
          this.loginruleForm
        );
        // console.log(res);
        // 判断用户不存在
        if (res.meta.status === 400) {
          sessionStorage.removeItem("token");
          this.$message.error("用户名不存在");
        } else {
          if (res.meta.status === 200) {
            sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
            this.$message({
              type: "success",
              message: "登录成功!"
            });
          }
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
// 大的login登录框
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}

// 卡片
.card {
  width: 450px;
  height: 304px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // 这句话就是为了干掉 overflow:hidden 就和没写一样效果
  overflow: initial;
}

//   图片
.avatar {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  background-color: #fff;
  left: 50%;
  transform: translate(-50%, -60%);
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login-form {
  margin-top: 100px;
}

// 按钮
.right {
  float: right;
}
</style>

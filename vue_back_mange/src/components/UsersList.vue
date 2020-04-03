<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- table表格 -->
      <el-row :gutter="20">
        <!-- 搜索 要想输入需要进行绑定-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="userShow">
            <el-button slot="append" icon="el-icon-search" @click="userShow"></el-button>
          </el-input>
        </el-col>

        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="AdddialogVisible = true;">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="姓名"></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
        <el-table-column property="mobile" label="电话"></el-table-column>
        <el-table-column property="role_name" label="角色"></el-table-column>
        <el-table-column property="mg_state" label="状态">
          <!-- 插槽获取状态 -->
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="Statchange(scoped.row.id,scoped.row.mg_state,)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="EditShowfrom(scoped.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="Editdelete(scoped.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="Setting(scoped.row)"
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
        border
      ></el-pagination>
    </el-card>

    <!-- 添加 -->
    <el-dialog title="添加用户" :visible.sync="AdddialogVisible" width="50%" @close="AddresultInfo">
      <!-- from对话框 -->
      <el-form :model="AddruleForm" :rules="Addrules" ref="AddruleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddruleForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddruleForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddruleForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddAlert">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -对话框-->
    <el-dialog title="修改用户信息" :visible.sync="EditdialogVisible" width="50%" @close="EditresultInfo">
      <!-- from 表单验证  -->
      <el-form :model="EditruleForm" :rules="Editrules" ref="EditruleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="EditruleForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="EditruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditAlert">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置 对话框 -->
    <el-dialog title="分配权限" :visible.sync="SetdialogVisible" width="50%">
      <div>
        <p>当前的用户：{{setuserinfo.username}}</p>
        <p>当前的角色：{{setuserinfo.role_name}}</p>
        <p>
          分配新角色：
          <!-- 下拉列表 -->
          <el-select v-model="setselectID" placeholder="请选择">
            <el-option
              v-for="item in setList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="SetdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setserver">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 正则校验邮箱
    let EmailcheckAge = (rule, value, callback) => {
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        return callback();
      } else {
        return callback(new Error("您输入的邮箱不正确！"));
      }
    };
    return {
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 自定义空数组
      userList: [],
      total: 0,

      // 添加 => 对话框隐藏
      AdddialogVisible: false,
      // 添加 => from表单验证
      AddruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加 => from表单验证提示
      Addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请添加邮箱地址", trigger: "blur" },
          { validator: EmailcheckAge, trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
      },

      // 编辑 => 对话框隐藏
      EditdialogVisible: false,
      EditruleForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 编辑  => from表单验证提示
      Editrules: {
        email: [{ required: true, message: "请添加邮箱地址", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
      },

      // 设置 => 弹框消失
      SetdialogVisible: false,
      // 设置的形参  放到空数组中
      setuserinfo: {},
      // 设置确认按钮  占存一个空对象
      setList: {},
      // 设置时  根据id 设置
      setselectID: ""
    };
  },
  created() {
    // 调用
    this.userShow();
  },
  methods: {
    // 渲染数据
    async userShow() {
      // 发起Ajax 请求
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      // console.log(res);
      // 判断用户是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("用户数据列表获获取失败！");
      }
      // 赋值
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    // 点击switch按钮改变状态（开关）
    async Statchange(id, state) {
      // 发起Ajax请求
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`);
      // console.log(res);
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("修改用户状态获取失败！");
      }
    },

    //分页 => 获取当前页
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      // 重新调用
      this.userShow();
    },
    // 分页 => 分页数
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      // 重新调用
      this.userShow();
    },

    // 添加 => 清除弹框的提示信息
    AddresultInfo() {
      this.$refs.AddruleFormRef.resetFields();
    },
    // 添加
    AddAlert() {
      // 与判断填写是否完成
      this.$refs.AddruleFormRef.validate(async one => {
        if (!one) return false;
        // 发起Ajax请求
        const { data: res } = await this.$http.post("users", this.AddruleForm);
        // console.log(res);
        // 判断
        if (res.meta.status !== 201) {
          return this.$message.error("添加数据失败！");
        }
        // 调用
        this.userShow();
        // 弹框消失
        this.AdddialogVisible = false;
        this.$message.success("添加数据成功！");
      });
    },

    // 编辑 => 清除弹框提示的信息
    EditresultInfo() {
      this.$refs.EditruleFormRef.resetFields();
    },
    // 编辑 => 提交
    async EditShowfrom(id) {
      // 弹框显示
      this.EditdialogVisible = true;
      // 发起Ajax 渲染数据
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("编辑获取数据失败！");
      }
      // 否者查询到的数据赋值
      this.EditruleForm = res.data;
    },
    // 编辑 => 确认
    EditAlert() {
      // 预判断
      this.$refs.EditruleFormRef.validate(async one => {
        if (!one) return false;
        //  发起Ajax
        const { data: res } = await this.$http.put(
          "users/" + this.EditruleForm.id,
          {
            email: this.EditruleForm.email,
            mobile: this.EditruleForm.mobile
          }
        );
        // console.log(res);
        // 判断
        if (res.meta.status !== 200) {
          return this.$message.error("编辑失败");
        }
        // 调用
        this.userShow();
        this.$message.success("编辑成功");
        this.EditdialogVisible = false;
      });
    },

    // 删除
    async Editdelete(id) {
      const confirmimg = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 用户取消
      if (confirmimg != "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      // 确认删除 发起Ajax
      const { data: res } = await this.$http.delete("users/" + id);
      // console.log(res);
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除数据成功");
      // 调用
      this.userShow();
    },

    // 设置
    async Setting(row) {
      // 弹框显示
      this.SetdialogVisible = true;

      // 把存放的形参 保存到空数组中
      this.setuserinfo = row;
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      // 判断用户是否获渲染角色职位取成功
      if (res.meta.status !== 200)
        return this.$message.error("获取角色职位失败");
      // 把占存的空对象放进去
      this.setList = res.data;
    },
    // 设置 确认
    async setserver() {
      // 判断有没有设置  取反
      if (!this.setselectID) return this.$message.error("请选择要设置的新职位");
      // 通过连接接口
      const { data: res } = await this.$http.put(
        `users/${this.setuserinfo.id}/role`,
        { rid: this.setselectID }
      );
      // console.log(res);

      // 判断是否设置成功
      if (res.meta.status !== 200) return this.$message.error("设置权限失败");
      this.$message.success("设置权限成功");
      // 设置弹框 取消
      this.SetdialogVisible = false;
      // 把设置的 新职位清空
      this.setselectID = "";
      // 调用
      this.userShow();
    }
  }
};
</script>

<style>
</style>

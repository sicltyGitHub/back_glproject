<template>
  <div>
    <!-- 面包屑头部组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="AdddialogVisible=true">添加按钮</el-button>

      <!-- 表格 -->
      <el-table :data="handerList" border stripe>
        <!-- 渲染展开行 -->
        <el-table-column type="expand">
          <!-- 展开行  通过插槽渲染 -->
          <template slot-scope="scoped">
            <!-- 渲染一级权限   :style 动态绑定添加边框  -->
            <el-row
              v-for="(one,borderTop1) in scoped.row.children"
              :key="one.id"
              :style="{'border-bottom':'1px solid #eee', 'border-top': borderTop1 === 0? '1px solid #eee': ''}"
            >
              <el-col :span="5">
                <!-- 点击 小X 删除   使用Tag属性 close-->
                <el-tag closable @close="DeleTagRoles(scoped.row,one.id)">{{one.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限  边框有重复的 三元判断后取消-->
              <el-col :span="19">
                <el-row
                  v-for="(two,i2) in one.children"
                  :key="two.id"
                  :style="{'border-top': i2 === 0? '':'1px solid #eee'}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="DeleTagRoles(scoped.row,two.id)"
                    >{{two.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="three in two.children"
                      :key="three.id"
                      closable
                      @close="DeleTagRoles(scoped.row,three.id)"
                    >{{three.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="roleName" label="角色名称"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scoped">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="EditAlert(scoped.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="DelehnderList(scoped.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="qxfpdialogVisible(scoped.row)"
            >权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加管理内容 使用 对话框中close 事件清除提示-->
      <el-dialog title="添加角色" :visible.sync="AdddialogVisible" width="50%" @close="addclearfrom">
        <!-- 添加内容-->
        <el-form :model="AddruleForm" :rules="Addrules" ref="AddruleFormes" label-width="80px">
          <!-- 角色名称 -->
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="AddruleForm.roleName"></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="AddruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AdddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddhanderLise">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑   -->
      <el-dialog title="编辑角色" :visible.sync="EditdialogVisible" width="50%" @close="Editclearfrom">
        <!-- 添加内容-->
        <el-form :model="EditruleForm" :rules="Editrules" ref="EditruleFormes" label-width="80px">
          <!-- 角色名称 -->
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="EditruleForm.roleName"></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="EditruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EdithanderList">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 权限分配 -->
      <el-dialog title="权限分配" :visible.sync="qxfpdialogVisibleAlert" width="50%">
        <!-- 渲染树形结构  tree插件中 显示多选框按钮、 选中通过id、 点击时全部默认展开、根据id默认选中-->
        <el-tree
          :data="qxfpTree"
          :props="TreePrors"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="TreeArr"
          ref="tree"
        ></el-tree>
        <span slot="footer">
          <el-button @click="qxfpdialogVisibleAlert = false">取 消</el-button>
          <el-button type="primary" @click="treeSubmit ">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      handerList: [],
      // 添加 对话框
      AdddialogVisible: false,
      // 添加
      AddruleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 验证
      Addrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },

      // 编辑 对话框
      EditdialogVisible: false,
      // 编辑
      EditruleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 验证
      Editrules: {
        roleName: [
          { required: true, message: "请输入修改角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入修改角色描述", trigger: "blur" }
        ]
      },

      // 权限分配 对话框
      qxfpdialogVisibleAlert: false,
      // 权限分配 放一个空数组
      qxfpTree: [],
      // 树形结构对应的节点关系
      TreePrors: {
        // 指定节点展示的内容
        label: "authName",
        // 指定嵌套关系（有没有子元素）
        children: "children"
      },
      // 根据id 默认选中
      TreeArr: [],
      // 默认存放id
      roleId: ""
    };
  },
  // 调用
  created() {
    this.rolesShow();
  },
  methods: {
    // 渲染数据
    async rolesShow() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      // 判断是否获取到数据
      if (res.meta.status !== 200) {
        // 没有返回返回提醒
        return this.$message.error("获取数据失败");
      }
      // 赋值
      this.handerList = res.data;
    },
    // 添加 清除提示
    addclearfrom() {
      this.$refs.AddruleFormes.resetFields();
    },
    // 添加
    AddhanderLise() {
      // 判断校验是否通过
      this.$refs.AddruleFormes.validate(async one => {
        if (!one) return false;
        // 添加啊数据
        const { data: res } = await this.$http.post("roles", this.AddruleForm);
        // 判断是否获取到数据
        // console.log(res);

        if (res.meta.status !== 201) return this.$message.error("添加数据失败");
        this.$message.success("添加数据成功");
        // 调用
        this.rolesShow();
        // 弹框取消
        this.AdddialogVisible = false;
      });
    },

    // 编辑 渲染页面
    async EditAlert(id) {
      this.EditdialogVisible = true;

      const { data: res } = await this.$http.get("roles/" + id);
      // console.log(res);
      // 判断是否获取到数据
      if (res.meta.status !== 200) return this.$message.error("数据获取失败");
      // 赋值
      this.EditruleForm = res.data;
    },
    // 清除提示内容
    Editclearfrom() {
      this.$refs.EditruleFormes.resetFields();
    },
    // 编辑 添加
    EdithanderList() {
      // 判断校验是否通过
      this.$refs.EditruleFormes.validate(async one => {
        if (!one) return false;
        const { data: res } = await this.$http.put(
          "roles/" + this.EditruleForm.roleId,
          {
            roleName: this.EditruleForm.roleName,
            roleDesc: this.EditruleForm.roleDesc
          }
        );
        // 判断
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        // 调用
        this.rolesShow();
        // 弹框取消
        this.EditdialogVisible = false;
      });
    },

    // 删除
    async DelehnderList(id) {
      const confirmImg = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 取消了失败
      if (confirmImg !== "confirm")
        return this.$message({
          type: "info",
          message: "已取消删除"
        });

      const { data: res } = await this.$http.delete("roles/" + id);
      // 确认取消
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.rolesShow();
    },

    // 删除 (一级菜单展开 角色信息 权限id)
    async DeleTagRoles(role, rightId) {
      // 询问是否删除该用户
      const confirmDee = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 用户取消删除
      if (confirmDee !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("删除用户权限失败");
      this.$message.success("删除用户权限成功");
      // 刷新当前页面
      role.children = res.data;
    },

    // 权限分配
    async qxfpdialogVisible(role) {
      this.qxfpdialogVisibleAlert = true;

      // 连接文档显示权限分配数据
      const { data: res } = await this.$http.get(`rights/tree `);
      // 判断是否获取(渲染数据)成功
      if (res.meta.status !== 200) {
        return this.$message.error("权限分配数据获取失败");
      }
      // 把分配权限的数据 放到空数组中
      this.qxfpTree = res.data;

      // 调用递归（在qxfpdialogVisible() 添加 => 在qxfpdialogVisible()） 存放一空数组
      const Keys = [];
      this.getLeafId(role, Keys);
      // 定义一个空数组
      this.TreeArr = Keys;

      // 把角色id存到data上 roleId 属性中
      this.roleId = role.id;
    },
    // 定一个递归方法  获取角色下所有三级方法
    getLeafId(node, keyArr) {
      // 判断有没有子元素 没有子(children)元素执行
      if (!node.children) {
        return keyArr.push(node.id);
      }
      // 有子元素继续找
      node.children.forEach(item => this.getLeafId(item, keyArr));
    },
    // 点击多选框 分配权限
    async treeSubmit() {
      // 获取全选  在获取时要通过 ref来引用 tree中的方法
      const key1 = this.$refs.tree.getCheckedKeys();
      // 获取半选
      const key2 = this.$refs.tree.getHalfCheckedKeys();
      // es6 新语法拼接被勾选的id 字符串
      const str = [...key1, ...key2].join(",");

      // 获取所有授权（回显） 前提必须定义一个空数组
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: str }
      );
      // console.log(res);
      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("权限分配设置失败");
      }
     this.$message.success("权限分配设置成功");
      // 调用 刷新页面
      this.rolesShow();
      // 关闭弹框
      this.qxfpdialogVisibleAlert = false;
    }
  }
};
</script>


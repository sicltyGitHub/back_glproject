<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类 -->
      <el-row :span="24">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="modelvalue"
            :options="optionsList"
            :props="props"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab切换  @tab-click="handleClick"完成点击静态、动态显示相对应的页面-->
      <el-tabs v-model="activeName" @tab-click="tabclick">
        <!-- 动态 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮  禁用按钮disabled-->
          <el-button
            type="primary"
            size="mini"
            :disabled="isdisabled"
            @click="AddmanydialogVisible = true"
          >添加参数</el-button>

          <!-- 表格 -->
          <el-table :data="manykong" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 第一行 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editbtn(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remove(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加按钮  禁用按钮disabled-->
          <el-button
            type="primary"
            size="mini"
            :disabled="isdisabled"
            @click="AddmanydialogVisible = true"
          >添加属性</el-button>

          <!-- 表格 -->
          <el-table :data="onlykong" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 插槽接收数据 -->
              <template slot-scope="scoped">
                <!-- 遍历每一个 -->
                <el-tag
                  :key="item"
                  v-for="(tag,item) in scoped.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="deleteTag(scoped.row,item)"
                >{{tag}}</el-tag>
                <!-- 文本输=输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 第一行 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editbtn(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remove(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态、静态对话框 -->
    <el-dialog
      :title="activeName === 'many'? '动态参数':'静态属性'"
      :visible.sync="AddmanydialogVisible"
      width="50%"
      @close="colseclear"
    >
      <!-- from 验证表单 -->
      <el-form :model="AddruleForm" :rules="Addrules" ref="AddruleFormRef">
        <el-form-item :label="activeName === 'many'? '动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="AddruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddmanydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Addmang">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑动态、静态对话框 -->
    <el-dialog
      :title="activeName === 'many'? '修改动态参数':'修改静态属性'"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editcloseclear"
    >
      <!--  编辑from表单 -->
      <el-form :model="editruleForm" :rules="editrules" ref="editformRef" label-width="80px">
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modelvalue: [],
      optionsList: [],
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 默认选中
      activeName: "many",

      // 创建自定义动态、静态空数组
      manykong: [],
      onlykong: [],

      // 添加编辑对话框
      AddmanydialogVisible: false,
      // from 表单验证
      AddruleForm: {
        attr_name: ""
      },
      Addrules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },

      // 编辑对话框默认关闭
      editdialogVisible: false,
      // from 表单验证
      editruleForm: {
        attr_name: ""
      },
      editrules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },

      // tag 输入框显示隐藏
      inputVisible: false,
      // 输入框
      inputValue: " "
    };
  },
  created() {
    // 调用
    this.getparms();
  },
  methods: {
    // 渲染数据
    async getparms() {
      // 发起Ajax 请求
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      // console.log(res);

      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
      // 获取成功数据赋值
      this.optionsList = res.data;
    },

    // 级联选择框选中的是不是为 3
    handleChange() {
      // console.log(this.modelvalue);
      // 判断 选中绑定的长度不是为 3就强制清空数据
      if (this.modelvalue.length !== 3) {
        this.modelvalue = [];
        // 动态、静态都清空
        this.manykong = [];
        this.onlykong = [];
      } else {
        // // 选中的话发起ajax 请求   级联选中的时候 选择Id时候选 sel:this.activeName
        // const { data: res } = await this.$http.get(
        //   `categories/${this.threeId}/attributes`,
        //   { params: { sel: this.activeName } }
        // );
        // // console.log(res);

        // // 判断是否获取成功
        // if (res.meta.status !== 200) {
        //   return this.$message.error("数据获取失败");
        // }

        // // 创建两个空数组    判断赋值给 静态、动态   把值赋值给定义的这两个空数组
        // if (this.activeName === "many") {
        //   this.manykong = res.data;
        // } else {
        //   this.onlykong = res.data;
        // }
        // 调用抽离出来的东西
        this.getDataTable();
      }
    },

    // 自定义方法   并把级联选择框中的数据抽离出来  完成静态tab切换
    async getDataTable() {
      // 选中的话发起ajax 请求   级联选中的时候 选择Id时候选 sel:this.activeName
      const { data: res } = await this.$http.get(
        `categories/${this.threeId}/attributes`,
        { params: { sel: this.activeName } }
      );
      console.log(res);

      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
      // 赋值之前做一次分割  遍历每一个参数的 attr_vals属性，使用空格分割(判断后台文档之前有没有空格，有的化取消)
      res.data.forEach(itme => {
        itme.attr_vals = itme.attr_vals ? itme.attr_vals.split(" ") : [];
      });

      // 创建两个空数组    判断赋值给 静态、动态   把值赋值给定义的这两个空数组
      if (this.activeName === "many") {
        this.manykong = res.data;
      } else {
        this.onlykong = res.data;
      }
    },

    // 点击tab切换 表格
    tabclick() {
      // 级联选择框中没有id 不需要发起请求直接return
      if (!this.threeId) return;
      // 调用抽离出来的东西
      this.getDataTable();
    },

    // 添加
    Addmang() {
      // 判断内容是否添加
      this.$refs.AddruleFormRef.validate(async one => {
        if (!one) {
          return false;
        }
        // 发起Ajax
        const { data: res } = await this.$http.post(
          `categories/${this.threeId}/attributes`,
          { attr_name: this.AddruleForm.attr_name, attr_sel: this.activeName }
        );
        // 判断是否获取成功
        if (res.meta.status !== 201) {
          return this.$message.error("添加数据失败");
        }
        // 重新调用表格数据
        this.getDataTable();
        // 对话框关闭
        this.AddmanydialogVisible = false;
      });
    },
    // 添加 => 对话框清除提示
    colseclear() {
      this.$refs.AddruleFormRef.resetFields();
    },

    // 删除
    async remove(id) {
      // console.log(id);
      const confirmIng = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);

      // 判断是否用户是否点击取消
      if (confirmIng != "confirm") {
        return this.$message("删除取消");
      }

      // 用户点击确认 删除  发起Ajax
      const { data: res } = await this.$http.delete(
        `categories/${this.threeId}/attributes/${id}`
      );
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      // 重新调用表格数据
      this.getDataTable();
    },

    // 编辑 => 清除默认表单提示内容
    editcloseclear() {
      this.$refs.editformRef.resetFields();
    },
    // 编辑  渲染页面
    async editbtn(editId) {
      // 关闭编辑对话框
      this.editdialogVisible = true;

      // 渲染页面  直接发起Ajax 就好
      const { data: res } = await this.$http.get(
        `categories/${this.threeId}/attributes/${editId.attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      // 判断获取是否成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取编辑数据失败");
      }
      // 否者 赋值给编辑表单的from
      this.editruleForm = res.data;
    },
    // 编辑后确认提交
    editOK() {
      // 预先判断内容值有没有发生改变
      this.$refs.editformRef.validate(async one => {
        if (!one) {
          return;
        }

        // 发起Ajax 请求
        const { data: res } = await this.$http.put(
          `categories/${this.threeId}/attributes/${this.editruleForm.attr_id}`,
          { attr_name: this.editruleForm.attr_name, attr_sel: this.activeName }
        );
        // 重新调用表格
        this.tabclick();
        // 弹框消失
        this.editdialogVisible = false;
      });
    },

    // tag标签 回车、失去焦点触发这个函数
    async handleInputConfirm(tagRowId) {
      // 判断数据等于0 的话直接返回
      if (this.inputValue.trim().length === 0) {
        this.inputValue = " ";
        // 鼠标失去焦点 关闭文本框
        this.inputVisible = false;
        return;
      }

      // 失去焦点，留白、空格清空 查看长度是不是大于0
      if (this.inputValue.trim().length > 0) {
        // 把数据添加进入
        tagRowId.attr_vals.push(this.inputValue.trim());
      }
      // 文本框消失清空文本框得值
      this.inputValue = "";

      // 发起Ajax 请求把 attr_vals 添加
      const { data: res } = await this.$http.put(
        `categories/${tagRowId.cat_id}/attributes/${tagRowId.attr_id}`,
        {
          attr_name: tagRowId.attr_name,
          attr_sel: tagRowId.attr_sel,
          // 后台数据不支持原来的 只能通过字符串
          attr_vals: tagRowId.attr_vals.join(" ")
        }
      );
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
    },
    // tag标签
    showInput() {
      // 点击tag标签显示文本框
      this.inputVisible = true;
      // 文本框显示 自动获取光标
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // tag 小错号删除
    async deleteTag(tagRowId, i) {
      // console.log(tagRowId);

      // 根据索引删除
      tagRowId.attr_vals.splice(i, 1);
      // 发起Ajax 请求把 attr_vals 添加
      const { data: res } = await this.$http.put(
        `categories/${tagRowId.cat_id}/attributes/${tagRowId.attr_id}`,
        {
          attr_name: tagRowId.attr_name,
          attr_sel: tagRowId.attr_sel,
          // 后台数据不支持原来的 只能通过字符串
          attr_vals: tagRowId.attr_vals.join(" ")
        }
      );
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
    }
  },

  // 使用计算属性  设置按钮禁用方式
  computed: {
    isdisabled() {
      // 根据级联选择框一样  判断选中的长度是不是为3  是的话不禁用按钮
      if (this.modelvalue.length === 3) {
        return false;
      }
      return true;
    },

    // 自定义三级分类id  获取的时候必须是数字 放在计算属性中
    threeId() {
      // 判断获取的级联选择框是不是数字  不是数据的话 return null
      if (this.modelvalue.length === 3) {
        return this.modelvalue[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader,
.el-tabs {
  margin-top: 25px;
}

.el-tag {
  margin: 10px 5px;
}
.input-new-tag {
  width: 150px;
}
</style>


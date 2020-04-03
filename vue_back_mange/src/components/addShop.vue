<template>
  <div>
    <!-- 面包屑头部组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName- 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- from 表单 -->
      <el-form
        :model="goodsruleForm"
        :rules="goodsrules"
        ref="goodsruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- Tab 标签页   v-model要和步骤条中的 :active 一致-->
        <el-tabs
          v-model="activeName"
          tab-position="left"
          :before-leave="beforeleave"
          @tab-click="tabsCheckbox"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsruleForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsruleForm.goods_price"></el-input>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsruleForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 商品数量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsruleForm.goods_number"></el-input>
            </el-form-item>
            <!-- 商品分类 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="goodsruleForm.goods_cat"
                :options="optionsList"
                :props="props"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manytables" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlytables" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action指定图片上传 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="onsuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goodsruleForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" style="margin-top:15px;" @click="addgoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="PngdialogVisible" width="50%">
      <img :src="PngImgpath" alt width="100%" />
    </el-dialog>
  </div>
</template>

<script>
// 导入图片途径（json）
import ImgURL from "../../src/ImgURL.json";
// 导入lodash  富文本编辑器下边添加商品按钮 要用到
import _ from "lodash";

export default {
  data() {
    return {
      // 步骤条和备选中的同步
      activeName: "0",
      goodsruleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        // 商品分类后台文档给的式字符串形式  但是用到了级联选择器 所以用数组
        goods_cat: [],
        goods_introduce: "",
        pics: [],
        // 商品的参数信息
        attrs: []
      },
      goodsrules: {
        // 商品名称
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        // 商品价格
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        //商品重量
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        // 商品数量
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        // 商品级联列表
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },

      // 级联选择器
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      optionsList: [],
      // 动态参数数据
      manytables: [],
      // 静态参数数据
      onlytables: [],

      // 图片上传路劲
      uploadURL: ImgURL.baseURL + "upload",
      // 请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 预览图片对话框
      PngdialogVisible: false,
      // 预览图片地址
      PngImgpath: ""
    };
  },
  created() {
    // 调用
    this.goosList();
  },
  methods: {
    async goosList() {
      // 发起Ajax 请求
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      // console.log(res);

      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      // 把获取到的数据赋值
      this.optionsList = res.data;
    },

    // 判断级联选择框中 选中的长度 不是为3 就强制清空
    handleChange() {
      if (this.goodsruleForm.goods_cat.length !== 3) {
        this.goodsruleForm.goods_cat = [];
      }
    },

    // 在tab 页面离开之前做判断
    beforeleave(Old, News) {
      if (News === "0" && this.threeId === null) {
        this.$message.error("请先选择商品分类！");
        // 阻止 页签 切换
        return false;
      }
    },

    // tab栏被点击时 获取第二个页面
    async tabsCheckbox() {
      // 判断进入静态熟悉页面
      if (this.activeName === "1") {
        // 发起Ajax 请求
        const { data: res } = await this.$http.get(
          `categories/${this.threeId}/attributes/`,
          { params: { sel: "many" } }
        );
        // console.log(res);
        // 判断
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败！");
        }

        // 把每一个动态参数使用 attr_vals 属性，都是用' '做分割 处理空字符串
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });

        // 成功赋值
        this.manytables = res.data;
      } else {
        // 进入静态属性页面
        if (this.activeName === "2") {
          // 发起Ajax 请求
          const { data: res } = await this.$http.get(
            `categories/${this.threeId}/attributes/`,
            { params: { sel: "only" } }
          );
          // console.log(res);
          // 判断
          if (res.meta.status !== 200) {
            return this.$message.error("获取静态参数失败！");
          }
          this.onlytables = res.data;
          // console.log(res);
        }
      }
    },

    // 图片上传 => 点击预览图片
    handlePreview(result) {
      this.PngdialogVisible = true;
      this.PngImgpath = result.response.data.url;
    },
    // 图片上传 => 点击移除图片
    handleRemove(result) {
      // console.log(result);
      // 获取要删除的图片地址
      const pinPath = result.response.data.temp_path;
      // 根据 picPath, 从 addFrom.pics 数组中，找到要删除的索引
      const i = this.goodsruleForm.pics.findIndex(x => x.pic === pinPath);
      this.goodsruleForm.pics.splice(i, 1);
    },
    // 图片上传 => 上传图片成功触发
    onsuccess(result) {
      // console.log(result);
      // 判断
      if (result.meta.status === 200) {
        const png = { pic: result.data.tmp_path };
        this.goodsruleForm.pics.push(png);
      }
    },
    // 富文本编辑器 下边按钮添加商品
    async addgoods() {
      // 预判端
      this.$refs.goodsruleFormRef.validate(async one => {
        if (!one) {
          return this.$message.error("请完善表单数据后再提交再添加！");
        }
      });
      // 通过lodash 深拷贝 from表单
      const from = _.cloneDeep(this.goodsruleForm);
      // 处理把数组中的goos_cat 转为 字符串
      from.goods_cat = from.goods_cat.join(",");
      // 处理动态参数属性
      this.manytables.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          atttr_value: item.attr_vals.join(" ")
        };
        from.attrs.push(newInfo);
        // console.log(this.manytables);
      });
      // 处理静态处理参数
      this.onlytables.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          atttr_value: item.attr_vals
        };
        from.attrs.push(newInfo);
        // console.log(this.onlytables);
      });
      // console.log(from);

      // 发起Ajax请求，添加新商品
      const { data: res } = await this.$http.post("goods", from);
      if (res.meta.status !== 201) return this.$message.error(res.meta.message);
      this.$message.success("添加商品成功");
      // 通过编程式，跳转到商品列表页面
      this.$router.push("/goods/list");
    }
  },
  // 使用计算属性 判断分类
  computed: {
    threeId: function() {
      if (this.goodsruleForm.goods_cat.length === 3) {
        return this.goodsruleForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps,
.el-tabs {
  margin-top: 25px;
}
</style>

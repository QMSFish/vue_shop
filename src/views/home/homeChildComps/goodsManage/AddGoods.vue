<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 文案提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeData - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 选项卡样式 -->
      <el-form :model="addForm" :rules="addGoods_rules" ref="addGoods_ref">
        <el-tabs v-model="activeData" tab-position="left" 
        :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name" label-position="top">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" label-position="top">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" label-position="top">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" label-position="top">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" label-position="top">
              <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="cascaderProps"
              clearable
              @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" label-position="top"
            v-for="item in dynamicTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="it" v-for="(it,i) in item.new_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" label-position="top"
            v-for="item in staticTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://119.23.53.78:8888/api/private/v1/upload"
              :headers="requestHeader"
              list-type="picture"
              :on-preview="showPicture"
              :on-success="uploadSuccess"
              :on-remove="removePicture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor 
            v-model="addForm.goods_introduce" 
            class="quill_editor">
            </quill-editor>
            <el-button type="primary" @click="addGoodClick">添加商品</el-button>
          </el-tab-pane>
        </el-tabs> 
      </el-form>

      <!-- 商品图片对话框 -->
      <el-dialog
        title="图片预览"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <img :src="pictureUrl" alt="">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getGoodsClassifyList,getClassifyParams,addGoods} from 'network/home'

import _ from "lodash"

export default {
  name: 'addgoods',
  data() {
    return {
      // 步骤条选中的变量值
      activeData: '0',
      options: [],
      // 级联选择器的props
      cascaderProps: {
        expandTrigger: 'hover',
        // checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // form表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []

      },
      // from表单的验证规则
      addGoods_rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ]
      },
      // 分类id
      classifyId: 0,
      // 动态参数的数据
      dynamicTableData: [],
      // 静态参数的数据
      staticTableData: [],
      // 图片上传的请求头
      requestHeader: {
        Authorization: sessionStorage.getItem('token')
      },
      // 商品图片对话框的显示隐藏变量
      dialogVisible: false,
      pictureUrl: '',
      
    }
  },
  created () {
    // 请求所有商品分类数据列表
  this.getGoodsClassifyList1({})
  },
  methods: {
    // 请求分类数据列表
    async getGoodsClassifyList1(obj) {
      const res = await getGoodsClassifyList(obj);
      // console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求商品分类数据失败');}
      this.options = res.data;
    },
    // 分类动态参数请求/分类静态参数请求
    async getClassifyParams1(id, type) {
      const res = await getClassifyParams(id, type);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求分类参数失败');}
      if(type == 'many') {
        this.dynamicTableData = res.data;
        this.dynamicTableData.forEach(item => {
          item.attr_vals = item.attr_vals.split(',');
          item.new_vals = item.attr_vals; //再复制一份item.attr_vals给checkbox遍历用
        });
        console.log(this.dynamicTableData);
      }else {
        this.staticTableData = res.data
      }
    },
    // 添加商品请求
    async addGoods1(obj) {
      const res = await addGoods(obj);
      console.log(res);
      if(res.meta.status !== 201) {return this.$message.error('添加商品失败');}
      this.$message.success('添加商品成功');
      this.$router.push('/goods')
    },
    // // 分类静态参数请求
    // async getClassifyParams2(id, type) {
    //   const res = await getClassifyParams(id, type);
    //   console.log(res);
    //   if(res.meta.status !== 200) {return this.$message.error('请求分类参数失败');}
    //   this.staticTableData = res.data
    // },
    // 级联选择器中 当选中节点变化时触发 控制选择范围 
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }else {
        const ClassifyValue = this.addForm.goods_cat;
        this.classifyId= ClassifyValue[ClassifyValue.length - 1];
        console.log(this.classifyId);
      }
    },
    // 选项卡离开之前
    beforeLeave(activeName, oldActiveName) {
      console.log("即将要离开第" + oldActiveName + '个选项卡');
      console.log("即将要进入第" + activeName + '个选项卡');
      if(this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类');
        return false
      }
    },
    // 选项卡被点击
    tabClick(tab) {
      // console.log(tab);
      if(tab.index == 1) {
        // 请求动态参数列表
        this.getClassifyParams1(this.classifyId, 'many')
      }
      if(tab.index == 2) {
        // 请求静态属性列表
        this.getClassifyParams1(this.classifyId, 'only')
      }
    },
    showPicture(file) {
      console.log(file);
      this.pictureUrl = file.response.data.url;
      this.dialogVisible = true
    },
    // 图片上次成功
    uploadSuccess(res) {
      let pic = {"pic": res.data.tmp_path};
      this.addForm.pics.push(pic);
      console.log(this.addForm.pics);
    },
    // 移除已上传的图片
    removePicture(file) {
      // 先获取要删除的索引号
      // 再通过splice删除该元素
      let index = this.addForm.pics.findIndex( currentValue => {
        return currentValue['pic'] == file.response.data.tmp_path;
      });
      this.addForm.pics.splice(index,1);
      console.log(this.addForm.pics);
    },
    // 添加商品按钮点击事件
    addGoodClick() {
      this.$refs.addGoods_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        // 把this.addForm对象深拷贝份
        const addform = _.cloneDeep(this.addForm);
        addform.goods_cat = addform.goods_cat.join(',');
        this.dynamicTableData.forEach(item => {
          const attr = {};
          let vals = item.attr_vals.join(',');
          attr.attr_id = item.attr_id;
          attr.attr_value = vals;
          addform.attrs.push(attr);
        });
        this.staticTableData.forEach(item => {
          const attr = {};
          attr.attr_id = item.attr_id;
          attr.attr_value = item.attr_vals;
          addform.attrs.push(attr);
        })
        console.log(addform);
        // 发起添加商品请求
        this.addGoods1(addform)
      })

    }
  }
}

</script>
<style scoped>
  .el-steps {
    margin: 10px 0;
  }
  .quill_editor {
    margin-bottom: 10px;
  }
</style>
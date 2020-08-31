<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-button type="primary" @click="showAddClassifyDialog">添加分类</el-button>
      <!-- vue-table-with-tree-grid插件 实现树状表格 -->
      <tree-table
        ref="table"
        :data="goodsClassifyData"
        :columns="columns"
        :show-index="props.showIndex"
        index-text="#"
        :show-header="props.showHeader"
        :stripe="props.stripe"
        :border="props.border"
        :show-row-hover="props.showRowHover"
        :tree-type	="props.treeType"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :selection-type="props.selectionType"
        :show-summary="props.showSummary"
        class="tree_table">
        <!-- valid模板列 -->
        <template slot="valid" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排列模板列 -->
        <template slot="level" slot-scope="scope">
          <el-tag :type="tagTypeArr[scope.row.cat_level]">{{levelArr[scope.row.cat_level]}}</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditClassifyDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteClassifyRequest(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="parames.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addClassifyFlag"
        width="50%"
        @close="addClassifyClosed">
        <el-form :model="addClassifyData" :rules="addClassify_rules" ref="addClassify_ref"  label-width="100px">
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model="addClassifyData.name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级分类：">
            <el-cascader
             v-model="addClassifyData.value"
             :options="options"
             :props="cascaderProps"
             clearable
             class="cascader">
            </el-cascader>
          </el-form-item>
          
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassifyFlag = false">取 消</el-button>
          <el-button type="primary" @click="addClassifyRequest">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editClassifyFlag"
        width="50%">
        <el-form :model="editClassifyData" :rules="editClassify_rules" ref="editClassify_ref"  label-width="100px">
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model="editClassifyData.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editClassifyFlag = false">取 消</el-button>
          <el-button type="primary" @click="editClassifyRequest">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getGoodsClassifyList,addClassify,editClassify,deleteClassify} from 'network/home'

export default {
  name: 'goodsclassify',
  data() {
    return {
      props: {
          stripe: true,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: false,
          showIndex: true,
          treeType: true,
          isFold: true,
          expandType: false,
          selectionType: false,
        },
      // 表格各行的数据
      goodsClassifyData: [],
      // 所有行的数量
      total: 0,
      // 当前操作的行数据
      currentRow: {},
      // 添加分类对话框变量
      addClassifyFlag: false,
      // 编辑分类对话框变量
      editClassifyFlag: false,
      // 排序level的数组
      levelArr: ['一级','二级','三级'],
      // tag标签type属性值的数组
      tagTypeArr:  ['','success','warning'],
      // 表格各列的配置
      columns: [
        {
          label: '分类名称',
          minWidth: '170px',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示将 当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'valid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          minWidth: '220px',
          type: 'template',
          template: 'operation',
        },
      ],
      // 请求商品分类数据列表的请求参数
      parames: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类的信息
      addClassifyData: {
        name: '',
        // 级联选择器的选中项绑定值 数组
        value: [],
      },
      // 编辑分类的信息
      editClassifyData: {
        name: ''
      },
      // 编辑分类参数
      edit_id: '',
      // 添加分类的验证规则
      addClassify_rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 编辑分类的验证规则
      editClassify_rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器的可选项数据源 数组
      options: [],
      // 级联选择器的props
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 添加分类请求参数
      addClassifyParams: {
        // 分类名称
        cat_name: '',
        // 分类父 ID	
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      }
    }
  },
  created() {
    // 请求商品分类数据列表
    this.getGoodsClassifyList1(this.parames)

  },
  methods: {
    // 请求分类数据列表
    async getGoodsClassifyList1(obj) {
      const res = await getGoodsClassifyList(obj);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求商品分类数据失败');}
      this.total = res.data.total;
      this.goodsClassifyData = res.data.result;
    },
    // 请求父级分类数据列表
    async getGoodsClassifyList2(obj) {
      const res = await getGoodsClassifyList(obj);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求商品分类数据失败');}
      this.options = res.data;
    },
    // 添加分类请求
    async addClassify1(obj) {
      const res = await addClassify(obj);
      console.log(res);
      if(res.meta.status !== 201) {return this.$message.error('添加分类失败');}
      this.$message.success('添加分类成功');
      // 重新请求商品分类数据列表
      this.getGoodsClassifyList1(this.parames)
    } ,
    // 编辑分类请求
    async editClassify1(id, name) {
      const res = await editClassify(id, name);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('编辑分类失败');}
      // 修改局部数据实现局部刷新  但是没有触发
      // 该组件data数据中心初始化的时候，只绑定了options数组，没绑定里面的元素，所以实现不了响应式刷新
      this.currentRow.cat_name = res.data.cat_name;
      // 通过数组扩展运算符来实现数组响应式刷新 
      // [...this.options] 创建一个新的数组 ...this.options 深拷贝数组
      this.options = [...this.options];
      // 重新请求商品分类数据列表
      // this.getGoodsClassifyList1(this.parames)
    },
    // 删除分类请求
    async deleteClassify1(id) {
      const res = await deleteClassify(id);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('删除分类失败');}
      this.$message.success('删除分类成功');
      // 请求商品分类数据列表
      this.getGoodsClassifyList1(this.parames)
    },
    // 确定删除按钮
    async deleteClassifyRequest(id) {
      const res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
      if(res !== 'confirm')  {
        return this.$message.info('已经取消删除')
      }
      this.deleteClassify1(id)
    },
    // 监听每一页数据个数的改变 size-change
    handleSizeChange(val) {
      // console.log('每页' + val + '条');
      this.parames.pagesize = val;
      this.getGoodsClassifyList1(this.parames)
    },
    // 监听当前页的改变  current-change
    handleCurrentChange(val) {
      // console.log('当前页：' + val);
      this.parames.pagenum = val;
      this.getGoodsClassifyList1(this.parames)
    },
    // 显示添加分类对话框
    showAddClassifyDialog() {
      let obj = {type: 2};
      this.getGoodsClassifyList2(obj)
      this.addClassifyFlag = true;
    },
    // handleSelectedChange() {
    //   console.log(this.addClassifyData.value);
    //   const addCValue = this.addClassifyData.value;
    //   if(addCValue.length == 0) {
    //     this.addClassifyParams.cat_pid = 0;
    //     this.addClassifyParams.cat_level = 0
    //   } else {
    //     let pid = addCValue[addCValue.length - 1];
    //     this.addClassifyParams.cat_pid = pid;
    //     this.addClassifyParams.cat_level = this.value.length
    //   }
    // },
    // 点击添加分类对话框中确定按钮
    addClassifyRequest() {
      this.$refs.addClassify_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        // 定义变量 简化代码
        const Data = this.addClassifyData;
        const params = this.addClassifyParams;

        if(Data.value.length == 0) {
          params.cat_pid = 0;
          params.cat_level = 0
        } else {
          let pid = Data.value[Data.value.length - 1];
          params.cat_pid = pid;
          params.cat_level = Data.value.length
        }
        params.cat_name = Data.name
        this.addClassify1(params);
        this.addClassifyFlag = false;

        // // 重置 addClassifyParams请求参数
        // params.cat_pid = 0;
        // params.cat_level = 0
      })
    },
    // 添加分类对话框关闭时候执行重置表单
    addClassifyClosed() {
      this.addClassifyData.value = [];
      this.addClassifyData.name = '';
      //  this.$refs.addClassify_ref.resetFields()
      //  console.log(11);
    },
    // 显示编辑分类对话框
    showEditClassifyDialog(row) {
      this.currentRow = row;
      this.edit_id = row.cat_id;
      this.editClassifyData.name = row.cat_name;
      this.editClassifyFlag = true;
    },
    // // 点击编辑分类对话框中确定按钮
    editClassifyRequest() {
      this.$refs.editClassify_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        this.editClassify1(this.edit_id,this.editClassifyData.name);
        // 隐藏编辑分类对话框
        this.editClassifyFlag = false;
      })
    },
    
    


  }
}

</script>
<style scoped>
  .el-card {
    margin-top: 15px;
  }
  .tree_table {
    margin: 15px 0;
  }
  .cascader {
    width: 100%;
  }
</style>
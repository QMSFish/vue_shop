<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告语句 -->
      <el-alert
      title="注意：只允许第三级分类设置相关参数！"
      type="warning"
      show-icon>
      </el-alert>
      <!-- 选择商品分类模板 -->
      <div class="goodClassify">
        <span>选择商品分类：</span>
        <el-cascader
        v-model="classifyParamsData.value"
        :options="options"
        :props="cascaderProps"
        clearable
        @change="handleChange">
        </el-cascader>
      </div>
      <!-- 选项卡模块 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数 -->
          <el-button type="primary" 
          :disabled="this.classifyParamsData.value.length == 0"
          @click="addDynamicParams">添加参数</el-button>
          <!-- table -->
          <el-table
            :data="dynamicTableData"
            border
            striper
            class="tabs_table">
            
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope" >
                <el-row>
                  <!-- 编辑按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="editParamsBtn(scope.row)">修改</el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" 
                  @click="deleteParamsBtn(scope.row)">删除</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <!-- 添加参数 -->
          <el-button type="primary"
           :disabled="this.classifyParamsData.value.length == 0"
           @click="addStaticProperty">添加属性</el-button>
          <!-- table -->
          <el-table
            :data="staticTableData"
            border
            striper
            class="tabs_table">
            
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-row>
                  <!-- 编辑按钮 -->
                  <el-button type="primary" icon="el-icon-edit" 
                  size="mini"
                  @click="editParamsBtn(scope.row)">修改</el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" 
                  @click="deleteParamsBtn(scope.row)">删除</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 -->
      <el-dialog
        :title="paramsTitle"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addParamsClosed">
        <el-form :model="paramsData" :rules="params_rules" ref="params_ref"  label-width="100px">
          <el-form-item :label="paramsLabel" prop="name">
            <el-input v-model="paramsData.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsRequest">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑参数对话框 -->
      <el-dialog
        :title="editParamsTitle"
        :visible.sync="editParamsFlag"
        width="50%"
        @close="handleEditClosed">
        <el-form :model="editparamsData" :rules="params_rules" ref="editparams_ref"  label-width="100px">
          <el-form-item :label="editParamsLabel" prop="name">
            <el-input v-model="editparamsData.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsFlag = false">取 消</el-button>
          <el-button type="primary" @click="editParamsRequest">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getGoodsClassifyList,getClassifyParams,addParams,editParams,deleteParams} from 'network/home'
export default {
  name: 'classify',
  data() {
    return {
      // 选择商品分类模板的数据
      options: [],
      // 选中的分类id
      classifyId: '',
      // 级联选择器 v-model绑定的数据
      classifyParamsData: {
        value: ''
      },
      // 级联选择器 props配置参数
      // 级联选择器的props
      cascaderProps: {
        expandTrigger: 'hover',
        // checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选项卡默认被选中的选项
      activeName: 'first',
      // 选项卡动态参数中table的数据
      dynamicTableData:[],
      // 选项卡动态参数中table的数据
      staticTableData:[],
      // 对话框显示隐藏变量
      dialogVisible:false,
      // 对话框的标题
      paramsTitle: '',
      //  对话框中input的label值
      paramsLabel: '',
      // 对话框中form表单的绑定值
      paramsData: {
        name: ''
      },
      // 区分被点击的是动态和静态按钮的变量
      paramsFlag: '',
      //  表单的验证规则
      params_rules:{
        name: [
          { required: true, message: '请输入参数/属性名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 添加分类参数请求的参数对象
      paramsRequestObj: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 当前参数行对象
      currentRow: {},
      // 编辑对话框显示隐藏变量
      editParamsFlag: false,
      // 编辑参数对话框的标题
      editParamsTitle:'',
      //  编辑参数对话框中input的label值
      editParamsLabel: '',
      // 编辑参数对话框中form表单的绑定值
      editparamsData: {
         name: ''
      },
      editParamsObj: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      }
    }
  },
  created() {
    // 请求所有商品分类数据列表
    this.getGoodsClassifyList1({})

  },
  methods: {
    // 请求分类数据列表
    async getGoodsClassifyList1(obj) {
      const res = await getGoodsClassifyList(obj);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求商品分类数据失败');}
      this.options = res.data;
    },
    // 分类动态参数请求
    async getClassifyParams1(id, type) {
      const res = await getClassifyParams(id, type);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求分类参数失败');}
      this.dynamicTableData = res.data
    },
    // 分类静态参数请求
    async getClassifyParams2(id, type) {
      const res = await getClassifyParams(id, type);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('请求分类参数失败');}
      this.staticTableData = res.data
    },
    // 添加参数请求
    async addParams1(id, obj) {
      const res = await addParams(id, obj);
      console.log(res);
      if(res.meta.status !== 201) {return this.$message.error('添加参数失败');}
      this.$message.success('添加分类参数成功');
      if(this.paramsFlag) {
        this.getClassifyParams1(this.classifyId,'many');
      }else {
        this.getClassifyParams2(this.classifyId,'only');
      }
    },
    // 编辑提交参数请求
    async editParams1(id, attrId, obj) {
      const res = await editParams(id, attrId, obj);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('修改参数失败');}
      this.$message.success('修改分类参数成功');
      if(this.currentRow.attr_sel == 'many') {
        this.getClassifyParams1(this.classifyId,'many');
      }else {
        this.getClassifyParams2(this.classifyId,'only');
      }
    },
    // 删除参数请求
    async deleteParams1(id, attrId) {
      const res = await deleteParams(id, attrId);
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('删除参数失败');}
      this.$message.success('删除参数成功');
      if(this.currentRow.attr_sel == 'many') {
        this.getClassifyParams1(this.classifyId,'many');
      }else {
        this.getClassifyParams2(this.classifyId,'only');
      }

    },
    // 级联选择器中 当选中节点变化时触发 控制选择范围 
    handleChange() {
      if(this.classifyParamsData.value.length !== 3) {
        this.classifyParamsData.value = []
      }
      if(this.classifyParamsData.value.length !== 0) {
        // 请求分类参数
        const ClassifyValue = this.classifyParamsData.value;
        this.classifyId= ClassifyValue[ClassifyValue.length - 1]
        this.getClassifyParams1(this.classifyId,'many');
        this.getClassifyParams2(this.classifyId,'only');
      }else {
        // 当点击级联选择器的清空选项时，把动态参数和静态属性的table数据都清空
        this.dynamicTableData = [];
        this.staticTableData = []
      }
    },
    // 点击添加动态参数按钮
    addDynamicParams() {
      this.paramsFlag = true;
      this.paramsTitle = '添加动态参数';
      this.paramsLabel = '动态参数';
      this.dialogVisible = true
    },
    //  点击添加静态属性按钮
    addStaticProperty() {
      this.paramsFlag = false;
      this.paramsTitle = '添加静态属性';
      this.paramsLabel = '静态属性';
      this.dialogVisible = true
    },
    // 点击对话框的确认按钮
    addParamsRequest() {
      this.$refs.params_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        this.paramsRequestObj.attr_name = this.paramsData.name;
        if(this.paramsFlag) {
          this.paramsRequestObj.attr_sel = 'many';
          this.paramsRequestObj.attr_vals = 'a,b,c';
          this.addParams1(this.classifyId,this.paramsRequestObj)
        } else {
          this.paramsRequestObj.attr_sel = 'only';
          this.addParams1(this.classifyId,this.paramsRequestObj)
        }
      })
      // 隐藏对话框
      this.dialogVisible = false;
    },
    // 对话框关闭
    addParamsClosed() {
      this.$refs.params_ref.resetFields();
    },
    // 点击编辑按钮
    editParamsBtn(row) {
      this.currentRow = row;
      if(row.attr_sel == 'many') {
        this.editParamsTitle = '修改动态参数';
        this.editParamsLabel = '动态参数';  
      }else {
        this.editParamsTitle = '修改静态属性';
        this.editParamsLabel = '静态属性';
      }
      this.editparamsData.name = row.attr_name;
      this.editParamsFlag = true;
    },
    //点击编辑参数对话框的确认按钮
    editParamsRequest() {
      this.$refs.editparams_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        this.editParamsObj.attr_name = this.editparamsData.name;
        if(this.currentRow.attr_sel == 'many') {
          this.editParamsObj.attr_sel = 'many';
          this.editParamsObj.attr_vals = 'a,b,c';
        } else {
          this.editParamsObj.attr_sel = 'only';
          this.editParamsObj.attr_vals = '';
        }
        this.editParams1(this.classifyId,this.currentRow.attr_id,this.editParamsObj)
        // 隐藏编辑参数对话框
        this.editParamsFlag = false;
      })
    },
    // 编辑参数对话框关闭
    handleEditClosed() {
      this.$refs.editparams_ref.resetFields();
    },
    // 点击选项卡动态参数和静态属性中的删除按钮
    async deleteParamsBtn(row) {
      this.currentRow = row;
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(res !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发起删除请求
      this.deleteParams1(this.classifyId,row.attr_id)
    }
  }
}

</script>
<style scoped>
  .el-card {
    margin-top: 15px;
  }
  .goodClassify {
    margin: 15px 0;
  }
  .el-form-item .el-form-item__label {
    text-align: left!important;
    /* padding: 0; */
  }
  .tabs_table {
    width: 100%;
    margin-top: 15px;
  }
</style>
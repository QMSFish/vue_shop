<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- input和button -->
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入搜索内容" class="input_serch" 
        v-model="parameter.query" 
        clearable 
        @clear="getUserList1(parameter)">
          <el-button slot="append" icon="el-icon-search" @click="getUserList1(parameter)"></el-button>
        </el-input>
        <el-button type="primary" @click="visibleFlag = true">添加用户</el-button>
      </div>
      
      <!-- table表格区域 -->
      <el-table
        :data="tableData"
        border
        stripe
        :max-height="700"
        class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 这里作用域插槽可以获取到当前行的所有内容 -->
          <template slot-scope="scope">
            <!-- <span>{{scope.row}}</span> -->
            <!-- scope是一个 对象 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeState(scope.row,scope)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-row>
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" 
            size="mini" @click="primaryUserData(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <!-- 组件的标签 设置事件必须加native -->
            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click.native="deleteRow(scope.row.id)"></el-button>
            <!-- 分配按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRoleBlock(scope.row)"></el-button>
            </el-tooltip>
          </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getCurrent"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="visibleFlag"
        width="50%"
        @close="addFormClosed">
        <el-form :model="addForm" :rules="addRules" ref="ruleAddForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visibleFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitAddData">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="ChangeDataFlag"
        width="50%"
        @close="changeDialogClosed"
        >
        <el-form :model="changeUserData" :rules="addRules" ref="ruleChangeData" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="changeUserData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="changeUserData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="changeUserData.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ChangeDataFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitChangeData">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="allotRoleFlag"
        width="50%"
        >
        <p><span>当前的用户：</span><span>{{currentUser}}</span></p>
        <p><span>当前的角色：</span><span>{{currentRole}}</span></p>
        <div>
          <span>分配新角色：</span>
          <el-select v-model="value1" placeholder="请选择" ref="roleSelect">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allotRoleFlag = false">取 消</el-button>
          <el-button type="primary" @click="allotRoleRequest">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getUserList,changeUserState, addUser,changeUserData,deleteUser,getRolesList,allotRole } from 'network/home'

export default {
  name: 'userlist',
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if(regMobile.test(value)) {
        // 合法手机号
        return callback()
      }

      callback(new Error('请输入合法的手机号'))
    }

    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if(regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }
    return {
      // 访问对象属性值的方法有两种：1、点的方式：object.name  但是这里的name必须是对象存在的属性 不能是变量或者函数参数
      // 2、[]的方式：object[name] name可以是变量或者函数参数
      tableData: [],
      currentUser: '', // 当前分配角色的用户名
      currentRole: '', // 当前分配角色的用户的角色
      currentRow: {}, // 当前分配角色的对象
      roleId: 0, // 被选中的角色id
      // 请求用户数据列表的参数
      parameter: {
        query: '', //query是用来搜索用的
        pagenum: 1, //第几页
        pagesize: 1 //每页有多少条数据
      },
      total: 0,  // 总共有多少条数据
      visibleFlag: false, // 添加用户对话框显示变量
      ChangeDataFlag: false, //修改用户对话框的显示变量
      allotRoleFlag: false, //分配角色对话框的显示变量
      // 添加用户的信息
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 分配角色对话框select里面option数组
      options: [],
      // select的value值
      value1: '',
      // 添加用户的验证规则
      addRules: {
        username: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 保存修改后的用户信息
      changeUserData: {
        username: '',
        mobile: '',
        email: ''
      }
    }
  },
  computed: {
    getCurrent() {
      return this.parameter.pagenum
    }
  },
  created() {
    //请求用户数据列表
    this.getUserList1(this.parameter)
  },
  methods: {
    // 数据请求函数
    async getUserList1(object) {
      const res = await getUserList(object);
      console.log(res);
      // console.log(this.parameter.pagenum);
      if(res.meta.status !== 200) {return this.$message.error('获取菜单数据失败');}
      // this.tableData[this.pagenum] = res.data;
      this.total = res.data.total;
      this.tableData = res.data.users;
      // console.log(this);
      // console.log(this.meunList);
    },
    //修改用户状态
    async changeUserState1(value) {
      const res = await changeUserState(value.id,value.my_state) 
      console.log(res);
      if(res.meta.status !== 200) {
        value.my_state = !value.my_state;
        return this.$message.error('状态更新失败');}
      this.$message.success('状态更新成功');
      // 重新请求用户信息
      // this.getUserList1(this.parameter) 
      // 后台返回更改状态成功 但是后台数据没有改变，这是后台的问题
      // const res1 = await getUserList(this.parameter);
      // console.log(res1);
    },
    // 添加用户信息
    async addUser1(obj) {
      const res = await addUser(obj);
      console.log(res);
      if(res.meta.status !== 201) {
        return this.$message.error('添加用户失败');}
      this.$message.success('添加用户成功');
      // 重新请求用户信息
      this.getUserList1(this.parameter) 
    },
    // 修改用户信息
    async changeUserData1(object) {
      const res = await changeUserData(object);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败');}
      this.$message.success('修改用户信息成功');
      // 重新请求用户信息
      this.getUserList1(this.parameter) 
    },
    // 删除单个用户
    async deleteUser1(id) {
      const res = await deleteUser(id);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('删除用户失败');}
      this.$message.success('删除用户成功');
      this.parameter.pagenum--;
      // 重新请求用户信息
      this.getUserList1(this.parameter) 
    },
   
    //删除用户列表操作
    async deleteRow(id) {
      console.log(id);
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err); 
      // 点击确认，打印字符串confirm  点击取消，打印字符串cancel
      console.log(res);  
      if(res !== 'confirm')  {
        return this.$message.info('已经取消删除')
      }
      this.deleteUser1(id)
      // table.splice(index,1)
    },
    // 请求角色列表
    async getRolesList1() {
      const res = await getRolesList();
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败');}
      this.options = res.data;
    },
    // 分配角色
    async allotRole1(userId,roleId) {
      const res = await allotRole(userId,roleId);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败');}
      // 重新请求数据列表
      this.getUserList1(this.parameter)
      // 重置当前分配角色对象的角色
      // this.currentRow.role_name = this.value1;
    },
    // 监听每一页数据个数的改变 size-change
    handleSizeChange(val) {
      console.log('每页' + val + '条');
      this.parameter.pagesize = val
      this.getUserList1(this.parameter)
    },
    // 监听当前页的改变  current-change
    handleCurrentChange(val) {
      console.log('当前页：' + val);
      this.parameter.pagenum = val;
      this.getUserList1(this.parameter)
    },
    //修改用户状态
    changeState(value,val) {
      // let state = !value.my_state
      console.log(val);
      this.changeUserState1(value)
    },
    // 添加用户对话框关闭时候执行重置表单
    addFormClosed() {
       this.$refs.ruleAddForm.resetFields()
    },
    // 点击确认，进行添加用户对话框表单预校验
    submitAddData() {
      this.$refs.ruleAddForm.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        // this.$message.success('校验通过');
        // 执行添加用户信息请求必须必须在隐藏对话框之前，不然this.addFrom被清空了
        this.addUser1(this.addForm);
        // 控制台这里有bug,只能创建一个新对象，再打印
        console.log(JSON.parse(JSON.stringify(this.addForm))); 
        // 隐藏对话框
        this.visibleFlag = false;
        console.log(this.addForm);
      })
    },
    // 显示修改用户对话框
    primaryUserData(rowValue) {
      this.ChangeDataFlag = true;
      this.changeUserData = rowValue
    },
    // 点击确认、进行修改用户对话框表单预校验
    submitChangeData() {
      this.$refs.ruleChangeData.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        // this.$message.success('校验通过');
        this.changeUserData1(this.changeUserData)
        // 隐藏对话框
        this.ChangeDataFlag = false;
      })
    },
    // 修改用户对话框关闭时候执行重置表单
    changeDialogClosed() {
      this.$refs.ruleChangeData.resetFields()
    },
    // 显示分配角色对话框
    allotRoleBlock(row) {
      // 保存当前行对象
      this.currentRow = row;
      // 保存当前分配角色的userid
      // this.currentUserId = row.id;
      //  请求所有角色列表
      this.getRolesList1()
      this.currentUser = row.username;
      this.currentRole = row.role_name;
      this.allotRoleFlag = true;
    },
    // 分配角色请求
    allotRoleRequest() {
      // 隐藏分配角色对话框
      this.allotRoleFlag = false;
      if(!this.value1) {
        return this.$message.error('请选择用户新角色');
      };
      console.log(this.value1);
      let roleId = this.value1;
      this.allotRole1(this.currentRow.id,roleId);
      this.value1 = '';
      console.log(roleId);
      console.log(this.currentRow.id);
    }
  }
}

</script>
<style scoped>
  .input_serch {
    width: 400px;
    margin-right: 20px;
  }
  .table {
    width: 100%;
    margin-top: 15px;
    margin-bottom: 10px;
  }
</style>
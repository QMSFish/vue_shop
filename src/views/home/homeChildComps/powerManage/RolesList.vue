<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-button type="primary" @click="dialogVisible_roles = true">添加角色</el-button>
      <!-- table表格区域 -->
      <el-table
        :data="tableData"
        class="table"
        border
        stripe
        >
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id" class="level0_row">
              <!-- 一级权限 -->
              <el-col :span="5">
                <div>
                  <el-tag
                  closable
                  @close="removeRoleRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </div>
              </el-col>
              <!-- 二级、三级权限 -->
              <el-col :span="19">
                <div>
                  <el-row v-for="item2 in item1.children" :key="item2.id" class="level1_row">
                    <!-- 二级权限 -->
                    <el-col :span="6">
                      <div>
                        <el-tag type="success"
                        closable
                        @close="removeRoleRight(scope.row,item2.id)" 
                        >{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </div>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18" class="col_2">
                      <div>
                        <el-tag type="warning"  
                        v-for="item3 in item2.children" 
                        :key="item3.id"
                        class="tag_3"
                        closable
                        @close="removeRoleRight(scope.row,item3.id)"
                        >{{item3.authName}}</el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引行 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="primaryRoleData(scope.row)" >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletCurrentRole(scope.row.id)" >删除</el-button>
            <!-- 分配按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRight(scope.row)">分配权限</el-button>
          </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible_roles"
        width="50%"
        @close="addRolesClose">
        <el-form :model="addRoles" :rules="addRoles_rules" ref="addRoles_ref" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible_roles = false">取 消</el-button>
          <el-button type="primary" @click="submitAddRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色信息对话框 -->
      <el-dialog
        title="编辑角色信息"
        :visible.sync="editRolesFlag"
        width="50%"
        @close="editRolesClose">
        <el-form :model="editRoles" :rules="addRoles_rules" ref="editRoles_ref" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitEditRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="allotRightFlag"
        width="50%"
        >
        <el-tree
          :data="rightData"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedArr"
          ref="tree"
          node-key="id"
          :props="defaultProps">
        </el-tree> 
        <span slot="footer" class="dialog-footer">
          <el-button @click="allotRightFlag = false">取 消</el-button>
          <el-button type="primary" @click="allotRoleRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getRolesList,addRoles,editRoles,deleteRoles,deleteRoleRight,allotRight,getPowerList} from 'network/home'

export default { 
  name: 'roleslist',
  data() {
    return {
      tableData: [],
      // 默认被选中的权限id的数组
      checkedArr: [],
      dialogVisible_roles: false, //添加角色变量
      editRolesFlag: false, //编辑角色变量
      allotRightFlag: false, //分配权限变量
      currentRoleId: 0,  // 权限按钮被点击所在的当前行id
      // 添加角色的信息
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色的信息
      editRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则
      addRoles_rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 所有的权限数据
      // requestRightData: [],
      rightData: [],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
      checkedNode:[]
    }
  },
  created() {
  //  请求所有角色列表
    this.getRolesList1()
    // // 请求所有权限树形列表
    this.getPowerList1('tree')

  },
  methods: {
    // 请求角色列表
    async getRolesList1() {
      const res = await getRolesList();
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败');}
      this.tableData = res.data;
    },
    // 请求所有权限树形列表
    async getPowerList1(type) {
      const res = await getPowerList(type);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败');}
      // this.requestRightData = res.data;
      this.rightData = res.data;
      return new Promise((resolve,reject) => {
        resolve()
      })
    },
    // 添加角色
    async addRoles1(obj) {
      const res = await addRoles(obj);
      console.log(res);
      if(res.meta.status !== 201) {
        // 隐藏对话框
        this.dialogVisible_roles = false;
          return this.$message.error('添加角色失败');
        }
      // 隐藏对话框
      this.dialogVisible_roles = false;
      //  重新请求所有角色列表
      this.getRolesList1()
    },
    // 编辑角色
    async editRoles1(obj) {
      const res = await editRoles(obj);
      console.log(res);
      if(res.meta.status !== 200) {
          return this.$message.error('编辑角色失败');
        }
        //  重新请求所有角色列表
        this.getRolesList1()
    },
    // 删除单个角色
    async deleteRoles1(id) {
      const res = await deleteRoles(id);
      console.log(res);
      if(res.meta.status !== 200) {
          return this.$message.error('删除角色失败');
        }
        //  重新请求所有角色列表
      this.getRolesList1()
    },
    // 删除角色特定权限
    async deleteRoleRight1(row,rightId) {
      const res = await deleteRoleRight(row.id,rightId);
      console.log(res);
      // 返回的data, 是当前角色下最新的权限数据
      if(res.meta.status !== 200) {
          return this.$message.error('删除角色权限失败');
        }
        //  重新请求所有角色列表
      // this.getRolesList1()
      // 把请求过来的数据传给当前行对象里面的children，从而局部刷新页面
      row.children = res.data;
      // console.log(11);
    },
    // 删除角色的确定消息
    async deletCurrentRole(id) {
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
      this.deleteRoles1(id)
    },
    // 删除角色特定权限的确定消息
    async removeRoleRight(row,rightId) {
      const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(res != 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.deleteRoleRight1(row,rightId)
    },
    // 角色授权
    async allotRight1(roleId, rids) {
      const res = await allotRight(roleId, rids);
      console.log(res);
      if(res.meta.status !== 200) {
          return this.$message.error('角色授权失败');
        }
      //  重新请求所有角色列表
      this.getRolesList1()
    },
    // 添加角色对话框关闭时候执行重置表单
    addRolesClose() {
      this.$refs.addRoles_ref.resetFields();
    },
    // 点击确认、进行添加角色对话框表单预校验
    submitAddRoles() {
      this.$refs.addRoles_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        this.addRoles1(this.addRoles);
        console.log(JSON.parse(JSON.stringify(this.addRoles))); 
        // 隐藏对话框
        // this.dialogVisible_roles = false;
      })
    },
    // 显示 编辑角色对话框
    primaryRoleData(rowValue) {
      this.editRolesFlag = true;
      this.editRoles = rowValue
    },
    editRolesClose() {
      this.$refs.editRoles_ref.resetFields();
    },
    // 点击确认，进行编辑角色对话框表单预校验
    submitEditRoles() {
      this.$refs.editRoles_ref.validate((value,obj) => {
        if(!value) {
          return this.$message.error('校验未通过')
        }
        this.editRoles1(this.editRoles);
        // 隐藏对话框
        this.editRolesFlag = false;
      })
    },
    // 点击分配权限按钮，显示对话框
    allotRight(row) {
      console.log(row);
      // this.rightData = [],
      // 两种清空数组的方法 1、赋值空数组，2、把长度设置为0 checkedArr数组
      this.checkedArr = [];
      this.currentRoleId = row.id
      // this.checkedArr.length = 0;
      for(let item1 of row.children) {
        for(let item2 of item1.children) {
          for(let item3 of item2.children) {
            this.checkedArr.push(item3.id);
          }
        }
      }
      // 改变数据 引起权限对话框刷新,这个行不通，权限对话框没有刷新
      // this.rightData = this.requestRightData;
      // 请求所有权限树形列表
      this.getPowerList1('tree').then(() => {
        // 等权限列表请求成功，再显示对话框
        this.allotRightFlag = true
      })
      // this.$nextTick(() => {
      //   this.allotRightFlag = true
      // })
      console.log(this.checkedArr);
    },
    // 点击对话框确定按钮，进行角色授权
    allotRoleRight() {
      // 隐藏角色授权对话框
      this.allotRightFlag = false;
      this.checkedNode = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      let str = this.checkedNode.join()
      this.allotRight1(this.currentRoleId,str)
    }
    
  }
}

</script>
<style scoped>
    .box-card {
    margin-top: 15px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1);
  }
  .table {
    width: 100%;
    /* min-width: 1000px; */
    margin-top: 15px;
  }
  .level0_row {
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
  }
 
  .level0_row:first-child {
    border-top: 1px solid #ebeef5;
  }
  .level1_row {
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
    
  }
  .level1_row:last-child {
    border-bottom: 0;
  }
  .level1_row .col_2 .tag_3{
    margin: 10px;
  }
</style>
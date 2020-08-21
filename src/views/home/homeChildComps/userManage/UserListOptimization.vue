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
        <el-input placeholder="请输入搜索内容" class="input_serch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary">添加用户</el-button>
      </div>
      
      <!-- table表格区域 -->
      <el-table
        :data="tableData[getCurrent] || tableArr"
        border
        stripe
        :max-height="700"
        class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" width="180" prop="username"></el-table-column>
        <el-table-column label="邮箱" width="180" prop="email"></el-table-column>
        <el-table-column label="电话" width="180" prop="mobile"></el-table-column>
        <el-table-column label="角色" width="180" prop="role_name"></el-table-column>
        <el-table-column label="状态" width="180">
          <!-- 这里作用域插槽可以获取到当前行的所有内容 -->
          <template slot-scope="scope">
            <!-- <span>{{scope.row}}</span> -->
            <!-- scope.row是当前行数据对象 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-row>
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <!-- 组件的标签 设置事件必须加native -->
            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click.native="deleteRow(scope.$index, tableData)"></el-button>
            <!-- 分配按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
      <!-- <div class="block">
        
      </div> -->
    </el-card>
  </div>
</template>

<script>
import { getUserList,changeUserState } from 'network/home'

export default {
  name: 'userlist',
  data() {
    return {
      // 访问对象属性值的方法有两种：1、点的方式：object.name  但是这里的name必须是对象存在的属性 不能是变量或者函数参数
      // 2、[]的方式：object[name] name可以是变量或者函数参数
      tableData: {},
      tableArr: [], //空数组
      parameter: {
        query: {},
        pagenum: 1,
        pagesize: 1
      },
      total: 0
    }
  },
  computed: {
    getCurrent() {
      return this.parameter.pagenum
    },
    // el-table   data  table区域
    // hasOwnProperty(key) 可以判断对象自身是否有该属性 true 就是存在该属性key
    // Object.keys(obj)  可以判断对象obj是否为空

    // getData() {
      //   console.log('updata --');
      // 第一种方式
      // if(Object.keys(this.tableData).length == 0 || !this.tableData.hasOwnProperty(this.getCurrent)) {
      //   console.log('1 ----1 ');
      //   return []
      // }
      // return this.tableData[this.getCurrent]
      // 第二种方式
      // return Object.keys(this.tableData).length == 0 ? [] : this.tableData[this.getCurrent]
    // },

    // el-pagination  total  分页区域
    // getTotal() {
    //   if(Object.keys(this.tableData).length !== 0&&this.tableData.hasOwnProperty(this.getCurrent)) {
    //     return this.tableData[this.getCurrent].total
    //   }
    //   return 0
    // },
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
      if(res.data.users.length == 0) {
        this.parameter.pagenum++;
        return this.$message.error('用户数据已经展示完！')
      }
      this.tableData[this.getCurrent] = res.data.users
      console.log(this.tableData[this.getCurrent]);
      console.log(this.tableData);
      return new Promise((resolve,reject) => {
        resolve();
      })
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
      // 后台返回更改状态成功 但是后台数据没有改变，这是后台的问题
      // const res1 = await getUserList(this.parameter);
      // console.log(res1);
    },
    
    //删除用户列表操作
    deleteRow(index,table) {
      console.log(index);
      // table.splice(index,1)
    },
    // 监听每一页数据个数的改变 size-change
    handleSizeChange(val) {
      console.log('每页' + val + '条');
      this.tableData = {};
      this.parameter.pagesize = val
      this.getUserList1(this.parameter)
    },
    // 监听当前页的改变  current-change
    handleCurrentChange(val) {
      console.log('当前页：' + val);
      if(this.tableData.hasOwnProperty(val)) {
         this.parameter.pagenum = val;
         return
      }
      this.parameter.pagenum = val
      this.getUserList1(this.parameter).then(() => {
        console.log(val + '页请求完毕');
      })
    },
    changeState(value) {
      // let state = !value.my_state
      console.log(value);
      this.changeUserState1(value)


    }
  }
}

</script>
<style scoped>
  .box-card {
    /* height: 400px; */
    margin-top: 15px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1);

  }
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
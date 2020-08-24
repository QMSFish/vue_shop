<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- table表格区域 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="tagType[scope.row.level]">{{tagGrade[scope.row.level]}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template> 

<script>
import {getPowerList} from 'network/home'

export default {
  name: 'permissionlist',
  data() {
    return {
      tableData: [],
      displayType: 'list',
      tagType: ['','success','warning'],
      tagGrade: ['一级','二级','三级']

    }
  },
  created() {
  //  请求所有权限列表
    this.getPowerList1(this.displayType)

  },
  methods: {
    async getPowerList1(type) {
      const res = await getPowerList(type);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败');}
      this.tableData = res.data;
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
</style>
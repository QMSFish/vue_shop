<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- input和button -->
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" class="input_serch" 
        v-model="goodsRequestParams.query" 
        clearable 
        @clear="clearInput">
          <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
        </el-input>
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </div>
      <!-- table表格区域 -->
      <el-table
        :data="tableData"
        border
        stripe
        :max-height="700"
        class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" min-width="450px" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" min-width="110px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" min-width="180px">
          <template slot-scope="scope">
            <span>{{transformTimer1(scope.row.add_time)}}</span>
            <!-- 1{{transformTimer1(scope.row.add_time)}} -->
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope" >
            <el-row>
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" 
            size="mini" 
            ></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click="deleteGoodClick(scope.row.goods_id)"></el-button>
          </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="goodsRequestParams.pagenum"
          :page-sizes="[1, 2, 5, 8, 10]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!-- 编辑商品对话框 -->
      <!-- <el-dialog
        title="编辑商品"
        :visible.sync="editGoodsFlag"
        width="50%"
        >
        <el-form :model="editGoodData" :rules="editGood_rules" ref="editGood_ref"  label-width="100px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="editGoodData.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsFlag = false">取 消</el-button>
          <el-button type="primary" >确 定</el-button>
        </span>
      </el-dialog> -->




    </el-card> 
    
  </div>
</template>
 
<script>
import {getGoodsList,addGoods,deleteGood} from 'network/home'

import {transformTimer} from 'common/utils'

export default {
  name: 'goodslist',
  data() {
    return {
      // table表格数据
      tableData: [],
      // 总共商品的数量
      total: 0,
      // 商品列表数据请求参数
      goodsRequestParams: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      


    }
  },
  created() {
    // 请求商品列表数据
    this.getGoodsList1(this.goodsRequestParams)

  },
  methods: {
    // 商品列表数据请求
    async getGoodsList1(obj) {
      const res = await getGoodsList(obj);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('商品列表数据请求失败！')
      }
      this.total = res.data.total;
      this.tableData = res.data.goods;
    },
    // 删除商品请求
    async deleteGood1(id) {
      const res = await deleteGood(id);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！');
      this.getGoodsList1(this.goodsRequestParams)

    },
    // 监听每一页数据个数的改变 size-change
    handleSizeChange(val) {
      console.log('每页' + val + '条');
      this.goodsRequestParams.pagesize = val;
      // this.goodsRequestParams.query = '';
      this.getGoodsList1(this.goodsRequestParams)
    },
    // 监听当前页的改变  current-change
    handleCurrentChange(val) {
      console.log('当前页：' + val);
      this.goodsRequestParams.pagenum = val;
      // this.goodsRequestParams.query = '';
      this.getGoodsList1(this.goodsRequestParams)
    },
    // 时间戳转换
    transformTimer1(time) {
      return transformTimer(time)
      // console.log(transformTimer(time));
      // console.log(11);
    },
    // 点击input后面搜索按钮，进行查询
    queryGoods() {
      if(this.goodsRequestParams.query !== '') {
        this.getGoodsList1(this.goodsRequestParams)
      }
    },
    // 在点击由 clearable 属性生成的清空按钮时请求所有商品列表
    clearInput() {
      this.getGoodsList1(this.goodsRequestParams)
    },
    // 点击添加商品按钮
    addGoods() {
      this.$router.push('/add');

    },
    // 点击删除商品
    async deleteGoodClick(id) {
      const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      
      this.deleteGood1(id);
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
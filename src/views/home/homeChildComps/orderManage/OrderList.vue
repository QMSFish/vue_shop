<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- input输入框 -->
      <el-input placeholder="请输入内容" 
      style="width: 300px" 
      clearable
      v-model="input_value" 
      @clear="clearInputValue">
        <el-button slot="append" icon="el-icon-search" @click="queryList"></el-button>
      </el-input>
    
      <!-- table表格 -->
      <el-table
        :data="tableData"
        border
        stripe
        :max-height="700"
        class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" min-width="300px" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款" >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay == 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" min-width="150px">
          <template slot-scope="scope">
            <span>{{transformTimer1(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
           <template>
             <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDialog"></el-button>
             <el-button type="success" size="mini" icon="el-icon-location-outline"
             @click="LogisticsInfo_Click"></el-button>
           </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="requestData.pagenum"
      :page-sizes="[1, 2, 5, 8, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
      <!-- 编辑对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="changeAddressFlag"
        width="50%"
        @close="changeDialogClosed">
        <el-form :model="changeAddress" :rules="changeAddress_rule" ref="changeAddress_ref" label-width="100px">
          <el-form-item label="省市区/县" prop="city">
            <el-input v-model="changeAddress.city"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="changeAddress.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeAddressFlag = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看物流对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="logisticsProcessFlag"
        width="50%"
        >
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.ftime">
            {{activity.context}}
          </el-timeline-item>
       </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getOrderList,getLogisticsInfo} from 'network/home'

import {transformTimer} from 'common/utils'

export default {
  name: 'orderlist',
  data() {
    return {
      tableData: [],
      total: 0,
      input_value: '',
      requestData: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      changeAddressFlag: false,
      changeAddress: {
        city: '',
        address: ''
      },
      // 编辑对话框的表单验证规则
      changeAddress_rule: {
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ]
      },
      // 物流对话框的显示隐藏变量
      logisticsProcessFlag:false,
      activities: []
      
    }
  },
  created() {
    // 请求订单数据列表
    this.getOrderList(this.requestData);

  },
  methods: {
    // 订单数据列表请求
    async getOrderList(obj) {
      const res = await getOrderList(obj);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('订单数据里列表请求失败')
      }
      this.total = res.data.total;
      this.tableData = res.data.goods;
    },
    // 物流信息请求
    async getLogisticsInfo1(id) {
      const res = await getLogisticsInfo(id);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('查看物流信息失败')
      }
      this.activities = res.data;
    },
    // 下单时间转换
    transformTimer1(timer) {
      return transformTimer(timer)
    },
    // 每页的数据数量发生改变
    handleSizeChange(val) {
      console.log(val);
      this.requestData.pagesize = val;
      // this.requestData.query = '';
      this.getOrderList(this.requestData);

    },
    // 当前页码发生改变
    handleCurrentChange(val) {
      console.log(val);
      this.requestData.pagenum = val;
      // this.requestData.query = '';
      this.getOrderList(this.requestData);
    },
    // 点击input输入框里面的搜索按钮
    queryList() {
      this.requestData.query = this.input_value;
      // if(this.requestData.query !== '') {
      //   this.getOrderList(this.requestData);
      // } 
      this.getOrderList(this.requestData);
    },
    // 在点击input 中由 clearable 属性生成的清空按钮时触发
    clearInputValue() {
      if(this.requestData.query !== '') {
        this.requestData.query = '';
        this.getOrderList(this.requestData);
      }
    },
    // 点击操作里面修改按钮 显示编辑对话框
    showDialog() {
      this.changeAddressFlag = true

    },
    // 编辑对话框关闭
    changeDialogClosed() {
      this.$refs.changeAddress_ref.resetFields()
    },
    // 点击操作里面的查看物流信息按钮
    LogisticsInfo_Click() {
      // 供测试的物流单号：1106975712662
      this.getLogisticsInfo1(1106975712662);
      this.logisticsProcessFlag = true

    }
    

  }
}

</script>
<style scoped>
  .table {
    margin: 15px 0;
  }
</style>
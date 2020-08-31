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
      <!--1、 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div ref="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import {getReportsData} from 'network/home'

import echarts from 'echarts'

import _ from 'lodash'

export default {
  name: 'datareport',
  data() {
    return {
      // 3、指定图表的配置项和数据
      // option: {
      //       title: {
      //           text: 'ECharts 入门示例'
      //       },
      //       tooltip: {},
      //       legend: {
      //           data:['销量']
      //       },
      //       xAxis: {
      //           data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      //       },
      //       yAxis: {},
      //       series: [{
      //           name: '销量',
      //           type: 'bar',
      //           data: [5, 20, 36, 10, 10, 20]
      //       }]
      //   }
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
      
    }
  },
  mounted() {
    // 2、基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(this.$refs.main);
    // 请求统计数据
    this.getReportsData1(myChart);
    
    // myChart.setOption(this.option);
  },
  methods: {
    // 统计数据的请求
    async getReportsData1(myChart) {
      const res = await getReportsData();
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('获取统计数据失败')
      }
      // 合并两个对象
      const option = _.merge(this.options,res.data);
      // 4、使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
}

</script>
<style scoped>
</style>
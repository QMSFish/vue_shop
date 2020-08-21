<template>
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header class="home_head">
        <div class="head_left">
          <img src="~assets/img/icon1.jpg" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="exit">退出</el-button>
      </el-header>
      
      <el-container class="home_child_container ">
        <!-- 侧边栏区域 -->
        <el-aside :width="fontSize + 'px'" class="home_aside">
          <!-- 切换菜单栏部分 -->
          <div class="aside_top" @click="toggleCollapse">|||</div>
          <!-- 菜单栏部分 -->
          <!-- el-aside组件最终渲染成aside标签 所以vue组件的标签名不能和element组件渲染后的标签一样 -->
          <home-aside :meunList="meunList" :iconList="iconList" :flag="flag"></home-aside>
        </el-aside>
 
        <!-- 主体区域 -->
        <el-main class="home_main">
          <!-- 子组件跳转占位标签 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import HomeAside from './homeChildComps/HomeAside'

import { getMeunList } from 'network/home'



export default {
  name: 'home',
  data() {
    return {
      meunList: [],
      iconList: ['iconfont icon-users','iconfont icon-tijikongjian','iconfont icon-shangpin',
      'iconfont icon-danju','iconfont icon-baobiao'],
      flag: false,
      fontSize: 200

    }
  },
  components: {
    HomeAside
  },
  created() {
    // 请求菜单列表数据
    this.getMeunList1()
  },
  methods: {
    exit() {
      // 清空token
      sessionStorage.clear();
      // 跳转到登录页面
      this.$router.push('/login')
    },
    async getMeunList1() {
      const res = await getMeunList();
      console.log(res);
      if(res.meta.status !== 200) {return this.$message.error('获取菜单数据失败');}
      this.meunList = res.data;
      // console.log(this.meunList);
    },
    toggleCollapse() {
      this.flag = !this.flag;
      // console.log(this.flag);
      this.fontSize = this.flag? 64 : 200;
    }
  }
}

</script>
<style lang="less" scoped>
  .home_container {
    /* 让容器撑满整个页面 */
    height: 100%;
  }
  .home_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #363d40;
    padding-left: 0;
  }
  .head_left {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #e8eeed;
    img {
      width: 50px;
      border-radius: 25px;
      margin-right: 10px;
    }
  }
  .home_aside {
    background-color: #313743;
  }
  .aside_top {
    background-color: #475163;
    color: #e9edf0;
    padding: 5px 0;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .home_main {
    background-color: #e9edf0;
  }
</style>
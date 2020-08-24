<template>
  <el-menu 
  :default-active="activeIndex"
  @open="handleOpen"
  @close="handleClose" 
  class="el-menu-vertical-demo"
  background-color="#313743"
  text-color="#fff"
  active-text-color="#359bff"
  :unique-opened="true"
  :collapse="flag"
  :collapse-transition="false"
  router>
    <home-sub-menu v-for="(item,index) in meunList" :key="item.id" :submenuData="meunList[index]">
      <i :class="getIcon(index)" class="padd"></i>
    </home-sub-menu>
  </el-menu>
</template>
 
<script>
import HomeSubMenu from './HomeSubMenu'
export default {
  name: 'homeaside',
  data() {
    return {
      activeIndex: ''
    }
  },
  created() {
    console.log(sessionStorage.getItem('activeIndex')); //没有activeIndex属性的时候为null
    // 把处在活跃的导航的index存到sessionStorage的activeIndex属性中，到页面再次刷新，从sessionStorage中取出activeIndex属性值赋值给default-active
    const activeIndex = sessionStorage.getItem('activeIndex')
    this.activeIndex =  activeIndex === null? 'undefined' : activeIndex
  },
  components: {
    HomeSubMenu
  },
  props: {
    meunList: Array,
    iconList: Array,
    flag: Boolean
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getIcon(index) {
      if(this.iconList&&this.iconList.length !== 0) {
        return this.iconList[index]
      }
      return 'el-icon-location'
    }
    }
}

</script>
<style scoped>
  .padd {
    padding-right: 10px;
    /* margin-right: 5px; */
  }
  .el-menu {
    border-right: 0;
  }
</style>
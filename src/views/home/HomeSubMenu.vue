<template>
<!-- 一级菜单 -->
  <el-submenu :index="submenuData.id + ''" class="el_submenu">
    <template slot="title">
      <slot></slot>
      <span>{{submenuData.authName}}</span>
    </template>
    <!-- 二级菜单 -->
    <el-menu-item :index="'/' + item.path" v-for="item in submenuData.children" 
    :key="item.id"
    @click="setIndex('/' + item.path)">
      <i class="el-icon-menu"></i>
      <span slot="title">{{item.authName}}</span>
    </el-menu-item>  
  </el-submenu>
</template>

<script> 
export default { 
  name: 'submenu',
  props: {
    submenuData: Object
  },
  methods: {
    setIndex(index) {
      sessionStorage.setItem('activeIndex',index)
    }
  }
 
}

</script>
<style scoped>
</style>
<template>
  <div>
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    exit() {
      // 清空token
      sessionStorage.clear();
      // 跳转到登录页面
      this.$router.push('/login')
    }
  }
}

</script>
<style scoped>
</style>
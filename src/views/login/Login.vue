<template>
  <div class='login_container'>
    <div class="login_box">
      <!-- 图标部分 -->
      <div class="icon_box"></div>
      <!-- 登录表单部分 -->
      <el-form label-width="0" ref="loginForm" :rules="loginRules" :model="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-row class="login_row">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-row>
      </el-form>

    </div>
    
  </div>
</template>

<script>
import {loginRequest} from 'network/login'

export default {
  name: "login",
  data() {
    return {
      //这是表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //这是表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginForm.resetFields();
    },
    login() {
      //第一种处理数据方式： 利用 async await
      this.$refs.loginForm.validate(async (valid,object) => {
        // console.log(valid);
        // console.log(object);
        if(!valid) { return }
        const res = await loginRequest(this.loginForm)
        console.log(res);
        if(res.meta.status == 200) {
            // console.log('登录成功');
            // element-ui中message的消息提示
            this.$message.success('登录成功');
            // 除了登录外的请求都必须要携带token，所以其他请求都必须要登录成功后才能发起
            // 登录成功后，后台会返回token值，把返回的token值保存在sessionStorage中
            sessionStorage.setItem('token',res.data.token);
            //登录成功后，跳转到首页 /home
            this.$router.push('/home');

          } else {
            // console.log('登录失败');
            this.$message.error('登录失败，请重新登录')
          } 
      })

        //第二种处理数据方式：利用promise  then
      // this.$refs.loginForm.validate((valid,object) => {
      //   console.log(valid);
      //   console.log(object);
      //   if(!valid) { return }
      //   loginRequest(this.loginForm).then(res => {
      //     console.log(res);
      //     if(res.meta.status == 200) {
      //       console.log('登录成功');
      //     } else {
      //       console.log('登录失败');
      //     } 
      //   },err => {
      //     console.log(err);
      //   })
      // })
    }
  }
}

</script>
<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
  }
  .icon_box {
    width: 130px;
    height: 130px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -60px;
    background: url(~assets/img/logo.png) no-repeat;
    background-size: 130px;
    border: 4px solid #ffffff;
    border-radius: 75px;
    // box-shadow: 0 0 1px 1px;
    background-color: #eceeeb;
    // z-index: 1;
  }
  .login_form {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 20px;
    box-sizing: border-box;

  }
  .login_row {
    display: flex;
    justify-content: flex-end;
  }
</style>
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form :model="loginFrom" :rules='loginRules' ref="loginFormRef" label-width="0px" class="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginFrom: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    submitLoginForm () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginFrom)
        console.log(res, 'res==')
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        sessionStorage.token = res.data.token
        console.log(sessionStorage)
        this.$router.push('/home')
      })
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: #2b4b6b;
  height: 100%;
  position: relative;
  .login-box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #eee;
      overflow: hidden;
      position: absolute;
      padding: 10px;
      left: 50%;
      box-shadow: 0 0 10px #ddd;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        background: #eee;
        border-radius: 50%;
      }
    }
  }
  .loginForm {
    position: absolute;
    bottom: -10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="login-container">
    <el-card header="登录教务系统" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const { data } = await this.$http.post('login', this.user)
      sessionStorage.setItem('username', data.username)
      sessionStorage.setItem('name', data.name)
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
  .login-card {
    width: 30rem;
    margin: 10rem auto;
  }
</style>
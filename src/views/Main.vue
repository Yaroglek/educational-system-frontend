<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="$route.path" router>
        <el-menu-item :index="`/users/edit/${username}`" v-if="type !== '3'">个人信息</el-menu-item>
        <el-menu-item index="/users/create" v-if="type === '3'">新建用户</el-menu-item>
        <el-menu-item index="/users/list" v-if="type === '3'">用户列表</el-menu-item>
        <el-menu-item index="/courses/create" v-if="type === '2'">新建课程</el-menu-item>
        <el-menu-item index="/courses/list">课程列表</el-menu-item>
        <el-menu-item index="/course_records/list" v-if="type === '1'">选课列表</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <h3><span style="margin-right: 24px">欢迎，{{name}}</span><el-button type="warning" size="small" @click="logout">退出登录</el-button></h3>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    Object.getPrototypeOf(this).type = sessionStorage.getItem('username')[0]
    Object.getPrototypeOf(this).username = sessionStorage.getItem('username')
    Object.getPrototypeOf(this).name = sessionStorage.getItem('name')
  },
  methods: {
    logout() {
      sessionStorage.clear()
      this.$message({
        type: 'warning',
        message: '已退出登录'
      })
      this.$router.push('/login')
    }
  }
}
</script>
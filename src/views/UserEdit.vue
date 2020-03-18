<template>
  <div>
    <h1>{{username ? `${username} ${model.name}` : '新建用户'}}</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户类别" v-if="!username">
        <el-radio v-model="type" :label="'1'">学生</el-radio>
        <el-radio v-model="type" :label="'2'">教师</el-radio>
        <el-radio v-model="type" :label="'3'">管理员</el-radio>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="model.name" :disabled="myType !== '3'"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="model.sex" :label="false" :disabled="myType !== '3'">男</el-radio>
        <el-radio v-model="model.sex" :label="true" :disabled="myType !== '3'">女</el-radio>
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="model.major" :disabled="myType !== '3'"></el-input>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="model.birth" type="date" placeholder="选择日期" :disabled="myType !== '3'"></el-date-picker>
      </el-form-item>
      <template v-if="username === myUsername && myType !== '3'">
        <el-form-item label="修改密码" >
          <el-input v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="password2"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
      <el-form-item v-if="username && username[0] !== '3' && myType === '3'">
        <el-button type="warning" @click="deleteUser">退学</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: this.$route.params.username,
      myUsername: sessionStorage.getItem('username'),
      myType: sessionStorage.getItem('username')[0],
      type: '1',
      model: {
        name: '',
        sex: false,
        birth: '',
        major: '',
        active: true
      },
      password: '',
      password2: ''
    }
  },
  methods: {
    async save() {
      if (this.username) {
        if (this.username === this.myUsername && this.myType !== "3") {
          if (this.password && this.password === this.password2) {
            await this.$http.put(`users/${this.username}`, { user: { password: this.password } })
          } else {
            this.$message({
              type: 'warning',
              message: this.password ? '两次密码输入不一致' : '密码不能为空'
            })
            return
          }
        } else {
          await this.$http.put(`users/${this.username}`, { user: this.model })
        }
      } else {
        const temp = {};
        Object.keys(this.model).forEach(key => temp[key] = this.model[key])
        temp.password = temp.birth && (temp.birth.getFullYear() * 10000 + (temp.birth.getMonth() + 1) * 100 + temp.birth.getDate()).toString() || '123456';
        await this.$http.post('users', {
          user: temp,
          type: this.type
        });
      }
      this.$router.push('/')
    },
    async deleteUser() {
      await this.$confirm(`为用户${this.username} ${this.model.name}安排退学？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.$http.delete(`users/${this.username}`)
      this.$router.push('/')
    },
    async fetch() {
      const { data } = await this.$http.get(`users/${this.username}`)
      this.model = data.user
    }
  },
  created() {
    this.username && this.fetch()
  }
}
</script>
<style scoped>

</style>
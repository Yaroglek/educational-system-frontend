<template>
  <div>
    <h1>用户列表</h1>
    <el-table :data="list">
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.username[0] === '1' && '学生'
            || scope.row.username[0] === '2' && '教师'
            || scope.row.username[0] === '3' && '管理员'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="major" label="专业"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push(`/users/edit/${scope.row.username}`)" v-if="scope.row.username[0] !== '3'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    async fetch () {
      const { data } = await this.$http.get('users')
      this.list = data.users
    },
  },
  created () {
    this.fetch()
  }
}
</script>

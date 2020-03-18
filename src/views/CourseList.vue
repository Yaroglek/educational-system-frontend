<template>
  <div>
    <h1>课程列表</h1>
    <el-table :data="list">
      <el-table-column prop="id" label="课程号" width="120"></el-table-column>
      <el-table-column label="教师">
        <template slot-scope="scope">
          <span>{{scope.row.teacher.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程名"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status === -1 && '审核失败' || scope.row.status === 0 && '待审核' || scope.row.status === 1 && '审核通过'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push(`/courses/edit/${scope.row.id}`)" v-if="scope.row.teacher.username === username || username[0] === '3'">编辑</el-button>
          <el-button type="text" size="small" @click="$router.push(`/courses/edit/${scope.row.id}`)" v-if="username[0] === '1'">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: sessionStorage.getItem('username'),
      list: []
    }
  },
  methods: {
    async fetch () {
      const { data } = await this.$http.get('courses')
      this.list = data.courses
    },
  },
  created () {
    this.fetch()
  }
}
</script>

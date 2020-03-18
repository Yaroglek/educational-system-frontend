<template>
  <div>
    <h1>选课列表</h1>
    <el-table :data="list">
      <el-table-column label="课程号" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.course.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名">
        <template slot-scope="scope">
          <span>{{scope.row.course.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="选课状态">
        <template slot-scope="scope">
          <span>{{scope.row.status === -1 && '失败' || scope.row.status === 0 && '待审核' || scope.row.status === 1 && '成功'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩组成">
        <template slot-scope="scope">
          <p v-for="(value, index) in scope.row.course.scoreParts" :key="index">{{value.part}}({{value.weight}}%): {{scope.row.score[index]}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="finalScore" label="总成绩"></el-table-column>
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
      const { data } = await this.$http.get(`course_records/${this.username}`)
      this.list = data.courseRecords
      console.log(this.list)
    },
  },
  created () {
    this.fetch()
  }
}
</script>

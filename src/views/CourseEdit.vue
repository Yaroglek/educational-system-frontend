<template>
  <div>
    <h1>{{id ? `课程编号 ${id} ${model.name}` : '新建课程'}}</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="开课教师">
        <el-input :placeholder="model.teacher.username + ' ' + model.teacher.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="model.name" :disabled="myType !== '2'"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="model.description" type="textarea" :disabled="myType !== '2'"></el-input>
      </el-form-item>
      <el-form-item label="上课时间">
        <el-select v-model="model.time1" placeholder="星期" :disabled="myType !== '3'">
          <el-option
            v-for="(value, index) in ['星期一', '星期二', '星期三', '星期四', '星期五']"
            :key="index"
            :label="value"
            :value="index + 1">
          </el-option>
        </el-select>
        <el-select v-model="model.time2" placeholder="课节" :disabled="myType !== '3'">
          <el-option
            v-for="(value, index) in ['第一节', '第二节', '第三节', '第四节', '第五节']"
            :key="index"
            :label="value"
            :value="index + 1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上课地点">
        <el-input v-model="model.place" :disabled="myType !== '3'"></el-input>
      </el-form-item>
      <el-form-item label="成绩组成">
        <div
        v-for="(value, index) in model.scoreParts" :key="index"
        style="margin-bottom: 20px">
          <el-input v-model="value.part"
          :disabled="myType !== '2' || model.status !== 0"
          label="成绩描述"
          style="width: 240px; margin-right: 20px"></el-input>
          <el-input-number v-model="value.weight"
          :min="1" :max="100" label="成绩占比"
          :disabled="myType !== '2' || model.status !== 0"></el-input-number>
        </div>
        <el-button type="text" size="small"
        @click="model.scoreParts.push({part: '', weight: 50})"
        v-if="myType === '2' && model.status === 0">新增</el-button>
        <el-button type="text" size="small"
        @click="model.scoreParts.pop()"
        v-if="myType === '2' && model.status === 0 && model.scoreParts.length > 1">删除</el-button>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-radio v-model="model.status" :label="-1" :disabled="myType !== '3'">审核不通过</el-radio>
        <el-radio v-model="model.status" :label="0" :disabled="myType !== '3'">待审核</el-radio>
        <el-radio v-model="model.status" :label="1" :disabled="myType !== '3'">审核成功</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" v-if="myType !== '1'">保存</el-button>
        <el-button type="primary" @click="pick" v-if="myType === '1' && model.status === 1">选课</el-button>
      </el-form-item>
    </el-form>
    <template v-if="model.status === 1 && myType !== '1'">
      <h1>学生列表</h1>
      <el-table :data="courseRecords">
        <el-table-column label="用户名" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.student.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.student.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.status" :label="-1" :disabled="myType !== '3'" style="display: block">失败</el-radio>
            <el-radio v-model="scope.row.status" :label="0" :disabled="myType !== '3'" style="display: block; margin: 5px 0">待审核</el-radio>
            <el-radio v-model="scope.row.status" :label="1" :disabled="myType !== '3'" style="display: block">成功</el-radio>
          </template>
        </el-table-column>
        <el-table-column v-for="(value, index) in model.scoreParts" :key="index" :label="value.part">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.score[index]" :min="1" :max="100" style="width: 100px" size="small" label="成绩占比" :disabled="myType === '3' || scope.row.status !== 1">></el-input-number>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editCourseRecord(scope.row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      myUsername: sessionStorage.getItem('username'),
      myName: sessionStorage.getItem('name'),
      myType: sessionStorage.getItem('username')[0],
      type: '1',
      model: {
        teacher: '',
        name: '',
        description: '',
        time1: null,
        time2: null,
        status: 0,
        scoreParts: [{
          part: '期末考试',
          weight: 100
        }]
      },
      courseRecords: []
    }
  },
  methods: {
    async save() {
      const course = JSON.parse(JSON.stringify(this.model))
      course.time = (course.time1 || 0) + '' + (course.time2 || 0)
      delete course.time1
      delete course.time2
      if (course.scoreParts.reduce((last, curr) => last + curr.weight, 0) !== 100) {
        this.$message({
          type: 'warning',
          message: '成绩组成之和必须为100'
        })
        return
      }
      if (this.id) {
        await this.$http.put(`courses/${this.id}`, { course })
      } else {
        await this.$http.post(`courses`, { course })
      }
      this.$router.push('/')
    },
    async fetch() {
      const { data } = await this.$http.get(`courses/${this.id}`)
      this.courseRecords = JSON.parse(JSON.stringify(data.course.courseRecords || []))
      delete data.course.courseRecords
      const time = data.course.time
      delete data.course.time
      this.model = data.course
      this.$set(this.model, 'time1', Number(time[0]) || null)
      this.$set(this.model, 'time2', Number(time[1]) || null)
    },
    async pick() {
      await this.$http.post('course_records', {
        course: this.id,
        student: this.myUsername
      })
    },
    async editCourseRecord(courseRecord) {
      const copy = JSON.parse(JSON.stringify(courseRecord))
      const id = copy.id
      delete copy.id
      delete copy.student
      delete copy.course
      if (this.myType === '3') {
        delete copy.score
      } else {
        delete copy.status
      }
      await this.$http.put(`course_records/${id}`, {
        courseRecord: copy
      })
    }
  },
  created() {
    if (this.id) {
      this.fetch()
    } else {
      this.model.teacher = {
        username: this.myUsername,
        name: this.myName
      }
    }
  }
}
</script>
<style scoped>

</style>
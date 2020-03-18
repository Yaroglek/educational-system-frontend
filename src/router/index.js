import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import UserEdit from '../views/UserEdit.vue'
import UserList from '../views/UserList.vue'
import CourseEdit from '../views/CourseEdit.vue'
import CourseList from '../views/CourseList.vue'
import CourseRecordList from '../views/CourseRecordList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '/users/list',
        component: UserList
      },
      {
        path: '/users/create',
        component: UserEdit
      },
      {
        path: '/users/edit/:username',
        component: UserEdit
      },
      {
        path: '/courses/list',
        component: CourseList
      },
      {
        path: '/courses/create',
        component: CourseEdit
      },
      {
        path: '/courses/edit/:id',
        component: CourseEdit
      },
      {
        path: '/course_records/list',
        component: CourseRecordList
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      isPublic: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  to.meta.isPublic || sessionStorage.getItem('token')
    ? next()
    : next('/login')
})

export default router

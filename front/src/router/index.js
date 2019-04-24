import Vue from 'vue'
import Router from 'vue-router'
import Course from '@/components/course'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/course',
      name: 'Course',
      component: Course
    }
  ]
})

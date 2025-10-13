import { createRouter, createWebHistory } from 'vue-router'
import CaseForm from '../views/CaseForm.vue'
import CaseList from '../views/CaseList.vue'

const routes = [
  {
    path: '/',
    redirect: '/form'
  },
  {
    path: '/form',
    name: 'CaseForm',
    component: CaseForm
  },
  {
    path: '/list',
    name: 'CaseList',
    component: CaseList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
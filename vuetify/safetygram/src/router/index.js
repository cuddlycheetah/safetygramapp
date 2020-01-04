import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'

import Dashboard from '../components/Dashboard.vue'
//import ApolloExample from '../components/ApolloExample'

import ChatOverview from '../components/ChatOverview.vue'
import ChatView from '../components/ChatView.vue'

import DeletedMessageOverview from '../components/DeletedMessageOverview.vue'

import SetupTelegram from '../components/SetupTelegram.vue'
import Settings from '../components/Settings.vue'

import RawQueryInterface from '../components/RawQueryInterface.vue'
import NotYetImplementedSite from '../components/NotYetImplementedSite.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Main,
    children: [
      {
        name: 'Dashboard',
        path: '',
        component: Dashboard
      },
      {
        name: 'Raw Query Interface',
        path: 'rqi',
        component: RawQueryInterface
      },
      {
        name: 'Chats',
        path: 'chats',
        component: ChatOverview,
      },
      {
        name: 'Chats',
        path: 'chats/:id',
        component: ChatView,
        props: true
      },
      {
        path: 'archive',
        component: NotYetImplementedSite
      },
      {
        path: 'deletedmsgs',
        component: DeletedMessageOverview
      },
      {
        path: 'settings',
        component: Settings
      },
      {
        path: 'downloads',
        component: NotYetImplementedSite
      },
      {
        path: 'files',
        component: NotYetImplementedSite
      },
      {
        path: 'help',
        component: NotYetImplementedSite
      },
      {
        path: 'setup',
        component: SetupTelegram
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    /*if (!store.getters.isLoggedIn) {
      next({ name: 'Login' })
    } else {
      next() // go to wherever I'm going
    }*/
    next()
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router

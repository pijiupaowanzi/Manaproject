import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login =()=>import('./../views/Login.vue')
const Welcome =()=>import('./../views/Welcome.vue')
const Users=()=>import('./../views/users/users.vue')
const Userslist=()=>import('./../views/users/userslist.vue')
const Orders=()=>import('./../views/orderlist/Orderlist.vue')
const Statistics=()=>import('./../views/statistics/statistics.vue')
const Productlist=()=>import('./../views/product/Productlist.vue')
const Addgoods=()=>import('./../views/product/Addgoods.vue')
const Power=()=>import('./../views/power/Power.vue')
const Actlist=()=>import('./../views/power/Actlist.vue')
const Categories=()=>import('./../views/product/Categories.vue')
const Params=()=>import('./../views/product/Params.vue')
const routes = [
  {
    path:"/",
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login,
    meta:{
      title:"登录页面"
    }
  },
  {
    path:'/welcome',
    component:Welcome,
    meta:{
      title:"操作页面"
    },
    children:[
      {
        path:'users',
        component:Userslist,
        children:[
          {
            path:'',
            redirect:'users'
          },
          {
            path:'users',
            component:Users,
          }
        ]
      },
      {
        path:'orders',
        component:Orders,
      },
      {
        path:"reports",
        component:Statistics,
      },
      {
        path:'goods',
        component:Productlist,
      },
      {
        path:"addgoods",
        component:Addgoods,
      },
      {
        path:"rights",
        component:Power
      },
      {
        path:"roles",
        component:Actlist
      },
      {
        path:"categories",
        component:Categories
      },
      {
        path:"params",
        component:Params
      }
    ]
  },
]

const router = new VueRouter({
  routes,
  mode:"history"
})

router.beforeEach((to,from,next)=>{
  document.title=to.matched[0].meta.title
  next()
})

export default router

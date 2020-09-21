<template>
  <div class="father">
    <el-container>
      <el-header>
        <h1>后台管理系统</h1>
        <el-button @click="relogin">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="uniqueopened"
          >
            <el-submenu :index="item.id+''" v-for="(item,index) in obj.data" :key="item.id">
              <template slot="title">
                <i :class="icon[index]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="itm.id+''" v-for="itm in item.children" :key="itm.id" @click="route(itm.path)">
                 <i class="el-icon-menu"></i>
                  {{itm.authName}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <h5 class="h5">欢迎来到后台管理系统！</h5>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data(){
    return{
      obj:{},
      icon:[
        "el-icon-user-solid",
        'el-icon-s-tools',
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-marketing",
      ],
      uniqueopened:true
    }
  },
  methods: {
    relogin() {
      this.$router.replace("/login");
    },
    route(path){
      this.$router.push('/welcome/'+path)
    }
  },
  mounted(){
    this.$axios({
      url:"/menus",
      method:'get',
    }).then(res=>{
      this.obj=res;
      console.log(res)
    }).catch(err=>console.log(err))
  }
};
</script>



<style lang="less" scoped>
.img{
  width: 100%;
}
.h5{
  color: #999;
  span{
    color: black;
    font-weight: bold;
  }
  margin-bottom: 20px;
}
.father {
  height: 100%;
  width: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  background-color: #343a3f;
}
.el-aside{
  background-color: #545C64;
}
.el-main{
  background-color: #EAEDF1;
}
</style>
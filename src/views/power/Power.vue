<template>
    <div>
<el-card >
    <el-table :data = 'rightslist'>
    <el-table-column
      type= "index"
      label="#"
      width="50px"
      border >
    </el-table-column>
      <el-table-column
      prop="authName"
      label="权限名称"
      width="400px">
    </el-table-column>
      <el-table-column
      prop="path"
      label="路径"
      width="400px">
    </el-table-column>
      <el-table-column
      prop="level"
      label="权限等级"
      width="400"
      >
      <template  slot-scope = "scoped">
          <el-tag  v-if="scoped.row.level === '0' ">
          一级
      </el-tag  >
       <el-tag type ="danger" v-else-if="scoped.row.level ==='1' "  >
          二级
      </el-tag>
       <el-tag type= "warning" v-else >
            三级
      </el-tag> 
       </template>
    </el-table-column>
    </el-table>
</el-card>
    </div>
</template>
<script>
export default {
    props: {
    },
    data() {
        return {
            //接收数据
            rightslist:[],
        };
    },
    methods: {
         getuserlist(){
          this.$axios.get('rights/list').then(res=>{
            this.rightslist = res.data
          })
        }
    },
    components: {
    },
    mounted(){
        this.getuserlist();
    }
};
</script>
<style scoped >
.el-card{
    margin-top:20px ;
}
</style>

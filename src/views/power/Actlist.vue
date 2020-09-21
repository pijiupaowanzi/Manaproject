<template>
  <div class="all">
    <el-card>
      <el-button type="primary" @click="fna">添加角色</el-button>
      <el-form label-width="100px" ref="ruser" v-show="!msg" :rules="rules" :model="ruser" class="topic">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="ruser.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="direct">
          <el-input v-model="ruser.direct"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruser')">提交</el-button>
          <el-button @click="resetForm('ruser')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="roleslist" border v-show="msg">
        <el-table-column type="expand" width="80px">
        <template slot-scope="scope">
          <el-row v-for="(item1,i1) in scope.row.children" :key="i1">
            <el-col :span="6" class="col-a" >
                  <el-tag class="tag-all"   closable >{{item1.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span ="18" >
              <el-row :span='6' v-for="(item2,i2) in item1.children" :key="i2">
                  <el-col  class="col-a" :span = "6" ><el-tag class="tag-all" type="success" closable > 
                     {{item2.authName}}
                  </el-tag>
                   <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                    <el-row  v-for="(item3,i3) in item2.children" :key="i3">
                <el-col  class="col-a">
                  <el-tag type="warning" class="tag-all"  closable @close="open(scope.row,item3.id)">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300px"></el-table-column>
        <el-table-column label="操作" width="380px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="replace(scope.$index, scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑数据 -->
      <el-dialog title="编辑数据" :visible.sync="editFormVisible">
          <el-form  :model="editForm" ref="editForm" class="we-a" :rules="ruleser">
            <el-form-item label="名称" label-width="80px" prop="name">
              <el-input autocomplete="off" v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="80px" prop="direct">
              <el-input  autocomplete="off" v-model="editForm.direct"></el-input>
            </el-form-item>
          </el-form>
     
        <div slot="footer" class="dialog-footer" >
          <el-button @click="fien">取消</el-button>
          <el-button @click="edittext('editForm')">修改</el-button>
        </div>
      </el-dialog>
    </el-card>
  <!-- 分配权限 -->
  <el-dialog
  title="分配权限"
  :visible.sync="quanxian"
 
  width="30%"
  >
<el-tree :data="qxlist" :props="quanxianProps" 
  show-checkbox
  node-key="id"
  default-expand-all
   :default-checked-keys="qxarr"
  ref="tree"

></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="quanxian = false">取 消</el-button>
    <el-button type="primary" @click="qxfna">确 定</el-button>
  </span>
</el-dialog>

   
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      roleslist: [],
      ruser: {
        name: "",
        direct: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        direct: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
      },
      msg: true,
      editFormVisible: false,
      editForm: {
        name: "",
        direct: "",
      },
        
        ruleser: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        direct: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
      },
    pid:'',
    quanxian:false,
    qxlist:[],
    //分配权限
    quanxianProps:{
       children: 'children',
          label: 'authName'
    },
    qxarr:[105,107],
    //分配权限的ID
    qxid :"",
    };
  },
  methods: {
    fna() {
      this.msg = !this.msg;
    },
    getsetdata() {
      this.$axios
        .get("/roles")
        .then((res) => {
          console.log(res);
          this.roleslist = res.data;
        })
    },
    // 修改
    handleEdit(index,row) {
      console.log(row.id);
         this.pid=row.id
     this.editFormVisible = true; //dialog对话窗口打开
    },
     //修改操作
      edittext(v){
         this.$refs[v].validate((valid) => {
          if (valid) {
            console.log(this.editForm.name);
            this.$axios({
              method:'put',
              url:`/roles/${this.pid}`,
              data:{
                roleName :this.editForm.name,
                roleDesc:this.editForm.direct
              }
            })
           this.editFormVisible = false;
         this.getsetdata();
        this.$message.success("修改成功");
          alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },

    //数据删除
    handleDelete(index, row) {
      console.log(index, row);
      console.log(row.id);
      this.$axios({
        url: `/roles/${row.id}`,
        method: "delete",
      }).then((res) => {
        this.getsetdata();
        this.$message.success("删除成功");
      });
    },
    //分配权限
    replace(index, row) {
    console.log(index, row);
   
    this.qxid = row.id
    this.quanxian = true
    console.log(row.children)
    this.$axios.get('rights/tree').then(res=>{
       this.qxlist = res.data
    })
      
    },
    //权限修改
    qxfna(){
      this.$axios({
        method:'post',
        url:`/roles/${this.pid}/rights`,
        data:{
          rids: this.$refs.tree.getCheckedKeys().toString()
        }
      }).then(res=>{
       this.$message.success("添加成功");
       this.quanxian =false;
      console.log(res);
      }).catch(err=>{
        console.log(err)
      })
      console.log(this.$refs.tree.getCheckedKeys())
    },
   //keys值
//添加
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruser.name);
          this.$axios({
            method: "post",
            url: "/roles",
            data: {
              roleName: this.ruser.name,
              roleDesc: this.ruser.direct,
            },
          }).then((res) => {
              if (res.meta.status === 201) {
                this.getsetdata();
                this.$message.success("创建成功");
                this.msg = !this.msg;
              } else {
                this.$message.error("创建失败");
              }
            }).catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(v) {
      this.$refs[v].resetFields();
    },
    fien() {
      this.editFormVisible = false;
    },
    //角色权限的删除
  open(rols,newid) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(rols.id,newid);
          this.$axios({
            method:'delete',
            url:`/roles/${rols.id}/rights/${newid}`

          }).then(res=>{
            console.log(res.data);
             rols.children = res.data
             
          }).catch(error=>{
            console.log(error)
          })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
},

  },
  components: {},
  mounted() {
    this.getsetdata();
  },
};
</script>

<style scoped >
.el-form{
  margin-top: 100px;
}
.el-card {
  margin-top: 20px;
  width: 100%;
  height: 100%;
}
.topic {
  width: 500px;
  height: 300px;
  padding-top: 40px;
  border: 1px solid #ccc;
  position: absolute;
  left: 50%;
  top: 165%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.all {
  position: relative;
}
.we-a {
  width: 100%;
  height: 100%;
}
.el-dialog__body {
  height: 600px;
}
.col-a{
  border-bottom: 1px solid #ddd;
  text-align: center;
}
.tag-all{
  margin: 10px;
}
</style>
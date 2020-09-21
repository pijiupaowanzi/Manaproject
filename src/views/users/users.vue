<template>
  <div class="father">
    <el-dialog title="添加用户" :visible.sync="outerVisible">
      <el-form :label-position="labelPosition" label-width="80px" :model="user" ref="userform">
        <el-form-item label="用户名" :rules="[{required:true}]">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" :rules="[{required:true}]">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :rules="[{required:true}]">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :rules="[{required:true}]">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="outerVisible = false">取消</el-button>
        <el-button type="primary" @click="submituser('userform')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="changeuser">
      <el-form :label-position="labelPosition" label-width="80px" :model="user" ref="userform">
        <el-form-item label="用户名">
          <el-input v-model="change.name" :disabled="true">{{change.names}}</el-input>
        </el-form-item>
        <el-form-item label="邮箱" :rules="[{required:true}]">
          <el-input v-model="change.email">{{change.email}}</el-input>
        </el-form-item>
        <el-form-item label="手机" :rules="[{required:true}]">
          <el-input v-model="change.mobile">{{change.mobile}}</el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changeuser = false">取消</el-button>
        <el-button type="primary" @click="changeusers('userform')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="divuser">
      <el-form :label-position="labelPosition" :model="user" ref="userform">
        <el-form-item>
          <div>当前的用户：admin</div>
          <div>当前的角色：超级管理员</div>
          <div>
            分配新角色：
            <el-dropdown>
              <span class="el-dropdown-link">
                请选择
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>主管</el-dropdown-item>
                <el-dropdown-item>测试角色</el-dropdown-item>
                <el-dropdown-item>测试角色2</el-dropdown-item>
                <el-dropdown-item>老七</el-dropdown-item>
                <el-dropdown-item>侯五个木</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="divuser = false">取消</el-button>
        <el-button type="primary" @click="divuser=!divuser">确定</el-button>
      </div>
    </el-dialog>

    <el-form class="demo-form">
      <el-form-item class="find">
        <el-input placeholder="请输入内容" v-model="userid"></el-input>
        <el-button icon="el-icon-search" type="info" plain @click="search()"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="outerVisible = true">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed label="#" width="50">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column label="姓名" width="165">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column label="邮箱" width="165">
        <template slot-scope="scope">{{scope.row.email}}</template>
      </el-table-column>
      <el-table-column label="电话" width="165">
        <template slot-scope="scope">{{scope.row.mobile}}</template>
      </el-table-column>
      <el-table-column label="角色" width="165">
        <template slot-scope="scope">{{scope.row.role_name}}</template>
      </el-table-column>
      <el-table-column label="状态" width="165">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="blue"
            inactive-color="#ccc"
            @change="cstatus(scope.row.mg_state,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="179">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="cuser(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deluser(scope.row.id)"></el-button>
          <el-button type="warning" icon="el-icon-aim" circle @click="distributeuser()"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[2,3,5]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total-0"
        ></el-pagination>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      tableData: [], //保存user列表数据的数组
      outerVisible: false,
      changeuser: false,
      divuser: false,
      labelPosition: "right",
      userid: "",
      total: "",
      page: 1,
      pagenum: 10,
      currentPage4: 1,
      user: {
        name: "",
        password: "",
        email: "",
        mobile: "",
      },
      change: {
        name: "",
        email: "",
        mobile: "",
        id: "",
      },
      options: [
        {
          value: 2,
          label: "2条/页",
        },
        {
          value: 3,
          label: "3条/页",
        },
        {
          value: 5,
          label: "5条/页",
        },
      ],
      value: "",
    };
  },
  methods: {
    //添加用户
    submituser(userform) {
      this.$refs[userform].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "/users",
            method: "post",
            data: {
              username: this.user.name,
              password: this.user.password,
              email: this.user.email,
              mobile: this.user.mobile,
            },
          }).then((res) => {
            if (this.user.name == "" || this.user.password == "") {
              return false;
            } else {
              this.$message({ message: "创建成功！", type: "success" });
              this.user.name = "";
              this.user.password = "";
              this.user.email = "";
              this.user.mobile = "";
              this.outerVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除用户
    deluser(id) {
      let oid = id;
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: `/users/${oid}`,
            method: "delete",
          }).then((res) => {
            this.$message({ message: res.meta.msg, type: "success" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //改变用户的状态
    cstatus(sta, id) {
      this.$axios({
        url: `/users/${id}/state/${sta}`,
        method: "put",
      }).then((res) => {
        this.$message({ message: res.meta.msg, type: "success" });
      });
    },
    //改变用户信息
    cuser(res) {
      this.change = {
        name: res.username,
        email: res.email,
        mobile: res.mobile,
        id: res.id,
      };
      this.changeuser = true;
    },
    changeusers(userform) {
      this.$refs[userform].validate((valid) => {
        if (valid) {
          this.$axios({
            url: `/users/${this.change.id}`,
            method: "put",
            data: {
              email: this.change.email,
              mobile: this.change.mobile,
            },
          }).then((res) => {
            this.$message({ message: res.meta.msg, type: "success" });
            this.changeuser = !this.changeuser;
          });
        } else {
          return false;
        }
      });
    },
    
    
    //分配角色
    distributeuser() {
      this.divuser = true;
    },


    //搜索用户
    search() {
      if (this.userid == "") {
        this.tableData = [];
        this.$axios({
          url: "users?pagenum=1&pagesize=10",
          method: "get",
        }).then((res) => {
          this.tableData = res.data.users;
        });
        return;
      } else {
        this.$axios({
          url: `/users/${this.userid}`,
          method: "get",
        }).then((res) => {
          console.log(res);
          this.tableData = [res.data];
        });
      }
    },

    //跳转页码
    handleSizeChange(val) {
      this.pagenum = val;
      this.$axios({
        url: `users?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.users;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.$axios({
        url: `users?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.users;
      });
    },
  },
  mounted() {
    this.$axios({
      url: `users?pagenum=${this.page}&pagesize=${this.pagenum}`,
      method: "get",
    }).then((res) => {
      // console.log(res);
      this.tableData = res.data.users;
      this.total = this.tableData.length;
      console.log(this.tableData);
    });
  },
};
</script>

<style lang="less" scoped>
footer {
  margin-top: 20px;
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
  .el-select {
    width: 100px;
    margin-left: 20px;
  }
}
.demo-form {
  display: flex;
  align-items: center;
  .find {
    display: flex;
    margin-right: 20px;
    .el-input {
      width: 260px;
    }
  }
}
.father {
  background-color: white;
  box-sizing: border-box;
  padding: 20px;
}
</style>
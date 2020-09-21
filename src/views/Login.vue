<template>
  <div class="father">
    <div class="img">
      <img src="../assets/img/login/woman.jpg" alt />
    </div>
    <el-form
      :label-position="labelPosition"
      :model="userform"
      class="form"
      ref="loginForm"
    >
      <el-form-item prop="name" :rules="{required:true}">
        <el-input v-model="userform.name" clearable prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="userform.password" clearable show-password prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
    </el-form>
    <div class="btm">
      <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      <el-button @click="resetForm('loginForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      labelPosition: "right",
      userform: {
        name: "admin",
        password: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "/login",
            data: {
              username: this.userform.name,
              password: this.userform.password,
            },
            method: "post",
          }).then((res) => {
              console.log(res);
              if (res) {
                this.$message({
                  message: "登录成功！",
                  type: "success",
                  duration: 1000,
                  onClose:()=> {
                    sessionStorage.setItem("token", res.data.token);
                    this.$router.replace("/welcome");
                  },
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(loginForm) {
      this.$refs[loginForm].resetFields();
    },
  },
};
</script>

<style lang='less' scoped>
.father {
  width: 500px;
  height: 300px;
  margin: 0 auto;
  background-color: white;
  margin-top: 100px;
  position: relative;
}
.img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid #cccccc;
  box-shadow: 0px 0px 2px 1px #cccccc;
  position: absolute;
  top: -75px;
  left: 250px;
  transform: translate(-50%);
  background-color: white;
  z-index: 100;
  box-sizing: border-box;
  padding: 10px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.form {
  position: relative;
  top: 100px;
  text-align: center;
  .el-form-item {
    width: 80%;
    margin: 20px auto 0;
  }
}
.btm {
  position: absolute;
  bottom: 30px;
  right: 50px;
}
</style>
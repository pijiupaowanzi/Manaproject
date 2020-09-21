<template>
  <div>
    <!-- 头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/userslist' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!--级联选择器  -->
      <el-row class="sortcas">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="value"
          :options="options"
          :props="sortprop"
          @change="handleChange"
          :disabled="sortout"
        ></el-cascader>
      </el-row>

      <!-- 页面转换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="mini" :disabled="btnout" v-show="!msg">动态参数</el-button>
          <el-button type="primary" size="mini" :disabled="btnout" v-show="msg" @click="addcam">添加参数</el-button>

          <!-- 参数表格 -->
          <el-table :data="tablelist" style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="450px"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                  type="primary"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
            <el-button type="primary" size="mini" :disabled="btnout" v-show="!msg">静态属性</el-button>
          <el-button type="primary" size="mini" :disabled="btnout" v-show="msg" @click="addcam">添加参数</el-button>
          <el-table :data="table2list" style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="450px"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                  type="primary"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addVisible" width="70%">
      <el-form :model="addform" ref="addform">
        <el-form-item label="修改分类" label-width="80px">
          <el-input v-model="addform.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edinformre">取 消</el-button>
        <el-button type="primary" @click="addformsub('addform')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数 -->

    <el-dialog title="修改分类" :visible.sync="edinVisible" width="70%">
      <el-form :model="edinform" ref="edinform">
        <el-form-item label="编辑分类" label-width="80px">
          <el-input v-model="edinform.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidf">取 消</el-button>
        <el-button type="primary" @click="eidenformsub('edinform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      options: [],
      sortprop: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      btnout: true,
      value: [],
      activeName: "first",
      //控制级联选择器开关
      sortout: false,
      lastid: "",
      tablelist: [],
      table2list:[],
      msg: true,
      antc: false,
      addVisible: false,
      //添加
      addform: {
        name: "",
      },
      delatid: "",
     edinVisible:false,
     edinform:{
       name:""
     },
     rowid :""
    };
  },
  methods: {
    // 级联选择器中的参数
    getfristsend() {
      this.$axios({
        method: "get",
        url: "/categories",
      }).then((res) => {
        this.options = res.data;
      });
    },

    // 参数改变时的value
    handleChange() {
      console.log(this.value);
      if (this.value.length == 3) {
        this.sortout = false;
        this.btnout = false;
        this.msg = true;
        this.lastid = this.value[2];
        this.getsecondsend();
      } else {
        this.sortout = true;
        this.btnout = true;
        return;
      }
    },

    //标签页
    handleClick(tab, event) {
      // console.log(tab, event)
    },

    //分类参数请求
    getsecondsend() {
      this.$axios({
        method: "get",
        url: `/categories/${this.lastid}/attributes`,
        params: {
          sel: "only",
        },
      }).then((res) => {
        console.log(res);
        this.tablelist = res.data;
      });
    },

    // 修改
    handleEdit(index, row) {
      console.log(index, row);
      this.edinVisible = true;
      this.rowid = row.attr_id 
    },

    //编辑分类
    eidenformsub(f){
      this.$refs[f].validate((valid) => {
        if (valid) {
          console.log(this.addform.name);
          this.$axios({
            method: "put",
            url: `/categories/${this.lastid}/attributes/:attrId`,
            data: {
            attr_name : this.edinform.name,
            },
          }).then((res) => {
            console.log(res);
            this.edinVisible = false;
            this.getfristsend();
            this.$message.success("修改成功");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.delatid = row.attr_id;
      this.getthridsend();
    },
    //添加参数
    addcam() {
      this.addVisible = true;
    },

    //添加分类参数
    addformsub(v) {
      this.$refs[v].validate((valid) => {
        if (valid) {
          console.log(this.addform.name);
          this.$axios({
            method: "post",
            url: `/categories/${this.lastid}/${this.rowid}`,
            data: {
              attr_sel: "only",
              attr_name: this.addform.name,
            },
          }).then((res) => {
            console.log(res);
            this.addVisible = false;
            this.getfristsend();
            this.$message.success("创建成功");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //取消添加分类
    addformre() {
      this.addVisible = false;
    },
    //删除操作
    getthridsend() {
      this.$axios({
        method: "delete",
        url: `/categories/${this.lastid}/attributes/${this.delatid}`,
      }).then((res) => {
        console.log(res);
        this.getfristsend();
        this.$message.success("删除成功");
      });
    },
    edinformre(){
      this.edinVisible = false
    },
    getsecondsend() {
      this.$axios({
        method: "get",
        url: `/categories/${this.lastid}/attributes`,
        params: {
          sel: "many",
        },
      }).then((res) => {
        console.log(res);
        this.table2list = res.data;
      });
    },
    eidf(){
      this.edinVisible = false;
    }
  },
  components: {},
  mounted() {
    this.getfristsend();
  },
};
</script>

<style scoped >
.el-card {
  margin-top: 20px;
}
.sortcas {
  margin-top: 30px;
}
</style>

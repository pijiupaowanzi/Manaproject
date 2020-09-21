<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addclassify">添加分类</el-button>
      <!-- 表格区域 -->
      <tree-table
        :data="ficationlist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">级别一</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level ===1">级别二</el-tag>
          <el-tag type="danger" size="mini" v-else>级别三</el-tag>
        </template>

        <template slot="oter" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page=" pagenum"
          :page-sizes="[5]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 修改框 -->
    <el-dialog title="修改分类" :visible.sync="moedit">
      <el-form :model="moeditform" ref="moeditform">
        <el-form-item label="分类名称" label-width="80px">
          <el-input v-model="moeditform.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moedit = false">取 消</el-button>
        <el-button type="primary" @click="moeditsure('moeditform')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加框 -->
    <el-dialog title="添加分类" :visible.sync="addfind">
      <el-form :model="ad" ref="addformer">
        <el-form-item label="添加分类:" label-width="80px">
          <el-input v-model="ad.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" label-width="80px">
          <div class="block">
            <el-cascader
              v-model="valuerse"
              :options="options"
              :props="parentvalue"
              @change="handleChange"
             clearable
         
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addfind = false">取 消</el-button>
        <el-button type="primary" @click="classifysub('addformer')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
export default {
  props: {},
  data() {
    return {
      //总条数
      total: 0,
      ficationlist: [],
      editid: 0,
      //控制编辑框显示
      moedit: false,
      //控制添加显示
      addfind: false,
      moeditform: {
        name: "",
      },
      ad: {
        name: "",
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列的模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "oter",
        },
      ],
      //当前页
      pagenum: 1,
      //每页显示多少条
      pagesize: 5,
      //父级分类列表的数据
      valuerse: [],
    options:[],
    parentvalue:
        {
            value:'cat_id',
            label:'cat_name',
         children:'children',
         checkStrictly : true

        },
        sendfos:{
             cat_pid: 0,
            cat_name:"",
            cat_level:0
        }
    
        
    };
  },
  methods: {
    getcategories() {
      this.$axios({
        method: "get",
        url: "/categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: 5,
        },
      }).then((res) => {
        console.log(res.data);

        this.total = res.data.total;
        this.ficationlist = res.data.result;
      });
    },

    //编辑
    handleEdit(id) {
      console.log(id);
      this.editid = id;
      this.moedit = true;
    },
    //编辑操作
    moeditsure(v) {
      this.$refs[v].validate((valid) => {
        if (valid) {
          this.$axios({
            method: "put",
            url: `/categories/${this.editid}`,
            data: {
              cat_name: this.moeditform.name,
            },
          }).then((res) => {
            if (res.meta.status == 200) {
              this.moedit = false;
              this.getcategories();
              this.$message.success("更新成功");
            } else {
              is.$message.error("更新失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //删除
    handleDelete(id) {
      console.log(id);
      this.$axios
        .delete(`/categories/${id}`)
        .then((res) => {
          if (res.meta.status == 200) {
            this.getcategories();
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //当前页码改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;

      this.getcategories();
    },

    addclassify() {
      this.addfind = true;
      //获取分类
      this.getclassify();
    },
    //获取父级分类菜单

    getclassify() {
      this.$axios({
        method: "get",
        url: "/categories",
        params: {
          type: 2,
        },
      }).then((res) => {
        console.log(res.data);
        this.options = res.data;
        
    
      });
    },
    //数据改变时
    handleChange(){
        console.log(this.valuerse);
        if(this.valuerse.length == 0){
            this.cat_leve = 0;
            this.cat_pid =0;

        }else if(this.valuerse.length == 1){
           this.cat_leve = 1;
            this.cat_pid =1;
        }
        else {
            this.cat_leve = 2;
            this.cat_pid =2;
        }

        
    },
    classifysub(s){
        this.handleChange();
          this.$refs[s].validate((valid) => {
          if (valid) {
              console.log(this.ad.name)
            this.$axios({
                method:'post',
                url:'/categories',
                data:{
                   cat_pid:this.valuerse==''?0:this.valuerse[ this.valuerse.length-1],
                   cat_name:this.ad.name,
                    cat_level:this.cat_pid
                }
            }).then(res=>{
              this.addfind= false
                  this.getcategories();
                   this.$message.success("添加成功");

                console.log(res)
            })

            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
    }
  },

  components: {},
  mounted() {
    this.getcategories();
  },
};
</script>

<style scoped >
.el-card {
  margin-top: 30px;
}
.el-cascader{
    width: 100%;
}
</style>

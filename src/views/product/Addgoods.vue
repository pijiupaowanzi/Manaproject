<template>
  <div class="out1">
    <el-alert title="添加商品信息" type="info" center :closable="closable" show-icon></el-alert>
    <el-steps :active="Number(active)" finish-status="success">
      <el-step title="基本参数"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane label="基本信息" name="0">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="商品名称" :rules="{ required: true}">
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" :rules="{ required: true}">
            <el-input v-model="price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" :rules="{ required: true}">
            <el-input v-model="weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" :rules="{ required: true}">
            <el-input v-model="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :rules="{ required: true}">
            <div class="block">
              <el-cascader
                v-model="value"
                :options="prolist"
                :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name'}"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
        <p class="p1">公斤数</p>
        <div>
          <el-checkbox v-model="checked" label="5.5公斤漂甩二合一，6.5公斤漂甩二合一，7.5公斤漂甩二合一" border></el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="主体参数-商品名称">
            <el-input value="海尔洗衣机XQ55453-MSK68922"></el-input>
          </el-form-item>
          <el-form-item label="特性参数-DD电机">
            <el-input value="无"></el-input>
          </el-form-item>
          <el-form-item label="功能参数-洗衣程序">
            <el-input value="洗涤，漂水，脱水，桶干燥，常用，超净洗"></el-input>
          </el-form-item>
          <el-form-item label="规格参数-洗净比">
            <el-input value="0.8"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <quill-editor></quill-editor>
        <el-button type="primary" class="btn" @click="postpro">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Addgoods",
  data() {
    return {
      closable: false,
      active: 0,
      prolist: [],
      value: "",
      checked: true,
      name:"",
      price:'',
      weight:'',
      number:'',
      fenlei:"",
      fileList: [
        {
          name: "486.jpg",
          url:
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3091913893,3897993232&fm=26&gp=0.jpg",
        },
      ],
    };
  },
  methods: {
    handleChange(value) {
      let res=value.join(',');
      this.fenlei=res
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    //添加商品
    postpro(){
      this.$axios({
        url:`/goods`,
        method:'post',
        data:{
          goods_name:this.name,
          goods_cat:this.fenlei,
          goods_price:this.price,
          goods_number:this.number,
          goods_weight:this.weight,
        }
      }).then(res=>{
        this.$message({ message: res.meta.msg, type: "success" });
        this.$router.replace('goods')
      })
    },
  },
  mounted() {
    this.$axios({
      url: "categories",
      method: "get",
    }).then((res) => {
      this.prolist = res.data;
      console.log(this.prolist);
    });
  },
};
</script>

<style lang="less" scoped>
.btn{
  margin-top: 25px;
}
.p1 {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.out1 {
  width: 100%;
  height: 100%;
  background-color: white;
  box-sizing: border-box;
  padding: 20px;
}
.el-steps {
  margin-top: 20px;
}
.el-form {
  height: 100%;
}
</style>
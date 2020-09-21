<template>
  <div class="out">
    <el-dialog title="编辑商品信息" :visible.sync="changepro">
      <el-form label-position="left" label-width="80px" ref="userform">
        <el-form-item label="商品名称" :rules="[{required:true}]">
          <el-input v-model="change.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :rules="[{required:true}]">
          <el-input v-model="change.price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :rules="[{required:true}]">
          <el-input v-model="change.number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" :rules="[{required:true}]">
          <el-input v-model="change.weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changepro = false">取消</el-button>
        <el-button type="primary" @click="changegood">确定</el-button>
      </div>
    </el-dialog>

    <el-form class="demo-form">
      <el-form-item class="find">
        <el-input placeholder="请输入内容" v-model="goods_id"></el-input>
        <el-button icon="el-icon-search" type="info" plain @click="search()"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changepage">添加商品</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="productlist" border style="width: 100%">
      <el-table-column fixed label="#" width="50">
        <template slot-scope="scope">{{scope.row.goods_id}}</template>
      </el-table-column>
      <el-table-column label="商品名称" width="500">
        <template slot-scope="scope">{{scope.row.goods_name}}</template>
      </el-table-column>
      <el-table-column label="商品价格(元)" width="110">
        <template slot-scope="scope">{{scope.row.goods_price}}</template>
      </el-table-column>
      <el-table-column label="商品重量" width="80">
        <template slot-scope="scope">{{scope.row.goods_weight}}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="165">
        <template slot-scope="scope">{{scope.row.add_time}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="cgoods(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="delgood(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10,20,30]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total-0"
        ></el-pagination>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name:"productlist",
  data(){
    return{
      productlist:[],
      total: "",
      page: 10,
      pagenum: 100,
      currentPage4: 1,
      goods_id:'',
      changepro:false,
      change:{
        name:'',
        price:'',
        weight:"",
        number:"",
        proid:""
      }
    }
  },
  methods:{
    //编辑商品
    cgoods(res){
      this.changepro=true;
      this.change={
        name:res.goods_name,
        price:res.goods_price,
        number:res.goods_number,
        weight:res.goods_weight,
        proid:res.goods_id
      }
    },
    changegood(){
      this.$axios({
        url:`/goods/${this.change.proid}`,
        method:"put",
        data:{
          goods_name:this.change.name,
          goods_price:this.change.price,
          goods_number:this.change.number,
          goods_weight:this.change.weight,
        }
      }).then(res=>{
        console.log(res)
      })
    },
    //跳转到添加商品页面
    changepage(){
      this.$router.replace('/welcome/addgoods')
    },
    //删除商品
    delgood(id) {
      console.log(id)
      let oid = id;
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: `/goods/${oid}`,
            method: "delete",
          }).then((res) => {
            console.log(res)
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
    //查找商品
    search(){
      if (this.goods_id == "") {
        this.productlist = [];
        this.$axios({
          url: `/goods?pagenum=1&pagesize=10`,
          method: "get",
        }).then((res) => {
          this.productlist=res.data.goods;
        });
        return;
      } else {
        this.$axios({
          url: `/goods/${this.goods_id}`,
          method: "get",
        }).then((res) => {
          console.log(res);
          this.productlist = [res.data];
        });
      }
    },
    //跳转页码
    handleSizeChange(val) {
      this.pagenum = val;
      this.$axios({
        url: `goods?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.productlist = res.data.goods;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.$axios({
        url: `goods?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.productlist = res.data.goods;
      });
    },
  },
  mounted(){
    this.$axios({
      url:`/goods?pagenum=1&pagesize=10`,
      method:'get'
    }).then(res=>{
      this.productlist=res.data.goods;
      this.total = res.data.total;
      console.log(res);
      this.productlist.forEach((item) => {
          let time = item.add_time;
          let date = new Date(time);
          let year = date.getFullYear();
          let month = date.getMonth();
          month = month + 1;
          let day = date.getDate();
          let hour = date.getHours();
          let minu = date.getMinutes();
          let sec = date.getSeconds();
          month = month < 10 ? "0" + month : month;
          minu = minu < 10 ? "0" + minu : minu;
          sec = sec < 10 ? "0" + sec : sec;
          item.add_time =year +"-" +month +"-" +day +" " +hour +":" +minu +":" +sec;
        });
    })
  }
}
</script>

<style lang="less" scoped>
  .out{
    width: 100%;
    background-color: white;
    box-sizing: border-box;
    padding: 20px;
  }
  footer{
    margin-top: 20px;
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
</style>
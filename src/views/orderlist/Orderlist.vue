<template>
  <div class="father2">
    <el-dialog title="修改地址" :visible.sync="clocation">
      <el-form :label-position="labelPosition" label-width="100px" ref="userform">
        <el-form-item label="省市区/县" :rules="[{required:true}]">
          <el-cascader :options="cityOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :rules="[{required:true}]">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改订单状态" :visible.sync="status" width="30%">
      <div>
        <span>是否付款：</span>
        <el-switch v-model="payvalue" active-color="blue" inactive-color="#ccc"></el-switch>
      </div>
      <div>
        <span>是否发货：</span>
        <el-switch v-model="sendvalue" active-color="blue" inactive-color="#ccc"></el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="status = false">取 消</el-button>
        <el-button type="primary" @click="status = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="wuliu" width="40%">
      <h6>{{context}}</h6>
      <div>{{time}}</div>
    </el-dialog>

    <el-form class="demo-form">
      <el-form-item class="find">
        <el-input placeholder="请输入内容" v-model="orderid"></el-input>
        <el-button icon="el-icon-search" type="info" plain @click="search()"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed label="#" width="50">
        <template slot-scope="scope">{{scope.row.order_id}}</template>
      </el-table-column>
      <el-table-column label="订单编号" width="300">
        <template slot-scope="scope">{{scope.row.order_number}}</template>
      </el-table-column>
      <el-table-column label="订单价格" width="80">
        <template slot-scope="scope">{{scope.row.order_price}}</template>
      </el-table-column>
      <el-table-column label="是否付款" width="80">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" width="80">
        <template slot-scope="scope">{{scope.row.is_send}}</template>
      </el-table-column>
      <el-table-column label="下单时间" width="160">
        <template slot-scope="scope">{{scope.row.create_time}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template  slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="Cstatus(scope.row.pay_status,scope.row.is_send,scope.row.order_id)"></el-button>
          <el-button type="success" icon="el-icon-location" circle @click="changeloc"></el-button>
          <el-button type="info" icon="el-icon-search" circle @click="showwuliu(scope.row.order_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5,10]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total-0"
        ></el-pagination>
      </div>
    </footer>
  </div>
</template>

<script>
import cityOptions from "../../assets/js/city_data2017_element";
export default {
  name: "users",
  data() {
    return {
      tableData: [],
      clocation: false,
      labelPosition: "right",
      cityOptions: cityOptions,
      status: false,
      payvalue: '',
      sendvalue:'',
      orderid:'',
      wuliu:false,
      context:'',
      time:'',
      total: 27,
       page: 1,
      pagenum: 10,
      currentPage4: 1,
    };
  },
  methods: {
    //修改地址
    changeloc() {
      this.clocation = true;
    },
    //修改用户状态
    Cstatus(payres,sendres,idres) {
      this.payvalue=payres==0?false:true;
      this.sendvalue=sendres=='否'?false:true;
      this.orderid=idres;
      // console.log(payres,sendres,idres)
      // console.log(this.payvalue,this.sendvalue,this.orderid)
      this.status = true;
    },
    //物流信息
    showwuliu(req){
      this.wuliu=true
      this.$axios({
        url:`/kuaidi/1106975712662`,
        methods:'get'
      }).then(res=>{
        this.context=res.data[0].context
        this.time=res.data[0].time
      })
    },
    //查询订单
    search() {
      if (this.orderid == "") {
        this.tableData = [];
        this.$axios({
          url: `/orders?pagenum=1&pagesize=50`,
          method: "get",
        }).then((res) => {
          this.tableData=res.data.goods;
        });
        return;
      } else {
        this.$axios({
          url: `/orders/${this.orderid}`,
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
        url: `orders?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.goods;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.$axios({
        url: `orders?pagenum=${this.page}&pagesize=${this.pagenum}`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.goods;
      });
    },
  },
  mounted() {
    this.$axios({
      url: "/orders?pagenum=1&pagesize=10",
      method: "get",
    })
      .then((res) => {
        this.tableData = res.data.goods;
        this.tableData.forEach((item) => {
          let time = item.create_time;
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
          item.create_time =year +"-" +month +"-" +day +" " +hour +":" +minu +":" +sec;
        });
      })
      .catch((err) => console.log(err));
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
.el-cascader {
  width: 100%;
}
.father2 {
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  padding: 20px;
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
<template>
  <div style="width:100%;height:100%">
    <div id="myChart" style="height:100%; width:100%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "hello",
  data() {
    return {
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {},
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [],
        series: [],
      },
    };
  },

  methods: {},
  mounted() {
    let myChart = echarts.init(document.getElementById("myChart"));
    this.$axios({
      url: "/reports/type/1",
      method: "get"
    }).then((res) => {
      this.option.legend = res.data.legend;
      this.option.series = res.data.series;
      this.option.yAxis = res.data.yAxis;
      this.option.xAxis[0].data = res.data.xAxis[0].data;
      myChart.setOption(this.option);
    });
  },
};
</script>

<style scoped lang="less">
</style>
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      ><div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    // this.getReportList()
  },
  methods: {
    // async getReportList() {
    //   const { data: res } = await this.$http.get('reports/type/1')
    //   console.log(res)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取数据信息失败')
    //   }
    //   this.reportList = res.data
    //   console.log(this.reportList, '===reportList')
    // }
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据信息失败')
    }
    // this.reportList = res.data
    // console.log(this.reportList, '===reportList')
    // 使用刚指定的配置项和数据显示图表。
    const result = _.merge(res.data, this.options)
    console.log(result, 'result')
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped></style>

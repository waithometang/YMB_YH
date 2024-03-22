<template>
  <div class="daoru">
  <div class="titleFont">
     2020年<span>{{school_current.学校名称}}</span>招生电脑摇号中签名单
  </div>
  <div class="title">
      <div class="title_left">
        <div class="leble">
          <div></div>摇号记录（{{school_current.yhjl.length}}）
        </div>
      </div>
      <div class="title_right">
        <div class="leble">
          <div></div>中签结果（{{zqListData.length}}）
        </div>
      </div>
    </div>
  <div class="PublicTable">
    <div class="table">
      <table class="table_main">
        <tr>
          <th>序号</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>中签数量</th>
          <th>占用学位</th>
        </tr>
        <tr v-for="(item,index) in currentData1" :class="{selected:item.selected}" :key="index" @click="showList(item)">
          <td v-if="item.d.kssj">{{index+1}}</td>
          <td v-else></td>
          <td>{{item.d.kssj}}</td>
          <td>{{item.d.jssj}}</td>
          <td>{{item.d.count}}</td>
          <td>{{item.d.zqsl}}</td>
        </tr>
      </table>
      <table class="table_main">
        <tr>
          <th>报名编号</th>
          <th>姓名</th>
          <th>是否双胞胎</th>
          <th>占用学位</th>
          <th>电脑编号</th>
        </tr>
        <tr v-for="(item,index) in currentData2" :key="index">
          <td>{{item.报名编号}}</td>
          <td>{{item.姓名}}</td>
          <td>{{item.是否双胞胎}}</td>
          <td>{{item.占用学位}}</td>
          <td>{{item.电脑编号}}</td>
        </tr>
      </table>
    </div>
    <div class="flex">
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        @current-change="pageChange1"
        :page-size="pageSize"
        :total="total1">
      </el-pagination>
    </div>
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        @current-change="pageChange2"
        :page-size="pageSize"
        :total="total2">
      </el-pagination>
    </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed:{
    ...mapState({
      students_zq: (state)=>state.Data.students_zq,
      school_current: (state)=>state.Data.school_current,
    })
  },
  data() {
    return {
      allData:[],
      currentData1:[],
      currentData2:[],
      pageIndex1:1, 
      pageIndex2:1, 
      pageSize:8,
      total1:0,
      zqListData:[],
      selectedJl:{},
      total2:0
    }
  },
  mounted() {
      this.getCurrentData1()
      this.zqListData=this.school_current.students_zq
      this.getCurrentData2()
  },
  methods: {
    showList(item){
      if (item.d) {
        this.zqListData=item.d.jlyhjl || []
        this.pageIndex2=1
        this.getCurrentData2()
        this.selectedJl.selected=false
        item.selected=true
        this.selectedJl = item
      }
    },
    pageChange1(p){
      this.pageIndex1=p
      this.getCurrentData1()
    },
    pageChange2(p){
      this.pageIndex2=p
      this.getCurrentData2()
    },
    getZqmd(){
      return this.currentData2
    },
    getYhJl(){
      if (this.selectedJl.selected) {
        return this.selectedJl
      }else{
        return null
      }
    },
    getCurrentData1(){
      let arr = []
      let _item
      let start = (this.pageIndex1-1)*this.pageSize
      let end = start+this.pageSize
      let jlData=this.school_current.yhjl
      this.total1 = jlData.length
      for (let index = start; index < end; index++) {
        _item=jlData[index]
        if (!_item) {
          arr.push({d:''})
        }else{
          arr.push({d:_item})
        }
      }
      this.currentData1 = arr
    },
    getCurrentData2(){
      let arr = []
      let _item
      let start = (this.pageIndex2-1)*this.pageSize
      let end = start+this.pageSize
      let jlData=this.zqListData
      this.total2 = jlData.length
      for (let index = start; index < end; index++) {
        _item=jlData[index]
        if (!_item) {
          arr.push({})
        }else{
          arr.push(_item)
        }
      }
      this.currentData2 = arr
    },
  }
}
</script>


<style lang="scss" scoped>
@import "./style/WCTable.scss"

</style>
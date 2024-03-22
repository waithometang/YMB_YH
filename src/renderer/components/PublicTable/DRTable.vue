<template>
  <div class="daoru">
  <div class="title">
    <div class="title_left">
      {{school_current.学校名称}}报名学生名单
    </div>
    <div class="title_center">
      <img src="../../../../static/images/img_05.png"/>计划招生学位：{{school_current.招生计划}}
    </div>
    <div class="title_right">
      <img src="../../../../static/images/img_06.png"/>报名学生人数：{{school_current_bmxs.length}}
    </div>
  </div>
  <div class="PublicTable">
    <div class="table">
      <table class="table_main">
        <tr>
          <th>序号</th>
          <th>报名编号</th>
          <th>姓名</th>
          <th>是否双胞胎</th>
          <th>占用学位</th>
          <th>电脑编号</th>
        </tr>
        <tr v-for="(item,index) in currentData1" :key="index">
          <td>{{item.序号}}</td>
          <td>{{item.报名编号}}</td>
          <td>{{item.姓名}}</td>
          <td>{{item.是否双胞胎}}</td>
          <td>{{item.占用学位}}</td>
          <td>{{item.电脑编号}}</td>
        </tr>
      </table>
    </div>
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        @current-change="pageChange"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  watch: {
    students_current(){
      this.setData()
    }
  },
  computed:{
    ...mapState({
      school_current: (state)=>state.Data.school_current,
      students_current: (state)=>state.Data.students_current,
      school_current_bmxs: (state)=>state.Data.school_current_bmxs,
    })
  },
  data() {
    return {
      currentData1:[],
      currentData2:[],
      pageIndex:1, 
      pageSize:16,
      total:0
    }
  },
  methods: {
    pageChange(p){
      this.pageIndex=p
      this.getCurrentData()
    },
    setData() {
      // if (this.currentData1.length > 0) {
      //   return
      // }
      let data = this.students_current || []
      this.total = data.length
      this.getCurrentData()
    },
    updateData(){
      let temp1=this.currentData1
      this.currentData1=[]
      this.currentData1=temp1
      let temp2=this.currentData2
      this.currentData2=[]
      this.currentData2=temp2
    },
    getCurrentData(){
      let arr = []
      let _item
      let start = (this.pageIndex-1)*this.pageSize
      let end = start+this.pageSize/2
      for (let index = start; index < end; index++) {
        _item=this.students_current[index]
        if (!_item) {
          arr.push({})
        }else{
          arr.push(_item)
        }
      }
      this.currentData1 = arr
      arr = []
      start = end
      end = start+this.pageSize/2
      for (let index = start; index < end; index++) {
        _item=this.students_current[index]
        if (!_item) {
          arr.push({})
        }else{
          arr.push(_item)
        }
      }
      this.currentData2 = arr
    } 
  },
  created(){
    this.setData()
  }
}
</script>


<style lang="scss" scoped>
@import "./style/DRTable.scss";
</style>
<template>
  <div class="PublicTable">
    <div class="border">
      <div class="table">
        <table class="table_main">
          <tr>
            <th>序号</th>
            <th>学校</th>
            <th>招生计划</th>
          </tr>
          <tr v-for="(item,index) in currentData1" :key="index">
            <td>{{item.序号}}</td>
            <td>{{item.学校名称}}</td>
            <td>{{item.招生计划}}</td>
          </tr>
        </table>
        <table class="table_main">
          <tr>
            <th>序号</th>
            <th>学校</th>
            <th>招生计划</th>
          </tr>
          <tr v-for="(item,index) in currentData2" :key="index">
            <td>{{item.序号}}</td>
            <td>{{item.学校名称}}</td>
            <td>{{item.招生计划}}</td>
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
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  watch:{
    schools(){
      this.setData() 
    }
  },
  props:{
    schools:{
      type: Array,
      required:true
    }
  },
  // computed:{
  //   ...mapState({
  //     schools: function (state) {
  //       return state.Data.schools
  //     },
  //   })
  // },
  data() {
    return {
      allData: [],
      currentData1: [],
      currentData2: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0
    };
  },
  created() {
    this.setData() 
  },
  methods: {
    pageChange(p) {
      this.pageIndex = p;
      this.getCurrentData();
    },
    setData() {
      let data = this.schools || [];
      this.total = data.length;
      if (this.total === 0) {
        return;
      }
      this.allData = data;
      this.getCurrentData();
    },
    getCurrentData() {
      let arr = [];
      let _item;
      let start = (this.pageIndex - 1) * this.pageSize;
      let end = start + this.pageSize / 2;
      for (let index = start; index < end; index++) {
        _item = this.allData[index];
        if (!_item) {
          // break;
          arr.push({});
        } else {
          arr.push(this.allData[index]);
        }
      }
      this.currentData1 = arr;
      arr = [];
      start = end;
      end = start + this.pageSize / 2;
      for (let index = start; index < end; index++) {
        _item = this.allData[index];
        if (!_item) {
          // break;
          arr.push({});
        } else {
          arr.push(this.allData[index]);
        }
      }
      this.currentData2 = arr;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style/SYTable.scss";
</style>
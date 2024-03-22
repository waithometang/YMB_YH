<template>
<div class="suiji">
    <div class="title">
      <div class="title_left">
        <div class="leble">
          <div></div>剩余未摇号学校（{{schools_wyh.length}}）
        </div>
      </div>
      <div class="title_right">
        <div class="leble">
          <div></div>已完成摇号学校（{{schools_yyh.length}}）
        </div>
      </div>
    </div>
  <div class="PublicTable">
    <div class="table">
      <table  border="0" cellspacing="0" cellpadding="0" class="table_main">
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
          <th>摇号时间</th>
        </tr>
        <tr v-for="(item,index) in currentData2" :key="index" @click="gotoDetail(item)">
          <td>{{item.序号}}</td>
          <td>{{item.学校名称}}</td>
          <td v-if="item.学校名称">{{item.kssj}}-{{item.wcsj}}</td>
          <td v-else></td>
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
          :total="schools_wyh.length">
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
          :total="schools_yyh.length">
        </el-pagination>
      </div>
    </div>
    <div class="popup" v-show="showRandom">
      <div class="popup-title">随机抽取学校</div>
      <div class="Carousel">
        <div class="swiper-container e-car swiper-no-swiping" >
          <div class="swiper-wrapper">
            <div v-for="(item,index) in swiperList" :key="index" class="swiper-slide">
              <div class="number">{{item.学校名称}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="nextStep pointer" @click="kscq">开始抽取</div>
      <div class="nextStep pointer" @click="nextStep">下一步</div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Swiper from "swiper";
import "swiper/css/swiper.css";
import { getRandomIndex } from "@/utils/commonUtil.js";
export default {
  watch:{
    schools_yyh(){
      this.currentData2=this.getCurrentData(this.schools_yyh,this.pageIndex2)
    },
    schools_wyh(){
      this.currentData1=this.getCurrentData(this.schools_wyh,this.pageIndex1)
    },
  },
  computed:{
    ...mapState({
      schools_wyh: (state)=>state.Data.schools_wyh,
      schools_yyh: (state)=>state.Data.schools_yyh,
      school_current: (state)=>state.Data.school_current,
    })
  },
  data() {
    return {
      allData:[],
      swiperList:[],
      currentData1:[],
      currentData2:[],
      pageIndex1:1, 
      pageIndex2:1, 
      pageSize:8,
      total1:0,
      total2:0,
      mySwiper:'',
      showRandom:false,
      time:false,
      clickbuttom:false,
      isLooping:false
    }
  },
  methods: {
    ...mapMutations(['init_school_current','update_school_current']),
    gotoDetail(item){
      if(item.学校名称){
        this.update_school_current(item)
        this.$router.push('/accomplish?mode=view')
      }
      
    },
    pageChange1(p){
      this.pageIndex1=p
      this.currentData1=this.getCurrentData(this.schools_wyh,p)
    },
    pageChange2(p){
      this.pageIndex2=p
      this.currentData2=this.getCurrentData(this.schools_yyh,p)
    },
    setData(data) {
      data = data || []
      this.total = data.length
      if (this.total === 0) {
        return
      }
      this.allData = data
      this.getCurrentData()
    },
    kscq(){
      if(this.isLooping){
        this.$alert('正在摇号中，请稍候','温馨提示')
        return
      }
      if (this.schools_wyh.length === 0) {
        this.$alert('所有学校已经完成抽签','温馨提示')
        return
      }
      this.swiperList=this.schools_wyh
      let that=this
      this.isLooping=true
      this.$nextTick(()=>that.ksloop())
      // if(this.clickbuttom){
      //   this.$alert('已经抽取学校','温馨提示')
      // }else{
      
    // }
    },
    ksloop(){
      let that=this
      let thisIndex = getRandomIndex(this.schools_wyh)
      let thisOne = this.schools_wyh[thisIndex]
      while (!thisOne) {
        thisIndex=getRandomIndex(this.schools_wyh)
        thisOne = this.schools_wyh[thisIndex]
      }
        if(this.mySwiper==''){
        this.mySwiper = new Swiper(".swiper-container", {
          direction: "vertical",
          freeMode: false,
          autoplay:false,
          loop: true,
        });
        this.ksloop()
      }else{
        let s=setInterval(() => this.mySwiper.slideNext(100,true), 30);
        setTimeout(() => {
          console.log(thisOne.学校名称);
          this.mySwiper.slideTo(thisIndex+1, 1000, false);
          clearInterval(s)
          this.init_school_current(thisOne)
           setTimeout(()=>that.isLooping=false,1000)
        }, 3000);
      }
      this.clickbuttom=true
    },
    beginRandom(){
      this.swiperList=[]
      this.showRandom=true
    },
    getCurrentData(source,pageindex){
      let arr = []
      let _item
      let start = (pageindex-1)*this.pageSize
      let end = start+this.pageSize
      for (let index = start; index < end; index++) {
        _item=source[index]
        if (!_item) {
          // break;
          arr.push({})
        }else{
          arr.push(_item)
        }
      }
      return arr
    },
    nextStep () {
      if(this.isLooping){
        this.$alert('正在摇号中，请稍候','温馨提示')
        return
      }
      if (!this.school_current) {
        this.$alert('请先随机抽取学校','温馨提示')
        return
      }
      this.$router.push('/drxsmd')
    }
  },
  created () {
    this.currentData1=this.getCurrentData(this.schools_wyh,1)
    this.currentData2=this.getCurrentData(this.schools_yyh,1)
  },
}
</script>
<style lang="scss" scoped>
@import "./style/SJTable.scss"
</style>
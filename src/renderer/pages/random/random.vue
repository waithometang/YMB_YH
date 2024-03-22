<template>
  <div class="drxsmd">
    <SJTable ref="mTable"/>
    <div class="public-base">
      <div class="public-base-left">
        <div class="base-left-head"><i></i>本次参摇学校合计：{{schools.length}}所</div>
        <div class="base-left-bootom base-left-bootom-margin">
          <div class="bootom-left">操作步骤</div>
          <div class="bootom-right">
            <div class="right-tab" v-for="(item, index) in infoData" :class="index==1 ? 'cor' : ''" :key="index">
              <div class="tab-number">0{{item.id}}</div>
              <div class="right-info">
                <div>{{item.name}}</div>
                <div>{{item.title}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="public-base-right">
        <div class="base-right-head"><i></i>请点击随机抽取学校进行电脑摇号</div>
        <div class="base-right-bootom">
          <div class="bootom-but pointer" @click="cqClick">点击抽取学校</div>
          <!-- <div class="bootom-but pointer" @click="nextStep">下一步</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SJTable from '@/components/publicTable/SJTable';
import { random, getRandomOne } from "@/utils/commonUtil.js";
import { mapState,mapMutations } from 'vuex'
export default {
  computed:{
    ...mapState({
      schools: (state)=>state.Data.schools,
      schools_wyh: (state)=>state.Data.schools_wyh,
      schools_yyh: (state)=>state.Data.schools_yyh,
      school_current: (state)=>state.Data.school_current,
    })
  },
  data () {                
    return {
     infoData: [{id: 1, name: '导入', title: '学校学位名单'},{id: 2, name: '随机抽取学校', title: '进行摇号'},{id: 3, name: '导入报名名单', title: '电脑随机编号'},{id: 4, name: '学校开始', title: '电脑随机摇号'},{id: 5, name: '导出', title: '中签名单'}],
     mySwiper:'',
     isShowRandom:false,
    }
  },
  components: {
    SJTable
  },
  mounted() {
    this.update_school_current('')
  },
  methods: {
    ...mapMutations(['update_school_current','remove_schools_wyh','push_schools_yyh']),
    cqClick(){
      if (this.isShowRandom) {
        return
      }
      this.isShowRandom=true
      this.$refs['mTable'].beginRandom()
      // if (this.school_current) {
      //   this.$alert('当前已经随机抽取了学校:'+this.school_current['学校名称'],'温馨提示')
      //   return
      // }
      // let thisOne = getRandomOne(this.schools_wyh)
      // // this.remove_schools_wyh(thisIndex)
      // // this.push_schools_yyh(thisOne)
      // if (!thisOne) {
      //   this.$alert('随机抽取失败','温馨提示')
      //   return
      // }
      // this.update_school_current(thisOne)
    },
    // nextStep () {
    //   if (!this.school_current) {
    //     this.$alert('请先随机抽取学校','温馨提示')
    //     return
    //   }
    //   this.$router.push('/drxsmd')
    // }
  },
}
</script>
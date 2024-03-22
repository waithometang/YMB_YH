<template>
  <div class="index">
    <DRTable ref="datatable" :schools="schools"/>
    <div class="public-base">
      <div class="public-base-left">
        <div class="base-left-head"><i></i>本次参摇学校合计：{{schools.length}}所</div>
        <div class="base-left-bootom">
          <div class="bootom-left">操作步骤</div>
          <div class="bootom-right">
            <div class="right-tab" v-for="(item, index) in infoData" :class="index==0 ? 'cor' : ''" :key="index">
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
        <div class="base-right-head"><i></i>请导入学校和学位名单</div>
        <div class="base-right-bootom">
          <div class="bootom-but pointer" @click="jxyhClick" v-if="canJxyh">继续摇号</div>
          <div class="bootom-but pointer" @click="importData">点击导入名单</div>
          <div class="bootom-but pointer" @click="nextStep">下一步</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DRTable from '@/components/PublicTable/SYTable';
import excelUtil from '@/utils/excelUtil.js'
import DbUtil from '@/DB/DbUtil.js'
const ipc = require('electron').ipcRenderer;
import { mapMutations,mapState,mapActions } from 'vuex'

export default {
  data () {                
    return { 
      schools:[],
      canJxyh:false,
      infoData: [{id: 1, name: '导入', title: '学校学位名单'},{id: 2, name: '随机抽取学校', title: '进行摇号'},{id: 3, name: '导入报名名单', title: '电脑随机编号'},{id: 4, name: '学校开始', title: '电脑随机摇号'},{id: 5, name: '导出', title: '中签名单'}]  
    }
  },
  computed: {
    ...mapState({
      school_current: state => state.Data.school_current,
      students_current: state => state.Data.students_current,
      school_current_bmxs: state => state.Data.school_current_bmxs
    })
  },
  methods:{
    ...mapActions(['initSchoolData']),
    jxyhClick(){
      this.$router.push('dnyh')
    },
    importData(){
      ipc.send('open-file-dialog','xx');
    },
    setSchoolData(json){
      // this.$refs['datatable'].setData(json)
      this.initSchoolData(json)
    },
    nextStep () {
      if (this.schools.length === 0) {
        this.$alert(`请先导入学校和学位名单`,'温馨提示')
      }else{
        this.$router.push('/random')
      }
    }
  },
  created() {
    let that = this;
    this.canJxyh= this.school_current && this.students_current && this.students_current.length > 0
    // DbUtil.getSchoolData(_data=>{
    //   that.setSchoolData(_data)
    // })
    // this.initSchoolData([])
    ipc.on('selected-file-xx', function (event, path) {
        
       if (path.length > 0) {
         try {
           let json = excelUtil.importSchoolData(path[0])
           that.setSchoolData(json)
           that.schools=json
          //  DbUtil.importSchoolData(json)
           that.$alert(`共导入${json.length}条数据`,'导入成功', {
            confirmButtonText: '确定',
            callback: action => {
              
            }
          })
         } catch (error) {
           that.$alert(error,'导入失败', {
            confirmButtonText: '确定',
            callback: action => {
              
            }
          })
         }
       }
    })
  },
  components: {
    DRTable,
  }
}
</script>
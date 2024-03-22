<template>
  <div class="dnyh">
    <DRTable ref="mTable" />
    <div class="public-base">
      <div class="public-base-right">
        <div class="base-right-bootom base-right-bootom-margin">
          <div class="bootom-but bootom-but-little pointer" @click="Preview">打印</div>
          <div class="bootom-but bootom-but-little pointer" @click="exportMd">导出中签名单</div>
          <div class="bootom-but bootom-but-little pointer" v-if="!isView" @click="backTo">返回电脑摇号</div>
          <div class="bootom-but bootom-but-little pointer" v-if="!isView" @click="nextStep">完成本次摇号</div>
          <div class="bootom-but bootom-but-little pointer" v-if="isView" @click="backToSchol">返回学校列表</div>
        </div>
      </div>
    </div>
    <div class="printer-view" v-show="PreviewShow">
      <div @click="closeprinter" class="close pointer">关闭</div>
      <div @click="print" class="close print pointer">打印</div>
      <webview class="webview" ref="printWebview" src="./static/print/bhmd.html" autosize nodeintegration />
    </div>
  </div>
</template>

<script>
import DRTable from "@/components/publicTable/WCTable";
import Swiper from "swiper";
import "swiper/css/swiper.css";
import excelUtil from "@/utils/excelUtil";
import { mapState, mapActions } from 'vuex'
import { filZero,sortBmbh } from '@/utils/commonUtil'
export default {
  computed:{
    ...mapState({
      school_current: (state)=>state.Data.school_current
    }),
    isView(){
      return this.$route.query.mode === 'view'
    }
  },
  data() {
    return {
      infoData: [
        { id: 3, name: "导入报名名单", title: "电脑随机编号" },
        { id: 4, name: "学校开始", title: "电脑随机摇号" },
        { id: 5, name: "导出", title: "中签名单" }
      ],
      mySwiper: "",
      time: false,
      PreviewShow:false
    };
  },
  mounted() {
    this.mySwiper = new Swiper(".swiper-container", {
      loop: true,
      direction: "vertical",
      speed: 200,
      autoplay: {
        delay: 0,
        disableOnInteraction: false
      },
      on: {
        slideChange: () => {
          if (this.time) {
            if (this.mySwiper[0].activeIndex == 10)
              this.mySwiper[0].autoplay.stop();
            if (this.mySwiper[1].activeIndex == 2)
              this.mySwiper[1].autoplay.stop();
            if (this.mySwiper[2].activeIndex == 3)
              this.mySwiper[2].autoplay.stop();
            if (this.mySwiper[3].activeIndex == 4)
              this.mySwiper[3].autoplay.stop();
            if (this.mySwiper[4].activeIndex == 5)
              this.mySwiper[4].autoplay.stop();
            if (this.mySwiper[5].activeIndex == 6)
              this.mySwiper[5].autoplay.stop();
          }
        }
      },
      freeMode: true
    });
    setTimeout(() => {
      this.time = true;
    }, 300);
  },
  components: {
    DRTable
  },
  methods: {
    ...mapActions(['finishYh']),
    exportMd(){
      let yhjl=this.$refs.mTable.getYhJl()
      if (!yhjl) {
        this.$alert('请选要导出的记录','温馨提示')
        return
      }
      let list=[...yhjl.d.jlyhjl]
      list.sort(sortBmbh)
      let len=list.length
      if ( len === 0) {
        this.$alert('当前没有中签学生','温馨提示')
        return
      }
      let date = new Date()
      let rq= `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(date.getDate())}`
      let title=[`2020年${this.school_current.学校名称}招生电脑摇号中签名单`]
      let rytj=[`报名人数:${this.school_current.bmry}`,null,null,`计划招生人数:${this.school_current.招生计划}`]
      let sjsm=[`开始摇号时间:${rq} ${yhjl.d.kssj}`,null,null,yhjl.d.jssj?`结束摇号时间:${rq} ${yhjl.d.jssj }`:'']
      let listtitle=['报名编号','姓名','是否双胞胎','占用学位','电脑编号','中签时间']
      let arr=[title,rytj,sjsm,listtitle]
      for (let index = 0; index < len; index++) {
        const el = list[index];
        arr.push([el.报名编号,el.姓名,el.是否双胞胎,el.占用学位,el.电脑编号,el.中签时间])
      }
      let merges=[{s: {r: 0, c: 0}, e: {r: 0, c: 5}},{s: {r: 1, c: 0}, e: {r: 1, c: 2}},{s: {r: 1, c: 3}, e: {r: 1, c: 5}},{s: {r: 2, c: 0}, e: {r: 2, c: 2}},{s: {r: 2, c: 3}, e: {r: 2, c: 5}}]
      let cols=[{wpx: 50},{wpx: 50},{wpx: 50},{wpx: 50},{wpx: 50},{wpx: 50}]
      excelUtil.aoaToExcel(arr,`中签名单(${this.school_current.学校名称})`,merges,cols)
    },
    backToSchol(){
      this.$router.push('/random')
    },
    print(){
      const webview = this.$refs.printWebview;
      let getHtml=this.getPrintHtml()
      if (!getHtml) {
        return
      }
      webview.executeJavaScript(`document.getElementById('bd').innerHTML ='${getHtml}'`);
      webview.print(
          {
            silent: false,
            printBackground: false,
          },
          (data) => {
          },
        );
    },
    getPrintHtml(){
      let yhjl=this.$refs.mTable.getYhJl()
      if (!yhjl) {
        this.$alert('请选要预览的记录','温馨提示')
        return
      }
      let cq=this.school_current.yhjl.indexOf(yhjl.d)+1
      let list=[...yhjl.d.jlyhjl]
      list.sort(sortBmbh)
      let title=`2020年${this.school_current.学校名称}招生电脑摇号中签名单`
      let date = new Date()
      let rq= `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(date.getDate())}`
      // let rtn='<h1>'+title+'</h1><div class="mybox"><div class="flex50">'+`报名人数:${this.school_current.bmry}`+'</div><div class="flex50">'+`计划招生人数:${this.school_current.招生计划}`+'</div></div><div class="mybox"><div class="flex50">'+`开始摇号时间:${rq} ${yhjl.d.kssj}`+'</div><div class="flex50">'+(yhjl.d.jssj?`结束摇号时间:${rq} ${yhjl.d.jssj}`:'')+'</div></div><table><tr><th>报名编号</th><th>姓名</th><th>是否双胞胎</th><th>占用学位</th><th>电脑编号</th></tr>' 
      // let len = list.length
      // let item
      // for (let index = 0; index < len; index++) {
      //   item=list[index]
      //   if (!item.姓名) {
      //     break
      //   }
      //   rtn+=`<tr><td>${item.报名编号 || ''}</td><td>${item.姓名 || ''}</td><td>${item.是否双胞胎 || ''}</td><td>${item.占用学位 || ''}</td><td>${item.电脑编号 || ''}</td></tr>`
      // }
      // rtn+='</table>'
      // return rtn
      let zqsl=0
      if(yhjl.d.jlyhjl) {
        zqsl=yhjl.d.jlyhjl.length
      }
      let rtns='<br/><br/><table class="table" border="1" cellspacing="0">'+
      '<thead class="table" border="1" cellspacing="0">'+
      '<tr><td colspan=6>'+this.school_current.学校名称 +',第'+cq+'轮摇号结果</td></tr>'+
      '<tr class="nobordaer"><td colspan=3 class="nobordaer">'+`报名人数: ${this.school_current.bmry}`+'</td><td colspan=3 class="nobordaer">'+`已中签人数: ${zqsl}`+'</td></tr>'+
      '<tr><td colspan=3 class="nobordaer">开始摇号时间:'+rq+' '+yhjl.d.kssj+'</td><td colspan=3 class="nobordaer">结束摇号时间:'+rq+' '+yhjl.d.jssj+'</td></tr>'+
      '<tr><td>报名编号</td><td>姓名</td><td>是否双胞胎</td><td>占用学位</td><td>电脑编号</td><td>中签时间</td></tr></thead><tbody>';
      let rtn=rtns
      let len = list.length;
      let item;
      let pagination=Math.ceil(len/17);
      let num=0;
      for (let index = 1; index < len+1; index++) {
        item = list[index-1];
        rtn += `<tr><td>${item.报名编号 || ""}</td><td>${item.姓名 ||
          ""}</td><td>${item.是否双胞胎 || ""}</td><td>${item.占用学位 ||
          ""}</td><td>${item.电脑编号 || ""}</td><td>${item.中签时间 ||
          ""}</td></tr>`;
          if(index == len ){
            num++
            rtn+='</tbody></table><div class="mybox"><div class="name">现场监督人员签字：</div></div><div class="mybox"><div class="flex50">招生学校盖章：</div><div class="flex50">区教育局招生考试科盖章:</div></div><div class="pagination">第'+num+'页，共'+pagination+'页</div>'
          }else if(index%17==0 ){
            num++
            rtn+='</tbody></table><div class="mybox"><div class="name">现场监督人员签字：</div></div><div class="mybox"><div class="flex50">招生学校盖章：</div><div class="flex50">区教育局招生考试科盖章:</div></div><div class="pagination">第'+num+'页，共'+pagination+'页</div>'+rtns
          }
      }
     return rtn;
    },
    nextStep(){
      this.$confirm('此操作将完成摇号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.finishYh()
          this.$message({
            type: 'success',
            message: '完成摇号!'
          });
          this.$router.push('/random')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消完成'
          });          
        });
    },
    backTo(){
      this.$router.go(-1)
    },
    Preview(){
      let yhjl=this.$refs.mTable.getYhJl()
      if (!yhjl) {
        this.$alert('请选要预览的记录','温馨提示')
        return
      }
      const webview = this.$refs.printWebview;
      webview.executeJavaScript(
        `document.getElementById('bd').innerHTML ='${this.getPrintHtml()}'`
      );
      this.PreviewShow=true
    },
    closeprinter(){
      this.PreviewShow=false
    }
  }
}; 
</script>
<style lang="scss" scoped>
@import "./style/accomplish.scss"
</style>

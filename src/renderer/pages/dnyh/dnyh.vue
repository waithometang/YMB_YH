<template>
  <div class="dnyh">
    <DRTable />
    <div class="public-base">
      <div class="public-base-left">
        <div class="base-list">
          <div class="base-left-tab">
            <div class="tab-number">{{school_current.招生计划}}</div>
            <div class="tab-name">计划招生</div>
          </div>
          <div class="base-left-tab">
            <div class="tab-number color1">{{leaveXW}}</div>
            <div class="tab-name">剩余学位</div>
          </div>
          <div class="base-left-tab">
            <div class="tab-number color2">{{school_current.zqsl}}</div>
            <div class="tab-name">中签数量</div>
          </div>
          <div class="base-left-tab">
            <div class="tab-number color2">{{zql}}%</div>
            <div class="tab-name">中签率</div>
          </div>
        </div>
      </div>
      <div class="public-base-right">
        <div class="base-right-bootom base-right-bootom-margin">
          <div class="bootom-but pointer bootom-but-little cor1" @click="SelectNum">开始电脑摇号</div>
          <div class="bootom-but pointer bootom-but-little" @click="checkMd">查看中签名单</div>
          <div class="bootom-but pointer bootom-but-little" @click="exportMd">导出所有中签名单</div>
          <div class="bootom-but pointer bootom-but-little" @click="Preview">打印所有中签名单</div>
          <div class="bootom-but pointer bootom-but-little" @click="nextStep">完成本次摇号</div>
        </div>
      </div>
    </div>
    <div class="popup" v-if="showRandom">
      <div class="popup-title">电脑随机抽号中</div>
      <div class="popup-title">请设置本次您想出号的数量</div>
      <div class="Input">
        <input v-model="yhNum" type="number" />
        <div class="Button size">
          <div @click="beginYh">确认</div>
          <div @click="cancel">取消</div>
        </div>
      </div>
      <!-- <div class="popup-title">本次摇号已完成<p>请选择下一步工作计划</p></div>
          <div class="Button">
            <div>全部摇号已完成<br/>归档保存记录资料</div>
            <div>返回随机抽取<br/>下一所学校进行摇号</div>
      </div>-->
    </div>
    <div class="maxPopup" v-if="startRandom">
      <div @click="close" class="close pointer">确定</div>
      <div class="maxpopup-title">{{school_current.学校名称}}第{{cqtime}}轮抽签,本轮抽取{{yhNum}}个号</div>
      <div class="lottery">
        <div class="lotteryItem" v-for="(item,index) in yhNum" :key="index">
          <div class="name">{{students[index].电脑编号}}</div>
          <div class="num">{{students[index].姓名}}</div>
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
import DRTable from "@/components/publicTable/DRTable";
import Swiper from "swiper";
import "swiper/css/swiper.css";
import { mapState, mapMutations, mapActions } from "vuex";
import excelUtil from "@/utils/excelUtil";
import { random, randomilize, filZero,sortBmbh } from "@/utils/commonUtil";

export default {
  computed: {
    ...mapState({
      school_current: state => state.Data.school_current,
      students_current: state => state.Data.students_current,
      school_current_bmxs: state => state.Data.school_current_bmxs
    }),
    zql() {
      let rtn = this.school_current.招生计划 / this.school_current_bmxs.length;
      return rtn.toFixed(3) * 100;
    }
  },
  data() {
    return {
      showRandom: false,
      startRandom: false,
      cqtime: 1,
      leaveXW: 0,
      yhNum: 1,
      isRuning: false,
      infoData: [
        { id: 3, name: "导入报名名单", title: "电脑随机编号" },
        { id: 4, name: "学校开始", title: "电脑随机摇号" },
        { id: 5, name: "导出", title: "中签名单" }
      ],
      mySwiper: "",
      time: false,
      students: "",
      PreviewShow: false
    };
  },
  methods: {
    ...mapMutations([
      "update_school_current",
      "push_students_zq",
      "remove_students_current",
      "record_hyjl"
    ]),
    ...mapActions(["finishYh"]),
    exportMd() {
      let list=[...this.school_current.students_zq]
      list.sort(sortBmbh)
      let len = list.length;
      if (len === 0) {
        this.$alert("当前没有中签学生", "温馨提示");
        return;
      }
      let date = new Date();
      let rq = `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(
        date.getDate()
      )}`;
      let title = [`2020年${this.school_current.学校名称}招生电脑摇号中签名单`];
      let rytj = [
        `报名人数:${this.school_current.bmry}`,
        null,
        null,
        `计划招生人数:${this.school_current.招生计划}`
      ];
      let sjsm = [
        `开始摇号时间:${rq} ${this.school_current.kssj}`,
        null,
        null,
        this.school_current.wcsj
          ? `结束摇号时间:${rq} ${this.school_current.wcsj}`
          : ""
      ];
      let listtitle = [
        "报名编号",
        "姓名",
        "是否双胞胎",
        "占用学位",
        "电脑编号",
        "中签时间"
      ];
      let arr = [title, rytj, sjsm, listtitle];
      for (let index = 0; index < len; index++) {
        const el = list[index];
        arr.push([
          el.报名编号,
          el.姓名,
          el.是否双胞胎,
          el.占用学位,
          el.电脑编号,
          el.中签时间
        ]);
      }
      let merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
        { s: { r: 1, c: 3 }, e: { r: 1, c: 5 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
        { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } }
      ];
      let cols = [
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 }
      ];
      excelUtil.aoaToExcel(
        arr,
        `中签名单(${this.school_current.学校名称})`,
        merges,
        cols
      );
    },
    //选择摇号数量
    SelectNum() {
      this.showRandom = true;
    },
    print() {
      const webview = this.$refs.printWebview;
      webview.executeJavaScript(
        `document.getElementById('bd').innerHTML ='${this.getPrintHtml()}'`
      );
      webview.print(
        {
          silent: false,
          printBackground: false
        },
        data => {}
      );
    },
    getPrintHtml() {
      let date = new Date();
      let rq = `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(
        date.getDate()
      )}`;
      let rtns='<br/><br/><table class="table" border="1" cellspacing="0">'+
      '<thead class="table" border="1" cellspacing="0">'+
      '<tr><td colspan=6>'+this.school_current.学校名称 +'</td></tr>'+
      '<tr class="nobordaer"><td colspan=3 class="nobordaer">'+`报名人数: ${this.school_current.bmry}`+'</td><td colspan=3 class="nobordaer">'+`已中签人数: ${this.school_current.招生计划}`+'</td></tr>'+
      '<tr><td colspan=3 class="nobordaer">开始摇号时间:'+rq+' '+this.school_current.kssj+'</td><td colspan=3 class="nobordaer">结束摇号时间:'+rq+' '+date.getHours()+':'+date.getMinutes()+'</td></tr>'+
      '<tr><td>报名编号</td><td>姓名</td><td>是否双胞胎</td><td>占用学位</td><td>电脑编号</td><td>中签时间</td></tr></thead><tbody>';
      let rtn=rtns
      let list=[...this.school_current.students_zq]
      list.sort(sortBmbh)
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
    //取消电脑摇号
    cancel() {
      this.showRandom = false;
    },
    //开始电脑摇号
    beginYh() {
      let that = this;
      if (this.isRuning) return;
      this.isRuning = true;
      if (this.yhNum > 50) {
        this.$alert("单次摇号数量不能大于50", "温馨提示");
        this.isRuning = false;
        return;
      } else if (this.yhNum < 1) {
        this.$alert("不能小于1", "温馨提示");
        this.isRuning = false;
        return;
      }
      this.yhNum = parseInt(this.yhNum);
      let yhCount = this.yhNum;
      if (this.leaveXW - yhCount < 0) {
        this.$alert("剩余学位数少于摇号数", "温馨提示");
        this.isRuning = false;
        return;
      }
      this.students = this.students_current.slice(0, this.yhNum);
      this.cqtime = this.school_current.yhjl.length + 1;
      this.startRandom = true;
      this.showRandom = false;
      let randomnum = 0;
      //选择号码
      let date = new Date();
      // let dataStr = `${filZero(date.getMonth() + 1)}/${filZero(date.getDate())} ${filZero(date.getHours())}:${filZero(date.getMinutes())}`
      let kssjStr = `${filZero(date.getHours())}:${filZero(
        date.getMinutes()
      )}:${filZero(date.getSeconds())}`;
      let yhlist = [...this.students_current];
      let yhjg = this.getYhOfNumb(yhCount);
      while (!yhjg) {
        yhjg = this.getYhOfNumb(yhCount);
      }
      let interval = setInterval(() => {
        randomnum += 1;
        this.students = randomilize(yhlist);
        if (randomnum === 30) {
          clearInterval(interval);
          that.students = yhjg;
          that.push_students_zq(yhjg);
          that.isRuning = false;
          let zqsl = 0;
          let xws;
          for (let j = 0; j < yhjg.length; j++) {
            xws = Number(yhjg[j].占用学位);
            if (xws) {
              zqsl += xws;
            } else {
              zqsl += 1;
            }
          }
          let date1 = new Date();
          let jssjStr = `${filZero(date1.getHours())}:${filZero(
            date1.getMinutes()
          )}:${filZero(date1.getSeconds())}`;
          that.record_hyjl({
            count: yhCount,
            kssj: kssjStr,
            jssj: jssjStr,
            jlyhjl: [...yhjg],
            zqsl
          });
          that.leaveXW = this.leaveXW - zqsl;
          // console.log(yhjg.map(item=>item.姓名));
        }
      }, 200);
    },
    //关闭摇号
    close() {
      if (this.isRuning) {
        this.$alert("正在摇号中,请勿关闭", "温馨提示");
        return;
      }
      this.startRandom = false;
    },
    nextStep() {
      this.$confirm("此操作将完成摇号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.finishYh();
          this.$message({
            type: "success",
            message: "完成摇号!"
          });
          this.$router.push("/random");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消完成"
          });
        });
    },
    getYhOfNumb(numb) {
      let rtnArray = [];
      let obj;
      let len = this.students_current.length;
      if (len === 0) return null;
      if (len === numb) return this.students_current;
      if (len < numb) return this.students_current;
      for (let index = 0; index < numb; index++) {
        let thisIndex = random(0, len);
        obj = this.students_current[thisIndex];
        if (obj) {
          rtnArray.push(obj);
          this.remove_students_current(thisIndex);
          len--;
        } else {
          console.log("空号:" + thisIndex);
          return null;
        }
      }
      return rtnArray;
    },
    checkMd() {
      this.$router.push("/accomplish");
    },
    Preview() {
      const webview = this.$refs.printWebview;
      webview.executeJavaScript(
        `document.getElementById('bd').innerHTML ='${this.getPrintHtml()}'`
      );
      this.PreviewShow = true;
    },
    
    closeprinter() {
      this.PreviewShow = false;
    }
  },
  created() {
    this.leaveXW = this.school_current.招生计划 - this.school_current.zqsl;
  },
  components: {
    DRTable
  }
};
</script>
<style lang="scss" scoped>
@import "./style/dnyh.scss";
</style>

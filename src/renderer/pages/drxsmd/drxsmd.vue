<template>
  <div class="drxsmd">
    <DRTable ref="mTable" />
    <div class="public-base">
      <div class="public-base-left">
        <div class="base-left-head">
          <div class="head-left">
            编号
            <br />说明
          </div>
          <div class="head-info">
            <div class="head-info-tab">1.一学生一编号，现场电脑随机生成；</div>
            <div class="head-info-tab">2.电脑编号代表学生进行本次电脑摇号。</div>
          </div>
        </div>
        <div class="base-left-bootom base-left-bootom-margin">
          <div class="bootom-left">操作步骤</div>
          <div class="bootom-right">
            <div
              class="right-tab"
              v-for="(item, index) in infoData"
              :class="index==0 ? 'cor' : ''"
              :key="index"
            >
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
        <div class="base-right-head">
          <i></i>导入报名学生名单及电脑随机编号
        </div>
        <div class="base-right-bootom">
          <div class="bootom-but pointer" @click="importData">点击导入学生名单</div>
          <div class="bootom-but pointer cor1" @click="randomCode">点击电脑随机编号</div>
          <div class="bootom-but pointer" @click="exportToExcel">导出电脑编号名单</div>
          <div class="bootom-but pointer" @click="Preview">打印</div>
          <!-- <div class="bootom-but pointer" @click="print">打印</div> -->
          <div class="bootom-but pointer" @click="nextStep">下一步</div>
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
const ipc = require("electron").ipcRenderer;
import { mapState, mapMutations } from "vuex";
import excelUtil from "@/utils/excelUtil.js";
import { filZero, getStarName,sortBmbh,getFileName } from "@/utils/commonUtil.js";

export default {
  computed: {
    ...mapState({
      school_current: state => state.Data.school_current,
      students_current: state => state.Data.students_current,
      school_current_bmxs: state => state.Data.school_current_bmxs 
    })
  },
  data() {
    return {
      hasRandomCode: false,
      infoData: [
        { id: 3, name: "导入报名名单", title: "电脑随机编号" },
        { id: 4, name: "学校开始", title: "电脑随机摇号" },
        { id: 5, name: "导出", title: "中签名单" }
      ],
      PreviewShow:false
    };
  },
  components: {
    DRTable
  },
  methods: {
    ...mapMutations([
      "update_students_current",
      "init_students_current",
      "create_students_code",
      "init_school_current_bmxs"
    ]),
    nextStep() {
      if (this.students_current.length === 0) {
        this.$alert("请先导入名单", "温馨提示");
        return;
      }
      if (!this.hasRandomCode) {
        this.$alert("请生成电脑随机编号", "温馨提示");
        return;
      }
      this.$router.push("/dnyh");
    },
    exportToExcel() {
      let len = this.school_current_bmxs ? this.school_current_bmxs.length : 0;
      if (len === 0) {
        this.$alert("请先导入报名学生", "温馨提示");
        return;
      }
      let date = new Date();
      let rq = `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(
        date.getDate()
      )}`;
      let title = [`${this.school_current.学校名称}报名学生名单`];
      let rytj = [
        `报名人数:${this.school_current.bmry}`,
        null,
        `计划招生人数:${this.school_current.招生计划}`
      ];
      let listtitle = [
        "报名编号",
        "姓名",
        "是否双胞胎",
        "占用学位",
        "电脑编号"
      ];
      let arr = [title, rytj, listtitle];
      let list=[...this.school_current_bmxs]
      list.sort(sortBmbh)
      for (let index = 0; index < len; index++) {
        const el = list[index];
        arr.push([
          el.报名编号,
          el.姓名,
          el.是否双胞胎,
          el.占用学位,
          el.电脑编号
        ]);
      }
      let merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
        { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } }
      ];
      let cols = [
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 80 }
      ];
      excelUtil.aoaToExcel(
        arr,
        `(${this.school_current.学校名称})报名学生名单`,
        merges,
        cols
      );
    },
    randomCode() {
      if (this.students_current.length === 0) {
        this.$alert("请先导入名单", "温馨提示");
        return;
      }
      this.create_students_code();
      this.hasRandomCode = true;
      this.$refs["mTable"].updateData();
    },
    importData() {
      ipc.send("open-file-dialog", "xs");
    },
    print() {
      const webview = this.$refs.printWebview;
      // webview.set=10
      // webview.clientWidth=10
      webview.executeJavaScript(
        `document.getElementById('bd').innerHTML ='${this.getPrintHtml()}'`
      );
      // webview.executeJavaScript('window.print();')
      webview.print(
        {
          silent: false,
          printBackground: false
        },
        data => {
          // console.log('webview success', data);
        }
      );
    },
    getPrintHtml() {
      let rtns='<br/><br/><table class="table" border="1" cellspacing="0">'+
      '<thead class="table" border="1" cellspacing="0">'+
      '<tr><td colspan=6>'+this.school_current.学校名称 +'</td></tr>'+
      '<tr><td colspan=3 class="nobordaer">'+`报名人数: ${this.school_current.bmry}`+'</td><td colspan=3 class="nobordaer">'+`招生人数: ${this.school_current.招生计划}`+'</td></tr>'+
      '<tr><td>报名编号</td><td>姓名</td><td>是否双胞胎</td><td>占用学位</td><td>电脑编号</td></tr></thead><tbody>';
      let rtn=rtns
      let list = [...this.students_current]
      let len = list.length;
      list.sort(sortBmbh)
      let item;
      let pagination=Math.ceil(len/18);
      let num=0;
      for (let index = 1; index < len+1; index++) {
        item = list[index-1];
        rtn += `<tr><td>${item.报名编号 || ""}</td><td>${item.姓名 ||
          ""}</td><td>${item.是否双胞胎 || ""}</td><td>${item.占用学位 ||
          ""}</td><td>${item.电脑编号 || ""}</td></tr>`;
          if(index == len ){
            num++
            rtn+='</tbody></table><div class="mybox"><div class="name">现场监督人员签字：</div></div><div class="mybox"><div class="flex50">招生学校盖章：</div><div class="flex50">区教育局招生考试科盖章:</div></div><div class="pagination">第'+num+'页，共'+pagination+'页</div>'
          }else if(index%18==0 ){
            num++
            rtn+='</tbody></table><div class="mybox"><div class="name">现场监督人员签字：</div></div><div class="mybox"><div class="flex50">招生学校盖章：</div><div class="flex50">区教育局招生考试科盖章:</div></div><div class="pagination">第'+num+'页，共'+pagination+'页</div>'+rtns
          }
      }
     return rtn;
    },
    Preview(){
      let len = this.school_current_bmxs ? this.school_current_bmxs.length : 0;
      if (len === 0) {
        this.$alert("请先导入报名学生", "温馨提示");
        return;
      }
      const webview = this.$refs.printWebview;
      // webview.set=10
      // webview.clientWidth=10
      webview.executeJavaScript(
        `document.getElementById('bd').innerHTML ='${this.getPrintHtml()}'`
      );
      this.PreviewShow=true
    },
    closeprinter(){
      this.PreviewShow=false
    }
  },
  created() {
    let that = this;
    this.init_students_current();
    ipc.on("selected-file-xs", function(event, path) {
      if (path.length > 0) {
        try {
          let filePath=path[0]
          let fileName=getFileName(filePath,'\\')
          if(!fileName) fileName=getFileName(filePath,'/')
          if(fileName !== that.school_current.学校名称){
            that.$alert("导入文件名称与当前学校名称不符("+that.school_current.学校名称+")","导入数据失败");
            return;
          }
          let json = excelUtil.importStudentData(filePath);
          let len = json.length;
          if (len === 0) {
            that.$alert("导入数据失败", "导入失败");
            return;
          }
          let el;
          let rtn = new Array();
          for (let j = 0; j < len; j++) {
            el = json[j];
            if (el.姓名) {
              if(el.姓名.indexOf('、'>-1)){
                let newArr=[]
                el.姓名.split('、').forEach(nnn => {
                  newArr.push(getStarName(nnn))
                })
                el.姓名=newArr.join('、')
              }else{
                el.姓名=getStarName(el.姓名)
              }
              rtn.push(el);
            }
          }
          that.update_students_current(rtn);
          that.init_school_current_bmxs(rtn);
          //  DbUtil.importSchoolData(json)
          that.$alert(`共导入${rtn.length}条数据`, "导入成功");
        } catch (error) {
          that.$alert(error, "导入失败", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "./style/drxsmd.scss"
</style>
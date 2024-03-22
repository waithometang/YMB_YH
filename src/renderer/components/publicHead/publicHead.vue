<template>
  <div class="publicHead">
    <div class="head-left"></div>
    <div class="head-right">{{data}} | {{time}}  {{week}}</div>
    <div class="head-event">
      <img class="pointer" @click="shrink" src="../../../../static/images/缩小.png"/>
      <!-- <img v-if="isFullScreen" @click="magnify" src="/static/images/放大.png"/>
      <img v-else @click="magnify" src="/static/images/放大.png"/> -->
      <img class="pointer" @click="close" src="../../../../static/images/关闭.png"/>
      <div></div>
    </div>
  </div>
</template>

<script>
function filZero(numb){
  return numb.toString().padStart(2,'0')
}
const ipc = require('electron').ipcRenderer;

export default {
  data () {
    return {
      week: '',
      time: '',
      data: '',
      isFullScreen: false,
    }
  },
  methods: {
    getTime () {
      let date = new Date()
      this.data = `${filZero(date.getHours())}:${filZero(date.getMinutes())}:${filZero(date.getSeconds()) }`
    },
    getInfo () {
      let date = new Date()
      this.data = `${filZero(date.getHours())}:${filZero(date.getMinutes())}:${filZero(date.getSeconds()) }`
      this.time = `${date.getFullYear()}/${filZero(date.getMonth() + 1)}/${filZero(date.getDate())}`
      switch (date.getDay()) {
        case 1:
          this.week = '星期一'
          break;
        case 2:
          this.week = '星期二'
          break;
        case 3:
          this.week = '星期三'
          break;
        case 4:
          this.week = '星期四'
          break;
        case 5:
          this.week = '星期五'
          break;
        case 6:
          this.week = '星期六'
          break;
        case 7:
          this.week = '星期天'
          break;                                                        
        default:
          break;
      }
    },
    //缩小
    shrink(){
      ipc.send('min');
    },
    //放大
    magnify(){
      ipc.send('fullscreen');
    },
    //关闭
    close(){
      this.$confirm('此操作将退出摇号系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ipc.send('close');
      }).catch(() => {
      });
    },
  },
  created () {
    let that = this
    this.getInfo()
    setInterval(this.getTime,1000)
    ipc.on('on-fullscreen',val=>{
      that.isFullScreen=val
    })
  }
}
</script>

<style lang='scss' scoped>
.publicHead {
  height: 10%;
  background:linear-gradient(90deg,rgba(25,59,193,1),rgba(21,26,64,1));
  display: flex;
  align-items: center;
  position: relative;
  .head-left {
    flex: 0 0 auto;
    width: 60%;
    height: 100%;
    background: url('../../../../static/images/img_21.png') no-repeat;
    background-size: 100% 100%;
  }
  .head-right {
    margin-right: 3.54%;
    font-size:3vh;
    font-weight:400;
    color:rgba(57,214,254,1);
    text-align: center;
  }
  .head-event{
     display: flex;
     width: 10%;
     margin-left: auto;
     justify-content: space-between;
     -webkit-app-region: no-drag;
     align-items: flex-end;
     img{
       width: 12%;
       height: 50%;
     }
  }
}
</style>
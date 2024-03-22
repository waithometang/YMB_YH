import {random,randomilize} from '@/utils/commonUtil'

function filZero(numb,count=2){
  return numb.toString().padStart(count,'0')
}
const state = {
  schools: [],
  schools_yyh: [],
  schools_wyh: [],
  students_current: [],
  school_current_bmxs: [],  //当前抽签学校报名学生
  school_current: '', //当前抽签学校
}

const mutations = {
  update_schools (state,val) {
    val.forEach(el => {
      el.students_zq=[]
    })
    state.schools=val
  },
  update_schools_yyh (state,val) {
    state.schools_yyh=val
  },
  push_schools_yyh (state) {
    state.schools_yyh.push(state.school_current)
  },
  update_schools_wyh (state,val) {
    state.schools_wyh=val
  },
  remove_schools_wyh (state,thisIndex) {
    state.schools_wyh.splice(thisIndex, 1)
  },
  remove_curschools_wyh (state) {
    let thisIndex = state.schools_wyh.indexOf(state.school_current)
    state.schools_wyh.splice(thisIndex, 1)
  },
  update_school_current (state,val) {
    state.school_current=val
  },
  init_school_current (state,val) {
    val.zqsl=0
    val.students_zq=[]
    val.yhjl=[]
    let date = new Date()
    let dataStr = `${filZero(date.getHours())}:${filZero(date.getMinutes())}`
    val.kssj=dataStr
    state.school_current=val
  },
  record_hyjl (state,val) {
    if(!state.school_current.yhjl) state.school_current.yhjl=[]
    state.school_current.yhjl.push(val)
    state.school_current.zqsl+=val.zqsl
  },
  update_students_current (state,val) {
    state.students_current=val
  },
  init_school_current_bmxs (state,val) {
    state.school_current_bmxs=[...val]
    state.school_current.bmry=val.length
    state.school_current.students_zq=[]
  },
  remove_students_current (state,thisIndex) {
    state.students_current.splice(thisIndex, 1)
  },
  removeArr_students_current (state,arr) {
    let i
    arr.forEach(el => {
      i=state.students_current.indexOf(el)
      if(i > -1) state.students_current.splice(i, 1)
    });
  },
  update_students_zq (state,val) {
    state.school_current.students_zq=val
  },
  init_students_current (state,val) {
    state.students_current=[]
    state.school_current_bmxs=[]
  },
  push_students_zq (state,arr) {
    let date = new Date()
    let dataStr = `${filZero(date.getHours())}:${filZero(date.getMinutes())}`
    arr.forEach(el => {
      el.中签时间=dataStr
    });
    if(!state.school_current.students_zq)
      state.school_current.students_zq=arr
    else
      state.school_current.students_zq.push(...arr)
  },
  update_school_ywc (state) {
    state.school_current.ywc=1
    let date = new Date()
    let dataStr = `${filZero(date.getHours())}:${filZero(date.getMinutes())}`
    state.school_current.wcsj=dataStr
    //清空学校中签记录
    // state.school_current.students_zq=[]
  },
  create_students_code (state) {
    let array = state.students_current
    let len = array.length
    let numbArr=new Array()
    for (let j = 0; j < len;) {
      numbArr[j]=++j
    }
    let newnumbArr=randomilize(numbArr)
    if(isRepeat(newnumbArr)){
      alert('打乱数组后存在相同的值')
      console.log(newnumbArr);
      return
    }
    for (let index = 0; index < len; index++) {
      const element = array[index]
      element.电脑编号 = filZero(newnumbArr[index],4)
    }
  },
}


function isRepeat(arr) {
  var hash = {};
  for(var i in arr) {
    if(hash[arr[i]]) {
      return true;
    }
    // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
    hash[arr[i]] = true;
  }
  return false;
}

const actions = {
  initSchoolData ({ commit },schools) {
    commit('update_schools',[...schools])
    commit('update_schools_wyh',[...schools])
    commit('update_schools_yyh',[])
  },
 actionYh({ commit,state },numb){
    let rtnArray =[]
    let obj
    let len=state.students_current.length
    if (len === 0) return null
    if (len === numb) return state.students_current
    if (len < numb) return state.students_current
    for (let index = 0; index < numb; index++) {
        let thisIndex=random(0, len)
        obj=state.students_current[thisIndex]
        if (obj) {
          commit('remove_students_current',thisIndex)
          rtnArray.push(obj)
          len--
        }else{
          console.log('空号:'+thisIndex);
          return null
        }
    }
    commit('push_students_zq',rtnArray)
    // console.log(state.students_zq);
    return rtnArray
},
  finishYh({ commit,state }){
    commit('update_school_ywc')
    commit('remove_curschools_wyh')
    commit('push_schools_yyh')
    commit('update_school_current','')
  }
}

export default {
  state,
  mutations,
  actions
}


import {random} from './commonUtil'
import { mapMutations } from 'vuex'

export function beginYh(source,numb){
    let rtnArray =[]
    let obj
    let remove_students_current=mapMutations(['remove_students_current'])[0]
    let len=source.length
    if (len === 0) return null
    if (len === numb) return source
    if (len < numb) return null
    for (let index = 0; index < numb; index++) {
        let thisIndex=random(0, len)
        let thisOne=source[thisIndex]
        if (thisOne) {
            remove_students_current(thisIndex)
            rtnArray.push(thisOne)
            len--
        }else{
            return null
        }
    }
    return rtnArray
}

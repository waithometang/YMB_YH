
export function random (m,n){
　　return Math.floor(Math.random()*(m - n) + n);
}

export function getRandomOne(source){
    let len=source.length
    if (len === 0) return null
    let thisIndex=random(0, len)
    console.log(thisIndex);
    let thisOne=source[thisIndex]
    return thisOne
}

export function getRandomIndex(source){
    let len=source.length
    if (len === 0) return null
    let thisIndex=random(0, len)
    return thisIndex
}

export function filZero(numb,count=2){
    return numb.toString().padStart(count,'0')
  }

export function popRandomOne(source){
    let len=source.length
    if (len === 0) return null
    let thisIndex=random(0, len)
    console.log(thisIndex);
    let thisOne=source[thisIndex]
    if (thisOne) {
        source.splice(thisIndex,1)
    }
    return thisOne
}

export function getStarName(name){
    if (!name || name.length < 2) {
        return name
    }
    return name.substring(0,1)+'*'+name.substring(2)
}

export function randomilize(arr){
    var length=arr.length;
    var arr1=new Array(); 
    for(var i=0;i<length;i++)
    {
        arr1[i]=i;
    }   //建立数组下标数组
    var arr2=new Array();
    for(var i=0;i<length;i++)
    {
        arr2[i]=arr1.splice(Math.floor(Math.random()*arr1.length),1);
    }  //将数组下标随机打乱
    var arr3=new Array();
    for(var i=0;i<length;i++)
    {
        arr3[i]=arr[arr2[i]];
    }  //将数组按打乱后的下标输出
    return arr3;
}


export function getFileName(file,tag){
    if(!file) return file
    let index=file.lastIndexOf(tag)
    if(index > -1){
        return file.substring(index+1).split('.')[0]
    }else{
        return null
    }
}

//根据报名编号排序
export function sortBmbh(val1,val2){
    if (val1.报名编号 < val2.报名编号)
        return -1
    else
        return 1
}
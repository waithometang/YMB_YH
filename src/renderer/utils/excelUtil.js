import XLSX from 'xlsx'

let util ={}

util.importSchoolData= function(file){
    let workbook
    try {
        workbook=XLSX.readFile(file, {type: 'base64'})
    } catch (error) {
        throw new Error('无法解析该文件，请导入excel文件')
    }
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('无法解析该文件，请导入excel文件')
    }
    let worksheet = workbook.Sheets[workbook.SheetNames[0]]
    let json = XLSX.utils.sheet_to_json(worksheet)
    return json 
}

util.importStudentData= function(file){
    let workbook
    try {
        let lastIndex=file.lastIndexOf('\\')

        workbook=XLSX.readFile(file, {type: 'base64'})
    } catch (error) {
        throw new Error('无法解析该文件，请导入excel文件')
    }
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('无法解析该文件，请导入excel文件')
    }
    let worksheet = workbook.Sheets[workbook.SheetNames[0]]
    let json = XLSX.utils.sheet_to_json(worksheet)
    return json 
}

/* 
merges 数组示例：[{s: {r: 0, c: 0}, e: {r: 1, c: 0}}]
cols   数组示例：[{wpx: 90}]

*/
util.aoaToExcel= function(arr,fileName, merges,cols){
    let sheet = XLSX.utils.aoa_to_sheet(arr)
    if(merges) sheet['!merges']=merges
    if(cols) sheet['!cols']=cols
    // sheet['A1'].s={Alignment:'ALIGN_CENTER'}
    openDownloadDialog(sheet2blob(sheet),fileName+'.xlsx');
}

util.exportToExcel= function(arr,fileName){
    let sheet = XLSX.utils.json_to_sheet(arr)
    openDownloadDialog(sheet2blob(sheet),fileName+'.xlsx');
}


// util.exportTableToExcel= function(table,fileName, options){
//     let sheet = XLSX.utils.table_to_sheet(table,options)
//     openDownloadDialog(sheet2blob(sheet),fileName+'.xlsx');
// }


// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }); // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

export default util
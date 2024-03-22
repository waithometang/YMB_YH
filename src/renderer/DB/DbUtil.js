// let util ={ }
// let SqliteDB = require('./sqlite.js').SqliteDB

// util.initTables= function() {
//     let sqliteDB = new SqliteDB()
//     let createSchoolTableSql = "create table if not exists School(序号 INTEGER, 学校名称 STRING, 招生计划 STRING);"
//     sqliteDB.createTable(createSchoolTableSql);
// }

// util.importSchoolData= function(dataList) {
//     let sqliteDB = new SqliteDB()
//     sqliteDB.executeSql('DELETE FROM School',()=>{
//         let thisData = []
//         dataList = dataList || []
//         dataList.forEach(el => {
//             thisData.push([el.序号,el.学校名称,el.招生计划])
//         })
//         let insertTileSql = "insert into School(序号, 学校名称, 招生计划) values(?, ?, ?)";
//         sqliteDB.insertData(insertTileSql, thisData);
//         sqliteDB.close()
//     });
// }

// util.getSchoolData= function(callback) {
//     let sqliteDB = new SqliteDB()
//     let querySql = 'select * from School'
//     sqliteDB.queryData(querySql, callback);
//     // sqliteDB.close()
// }


// export default util
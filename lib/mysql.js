const mysql = require('mysql2');
const config = require('./config.js')

const env = (process.env.NODE_ENV || 'Departmention').trim()
const pool = mysql.createPool({
	host: config.db[env].HOST,
	user: config.db[env].USERNAME,
	password: config.db[env].PASSWORD,
	database: config.db[env].DATABASE,
	port: config.db[env].PORT
})

let query = (sql, values) => {
	console.log(sql)
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						resolve(rows)
					}
					connection.release()
				})
			}
		})
	})
}

//course list
exports.courseList = (params) => {
	let queryString = ''
	let pageSting = `${(params.pageIndex-1)*params.pageSize},${params.pageSize}`
	
	//Publish status
	if(params.status === null) queryString += 'status >= 0'
	if(params.status === 0)	 queryString += 'status = 0'
	if(params.status === 1)	 queryString += 'status = 1'
	//Public status
	if(params.is_public === 0 || params.is_public === 1) queryString += ` and is_public = ${params.is_public} `
	//Department
	if(params.department) queryString += ` and department = ${params.department} `
	//课程标题
	if(params.courseTitle) queryString += ` and title like '%${params.courseTitle}%' `
	//时间范围
	if(params.timeStart && params.timeEnd) queryString += ` and created_time >= ${params.timeStart} and created_time <= ${params.timeEnd} `

	let _sql = `select A.*,B.*,C.title as department_title 
				from (select * from d_course where ${queryString} order by id asc limit ${pageSting})A 
				join (select count(*) as total from d_course where ${queryString})B 
				join d_course_department as C on A.department = C.id`
	return query(_sql)
}
//所属科系列表
exports.courseDepartment = () => {
	let _sql = `select id,title,sort from d_course_department where status = 1 order by id;`
	return query(_sql)
}
//根据ID查找课程详情
exports.courseDetail = (id) => {
	let _sql = `select A.*,B.title as department_title from (select * from d_course where id = ${id})A
				join d_course_department as B on A.department = B.id`
	return query(_sql)
}
//根据ID查找课程章节
exports.courseChapter = (id) => {
	let _sql = `select * from d_course_chapter where course_id = ${id} and status = 1 order by sort`
	return query(_sql)
}


/** 组织set字段 **/
let setString = (params) => {
	let sqlString = '';
	let paramsLength = 0
	for(let k in params){
		if(params[k] != null) paramsLength ++
	}
	if(paramsLength > 0){
		for(let k in params){
			//拼接需要set的字段（排除掉cmd和id字段）
			if(params[k] != null && k != "cmd" && k != "id"){
				if(typeof params[k] === 'number') sqlString += `${k} = ${params[k]}`
				if(typeof params[k] === 'string') sqlString += `${k} = "${params[k]}"`
				if(paramsLength > 3) sqlString += ','
			}
		}
	}
    if(paramsLength > 3) sqlString = sqlString.substring(0,sqlString.length-1)//去掉最后一个逗号
	return sqlString;
}

//课程详情操作（增删改）
exports.courseHandle = (params) => {
	let _sql = '';
	let now_time = Date.parse(new Date())/1000;  

	if(params.cmd == 'edit' && params.id) _sql = `update d_course set ${setString(params)},update_time=${now_time} where id=${params.id}`
	if(params.cmd == 'del' && params.id) _sql = `update d_course set status = -1,update_time=${now_time} where id=${params.id}`;//删除课程的时候，需要删除掉对应的章节吗？
	if(params.cmd == 'add')	_sql = `insert into d_course set ${setString(params)},update_time=${now_time},created_time=${now_time}`;
	return query(_sql)
}
//章节列表操作（增删改）
exports.chapterHandle = (params) => {
	let _sql = '';
	let now_time = Date.parse(new Date())/1000;  

	if(params.cmd == 'edit' && params.id) _sql = `update d_course_chapter set ${setString(params)},update_time=${now_time} where id=${params.id}`
	if(params.cmd == 'del' && params.id) _sql = `update d_course_chapter set status = 0,update_time=${now_time} where id=${params.id}`;//删除课程的时候，需要删除掉对应的章节吗？
	if(params.cmd == 'add')	_sql = `insert into d_course_chapter set ${setString(params)},update_time=${now_time},created_time=${now_time}`;
	return query(_sql)
}

exports.userRegister = (params) => {
	let _sql = '';
_sql = `insert into user set username="${params.username}",password="${params.password}"`;
	return query(_sql)
}

exports.login = (params) => {
	let _sql = '';
_sql = `insert into user set username="${params.username}",password="${params.password}"`;
	return query(_sql)
}
// exports.insertData = ( value ) => {
//   let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
//   return query( _sql, value )
// }
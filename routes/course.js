const router = require('koa-router')();
const course = require('../lib/mysql.js')

// Course list
router.get('/course/list', async (ctx, next) => {

    /**check length start**/
	let pageSize    =   parseInt(ctx.query.pageSize) || 10
	let pageIndex   =   parseInt(ctx.query.pageIndex) || 1
	let timeStart   =   parseInt(ctx.query.timeStart) || null;
	let timeEnd     =   parseInt(ctx.query.timeEnd) || null;
	let courseTitle =   ctx.query.courseTitle ? (ctx.query.courseTitle).toString() : ''
	let status      =   ctx.query.status >= 0 ? parseInt(ctx.query.status) : null
	let is_public   =    ctx.query.is_public >= 0 ? parseInt(ctx.query.is_public) : null
	let department_id  =   parseInt(ctx.query.department_id) || null
	/**check length end**/

    let params = { pageSize,pageIndex,courseTitle,timeStart,timeEnd,is_public,status,department_id }
    let ctxBoy = {ret:-1,msg:'',data:[],total:0}

    a= 1
    if(pageSize > 100 ) {
        ctxBoy.msg = 'Search quantity too much！'
        ctx.body = ctxBoy
        return
    }
    
    await course.courseList(params).then(result => {
        if(result.length > 0){
            ctxBoy.total = result[0].total;//total quantity
            for(let k in result){
                let key = result[k];
                if(key.total){
                    delete key.total;
                }
                key.uID = a++
                console.log(key)
                ctxBoy.data.push(key)
            }
        }
        ctxBoy.ret = 0;
    }).catch(err => {
        console.log("/course/list catch error：",err)
        ctxBoy.ret = -1;
        ctxBoy.msg = "catch err";
    })
    ctx.body = ctxBoy
})
// course list
router.get('/course/department', async (ctx, next) => {
    let ctxBoy = {ret:-1,msg:'',data:[],total:0}
    await course.courseDepartment().then(result => {
        a = 1
        if(result.length > 0){
            ctxBoy.data = result;
        }
        ctxBoy.ret = 0;
    }).catch(err => {
        console.log("/course/department catch error：",err)
        ctxBoy.ret = -1;
        ctxBoy.msg = "catch err";
    })
    ctx.body = ctxBoy
})
// search detail and chapter with course id
router.get('/course/detail/:id', async (ctx, next) => {
    let id = parseInt(ctx.params.id) || 0;
    if(!id) return false;

    let ctxBoy = {ret:-1,msg:'',data:{}}
    await course.courseDetail(id).then(result => {
        if(result.length > 0){
            ctxBoy.data = result[0];
            ctxBoy.data.chapters = []
        }
        ctxBoy.ret = 0;
    }).catch(err => {
        console.log("/course/detail catch error：",err)
        ctxBoy.ret = -1;
        ctxBoy.msg = "catch err";
    })
    if(ctxBoy.data.length != 0){
        await course.courseChapter(id).then(result => {
            if(result.length > 0){
                ctxBoy.data.chapters = result;
            }
        }).catch(err => {
            console.log("/course/detail catch error：",err)
        })
    }
    ctx.body = ctxBoy
})
//Register
router.post('/course/register', async (ctx, next) => {
    let ctxBoy = {ret:-1,msg:'error'}
        /**check length start**/
        let cmd   = ctx.request.body.cmd;
        let id              =parseInt(ctx.request.body.id) || null
        let username      = ctx.request.body.username || null
        let password    =   ctx.request.body.password || null
        /**check length end**/

        let registerParams = {cmd,id,username,password}
        console.log(registerParams)
        await course.userRegister(registerParams).then(result => {
            ctxBoy.ret = 0;
            ctxBoy.msg = 'ok';
            if(result.insertId) ctxBoy.insertId = result.insertId
        }).catch(err => {
            console.log("/course/register catch error：",err)
            ctxBoy.ret = -1;
            ctxBoy.msg = "catch err";
        })
    ctx.body = ctxBoy
})

//login
router.get('/course/login', async (ctx, next) => {

    /**check length start**/
	let username    =   ctx.query.username
	let password   =   ctx.query.password
	/**check length end**/

    let params = { username,password}
    let ctxBoy = {ret:-1,msg:'',data:[]}
    
    await course.login(params).then(result => {
        if(result.length > 0){
            for(let k in result){
                let key = result[k];
                console.log(key)
                ctxBoy.data.push(key)
            }
        }
        ctxBoy.ret = 0;
    }).catch(err => {
        console.log("/course/list catch error：",err)
        ctxBoy.ret = -1;
        ctxBoy.msg = "catch err";
    })
    ctx.body = ctxBoy
})
// edit course detail
router.post('/course/detail', async (ctx, next) => {
    let ctxBoy = {ret:-1,msg:'error'}
    let cmd   = ctx.request.body.cmd;
    if(cmd == 'edit' || cmd == 'del' || cmd == 'add'){

        /**check length start**/
        let id              =   parseInt(ctx.request.body.id) || null
        let department      =   parseInt(ctx.request.body.department) || null
        console.log(ctx.request.body.status)
        let status          =   ctx.request.body.status >= 0 ? parseInt(ctx.request.body.status) : null
        let is_public       =   ctx.request.body.is_public >= 0 ? parseInt(ctx.request.body.is_public) : null
        let cover           =   ctx.request.body.cover || null
        let title           =   ctx.request.body.title || null
        let introduction    =   ctx.request.body.introduction || null
        /**check length end**/

        let courseParams = {cmd,id,department,status,is_public,cover,title,introduction}
        console.log(courseParams)
        await course.courseHandle(courseParams).then(result => {
            ctxBoy.ret = 0;
            ctxBoy.msg = 'ok';
            if(cmd == 'add' && result.insertId) ctxBoy.insertId = result.insertId
        }).catch(err => {
            console.log("/course/detail catch error：",err)
            ctxBoy.ret = -1;
            ctxBoy.msg = "catch err";
        })
    }
    ctx.body = ctxBoy
})
// edit chapter
router.post('/course/chapters', async (ctx, next) => {
    let ctxBoy = {ret:-1,msg:'error'}
    let cmd   = ctx.request.body.cmd;
    if(cmd == 'edit' || cmd == 'del' || cmd == 'add'){

        /**check length start**/
        let id          =   parseInt(ctx.request.body.id) || null
        let course_id   =   parseInt(ctx.request.body.course_id) || null
        let sort        =   parseInt(ctx.request.body.sort) || null
        let status      =   parseInt(ctx.request.body.status) || null
        let title       =   ctx.request.body.title || null
        let video_link  =   ctx.request.body.video_link || null
        /**check length end**/

        let chaptersParams = {cmd,id,course_id,sort,status,title,video_link}
        await course.chapterHandle(chaptersParams).then(result => {
            ctxBoy.ret = 0;
            ctxBoy.msg = 'ok';
            if(cmd == 'add' && result.insertId) ctxBoy.insertId = result.insertId
        }).catch(err => {
            console.log("/course/detail catch error：",err)
            ctxBoy.ret = -1;
            ctxBoy.msg = "catch err";
        })
    }
    ctx.body = ctxBoy
})

module.exports = router
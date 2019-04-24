<template>
	<div class="course clear">
		<!--Search Toolbar start -->
		<div class="search clear pd20">
			<div class="search_item">Created ：
				<el-date-picker  v-model="search.timeRange"  type="datetimerange"  range-separator="to"  start-placeholder="Start Date"  end-placeholder="End Date" value-format="timestamp"></el-date-picker>
			</div>
			<div class="search_item">Course ：
				<el-input placeholder="Course Title" v-model="search.courseTitle" clearable style="width:300px"></el-input>
			</div>
			<div class="search_item">Department ：
				<el-select v-model="search.department" placeholder="Choose" style="width:200px">
					<el-option v-for="item in departmentOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
				</el-select>
			</div>
			<div class="search_item">status ：
				<el-select v-model="search.status" placeholder="Choose" style="width:200px">
					<el-option v-for="item in statusOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
				</el-select>
			</div>
			<div class="search_item">public ：
				<el-select v-model="search.is_public" placeholder="Choose" style="width:200px">
					<el-option v-for="item in publicOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
				</el-select>
			</div>
			<el-button type="primary" icon="el-icon-search" class="search_btn" @click="searchCourse">Search</el-button>
		</div>
		<!-- Search Toolbar end -->

		<!-- Edit Toolbar start -->
		<div class="tools clear pd20">
			<el-button type="primary" icon="el-icon-plus" size="mini" @click="addCourse">Create</el-button>
			<el-button type="danger" icon="el-icon-delete" size="mini" @click="delCourse" v-if="multipleSelection.length > 0">Delete</el-button>
			<el-button type="primary" icon="el-icon-check" size="mini" @click="setCourseStatus(true)"  v-if="multipleSelection.length > 0">Publish</el-button>
			<el-button type="danger" icon="el-icon-close" size="mini" @click="setCourseStatus(false)"  v-if="multipleSelection.length > 0">Stop Publish</el-button>
		</div>
		<!-- Edit Toolbar end -->

		<!-- Course List start -->
		<el-table ref="multipleTable" :data="courseDatas" tooltip-effect="dark" style="width: 100%;min-height: 630px;" border
			@cell-click="cellClick"  @selection-change="selectionChange">
				<el-table-column type="selection" width="50" align="center"></el-table-column>
				<!--<el-table-column label="ID" width="100" prop="id" align="center"></el-table-column> -->
				<el-table-column label="ID" width="100" prop="uID" align="center"></el-table-column>
				<el-table-column label="Department" width="140" prop="department_title" align="center" 
					:filters="departmentOptions" :filter-method="filterDepartmentTitle" filter-placement="bottom-end">
				</el-table-column>
				<el-table-column label="Course" width="400" align="center" show-overflow-tooltip>
					<template slot-scope="scope"><span style="color:#409EFF">{{ scope.row.title}}</span></template>
				</el-table-column>
				<el-table-column label="Publish" width="100" align="center" prop="status"
					:filters="statusOptions" :filter-method="filterStatus" filter-placement="bottom-end">
					<template slot-scope="scope">{{ scope.row.status === 1 ? 'Publish' :'unPublish'}}</template>	
				</el-table-column>
				<el-table-column label="Public" width="100" align="center" prop="is_public"
					:filters="publicOptions" :filter-method="filterPublic" filter-placement="bottom-end">
					<template slot-scope="scope">{{ scope.row.is_public === 1 ? 'Public' :'Unpublic'}}</template>	
				</el-table-column>
				<el-table-column label="Created" width="200" align="center">
					<template slot-scope="scope">{{ formatDateTime(scope.row.created_time)}}</template>	
				</el-table-column>
				<el-table-column label="" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button @click.native.prevent="openCourseDialog(scope.$index, courseDatas)" type="text" size="small">Edit</el-button>
					</template>
				</el-table-column>
		</el-table>
		<el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange"  :current-page="pageConfig.pageIndex" class="pd20"
      		:page-sizes="[10, 20, 50, 100]" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.pageTotal">
		</el-pagination>
		<!-- Course List end -->

		<!-- Check Course Information start -->
		<el-dialog :visible.sync="dialogVisibleShow" :fullscreen="true" class="dialog">
			<div class="dialog_section">
				<h3>Basic Information</h3>
				<div class="dialog_list">
					<div class="section_item">
						<div class="section_item_name">Department</div>
						<div class="section_item_content">{{ courseDetail.department_title }}</div>
					</div>
					<div class="section_item section_item_desc">
						<div class="section_item_name" :style="{'height':course_desc_height}">Introduction</div>
						<div class="section_item_content" id="course_desc" ref="course_desc">{{ courseDetail.introduction }}</div>
					</div>
					<div class="section_item section_item_image">
						<div class="section_item_name">Cover</div>
						<div class="section_item_content" style="color:blue"><img :src="courseDetail.cover"> </div>
					</div>
					<div class="section_item">
						<div class="section_item_name">Public</div>
						<div class="section_item_content" style="color:red">
							<span v-for="(item,index) in publicOptions" v-if="item.value == courseDetail.is_public" :key="index">{{ item.text }}</span>
						</div>
					</div>
					<div class="section_item">
						<div class="section_item_name">Publish</div>
						<div class="section_item_content" style="color:red">
							<span v-for="(item,index) in statusOptions" v-if="item.value == courseDetail.status" :key="index">{{ item.text }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="dialog_section" v-for="(item,index) in courseDetail.chapters" :key="index">
				<h3>Details：Chapter {{index+1}}</h3>
				<div class="dialog_list" >
					<div class="section_item">
						<div class="section_item_name">Title</div>
						<div class="section_item_content" style="color:red">{{item.title}}</div>
					</div>
					<div class="section_item">
						<div class="section_item_name">Url</div>
						<div class="section_item_content" style="color:blue">{{item.video_link}}</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- Check Course Information end -->

		<!-- Edit / Create Course start -->
		<el-dialog :visible.sync="dialogVisibleEdit" :fullscreen="true" class="dialog editDialog">
			<el-form :model="courseDetail" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<div class="dialog_section">
					<h3>Basic Information</h3>
					<div class="editDialogBtn">
						<el-button type="success" @click="submitForm('ruleForm')" size="mini" icon="el-icon-check">Save</el-button>
						<el-button @click="dialogVisibleEdit = false" size="mini" icon="el-icon-back">Return</el-button>
					</div>
					<el-form-item label="Department" prop="department_title" >
						<el-select v-model="courseDetail.department_title" placeholder="Please Choose Department">
							<el-option v-for="(item,index) in departmentOptions" v-if="item.value != 0" :key="index" :label="item.text" :value="item.text"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Course" prop="title">
						<el-input v-model="courseDetail.title" placeholder="Course Name or Title"></el-input>
					</el-form-item>
					<el-form-item label="introduction" prop="introduction">
						<el-input type="textarea" v-model="courseDetail.introduction" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Course Introduction"></el-input>
					</el-form-item>
					<el-form-item label="Cover Url" prop="cover">
						<el-input v-model="courseDetail.cover" placeholder="Cover Url"></el-input>
					</el-form-item>
					<el-form-item label="Public" prop="is_public">
						<el-radio-group v-model="courseDetail.is_public">
							<el-radio v-for="(item,index) in publicOptions"  v-if="item.value != -1" :key="index" :label="item.value">{{item.text}}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="Publish" prop="status">
						<el-radio-group v-model="courseDetail.status">
							<el-radio v-for="(item,index) in statusOptions"  v-if="item.value != -1" :key="index" :label="item.value">{{item.text}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div v-for="(item, index) in courseDetail.chapters" :key="index" class="dialog_section" v-if="item.status">
					<h3>Detail：Chapter {{index+1}}</h3>
					<div class="editDialogBtn">
						<el-button type="primary" size="mini" icon="el-icon-sort-up" v-if="index != 0"  @click.prevent="moveChapter(item,'up')">UP</el-button>
						<el-button type="primary" size="mini" icon="el-icon-sort-down" v-if="index != courseDetail.chapters.length-1" @click.prevent="moveChapter(item,'down')">DOWN</el-button>
						<el-button type="warning" icon="el-icon-delete" size="mini" @click.prevent="removeChapter(item)">DELETE</el-button>
					</div>
					<el-form-item label="Title" :prop="'chapters.' + index + '.title'"
						:rules="[{ required: true, message: 'Please fill Title', trigger: 'blur' },{ min: 1, max: 100, message: 'Title length only below 100 words', trigger: 'blur' }]">
						<el-input v-model="item.title"></el-input>
					</el-form-item>
					<el-form-item label="Urls" :prop="'chapters.' + index + '.video_link'"
						:rules="[{ required: true, message: 'Please fill Url', trigger: 'blur' },{ min: 1, max: 100, message: 'Url length only below 100 char', trigger: 'blur' }]">
						<el-input v-model="item.video_link"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div style="text-align: center;margin-bottom:100px">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="addChapter">Insert</el-button>
			</div>
		</el-dialog>
		<!-- Edit / Create Course end -->
	</div>
</template>
<script>
export default {
	data() {
		return {
			search:{
				timeRange:[],
				courseTitle:'',
				is_public:-1,
				status:-1,
				department:0
			},
			departmentOptions: [],
			statusOptions:[{ text: 'All', value: -1 },{ text: 'Pulish', value: 1 }, { text: 'unPulish', value: 0 }],
			publicOptions:[{ text: 'All', value: -1 },{ text: 'Public', value: 1 }, { text: 'unPublic', value: 0 }],
			courseDatas: [],
			multipleSelection: [],
			courseDetail:{},
			courseDetailBefore:{},
			dialogVisibleShow:false,
			dialogVisibleEdit:false,
			rules: {
				department_title: [{required: true, message: 'Please choose Department', trigger: 'change' }],
				title: [{ required: true, message: 'Please fill Title', trigger: 'blur' },{ min: 1, max: 100, message: 'Length below 100 Character', trigger: 'blur' }],
				introduction: [{ required: true, message: 'Please fill Introduction', trigger: 'blur' }],
				cover: [{ required: true, message: 'Please fill cover Url', trigger: 'blur' }],
				is_public: [{ required: true, message: 'Please choose Public Status', trigger: 'change' }],
				status: [{ required: true, message: 'Please choose Publish Status', trigger: 'change' }],
			},
			course_desc_height:'',
			pageConfig:{
				pageIndex:1,
				pageTotal:0,
				pageSize:10,
			},
			courseCMD:'',
			createCourseId:0,//Create new course id
		};
	},
	created() {
		this.getDepartment()
		this.getCourseData();
	},
	mounted () {
		
	},
	methods: {
		getDepartment(){
			let that = this;
			this.$axios.get("course/department").then(function (response) {
				if(response.data.ret === 0 ){
					let datas = response.data.data;
					let departmentOptions = [{value: 0,text: 'All'}]
					for(let k in datas){
						departmentOptions.push({
							value:datas[k].id,
							text:datas[k].title,
						})
					}
					that.departmentOptions = departmentOptions;
				}else{
					that.$message.error('Error:'+ response.data.msg)
				}
			})
		},
		getCourseData() {
			let that = this;
			//Search command
			let url = "course/list?pageSize=" + that.pageConfig.pageSize + "&pageIndex=" + that.pageConfig.pageIndex;
			if(this.search.courseTitle) url += '&courseTitle=' + this.search.courseTitle;

			let timeRange = this.search.timeRange;
			if(timeRange && timeRange.length > 0){
				if(timeRange[0]) url += '&timeStart=' + this.search.timeRange[0]; 
				if(timeRange[1]) url += '&timeEnd=' + this.search.timeRange[1];
			}

			if(this.search.is_public != -1)  url += '&is_public=' + this.search.is_public
			if(this.search.status != -1)  url += '&status=' + this.search.status
			if(this.search.department)  url += '&department=' + this.search.department

			this.$axios.get(url).then(function (response) {
				if(response.data.ret === 0 ){
					that.courseDatas = response.data.data;
					that.pageConfig.pageTotal = response.data.total;
				}else{
					that.$message.error('Error:'+ response.data.msg)
				}
			})
		},
		getChapters(id){
			let that = this;
			this.$axios.get("course/detail/" + id).then(function (response) {
				if(response.data.ret === 0 ){
					let datas = response.data.data
					that.courseDetail = datas
					that.courseDetailBefore = JSON.parse(JSON.stringify(datas))
				}else{
					that.$message.error('Error:'+ response.data.msg)
				}
			})
		},
		searchCourse(){
			let timeRange = this.search.timeRange;
			if(timeRange && timeRange.length > 0){
				this.search.timeRange[0] = (timeRange[0] + '').length == 13 ? timeRange[0]/1000 : timeRange[0];
				this.search.timeRange[1] = (timeRange[1] + '').length == 13 ? timeRange[1]/1000 : timeRange[0];
			}
			this.getCourseData()
		},
		submitForm(ruleName) {
			this.$refs[ruleName].validate((valid) => {
				if (valid) {
					console.log('submit!');
					this.checkOptions()
				} else {
					return false;
				}
			});
		},
		checkOptions(){
			let newParams = {chapters:[]}
			let a = this.courseDetail;
			let b = this.courseDetailBefore;
			// Check Course Edit
			if(a.department_title != b.department_title){
				for(let k in this.departmentOptions){
					if(this.departmentOptions[k].text == a.department_title){
						newParams['department'] = this.departmentOptions[k].value
						break
					}
				}
			}
			if(a.cover != b.cover) newParams['cover'] = a.cover
			if(a.introduction != b.introduction) newParams['introduction'] = a.introduction
			if(a.title != b.title) newParams['title'] = a.title
			if(a.status != b.status) newParams['status'] = a.status
			else newParams['status'] = a.status
			if(a.is_public != b.is_public) newParams['is_public'] = a.is_public
			else newParams['is_public'] = a.is_public
			//Check chapter Edit
			for(let k in a.chapters){
				let key = a.chapters[k]
				for(let i in b.chapters){
					let item = b.chapters[i]
					//Edit update
					if(key.id == item.id){
						let params = {}
						if(key.title != item.title) params.title = key.title
						if(key.video_link != item.video_link) params.video_link = key.video_link
						if(key.sort != item.sort) params.sort = key.sort
						if(JSON.stringify(params) != '{}'){
							params.id = key.id
							params.cmd = 'edit'
							newParams.chapters.push(params)
						}
					}
				}
				//New/Delete
				if(key.cmd && key.cmd == 'add') newParams.chapters.push({"cmd":key.cmd,"sort":key.sort,"title":key.title,"video_link":key.video_link,"course_id":key.course_id,"status":1})
				if(key.cmd && key.cmd == 'del') newParams.chapters.push({"id":key.id,"cmd":key.cmd})
			}
			this.setCourse(newParams,a.id)
		},
		setCourse(newParams,id){
			console.log(newParams)
			let that = this;
			let params = { cmd : that.courseCMD }
			if(id) params.id = id
			if(newParams.status >= 0) params.status = newParams.status
			if(newParams.is_public >= 0) params.is_public = newParams.is_public
			if(newParams.cover) params.cover = newParams.cover
			if(newParams.title) params.title = newParams.title
			if(newParams.introduction) params.introduction = newParams.introduction
			if(newParams.department) params.department = newParams.department

			// Edit/Delete id and cmd require. course length mush more than 2 
			let courseLength = 0
			for(let k in params){
				courseLength ++
			}
			let chapters = newParams.chapters
			//Edit Course
			if(courseLength >= 2){
				that.$axios.post("course/detail", params ).then(function (response) {
					if(response.data.ret == 0 ){
						// create new chapter id
						if(response.data.insertId &&  that.courseCMD == 'add'){
							for(let k in chapters){
								let key = chapters[k]
								key.course_id = response.data.insertId
								that.setChapters(key)
							}
						}
					}else{
						that.$message.error('Error:'+ response.data.msg)
					}
					that.handleSucess()
				}).catch(function (error) {
					//that.$message.error('request Error!')
				});
			}
			//Chapter edit
			if(chapters && chapters.length > 0){
				for(let k in chapters){
					let key = chapters[k]
					that.setChapters(key)
				}
			}
		},
		setChapters(parmas){
			let that = this;
			that.$axios.post("course/chapters", parmas ).then(function (response) {
				if(response.data.ret == 0){
					that.handleSucess()
				}else{
					that.$message.error('Error:'+ response.data.msg)
				}
			})
		},
		handleSucess(){
			this.$message({message: 'Success！',type: 'success'})
			this.getCourseData()
			this.dialogVisibleEdit = false
		},
		toggleSelection(rows) {
			if (rows) {
			rows.forEach(row => {
				this.$refs.multipleTable.toggleRowSelection(row);
			});
			} else {
			this.$refs.multipleTable.clearSelection();
			}
		},
		selectionChange(val) {
			this.multipleSelection = val;
		},
		cellClick(row, column, cell, event){
			if(column.label == 'Course'){
				this.getChapters(row.id)
				this.dialogVisibleShow = true;
				let that = this;
				that.$nextTick(() => {
					//Introduction dynamic Height
					var height= that.$refs.course_desc.offsetHeight || 40;
					that.course_desc_height = height > 40 ? height : 40 +'px';
				})
			}
		},
		openCourseDialog(index, rows) {
			this.courseCMD = 'edit'
			this.getChapters(rows[index].id)
			this.dialogVisibleEdit = true;
		},
		delCourse() {
			this.courseCMD = 'del';
			this.$confirm('This will delete all checked courses', 'Warning', {
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				if(this.multipleSelection.length > 0){
					for(let k in this.multipleSelection){
						let key = this.multipleSelection[k]
						this.setCourse({},key.id)
					}
				}
			})
		},
		setCourseStatus(type) {
			this.courseCMD = 'edit'
			let text = type ? 'This will Publish all checked courses' :'This will unPublish all checked courses'
			this.$confirm(text, 'Notice', {
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				if(this.multipleSelection.length > 0){
					for(let k in this.multipleSelection){
						let key = this.multipleSelection[k]
						this.setCourse({"status":type ? 1:0},key.id)
					}
				}
			})
		},
		addCourse(index, rows) {
			let newDetail = {
				department_title:'',
				title:'',
				introduction:'',
				cover:'',
				status:0,
				is_public:0,
				chapters:[]
			}
			this.courseDetail = newDetail
			this.courseDetailBefore = JSON.parse(JSON.stringify(newDetail))
			this.dialogVisibleEdit = true;
			this.courseCMD = 'add'
		},
		addChapter(){
			this.setChapterSort()
			let len = this.courseDetail.chapters.length + 1
			let params = {title:'',video_link:'',cmd:'add',sort:len,course_id:this.courseDetail.id,status:1}
			if(this.courseCMD == 'add') params.id = len
			this.courseDetail.chapters.push(params)
		},
		removeChapter(item) {
			let chapters = this.courseDetail.chapters
			for(let k in chapters){
				if(chapters[k].id == item.id){
					chapters[k].status = 0
					chapters[k].cmd = 'del'
					break
				}
			}
			this.setChapterSort()
      	},
		//Chapter sort function
		setChapterSort(){
			let chapters = this.courseDetail.chapters;
			if(chapters.length > 0){
				for(let k in chapters){
					this.courseDetail.chapters[k].sort = parseInt(k)+1
				}
			}
		},
		moveChapter(item,type) {
			//moving with next tittle、url
			let chapters = this.courseDetail.chapters
			for(let k in chapters){
				let key = chapters[k];
				if(key.id == item.id){
					let side = 0
					if(type == 'down' && k != chapters.length){
						side = parseInt(k)+1
					}
					if(type == 'up' && k != 0){
						side = parseInt(k)-1
					}
					let curKey = JSON.parse(JSON.stringify(key))
					// this.courseDetail.chapters[k].sort =  chapters[side].sort
					this.courseDetail.chapters[k].title =  chapters[side].title
					this.courseDetail.chapters[k].video_link =  chapters[side].video_link

					// this.courseDetail.chapters[side].sort = curKey.sort
					this.courseDetail.chapters[side].title = curKey.title
					this.courseDetail.chapters[side].video_link = curKey.video_link
					break
				}
			}
      	},
		handleSizeChange(val) {
			this.pageConfig.pageIndex = 1;
			this.pageConfig.pageSize = val;
			this.getCourseData()
		},
		handleCurrentChange(val) {
			this.pageConfig.pageIndex = val;
			this.getCourseData()
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		filterDepartmentTitle(value, row) {
			return row.department_title === value;
		},
		filterStatus(value, row) {
			return row.status === value;
		},
		filterPublic(value, row) {
			return row.is_public === value;
		},
		formatDateTime(time) {
			if((time + '').length == 10) time = time*1000;
			let date = new Date(time), y = date.getFullYear(),m = date.getMonth() + 1,d = date.getDate(),
				h = date.getHours(),minute = date.getMinutes(),second = date.getSeconds()
			m = m < 10 ? ('0' + m) : m;
			d = d < 10 ? ('0' + d) : d;
			h = h < 10 ? ('0' + h) : h;
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
		},
	},
}
</script>
<style scoped>
	.clear{
		overflow: hidden;
		clear: both;
	}
	.course{
		width: 1180px;
		padding: 0 20px;
		font-size: 14px;
		border: 1px solid #eee;
	}
	.pd20{
		padding: 20px 0;
	}
	.search .search_item,.search .search_btn{
		float: left;
		margin-right: 26px;
		margin-bottom: 20px;
	}
	.search .el-input{
		font-size: 14px;
		width:200px;
		display: inline-block;
	}
	.tools button{
		float: left;
	}
	.dialog{
		text-align: left;
		color: #606266;
		font-size: 14px;
	}
	.dialog .dialog_section{
		position: relative;
		width: 800px;
		margin: 0 auto 50px auto;
	}
	.dialog .dialog_section h3{
		margin: 0;
		height: 20px;
		margin-bottom: 10px;
	}
	.dialog .dialog_section .dialog_list{
		padding: 10px;
		border: 1px solid #eaeefb;
	}
	.dialog .dialog_section .section_item{
		height: 40px;
		border-bottom: 2px solid #fff;
	}
	.dialog .dialog_section .section_item_image{
		height: auto;
	}
	img{
	max-width:50%;
	max-height:50%;
	}

	.dialog .dialog_section .section_item > div{
		vertical-align: top;
		height: inherit;
		line-height: 40px;
		display: inline-block;
	}
	.dialog .dialog_section .section_item .section_item_name{
		width:80px;
		text-align: center;
		background-color: #eff8ff;
	}
	.dialog .dialog_section .section_item .section_item_content{
		width: 680px;
		overflow: hidden;
	}
	.dialog .dialog_section .section_item_desc{
		height: auto;
	}
	.dialog .dialog_section .section_item_desc{
		line-height: 20px;
		height: auto;
	}
	.editDialog .dialog_section .section_item > div{
		vertical-align: middle;
	}
	.editDialog .input{
		width: 800px!important
	}
	.editDialog .editDialogBtn{
		position: absolute;
		top: -8px;
		right: 0;
	}
</style>

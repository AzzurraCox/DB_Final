<template>
<div>
<!-- Login start -->
  <div class="login clear">
    <el-form class="form-signin" label-width="100px" @submit.prevent="login" :rules="rules" ref="ruleForm">
      <h2 class="form-signin-heading">Please sign in</h2>

      <el-form-item label="Username">
      <el-input v-model="username" class="form-control" placeholder="Username" required autofocus></el-input>
      </el-form-item>
      
      <el-form-item label="Password" class="sr-only">
      <el-input v-model="password" type="password" class="form-control" placeholder="Password"></el-input>
      </el-form-item>
      
      <div style="text-align: right;margin-bottom:50px">
        <el-button type="primary" @click="userRegister">Register</el-button>
				<el-button type="primary" @click="login">Sign in</el-button>
			</div>
    </el-form>
  </div>
   <!-- Login end -->

   <!-- register start -->
		<el-dialog :visible.sync="dialogVisibleEdit" :fullscreen="true" class="dialog editDialog">
			<el-form :model="userDetail" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<div class="dialog_section">
					<h3>Register</h3>
					<el-form-item label="Username" prop="user">
						<el-input v-model="userDetail.user" placeholder="Username"></el-input>
					</el-form-item>
					<el-form-item label="Password" prop="pass">
						<el-input type="password" v-model="userDetail.pass" placeholder="Password"></el-input>
					</el-form-item>
				</div>
        <div class="editDialogBtn">
						<el-button type="success" @click="submitForm('ruleForm')" size="mini" icon="el-icon-check">Register</el-button>
						<el-button @click="dialogVisibleEdit = false" size="mini" icon="el-icon-back">Return</el-button>
					</div>
			</el-form>
		</el-dialog>
		<!-- register end -->
</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      error: false,
      rules: {
				user: [{ required: true, message: 'Please fill Username', trigger: 'blur' },{ min: 6, message: 'Length more than 6 Character', trigger: 'blur' }],
				pass: [{ required: true, message: 'Please fill Password', trigger: 'blur' },{ min: 6, message: 'Length more than 6 Character', trigger: 'blur' }],
			},
      dialogVisibleEdit:false,
      userDetail:{}
    }
  },
  methods: {
    login () {
      this.$router.push('/Course')
    },
    userRegister () {
      this.dialogVisibleEdit = true;
    },
    submitForm (ruleName) {
			this.$refs[ruleName].validate((valid) => {
				if (valid) {
					console.log('submit!');
					this.checkOptions()
				} else {
					return false;
				}
			});
    },
    checkOptions() {
      this.userDetail['cmd'] = 'add'
      this.userDetail['username'] = this.userDetail.user
      this.userDetail['password'] = this.userDetail.pass

      this.$axios.post("course/register", this.userDetail).then(function (response) {
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
					that.$message.error('request Error!')
				});
        },
        handleSucess(){
			this.$message({message: 'Success！',type: 'success'})
			this.getCourseData()
			this.dialogVisibleEdit = false
		}
  }
}
</script>

<style lang="css">

.clear{
		overflow: hidden;
		clear: both;
	}
.login{
        margin-top: 20px;
		padding: 20px 40px;
		font-size: 14px;
		border: 1px solid #eee;
	}

.form-signin-heading{
    font-size:30px;
}

.dialog .dialog_section{
		position: relative;
		width: 300px;
		margin: 0 auto 50px auto;
	}

  .dialog .dialog_section h3{
		margin: 0;
		height: 20px;
		margin-bottom: 30px;
    font-size:30px;
	}

.el-form-item {
    margin-bottom: 22px;
}
</style>
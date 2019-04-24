<template>
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
				<el-button type="primary">Sign in</el-button>
			</div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      console.log(this.username)
      console.log(this.password)
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



.el-form-item {
    margin-bottom: 22px;
}
</style>
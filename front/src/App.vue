<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
  	name: "App",
	//updated () {
    //	if (!localStorage.token && this.$route.path !== '/') {
    //		this.$router.push('/?redirect=' + this.$route.path)
   // }
  //}
}
</script>

<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
	display: flex;
	justify-content: center;
}
/* Loading and Dialog level */
.el-loading-mask.is-fullscreen {
  	z-index: 3000 !important;
}
.el-dialog__wrapper {
  	z-index: 2999 !important;
}
</style>

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
import { Loading, Message} from 'element-ui'

// route
const mAxios = axios.create({
  timeout: 10 * 1000,
  baseURL: process.env.NODE_ENV == "development" ? 'http://localhost:3000/' : '/',//domain
})

var loadinginstace
// http request interceptor
mAxios.interceptors.request.use(config => {
	loadinginstace = Loading.service({
		fullscreen: true
	})
  	return config
}, error => {
	loadinginstace.close()
	Message.error({ message: 'Loading Timeout'})
	return Promise.reject(error)
})
// http response interceptor
mAxios.interceptors.response.use(data => {
	loadinginstace.close()
	return data
}, error => {
	loadinginstace.close()
	Message.error({message: 'Loading Fail'})
	return Promise.reject(error)
})

Vue.prototype.$axios = mAxios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

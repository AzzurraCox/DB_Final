const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const cors = require('koa2-cors');
const Router = require('koa-router');
const http = require('http');
const router = new Router();

onerror(app)//initial parameter on page when error

// middlewares
app.use(bodyparser({ enableTypes:['json', 'form', 'text']}))//html_body
app.use(json())
app.use(logger())//replace console.log and print log

// config static resource and middle
app.use(koaStatic(__dirname + '/public'))

// config server template render
app.use(views(__dirname + '/public', {extension: 'ejs' }))

app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} ----- ${ms}ms`)
})

//config router
app.use(cors({
	origin: function (ctx) {
		return '*';
		// return 'http://localhost:3001';
	},
	exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	maxAge: 5,
	credentials: true,
	allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Content-Length', 'X-Requested-With'],
}))

//main page
app.use(router.get('/', async (ctx) => {
  	await ctx.render('index')
}).routes())

// routes
app.use(require('./routes/course').routes())

//if ctx.status empty/404, insert response header
app.use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


//Create HTTP server.
const port = process.env.PORT || '3000'
const server = http.createServer(app.callback())
console.log(`listening on port ${port}, ${process.env.NODE_ENV}`)
server.listen(port)
server.on('error', function onError(error) {
	if ( error.syscall !== 'listen' ) throw error;
	let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
		break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
		break;
		default:
			throw error;
	}
})
server.on('listening', function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
})

// module.exports = app

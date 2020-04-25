const config = {
	// Start
	port: 9013,
	// Database Config
	db:{
		mysql: {
			DATABASE: 'course',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3307',
			HOST: '127.0.0.1',
			CONNECTTIMEOUT: '60000'
		},
		//localhost server
		local: {
			DATABASE: 'course',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3307',
			HOST: '127.0.0.1'
		},
		// internal development server
		dev: {
			DATABASE: 'course',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3307',
			HOST: '127.0.0.1'
		},
		// production server
		production: {
			DATABASE: '',
			USERNAME: '',
			PASSWORD: 'r',
			PORT: '',
			HOST: 'a'
		}
	}
}

module.exports = config
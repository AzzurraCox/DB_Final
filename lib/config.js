const config = {
	// Start
	port: 9013,
	// Database Config
	db:{
		mysql: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3306',
			HOST: '140.123.175.93',
			CONNECTTIMEOUT: '60000'
		},
		//localhost server
		local: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3306',
			HOST: '140.123.175.93'
		},
		// internal development server
		dev: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: 'd1w2id2011',
			PORT: '3306',
			HOST: '140.123.175.93'
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
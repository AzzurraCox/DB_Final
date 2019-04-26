const config = {
	// Start
	port: 9013,
	// Database Config
	db:{
		mysql: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: '',
			PORT: '3306',
			HOST: '',
			CONNECTTIMEOUT: '60000'
		},
		//localhost server
		local: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: '',
			PORT: '3306',
			HOST: ''
		},
		// internal development server
		dev: {
			DATABASE: 'Product',
			USERNAME: 'root',
			PASSWORD: '',
			PORT: '3306',
			HOST: ''
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

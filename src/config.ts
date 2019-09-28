const config = {
	source: {
		type		:'ftp',
		host		:"ftp.owd.com",
		user		:'photos',
		password	: 'And2017!!',
		path		:'/toprocess/',
		dirIn		: '/home/photos/ftp/toprocess/',
		dirOut		: '/home/photos/ftp/processed/'
	},
	target:{
		key			:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTUwMzkzNjA5M30.JtoaoN73CpR6YUvlZayqplWtxfnFH9rsZ3iCYBf0Go4"
	},
	api:{
		base_url	: "api.owd.com",
		key			:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTUwMzkzNjA5M30.JtoaoN73CpR6YUvlZayqplWtxfnFH9rsZ3iCYBf0Go4"
	}
};

export default config;

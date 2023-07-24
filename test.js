const {Client} = require('./index');

const youtubeSearch = new Client();

youtubeSearch.search('wawa cat')
	.then(result => {
		console.log(result[0].videoRenderer)
	});
const qs = require('querystring');
const axios = require('axios')
const cheerio = require('cheerio');

class Client {
	
	constructor() {
		this.endpoint = 'https://www.youtube.com';
	}
	
	async search(query, options) {
		if (!query) {
			throw new TypeError('Expected a query');
		}
		const url = `${this.endpoint}/results?${this.buildQuery(query, options)}`;
		const response = await axios.request(url);
        const result = response.data
		const scripts = [];
		var $ = cheerio.load(result);
  		$('script').each((index, element) => {
			scripts.push($(element).text());
		});
		const removedStart = scripts[34].slice(20);
  		const removedBoth = removedStart.slice(0, -1)
		var ytInitialData = []
		try {
			ytInitialData = JSON.parse(removedBoth);
		} catch (error) {
			throw new Error('Error parsing youtube JSON results:', error.message);
		}
		var ytSearchResults = ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
		ytSearchResults.shift();
		return ytSearchResults
	}

	buildQuery(query, options) {
		options = options || {};
		const result = {
			search_query: query.replace('+', /\s/g)
		};
		return qs.stringify(result);
	}
}
module.exports = {
	Client,
};

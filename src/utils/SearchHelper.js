var axios = require('axios');

// Github paths
var githubReposPath = '/search/repositories'; // e.g. var url = process.env.GITHUB_API_URL + '/search/repositories?q=test'

function convertParamString (paramsObj) {
	var paramsStr = '';
	Object.keys(paramsObj).map(function (key) {
		paramsStr += paramsStr.length ? '&' : '?';
		paramsStr += key + '=' + paramsObj[key];
	});
	return paramsStr;
}


var SearchHelper = {
	getRepos: function (keyword, page, numResultsPerPage) {
		page = page || 1;
		numResultsPerPage = numResultsPerPage || 30;
		var url = process.env.GITHUB_API_URL + githubReposPath 
					+ convertParamString({ q : keyword, page: page, per_page : numResultsPerPage, 
											client_id : process.env.GITHUB_CLIENT_ID, client_secret : process.env.GITHUB_CLIENT_SECRET})
		console.log('search url', url)
		return axios.get(url)
			.then(function(data) {
				if(data.status / 100 === 2) {
					return Object.assign(data.data, {ok: true})
				} else {
					return { ok: false, status: data.status, statusText: data.statusText }
				}
			})
			.catch(function(err) {
				console.error('Error getting repos', err);
			});
	}
};

module.exports = SearchHelper;
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
	getRepos: function (keyword) {
		var url = process.env.GITHUB_API_URL + githubReposPath + convertParamString({ q : keyword })
		axios.get(url)
			.then(function(repos){
				console.log('repos', repos)
			})
	}
};

module.exports = SearchHelper;
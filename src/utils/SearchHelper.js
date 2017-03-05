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

function getReposPromise(keyword, page, numResultsPerPage) {
	page = page || 1;
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
			return{ ok: false, statusText: err}
		});
}

// just retain whatever is relevant
function getRelevantInfo (repos) {
	// NOTE: 'followers' == 'watches' ??
 	var relevantKeys = ['id', 'owner', 'name', 'language', 'watchers', 'svn_url', 'description'];
	var skinnyRepo = [];

	repos.map(function (repo) {
		skinnyRepo.push(relevantKeys.reduce(function (skinny, key) {
			skinny[key] = repo[key];
			return skinny;
		}, {}))
	})

	return skinnyRepo;
}

var SearchHelper = {
	fetchRepos: function (keyword, page, callback) {
		return getReposPromise(keyword, page, 30).then(function(repos){
			if(repos.ok) { 
				var skinnyRepo = getRelevantInfo(repos.items);
				return {
					repos: skinnyRepo,
					total: repos.total_count,
					incomplete: repos.incomplete_results
				}
				
			} else {
				return {
					error: repos.statusText
				}
			}
		});
	}
};

module.exports = SearchHelper;
var axios = require('axios');

// Github paths
var githubReposPath = '/search/repositories'; // e.g. var url = process.env.GITHUB_API_URL + '/search/repositories?q=test'
var githubRepoByIdPath = function(repoId) { return '/repositories/' + repoId } // e.g. var url = process.env.GITHUB_API_URL + '/repositories/:repoId'
// var githubRepoWatchersByNamePath = function(userName, repoName) { return '/'+ userName +'/'+ repoName + '/subscribers' }; // e.g. var url = process.env.GITHUB_API_URL + '/repos/facebook/react/subscribers'
var githubRepoWatchersByIdPath = function(repoId) { return githubRepoByIdPath(repoId) + '/watchers' };  // e.g. var url = process.env.GITHUB_API_URL + '/repositories/10270250/subscribers'

function convertParamString (paramsObj) {
	var paramsStr = '';
	Object.keys(paramsObj).map(function (key) {
		paramsStr += paramsStr.length ? '&' : '?';
		paramsStr += key + '=' + paramsObj[key];
	});
	return paramsStr;
}

function processDataRetrieved (data) {
	if(data.status / 100 === 2) {
		return Object.assign(data.data, {ok: true})
	} else {
		return { ok: false, status: data.status, statusText: data.statusText }
	}
}

function getSearchReposByKeywordPromise (keyword, page, numResultsPerPage) {
	page = page || 1;
	var url = process.env.GITHUB_API_URL + githubReposPath 
				+ convertParamString({ q : keyword, page: page, per_page : numResultsPerPage, 
										client_id : process.env.GITHUB_CLIENT_ID, client_secret : process.env.GITHUB_CLIENT_SECRET})
	console.log('search repos by keyword url', url)
	return axios.get(url)
		.then(processDataRetrieved)
		.catch(function (err) {
			return { ok: false, statusText: err}
		});
}

function getSearchRepoByIdPromise (repoId) {
	var url = process.env.GITHUB_API_URL + githubRepoByIdPath(repoId) 
				+ convertParamString({ client_id : process.env.GITHUB_CLIENT_ID, client_secret : process.env.GITHUB_CLIENT_SECRET})
	console.log('search repo by id url', url);
	return axios.get(url)
		.then(processDataRetrieved)
		.catch(function (err) {
			return { ok: false, statusText: err}
		})
}

function getSearchRepoWatchersByIdPromise (repoId, page, numResultsPerPage) {
	page = page || 1;
	var url = process.env.GITHUB_API_URL + githubRepoWatchersByIdPath(repoId)
				+ convertParamString({ page: page, per_page : numResultsPerPage, 
										client_id : process.env.GITHUB_CLIENT_ID, client_secret : process.env.GITHUB_CLIENT_SECRET})
	console.log('search repo watchers by id url', url);
	return axios.get(url)
		.then(processDataRetrieved)
		.catch(function (err) {
			return { ok: false, statusText: err}
		})
}

// NOTE: relevantKey = object.property will only fetch the property of the object and not the whole object
function getRelevantInfo (source, relevantKeys) {
	var skinny = [];
	if(Array.isArray(source)) {
		source.map(function (item) {
			skinny.push(relevantKeys.reduce(function (skinny, key) {
				if(key.includes('.')) {
					var keys = key.split('.');
					skinny[keys[0]+keys[1]] = item[keys[0]][keys[1]];
				} else {
					skinny[key] = item[key];
				}
				return skinny;
			}, {}))
		})

	} else {
		skinny = {};
		relevantKeys.map(function(key) {
			if(key.includes('.')) {
				var keys = key.split('.');
				skinny[keys[0]+keys[1]] = source[keys[0]][keys[1]];
			} else {
				skinny[key] = source[key];
			}
		})
	}
	
	return skinny;
}

var SearchHelper = {
	fetchReposByKeyword: function (keyword, page) {

		var relevantKeys = ['id', 'owner.avatar_url', 'owner.login', 'name', 'language', 'watchers', 'svn_url', 'description'];

		return getSearchReposByKeywordPromise(keyword, page, 30).then(function (repos) {
			if(repos.ok) { 
				var skinnyRepo = getRelevantInfo(repos.items, relevantKeys);
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
	},
	fetchRepoById: function (repoId) {
		return getSearchRepoByIdPromise(repoId).then(function (repo) {

			var relevantKeys = ['id', 'owner.avatar_url', 'owner.login', 'name', 'language', 'watchers', 'svn_url', 'description'];

			if(repo.ok) { 
				return getRelevantInfo(repo, relevantKeys)
			} else {
				return {
					error: repo.statusText
				}
			}
		})
	},
	fetchRepoWatchersByRepoId: function (repoId, page) {
		return getSearchRepoWatchersByIdPromise(repoId, page, 30).then(function (watchers) {
			var relevantKeys = ['login', 'html_url'];

			if(watchers.ok) { 
				return getRelevantInfo(watchers, relevantKeys)
			} else {
				return {
					error: watchers.statusText
				}
			}
		})
	},
	getErrorMessage: function getErrorMessage (source, apiErrorMsg) {
		var generic = 'Oops! There seems to be some issue fetching the data from ' + source + "'s servers.";
		return apiErrorMsg ? generic + ' "' + apiErrorMsg + '"' : generic;
	}
};

module.exports = SearchHelper;
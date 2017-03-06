var React = require('react');
var PropTypes = React.PropTypes;
var SearchReposResultDetail = require('../components/SearchReposResultDetail');

var SearchHelper = require('../utils/SearchHelper');
var axios = require('axios');


function checkIfReceivedStates (state) {
	return ( state && state.userName && state.repoName && state.keyword && state.language && state.description && state.url )
}

// NOTE: use this if the other details like 'language', 'description' , etc is not available
function fetchRepoInfoById (repoId, page) {
	axios.all([SearchHelper.fetchRepoById(repoId), SearchHelper.fetchRepoWatchersByRepoId(repoId, page)])
		.then(axios.spread((function (repo, watchers) {
			console.log('[concurrent] fetchRepoInfoById repo', repo)
			console.log('[concurrent] fetchRepoInfoById watchers', watchers)
			this.setState({
				userName: repo.ownerlogin,
				repoName: repo.name,
				keyword: repo.keyword,
				language: repo.language,
				description: repo.description,
				url: repo.svn_url,
				page: page ? page : '1',
				watchers: watchers,
				watchersTotal: repo.watchers
			})
		}).bind(this)).bind(this))
}

function fetchRepoWatchersById (repoId, page) {
	SearchHelper.fetchRepoWatchersByRepoId(repoId, page)
		.then((function (watchers) {
			console.log('fetchRepoWatchersById watchers', watchers)
			this.setState({
				watchers: watchers
			})
		}).bind(this))
}

var SearchReposResultDetailContainer = React.createClass({
	propTypes: {
		
	},
	contextTypes: {
	    router: React.PropTypes.object.isRequired
  	},
	getInitialState: function () {
		return {
			page: '1'
		}
	},
	componentDidMount: function () {
		var pathname = this.props.location.pathname;
		var urlComponents = pathname.split('/');
		var check = checkIfReceivedStates(this.props.location.state);
		if(urlComponents[2].length > 0) {
			var repoId = urlComponents[2];
			var page = urlComponents[3];

			if(check) {
				// fetch watchers from api
				fetchRepoWatchersById.bind(this)(repoId)

				this.setState({
					userName: this.props.location.state.userName,
					repoName: this.props.location.state.repoName,
					keyword: this.props.location.state.keyword,
					language: this.props.location.state.language,
					description: this.props.location.state.description,
					url: this.props.location.state.url,
					page: page ? page : '1',
					watchersTotal: this.props.location.state.watchers
				})
			} else { // when user refreshed page, state is lost
				
				// fetch from all api
				fetchRepoInfoById.bind(this)(repoId, page)
			}

		} else {
			// show main page
			this.context.router.push({
		      	pathname: '/'
		    })
		}
	},
	render: function () {
		return (
			<SearchReposResultDetail userName={this.state.userName} repoName={this.state.repoName} keyword={this.state.keyword}
				language={this.state.language} description={this.state.description} url={this.state.url} page={this.state.page} 
				watchers={this.state.watchers} watchersTotal={this.state.watchersTotal} />
		)
	}
});


module.exports = SearchReposResultDetailContainer;
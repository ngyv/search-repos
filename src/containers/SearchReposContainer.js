var React = require('react');
var SearchRepos = require('../components/SearchRepos');
var SearchReposResult = require('../components/SearchReposResult');
var SearchingRepos = require('../components/SearchingRepos');

var SearchHelper = require('../utils/SearchHelper');

function onChangeKeyword(keyword) {
	
	this.setState({
		isLoading: true
	})

	if(this.props.location.pathname !== '/search/'+ keyword) {
		this.context.router.push({
			pathname: '/search/'+ keyword
		})
	}
	
	fetchRepos(keyword).then((repos) => {
		console.log('Result', repos);

		if(repos.ok) { 
			var skinnyRepo = getRelevantInfo(repos.items);
			this.setState({
				repos: skinnyRepo,
				total: repos.total_count,
				incomplete: repos.incomplete_results,
				isLoading: false
			})
		} else {
			// TODO: handle failure
			this.setState({
				isLoading: false
			})
		}
	})
}

// just retain whatever is relevant
function getRelevantInfo (repos) {
	// NOTE: 'followers' == 'watches' ??
 	var relevantKeys = ['id', 'owner', 'name', 'language', 'watchers', 'url', 'description'];
	var skinnyRepo = [];

	repos.map((repo) => {
		skinnyRepo.push(relevantKeys.reduce((skinny, key) => {
			skinny[key] = repo[key];
			return skinny;
		}, {}))
	})
	console.log('skinny', skinnyRepo)
	return skinnyRepo;
}


function fetchRepos(keyword) {
	return SearchHelper.getRepos(keyword)
}

var SearchReposContainer = React.createClass({
	contextTypes: {
	    router: React.PropTypes.object.isRequired
  	},
	getInitialState: function () {
		return {
			keyword: '',
			isLoading: false
		}
	},
	componentDidMount: function () {
		var pathname = this.props.location.pathname;
		if(pathname.includes('search') && pathname.split('/')[2].length > 0) {
			var keyword = pathname.split('/')[2];
			this.setState({
				keyword: keyword
			})
			onChangeKeyword.bind(this)(keyword);
		} else {
			this.setState({
				keyword: ''
			})
		}
	},
	handleClickHome: function (event) {
		console.log('home')
		if(this.props.location.pathname !== '/') {
			this.setState({
				keyword: ''
			})
			this.context.router.push({
				pathname: '/'
			})
		} 
	},
	handleSearchInputFocus: function (event) {
		var prev = this.state.keyword;
		this.setState({
			keyword: '',
			prevKeyword: prev
		})
	},
	handleSearchInputBlur: function (event) {
		if(this.state.keyword.length === 0) {
			var prev = this.state.prevKeyword;
			this.setState({
				keyword: prev,
				prevKeyword: ''
			})
		}
	},
	handleSearchInputChange: function (event) {
		this.setState({
			keyword: event.target.value
		})
	},
	handleSearchButtonClick: function (event) {
		var keyword = this.state.keyword;
		if(keyword.length) {
			onChangeKeyword.bind(this)(keyword);
		}
	},
	render: function () {
		return (
				<SearchRepos keyword={this.state.keyword} onClickHome={this.handleClickHome} 
					onSearchInputFocus={this.handleSearchInputFocus} onSearchInputBlur={this.handleSearchInputBlur}
					onSearchInputChange={this.handleSearchInputChange} onSearchButtonClick={this.handleSearchButtonClick}>

					{!this.state.isLoading && this.state.repos && this.state.repos.length && 
						<SearchReposResult repos={this.state.repos} total={this.state.total} incomplete={this.state.incomplete}/>}
					{this.state.isLoading && 
						<SearchingRepos />}
				</SearchRepos>
		)
	}
});


module.exports = SearchReposContainer;
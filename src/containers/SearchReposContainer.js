var React = require('react');

var Scroll  = require('react-scroll');
var scroll     = Scroll.animateScroll;

var SearchRepos = require('../components/SearchRepos');
var SearchReposResult = require('../components/SearchReposResult');
var SearchingRepos = require('../components/SearchingRepos');

var SearchHelper = require('../utils/SearchHelper');

function onChangeKeyword(keyword, page) {
	this.setState({
		isLoading: true
	})

	var shouldUpdatePath = page ? (this.props.location.pathname !== '/keyword/' + keyword + '/' + page) : (this.props.location.pathname !== '/keyword/' + keyword)
	if(shouldUpdatePath) {
		this.context.router.push({
			pathname: page ? '/keyword/'+ keyword + '/' + page : '/keyword/'+ keyword
		})
	}
	
	fetchRepos(keyword, page).then((function(repos) {
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
	}).bind(this))
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
	console.log('skinny', skinnyRepo)
	return skinnyRepo;
}

function fetchRepos(keyword, page) {
	return SearchHelper.getRepos(keyword, page)
}



var SearchReposContainer = React.createClass({
	contextTypes: {
	    router: React.PropTypes.object.isRequired
  	},
	getInitialState: function () {
		return {
			keyword: '',
			repos: [],
			isLoading: false,
			showRepoId: null,
			page: 1
		}
	},
	componentDidMount: function () {
		var pathname = this.props.location.pathname;
		if(pathname.includes('keyword') && pathname.split('/')[2].length > 0) {
			var keyword = pathname.split('/')[2];
			var page = pathname.split('/')[3];
			console.log('page', page)
			this.setState({
				keyword: keyword,
				page: page ? parseInt(page) : 1
			})
			onChangeKeyword.bind(this)(keyword, parseInt(page));
		} else {
			this.setState({
				keyword: ''
			})
		}
	},
	scrollToTop: function () {
		scroll.scrollToTop();
	},
	handleClickHome: function (event) {
		if(this.props.location.pathname !== '/') {
			this.setState({
				keyword: '',
				repos: [],
				total: undefined,
				incomplete: undefined,
				isLoading: false,
				page: 1
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
	handleSearchInputEnter: function (event) {
		if(event.key === 'Enter') {
			this.handleSearchButtonClick(event);
		}
	},
	handleSearchButtonClick: function (event) {
		var keyword = this.state.keyword;
		if(keyword.length) {
			onChangeKeyword.bind(this)(keyword);
		}
	},
	handleClickResult: function (repoId) {
		return (function (event) {
			var prev = this.state.showRepoId;
			this.setState({
				showRepoId: prev === repoId ? null : repoId
			})
		}).bind(this)
	},
	handleGoToPage: function (max) {
		return function (event) {
			var page = this.state.page;
			if(event.key === 'Enter' && /^\d+$/.test(page) && page <= max && page >= 1) {
				onChangeKeyword.bind(this)(this.state.keyword, parseInt(page));
			}
		}.bind(this)
	},
	handleClickPage: function(max, page) {
		return function (event) {
			if(/^\d+$/.test(page) && page <= max && page >= 1) {
				onChangeKeyword.bind(this)(this.state.keyword, parseInt(page));
			}
		}.bind(this)
	},
	handleChangePageInput: function(event) {
		this.setState({
			page: parseInt(event.target.value)
		})
	},
	render: function () {
		return (
				<SearchRepos keyword={this.state.keyword} onClickHome={this.handleClickHome} 
					onSearchInputFocus={this.handleSearchInputFocus} onSearchInputBlur={this.handleSearchInputBlur}
					onSearchInputChange={this.handleSearchInputChange} onSearchButtonClick={this.handleSearchButtonClick} 
					onSearchInputEnter={this.handleSearchInputEnter} onClickScrollTop={this.scrollToTop} hasResult={this.state.total}>

					{!this.state.isLoading && this.state.repos && this.state.repos.length > 0 && 
						<SearchReposResult repos={this.state.repos} keyword={this.state.keyword} total={this.state.total} page={this.state.page}
							incomplete={this.state.incomplete} onClickResult={this.handleClickResult} 
							showRepoId={this.state.showRepoId} onKeyPressInputPage={this.handleGoToPage} 
							onClickPage={this.handleClickPage} onChangePageInput={this.handleChangePageInput}/>}
					{this.state.isLoading && 
						<SearchingRepos />}
				</SearchRepos>
		)
	}
});


module.exports = SearchReposContainer;
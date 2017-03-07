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
	
	fetchRepos.bind(this)(keyword, page);
}


function fetchRepos(keyword, page) {
	SearchHelper.fetchReposByKeyword(keyword, page).then((function(results){
		console.log('results', results)
		if(results.error) {
			this.setState({
				isLoading: false,
				errorMsg: SearchHelper.getErrorMessage('GitHub')
			})
		} else if(results.repos) {
			this.setState({
				repos: results.repos,
				total: results.total,
				incomplete: results.incomplete,
				isLoading: false,
				page: page ? parseInt(page) : '1'
			})
		}
	}).bind(this))
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
			page: '1'
		}
	},
	componentDidMount: function () {
		var pathname = this.props.location.pathname;
		if(pathname.includes('keyword') && pathname.split('/')[2].length > 0) {
			var keyword = pathname.split('/')[2];
			var page = pathname.split('/')[3];

			this.setState({
				keyword: keyword,
				page: page ? parseInt(page) : '1'
			})
			onChangeKeyword.bind(this)(keyword, page);
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
				page: '1'
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
	handleClickResult: function (repoId, userName, repoName, language, description, url, watchersTotal) {
		return (function (event) {
			this.context.router.push({
		      	pathname: '/id/' + repoId,
		      	state: {
		        	userName: userName,
		        	repoName: repoName,
		        	language: language,
		        	description: description,
		        	url: url,
		        	watchersTotal: watchersTotal,
		        	keyword: this.state.keyword
		      	}
		    })
		}).bind(this)
	},
	handleGoToPage: function (max) {
		return function (event) {
			var page = this.state.page;
			if(event.key === 'Enter' && /^\d+$/.test(page) && page <= max && page >= 1) {
				onChangeKeyword.bind(this)(this.state.keyword, page);
			}
		}.bind(this)
	},
	handleClickPage: function(max, page) {
		return function (event) {
			if(page <= max && page >= 1) {
				onChangeKeyword.bind(this)(this.state.keyword, page);
			}
		}.bind(this)
	},
	handleChangePageInput: function(event) {
		if(/^\d+$/.test(page) || event.target.value.length === 0) {
			this.setState({
				page: event.target.value.length ? parseInt(event.target.value) : undefined
			})
		}
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

					{this.state.errorMsg && 
						<div className='col-xs-12 col-sm-6 col-sm-offset-3 alert alert-danger'>{this.state.errorMsg}</div>}
				</SearchRepos>
		)
	}
});


module.exports = SearchReposContainer;
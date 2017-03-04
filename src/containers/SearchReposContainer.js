var React = require('react');
var SearchRepos = require('../components/SearchRepos');

var SearchReposContainer = React.createClass({
	contextTypes: {
	    router: React.PropTypes.object.isRequired
  	},
	getInitialState: function () {
		return {
			keyword: ''
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
		if(this.state.keyword.length) {
			this.context.router.push({
		      	pathname: '/search/'+ this.state.keyword,
		      	state: {
		        	keyword: this.state.keyword
		      	}
		    })
		}
	},
	render: function () {
		return (
			<SearchRepos keyword={this.state.keyword} onSearchInputFocus={this.handleSearchInputFocus} onSearchInputBlur={this.handleSearchInputBlur}
				onSearchInputChange={this.handleSearchInputChange} onSearchButtonClick={this.handleSearchButtonClick}>
				{this.props.children}
			</SearchRepos>
		)
	}
});


module.exports = SearchReposContainer;
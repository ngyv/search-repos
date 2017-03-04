var React = require('react');

var SearchReposResultContainer = React.createClass({
	render: function () {
		return (
			<div>{this.props.location.state.keyword}</div>
		)
	}
})


module.exports = SearchReposResultContainer;
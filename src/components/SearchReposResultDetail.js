var React = require('react');
var PropTypes = React.PropTypes;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');

function constructWatcher (watcher) {
	return (
		<div key={watcher.login}>
			<a href={watcher.html_url}>{watcher.login}</a>
		</div>
	)
}

function constructWatchersList (watchers) {
	return watchers ? watchers.map(constructWatcher) : ''
}

function SearchReposResultDetail (props) {
	return (
		<div className={classnames(css.resultDetails)}>
			<div>Username: {props.userName}</div>
			<div>Repository: {props.repoName}</div>
			<div>Language: {props.language}</div>
			<div>Watchers: { constructWatchersList(props.watchers) }</div>
			<div>Url: <a href={props.url}>{props.url}</a></div>
			<div>Description: {props.description}</div>
			<div>
				   
			</div>
		</div>
	)
}

SearchReposResultDetail.propsTypes = {
	userName: PropTypes.string.isRequired,
	repoName: PropTypes.string.isRequired,
	keyword: PropTypes.string.isRequired,
	language: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	watchers: PropTypes.array.isRequired,
	watchersTotal: PropTypes.number.isRequired,
	page: PropTypes.string.isRequired
}


module.exports = SearchReposResultDetail;
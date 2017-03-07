var React = require('react');
var PropTypes = React.PropTypes;
var Link = require('react-router').Link;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');

function constructWatcher (watcher) {
	return (
		<li key={watcher.login}>
			<a href={watcher.html_url}>{watcher.login}</a>
		</li>
	)
}

function constructWatchersList (watchers) {
	return watchers ? watchers.map(constructWatcher) : ''
}

function getLastPage (total, perPage) {
	return Math.ceil(total * 1.0 / perPage)
}

function SearchReposResultDetail (props) {
	return (
		<div>
			<div className={classnames(css.resultDetailsTop)}>
				<Link to={props.keyword ? '/keyword/'+props.keyword : '/'}>
					<span className={classnames('glyphicon glyphicon-menu-left', css.glyphicon)}></span>Search
					{props.keyword ? ' "' + props.keyword + '"' : ''}
				</Link>
			</div>

			<div className={classnames(css.resultDetails)}>
				{props.errorMsg && 
						<div className='col-xs-12 col-sm-6 col-sm-offset-3 alert alert-danger' style={{marginTop: '10px'}}>{props.errorMsg}</div>}


				<div className={classnames('col-xs-12', 'col-sm-6', 'col-sm-offset-3', css.resultDetailsInner)}>
					<h2>{props.userName} / {props.repoName}</h2>
					<div>Language: {props.language}</div>
					<div className={classnames(css.watchersContainer)}>
						Watchers: {props.watchers && props.watchers.length ?  props.watchers.length + ' of ' + props.watchersTotal : ''}
						{	
							props.watchers && props.watchers.length &&
								<ul className={classnames(css.watchersList)}>{ constructWatchersList(props.watchers) }</ul>	
						}
						{
							props.page < getLastPage(props.watchersTotal, 30) && 
								<div className={classnames(css.viewMoreWatchers)} onClick={props.onClickViewMore(parseInt(props.page) + 1, getLastPage(props.watchersTotal, 30))}>View more</div>
						}
					</div>
					<div>Url: <a href={props.url}>{props.url}</a></div>
					<div>Description: {props.description}</div>
					<div>
				</div>
					   
				</div>
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
	page: PropTypes.string.isRequired,
	onClickViewMore: PropTypes.func.isRequired,
	errorMsg: PropTypes.string
}


module.exports = SearchReposResultDetail;
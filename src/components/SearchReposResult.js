var React = require('react');
var PropTypes = React.PropTypes;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');
var LazyLoad = require('react-lazy-load').default;

function constructRepoDetail (result) {
	return (
		<div>
			<div>Language: {result.language}</div>
			<div>Watchers: {result.watchers}</div>
			<div>Url: <a href={result.url}>{result.url}</a></div>
			<div>Description: {result.description}</div>
		</div>
	)
}

function constructLazyImg (src) {
	return (
		<LazyLoad height={100} offsetVertical={window.screen.availHeight} >
			<img src={src} className={classnames('img-responsive','center-block', css.resultOwnerImg)} />
		</LazyLoad>
	)
}
//{constructLazyImg(result.owner.avatar_url)}
function contructResult (result) {
	return (
		<div key={result.id}>
			<LazyLoad offsetVertical={window.screen.availHeight} >
				<div className={classnames('col-xs-12', 'col-sm-10', 'col-sm-offset-1', css.resultRow)} 
					onClick={this.onClickResult(result.id)} >
					<img src={result.owner.avatar_url} className={classnames('img-responsive','center-block', css.resultOwnerImg)} />
					<div>User: {result.owner.login}</div>
					<div>Repository: {result.name}</div>
					{
						this.showRepoId === result.id &&
						constructRepoDetail (result)
					}
				</div>
			</LazyLoad>
		</div>
	)
}

function constructAllResults (repos) {
	return repos.map(contructResult.bind(this))
}

function SearchReposResult (props) {
	return (
		<div>
			{constructAllResults.bind(props)(props.repos)}
		</div>
	)
}

SearchReposResult.propTypes = {
	repos: PropTypes.array.isRequired,
	total: PropTypes.number.isRequired,
	incomplete: PropTypes.bool,
	onClickResult: PropTypes.func.isRequired,
	showRepoId: PropTypes.number
}


module.exports = SearchReposResult;
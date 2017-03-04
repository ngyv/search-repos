var React = require('react');
var PropTypes = React.PropTypes;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');
var LazyLoad = require('react-lazy-load').default;

function constructLazyImg (src) {
	return (
		<LazyLoad height={100}>
			<img src={src} className={classnames('img-responsive','center-block', css.resultOwnerImg)} />
		</LazyLoad>
	)
}
function contructResult (result) {
	return (
		<div key={result.id} className={classnames('col-xs-12', 'col-sm-10', 'col-sm-offset-1')}>
			Owner: {result.owner.login}
			{constructLazyImg(result.owner.avatar_url)}
			Repo Name: {result.name}
		</div>
	)
}

function constructAllResults (repos) {
	return repos.map(contructResult)
}

function SearchReposResult (props) {
	return (
		<div>
			{constructAllResults(props.repos )}
		</div>
	)
}

SearchReposResult.propTypes = {
	repos: PropTypes.array.isRequired,
	total: PropTypes.number.isRequired,
	incomplete: PropTypes.bool
}


module.exports = SearchReposResult;
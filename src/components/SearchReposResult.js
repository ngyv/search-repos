var React = require('react');
var PropTypes = React.PropTypes;
var SearchPagination = require('../components/SearchPagination');
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');
var LazyLoad = require('react-lazy-load').default;


function constructRepoDetail (result) {
	return (
		<div className={classnames(css.resultDetails)}>
			<div>Language: {result.language}</div>
			<div>Watchers: {result.watchers}</div>
			<div>Url: <a href={result.svn_url}>{result.svn_url}</a></div>
			<div>Description: {result.description}</div>
		</div>
	)
}


function contructResult (result) {
	return (
		<div key={result.id}>
			<LazyLoad offsetVertical={window.screen.availHeight} >
				<div className={classnames('col-xs-12', css.resultRow, this.showRepoId === result.id ? css.inFocus : '')} 
					onClick={this.onClickResult(result.id)} >
					<img src={result.owner.avatar_url} className={classnames('img-responsive','center-block', css.resultOwnerImg)} />
					<div>User: {result.owner.login}</div>
					<div>Repository: {result.name}</div>
					{
						this.showRepoId === result.id &&
						constructRepoDetail(result)
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
			<div className={classnames(css.searchResults)}>
				{constructAllResults.bind(props)(props.repos)}
			</div>
			<SearchPagination currentPage={props.page} total={props.total} keyword={props.keyword} perPage={30} 
				onKeyPressInputPage={props.onKeyPressInputPage} onClickPage={props.onClickPage} onChangePageInput={props.onChangePageInput}/>
		</div>
	)
}

SearchReposResult.propTypes = {
	repos: PropTypes.array.isRequired,
	total: PropTypes.number.isRequired,
	incomplete: PropTypes.bool,
	onClickResult: PropTypes.func.isRequired,
	showRepoId: PropTypes.number,
	keyword: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	onKeyPressInputPage: PropTypes.func.isRequired,
	onClickPage: PropTypes.func.isRequired,
	onChangePageInput: PropTypes.func.isRequired
}


module.exports = SearchReposResult;
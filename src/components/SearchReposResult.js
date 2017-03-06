var React = require('react');
var PropTypes = React.PropTypes;
var SearchPagination = require('../components/SearchPagination');
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');
var LazyLoad = require('react-lazy-load').default;


function contructResult (result) {
	return (
		<div key={result.id} className={classnames(css.flexItem, 'col-xs-12', 'col-sm-6','col-md-4')}>
			<LazyLoad offsetVertical={200} >
				<div className={classnames(css.resultBox, this.showRepoId === result.id ? css.inFocus : '')} 
					onClick={this.onClickResult(result.id, result.ownerlogin, result.name, result.language, result.description, result.svn_url, result.watchers)} >
					<img src={result.owneravatar_url} className={classnames('img-responsive','center-block', css.resultOwnerImg)} />
					<div>{result.ownerlogin} / {result.name}</div>
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
			<div className={classnames(css.searchResults, css.flexContainer)}>
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
	page: PropTypes.string.isRequired,
	onKeyPressInputPage: PropTypes.func.isRequired,
	onClickPage: PropTypes.func.isRequired,
	onChangePageInput: PropTypes.func.isRequired
}


module.exports = SearchReposResult;
var React = require('react');
var PropTypes = React.PropTypes;
var Link = require('react-router').Link;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');


function SearchRepos (props) {
	return (
		<div className={classnames(css.searchContainer)}>
			<div><a className={classnames(css.sourceLink)} href='https://github.com/ngyv/search-repos'>Source</a></div>
			<h1 className={classnames(css.searchHome)} onClick={props.onClickHome}>Search Github Repositories</h1>

			<section>
				<div className={classnames('col-xs-12', 'col-sm-6','col-sm-offset-3', css.searchForm)}>
					<input className={classnames('form-control')} placeholder='Search by keyword' value={props.keyword} 
						onFocus={props.onSearchInputFocus} onBlur={props.onSearchInputBlur} onChange={props.onSearchInputChange}
						onKeyPress={props.onSearchInputEnter}/>
					<div className='col-xs-12 col-sm-6 col-sm-offset-3'>
						<button className={classnames('form-control', css.searchBtn)} onClick={props.onSearchButtonClick}>Search</button>
					</div>
				</div>
			</section>
			<section>
				{props.children}
			</section>
			<div className={classnames(css.stickyToTop, props.hasResult ? css.show : '')} onClick={props.onClickScrollTop}>
				TO TOP
			</div>
		</div>
	)
}

SearchRepos.propTypes = {
	keyword: PropTypes.string.isRequired,
	onClickHome: PropTypes.func.isRequired,
	onSearchInputFocus: PropTypes.func.isRequired,
	onSearchInputBlur: PropTypes.func.isRequired,
	onSearchInputChange: PropTypes.func.isRequired,
	onSearchInputEnter: PropTypes.func.isRequired,
	onSearchButtonClick: PropTypes.func.isRequired,
	onClickScrollTop: PropTypes.func.isRequired,
	hasResult: PropTypes.number
}


module.exports = SearchRepos;
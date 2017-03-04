var React = require('react');
var PropTypes = React.PropTypes;
var Link = require('react-router').Link;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');


function SearchRepos (props) {
	return (
		<div className={classnames('container', css.searchContainer)}>
			<h1 className={classnames(css.searchHome)} onClick={props.onClickHome}>Search Github Repositories</h1>

			<section>
				<div className={classnames('col-xs-12', 'col-sm-6','col-sm-offset-3', css.searchForm)}>
					<input className={classnames('form-control')} placeholder='Search by keyword' value={props.keyword} 
						onFocus={props.onSearchInputFocus} onBlur={props.onSearchInputBlur} onChange={props.onSearchInputChange}/>
					<div className='col-xs-12 col-sm-6 col-sm-offset-3'>
						<button className={classnames('form-control', css.searchBtn)} onClick={props.onSearchButtonClick}>Search</button>
					</div>
				</div>
			</section>
			<section>
				{props.children}
			</section>
		</div>
	)
}

SearchRepos.propTypes = {
	keyword: PropTypes.string.isRequired,
	onClickHome: PropTypes.func.isRequired,
	onSearchInputFocus: PropTypes.func.isRequired,
	onSearchInputBlur: PropTypes.func.isRequired,
	onSearchInputChange: PropTypes.func.isRequired,
	onSearchButtonClick: PropTypes.func.isRequired
}


module.exports = SearchRepos;
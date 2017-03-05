var React = require('react');
var Link = require('react-router').Link;
var PropTypes = React.PropTypes;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');


function SearchPagination (props) {
	var lastPage = Math.ceil(props.total * 1.0 / props.perPage);
	return (
		<div className={classnames(css.pagination)}>
			{props.currentPage > 1 && <button className={classnames(css.paginationButton)} onClick={props.onClickPage(lastPage, props.currentPage - 1)}>Prev</button>}

			<input className={classnames(css.paginationInput)} onKeyPress={props.onKeyPressInputPage(lastPage)} value={props.currentPage} onChange={props.onChangePageInput}/>

			{props.currentPage < lastPage && <button className={classnames(css.paginationButton)} onClick={props.onClickPage(lastPage, props.currentPage + 1)}>Next</button>}
		</div>
	)
}

SearchPagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	perPage: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	keyword: PropTypes.string.isRequired,
	onKeyPressInputPage: PropTypes.func.isRequired,
	onClickPage: PropTypes.func.isRequired,
	onChangePageInput: PropTypes.func.isRequired
}


module.exports = SearchPagination;
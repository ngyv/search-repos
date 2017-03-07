var React = require('react');
var Link = require('react-router').Link;
var classnames = require('classnames');
var css = require('../styles/searchRepos.less');

function NotFound (props) {
	return (
		<div>
			<div className={classnames(css.resultDetailsTop)}>
				<Link to='/'>
					<span className={classnames('glyphicon glyphicon-menu-left', css.glyphicon)}></span>Home
				</Link>
			</div>
			<div className={classnames('col-xs-10', 'col-sm-6', 'col-xs-offset-1', 'col-sm-offset-3', 'well')} style={{marginTop: '50px'}}>
				<strong>Oops!</strong> We can't find the page you were looking for.
			</div>
		</div>
	)
}


module.exports = NotFound;
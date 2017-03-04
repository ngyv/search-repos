var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var SearchReposContainer = require('../containers/SearchReposContainer');
var SearchReposResultContainer = require('../containers/SearchReposResultContainer');


var routes = (
	<Router history={hashHistory}>
		<Route path='/' component={SearchReposContainer}>
			<Route path='search/:keyword' component={SearchReposResultContainer}></Route>
		</Route>
	</Router>
);

module.exports = routes;

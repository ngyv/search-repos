var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var SearchReposContainer = require('../containers/SearchReposContainer');


var routes = (
	<Router history={hashHistory}>
		<Route path='/' component={SearchReposContainer}></Route>
		<Route path='search/:keyword' component={SearchReposContainer}></Route>
	</Router>
);

module.exports = routes;

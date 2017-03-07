var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Redirect = ReactRouter.Redirect;
var hashHistory = ReactRouter.hashHistory;

var SearchReposContainer = require('../containers/SearchReposContainer');
var SearchReposResultDetailContainer = require('../containers/SearchReposResultDetailContainer');
var NotFound = require('../components/NotFound');


var routes = (
	<Router history={hashHistory}>
		<Route path='/' component={SearchReposContainer}></Route>
		<Route path='keyword/:keyword' component={SearchReposContainer}></Route>
		<Route path='keyword/:keyword/:page' component={SearchReposContainer}></Route>

		<Route path='id/:repoId' component={SearchReposResultDetailContainer}></Route>

		<Route path='/404' component={NotFound} />
		<Redirect from='*' to='/404' />

	</Router>
);

module.exports = routes;

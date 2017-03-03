var axios = require('axios');


axios.get(process.env.GITHUB_API_URL + '/search/repositories?q=test')
	.then(function(repos){
		console.log('repos', repos)
	})
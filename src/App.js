import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import routes from './routes';
import 'semantic-ui-css/semantic.min.css';
import './css/app.css';

class App extends Component {
	render() {
		return (
			<HashRouter>
				<Switch>
					{routes.map((route, i) => (
						<Route key={i} {...route} />
					))}
				</Switch>
			</HashRouter>
		);
	}
}

export default App;

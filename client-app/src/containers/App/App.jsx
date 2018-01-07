import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// importing main components
import Main from 'components/Main';
import SignUp from 'components/Auth/SignUp';
import SignIn from 'components/Auth/SignIn';

// import the combined reducer
import { signInReducer } from 'reducers';

// initialise application store
let store = createStore(signInReducer);


class App extends Component {
  
  render() {
    return (
      <Provider store={store}>
      	<Router>
      		<Switch>
      			<Route exact path="/app/console" component={Main} />
      			<Route exact path="/sign-up" component={SignUp} onEnter={() => console.log('inside onEnter')}/>
      			<Route exact path="/sign-in" component={SignIn} />
      			<Route render={() => <h1>404 Error </h1>} />
      		</Switch>
      	</Router>
      </Provider>
    );
  }
}


export default App;

import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import auth from 'helpers/auth';
import { logIn } from 'actions';

// importing main components
import Main from 'components/Main';
import Language from 'components/Main/Language';
import Register from 'components/Auth/Register';
import Login from 'components/Auth/Login';
import Loading from 'components/Loading/Loading';


// import the combined reducer
import reducer from 'reducers';


// initialise application store
let store = createStore(reducer, applyMiddleware(logger));

// axios defaults
if(read_cookie('token').length) {
  axios.defaults.headers.common['Authorization'] = 'JWT ' + read_cookie('token');
}


const _PrivateRoute = ({ component: Component, team, ...rest }) => (
  <Route {...rest} render={props => (
    (team.token) 
      ? <Component {...props} />
      : <Redirect to="/login" />
  )}/> 
)

const PrivateRoute = connect(
  state => ({
    team: state.team
  })
)(_PrivateRoute);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    auth.checkLoggedIn().then(res => {
      if(res && read_cookie('token').length) {
        store.dispatch(logIn(res.teamName, read_cookie('token')));
      } else {
        store.dispatch(logIn(null, null));
      }
      this.setState({ loading: false });
    });
  }

  render() {

    if(window.innerWidth <= 800 && window.innerHeight <= 600) {
      return <h1>Sorry No mobile view</h1>
    } 
    
    if(this.state.loading) {
      return <Loading loading={true} />
    }

    return (
      <Provider store={store}>
      	<Router>
      		<Switch>
            <Route exact path="/" render={() => <h1>TODO: Home Page</h1>} />
            <PrivateRoute path="/app/language" component={Language} />
      			<PrivateRoute exact path="/app/console" component={Main} />
      			<Route exact path="/register" component={Register} />
      			<Route exact path="/login" component={Login} />
      			<Route render={() => <h1>TODO: 404 Error Page</h1>} />
      		</Switch>
      	</Router>
      </Provider>
    );
  }

}


export default App;

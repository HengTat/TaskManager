import './App.css';
import Homepage from'./components/Homepage/Homepage'
import Nav from './components/nav'
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom'
import Completedtask from './components/Completedtask'
import Todo from './components/todo'
import Completedtaskanalysis from './components/Taskanaylsis/Completedanalysis';
import todoanalysis from './components/Taskanaylsis/todoanalysis';
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav></Nav>
          <Route exact path="/" component={Homepage}>
            <Redirect to ="/home" />
          </Route>
          <Route path="/home" component={Homepage} />
          <Route path="/completedtask" component={Completedtask} />
          <Route path="/todo" component={Todo} />
          <Route
            path="/completedtaskanalysis"
            component={Completedtaskanalysis}
          />
          <Route path="/todoanalysis" component={todoanalysis} />
        </header>
      </div>
      <br />
      <br />
      <br />
      <br />
      <Footer></Footer>
    </Router>
  );
}

export default App;

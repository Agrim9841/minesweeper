import './App.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import Board from './components/Board';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true}><Home /></Route>
        <Route path="/board" exact={true}><Board /></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

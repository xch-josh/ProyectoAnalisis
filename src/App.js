import logo from './logo.svg';
import './App.css';
import CategoriesView from './Components/Categories/CategoriesView.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          <div className='row'>
            <div className='col-md-6'>
              <CategoriesView />
            </div>
            <div className='col-md-6'>
              <CategoriesView />
            </div>
          </div>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import './App.css'
import { BrowserRouter, Link } from 'react-router-dom'
import AppRouter from './AppRouter'

function App() {


  return (
    <>
      <BrowserRouter>
        <nav className='nav'>
          <h3>
            <Link to="/">About</Link>
          </h3>
          <h3>
            <Link to="/Lista">List</Link>
          </h3>
          <h3>
            <Link to="/Form">Form</Link>
          </h3>
        </nav>

        <AppRouter />
      </BrowserRouter>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoute from './routes/AppRoute'
import { Provider } from 'react-redux'
import store from './redux/store/taskStore'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>

          <AppRoute />

        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

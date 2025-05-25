import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoute from './routes/AppRoute'
import { Provider } from 'react-redux'
import store from './redux/store/taskStore'
import { ToastContainer } from 'react-toastify'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>

          <AppRoute />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

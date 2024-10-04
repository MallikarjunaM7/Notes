import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import {ToastContainer} from "react-toastify"
import { AuthProvider } from '../store/auth.jsx'

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <div class="wave"></div>
    <StrictMode>
    <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition: Bounce
    />
    <App />
  </StrictMode>
  </AuthProvider>
)

import React from 'react'
import { BrowserRouter as  Router } from 'react-router-dom'
import AppRoute from './routes/AppRoute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
    <Router>
      <ScrollToTop/>
        <AppRoute/>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick />
    
    </>
  )
}

export default App
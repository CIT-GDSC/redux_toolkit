// eslint-disable-next-line no-unused-vars
import React from "react"

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from "./components/Public";
import Login from './features/auth/Login';
import Welcome from "./features/auth/Welcome";
import RequireAuth from "./features/auth/RequireAuth";



const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Layout />}>

        {/* Public routes (nested) */}
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="welcome" element={<Welcome />} />
        </Route>

      </Route>

    </Routes>
  )
}

export default App

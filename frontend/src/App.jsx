import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Logo from './pages/Logo'
import Home from './pages/Home'
import RootLayout from './components/RootLayout'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import BestBooks from './pages/BestBooks'
import DetailsPage from './pages/DetailsPage'
import NotFound from './components/NotFound'
import Books from './pages/Books'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/index'
import './App.css'

// Guard for /home — redirects admin away to /admin
function HomeGuard() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return null

  if (isSignedIn && user?.publicMetadata?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Home />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Logo />} />

        <Route element={<RootLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/books' element={<Books />} />
          <Route path='/bestSellers' element={<BestBooks />} />
          <Route path='/about' element={<About />} />
          <Route path='/books/:id' element={<DetailsPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
        </Route>

        <Route
          path='/admin'
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='*' element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
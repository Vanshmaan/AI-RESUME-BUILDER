
import { Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Home from './pages/Home'
import Layout from './pages/Layout'

const App = () => {
  return (
    <Routes>

      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Layout Routes */}
      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="builder/:resumeId"
          element={<ResumeBuilder />}
        />
      </Route>

      {/* Preview Page */}
      <Route
        path="/view/:resumeId"
        element={<Preview />}
      />

    </Routes>
  )
}

export default App
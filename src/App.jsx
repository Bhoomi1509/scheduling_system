// src/App.js
import Navbar from './Components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import AvailabilityManager from './Components/AvailabilityManager';
import NotFound from './Components/NotFound';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import RegisterPage from './Components/Register';

function App() {
  const getToken = localStorage.getItem('token')
  return (
    <div className="min-h-screen bg-gray-50">
      {getToken ?  <Navbar /> : null}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route element={<PublicRoute restricted />}>
            <Route path="/" element={<RegisterPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<AvailabilityManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from "./MainPage"
import { Login } from "./components/Login"
import { Layout } from './components/Layout';
import { Register } from "./components/Register"
import { Profile } from "./components/Profile"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { JobPage } from './components/JobPage';
import AddJob from './components/AddJob';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute redirectTo='/login'><Profile/></ProtectedRoute>} />
            <Route path='/jobpage/:id' element={<JobPage/>}/>
            <Route path='/addjob' element={<AddJob/>}/>
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

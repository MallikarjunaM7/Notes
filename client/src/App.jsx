import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Navbar} from "./components/Navbar"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Logout } from "./pages/Logout"
import { ForgotPassword } from "./pages/ForgotPassword"
import { Edit } from "./pages/Edit"
import {ChangePassword} from "./pages/ChangePassword"
import { Todos } from "./pages/Todos"
import {EditTodo} from "./pages/EditTodo"

const App = () => {
  return (
  <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/edit/:id' element={<Edit/>}/>
        <Route path='/changepassword' element= {<ChangePassword/>}/>
        <Route path='/todos' element= {<Todos/>}/>
        <Route path="/edittodo/:id" element={<EditTodo/>}/>
      </Routes>
    </BrowserRouter>
  </>)
}

export default App


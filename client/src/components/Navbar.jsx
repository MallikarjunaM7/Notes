import { NavLink } from "react-router-dom"
import {useAuth} from "../../store/auth"
import "../index.css"

export const Navbar = () => {

    const {token} = useAuth()
    return (
        <>
            <div className="container">
                <div className="main">
                    <h1 className="malli"><NavLink to="/">Todo</NavLink></h1>
                </div>
                <nav>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        {
                            !token ? 
                            <>
                                <li><NavLink to="/login">Login</NavLink></li>
                                <li><NavLink to="/register">Register</NavLink></li>
                            </>: 
                            <>
                                <li><NavLink to="/todos">Your Todos</NavLink></li>
                                <li><NavLink to="/logout">Logout</NavLink></li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
}
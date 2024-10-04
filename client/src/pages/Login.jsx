import { useState } from "react"
import {useNavigate, NavLink} from "react-router-dom"
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import 'react-toastify/dist/ReactToastify.css';

export const Login = () => {

    const {storeTokenInLS} = useAuth();
    const backapi = "https://notes-backend-ax7n.onrender.com"

    const [data, setData] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleChange = async(e) => {
        const name = e.target.name
        const value = e.target.value

        setData({
            ...data,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${backapi}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const message = await response.json()
            console.log(message)
            if(response.ok){
                toast.success("Login Successfull")
                storeTokenInLS(message.token)
                navigate("/")
            }else{
                if(message.msg){
                    toast.error(message.msg)
                }else{
                    toast.error(message.extraDetails)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" name = "email" value={data.email} onChange={handleChange} autoComplete="off"/>
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={data.password} onChange={handleChange} autoComplete="off"/>
                <br />
                <button type="submit">Login</button>
                <br />
                <h2><NavLink to="/forgotpassword">Forgot Password</NavLink></h2>
            </form>
        </>
    )
}

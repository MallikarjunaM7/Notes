import { useState } from "react"
import {useAuth} from "../../store/auth"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom"

export const ChangePassword = () => {

    const {token} = useAuth()
    const navigate = useNavigate()

    const [data, setData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value})
    }

    const backapi = "https://notes-backend-ax7n.onrender.com"

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${backapi}/api/auth/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify(data)
            })
            const message = await response.json()
            
            if(!response.ok){
                if(message.extraDetails){
                    console.log(response.ok)
                    toast.error(message.extraDetails)
                }else if(message.samepassmsg){
                    console.log(response.ok)
                    toast.error(message.samepassmsg)
                }else if(message.nomatchmsg){
                    console.log(response.ok)
                    toast.error(message.nomatchmsg)
                }else if(message.wrongmsg){
                    console.log(response.ok)
                    toast.error(message.wrongmsg)
                }
                setData({currentPassword: "",
                    password: "",
                    confirmPassword: ""})
            }

            if(message.sucmsg){
                console.log(response.ok)
                toast.success(message.sucmsg)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
    <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="currentPassword">Current Password</label>
            <input name="currentPassword" type="password" placeholder="Current Password....." value={data.currentPassword} onChange={handleChange}/>
            <br />
            <label htmlFor="newPassword">New Password</label>
            <input name="password" type="password" placeholder="New Password....." value={data.password} onChange={handleChange}/>
            <br />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input name="confirmPassword" type="password" placeholder="Confirm Password....." value={data.confirmPassword} onChange={handleChange}/>
            <br />
            <button type="submit">Change</button>
        </form>
    </>
    )
}

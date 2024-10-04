import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const EditTodo = () => {
    const {id} = useParams()

    const {token} = useAuth()
    const [todo, setTodo] = useState({todo: ""})
    const backapi = "https://notes-backend-22yb.onrender.com"

    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setTodo({...todo, [name]: value})
    }

    useEffect(() => {

        const getTodo = async() => {
            console.log("fksdnffdlfkdkgdfl",id)
            try {
                const response = await fetch(`${backapi}/api/auth/gettodo`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }, 
                    body: JSON.stringify({id: id})
                })

                const message = await response.json()

                if(message.todo){
                    setTodo(message.todo)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getTodo()
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${backapi}/api/auth/updatetodo`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...todo, id: id})
            })

            const message = await response.json()
            if(message.sucmsg){
                toast.success(message.sucmsg)
                navigate("/todos")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input name="todo" type="text" value={todo.todo} onChange={handleChange}/>
                <button type="submit">Update</button>
            </form>
        </>
    )
}

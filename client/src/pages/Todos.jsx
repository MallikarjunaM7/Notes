import { useEffect, useState } from "react"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const Todos = () => {

    const {data, token, getMyDetails } = useAuth();
    const [todoData, setTodoData] = useState({todo: "", email: "", mainId: ""})
    const [allTodos, setAllTodos] = useState([])
    const [isLoad, setIsLoad] = useState(false)
    const navigate = useNavigate()

    const backapi = "https://notes-backend-22yb.onrender.com"
    const handleChange = (e) => {
        const {name, value} = e.target
        setTodoData({...todoData, [name]: value})
    }

    useEffect(() => {
        if(data.username){
            setTodoData({...todoData, email: data.email})
        }
    }, [data.username])

    const getAlltodos = async() => {
        setIsLoad(true)
        console.log(data)
        if(data.email){
            try {
                const response = await fetch(`${backapi}/api/auth/getalltodos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({email: data.email, mainId: data._id})
                })

                const message = await response.json()
                console.log(message)
                if(message.notodosmsg){
                    setAllTodos([])
                    setIsLoad(false)
                }else if(message.allTodos){
                    setAllTodos(message.allTodos) //[{_id: '66ff7db09a4f3cfd159f3196', Todos: Array(1)}]
                    setIsLoad(false)
                }
            } catch (error) {
                console.log(error)
            }finally{
                setIsLoad(false)
            }
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        todoData.mainId = data._id
        try {
            const response = await fetch(`${backapi}/api/auth/addtodo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(todoData)
            })

            const message = await response.json()
            if(message.noconmsg){
                toast.error(message.noconmsg)
            }else if(message.sucmsg){
                toast.success(message.sucmsg)
                setTodoData({...todoData, todo: ""})
                getAlltodos()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(data.email){
            getAlltodos()
        }
    }, [data.email])

    const deleteTodoById = async(id) => {
        try {
            const response = await fetch(`${backapi}/api/auth/deletetodo`,  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({id: id, email: data.email})
            })

            const message = await response.json()
            if(message.deletemsg){
                toast.error(message.deletemsg)
                getAlltodos()
            }

        } catch (error) {
            console.log(error)
        }
    }

    const editTodoById = async(id) => {
        try {
            navigate(`/edittodo/${id}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="todo" type="text" value={todoData.todo} onChange={handleChange} placeholder="Enter Your todo....."/>
                <button type="submit">Add Todo</button>
            </form>
            {
                isLoad? 
                <>Loading...</>
                :<>
                    {
                allTodos.length === 0 ?
                <>
                    <h2>No Todos as of Now Create one....</h2>
                </>:
                <>
                    <section className="">
                        <div className="container">
                            <h1>Your Todos</h1>
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Todo</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTodos.map((currElement, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{currElement.todo}</td>
                                                <td><button onClick={() => editTodoById(currElement._id)}>Edit</button></td>
                                                <td><button onClick={() => deleteTodoById(currElement._id, currElement)}>Delete</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            }
                </>
            }
        </>
    )
}

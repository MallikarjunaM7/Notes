import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth"
import {useNavigate, NavLink} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {

    const  {token, data, isLoading, getMyDetails} = useAuth();
    const navigate = useNavigate()
    

    const handleSubmit = async(id) => {
        if(id){navigate(`/edit/${id}`)}
    }

    const handlePassword = () => {
        navigate("/changepassword")
    }
    useEffect(() => {
        getMyDetails()
    }, [])

    console.log(data)

    if(isLoading){
        return <><h1>Loading....</h1></>
    }


    if(!token ){
        return(
        <>
            <h1>Welcome </h1>
        </>)
    }
    
    return(
        <>
            <div className="homediv">
                <h1>Welcome {data.username}</h1>
                <h2>Your Email : {data.email}</h2>
                <h2>Your Contact number : {data.phone}</h2>
                <br />
                <button onClick={() => handleSubmit(data._id)}>Edit</button>
                <br />
                <button onClick={() => handlePassword()}>Change Password</button>
            </div>
        </>
    )
}
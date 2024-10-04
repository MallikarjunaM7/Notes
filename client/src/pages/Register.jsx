import { useState } from "react"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const Register = () => {

    const navigate = useNavigate()

    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
        password: ""
    })
    const [otpdata, setOtpdata] = useState({
        email: "",
        otp: ""
    })

    const backapi = "http://localhost:5000"

    const [otpInput, setOtpInput] = useState(false)
    const [processing, setProcessing] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target
        setData({...data, [name]: value})
    } 

    const handleSubmit = async(e) => {
        e.preventDefault()
        setProcessing(true)
        try {
            const response = await fetch(`${backapi}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const message = await response.json()

            if(message.extraDetails){
                toast.error(message.extraDetails)
            }
            if(message.alreadymsg){
                toast.error(message.alreadymsg)
            }else if(message.sucmsg){
                toast.success(message.sucmsg)
                setOtpInput(true)
                setProcessing(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeOTP = async(e) => {
        const {name, value} = e.target;
        setOtpdata({...otpdata, [name]: value})
    }

    const handleSubmitotp = async(e) => {
        e.preventDefault()
        console.log(data)
        const response  = await fetch(`${backapi}/api/auth/verifyotp/${data.email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(otpdata)
        })
        console.log(response)
        const message = await response.json()
        if(message.extraDetails){
            toast.error(message.extraDetails)
        }
        if(response.ok && message.sucmsg){
            toast.success("OTP Verifired: Registered Successfully")
            navigate("/login")
        }else if(message.inmsg){
            toast.error(message.inmsg)
            console.log(data)
            setOtpdata({...otpdata, otp: ""})
        }
    }

    return (
    <>
            <div className="full">
                <form onSubmit={handleSubmit}>
                    <div>
                    <input autoComplete="off" type="text" name="username" placeholder="Username"  value={data.username} onChange={handleChange}/>
                    </div>
                    <br />
                    <div>
                    <input autoComplete="off" type="email" name="email" placeholder="email"  value={data.email} onChange={handleChange}/>
                    </div>
                    <br />
                    <div>

                    <input autoComplete="off" type="number" name="phone" placeholder="phone"  value={data.phone} onChange={handleChange}/>
                    </div>
                    <br />
                    <div>

                    <input autoComplete="off" type="password" name="password" placeholder="password"  value={data.password} onChange={handleChange}/>
                    </div>
                    <br />
                    <button type="submit">Submit</button>
                </form>
        {
            otpInput
            ?
            <>
                <form onSubmit={handleSubmitotp}>
                    <input name="otp" type="text" autoComplete="off" placeholder="Enter otp" value={otpdata.otp} onChange={handleChangeOTP}/>
                    <button type="submit">Verify</button>
                </form>
            </> : <></>
        }
        {
            processing? <>Processing....</>:<></>
        }
        </div>
        
    </>)
}
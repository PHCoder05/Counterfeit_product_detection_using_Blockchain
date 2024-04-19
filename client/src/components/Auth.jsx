import Axios from "axios";
import React, { useEffect, useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router";
import useEth from "../contexts/EthContext/useEth";


function Auth(){
    const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("4");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { state: { contract, accounts } } = useEth();
  //const addr = accounts[0];

  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = (e) =>{
      if (isRegister) {
        Axios.post("http://localhost:3001/register", {
      email: email,
      username: username,
      password: password,
      type: type,
      addr: accounts[0],
    }).then((response) => {
      if(response.data.message){
        alert(response.data.message);
        e.preventDefault();
        
      }else{
        alert("ACCOUNT CREATED SUCCESSFULLY");
        alert(accounts[0]);
      }
    })
    } else {
        Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
      addr: accounts[0],
    }).then((response) => {
      if(response.data.message){
        alert(response.data.message);
      }else{
        alert(response.data[0].email);
        sessionStorage.setItem("userId", response.data[0]._id);
        console.log(sessionStorage.getItem("userId"));
        sessionStorage.setItem("name",response.data[0].username);
        sessionStorage.setItem("role",response.data[0].role);
        sessionStorage.setItem("addr",response.data[0].address);
        navigate("/home");
      }
    })
    }

  }

  const current_theme = localStorage.getItem('current_theme');
  const [theme,setTheme] = useState(current_theme ? current_theme: 'dark');

    return     <div className={`container ${theme}`}>
      <div className="loginForm">
        <form>
          <h4>{isRegister ? "Register " : "Login "}Here</h4>
          {isRegister && (<div>
          <input className="textInput" type="text" name="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="Enter your Email Address" required />
          </div>)}
          <div>
          <input className="textInput" type="username" name="username" onChange={(e) => {setUsername(e.target.value)}} placeholder="Enter your Username" required />
          </div>
          <div>
          <input className="textInput" type="password" name="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter your Password" required />
          </div>
          {isRegister && (
            <div>
          <select className="textInput" name="type" defaultValue="4" onChange={(e) => {setType(e.target.value)}} required>
          <option value="1">Manufacturer</option>
          <option value="2">Distributor</option>
          <option value="3">Retailer</option>
          <option value="4">Customer</option>
          </select>
          </div>)}
          <input className="button" type="submit" onClick={handleSubmit} value={isRegister ? "Register" : "Login"} />
          <div className="col-md-6 text-end">
                  <button
                    className="btn-link"
                    onClick={() => setIsRegister(!isRegister)}
                  >
                    {isRegister ? "Login" : "Register"} ?
                  </button>
            </div>
        </form>
      </div>
    </div>
}
export default Auth;
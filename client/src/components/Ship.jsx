import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import useEth from "../contexts/EthContext/useEth";
import Axios from "axios";
import "./Ship.css";


const Ship = ({ setShipOpen }) => {
    const [data, setData] = useState('');
    const [file,setFile] = useState(null);
    const [state,setState] =useState('');
    const [isState,setIsState] = useState(false);
    const [payer,setPayer] = useState('');
    const [addr, setAddr] = useState('');
    const qrRef = useRef(null);
    const type=sessionStorage.getItem("role");

    const { state: { contract, accounts }, web } = useEth();

    const handleClick =() => {
        qrRef.current.click();
    }
      
    const retrieveFile = async (e) => {
        const qrdata = e.target.files[0]; //files array of files object
        setFile(qrdata);
        await QrScanner.scanImage(qrdata).then(result => {
          setData(result);})
        .catch(error => console.log(error || 'No QR code found.'));
        
    };

    useEffect(()=>{
      data && isEligible();
    },[data]);

    const isEligible = async () => {
      const name = sessionStorage.getItem("name");
      console.log(name);
      console.log(web.eth);
      
      try{
      const eligible = await contract.methods.getLatestOwner(data).call({ from: accounts[0]});
      console.log(eligible);
      console.log(name);
      if(eligible==name){
        const isPay = await contract.methods.getPaymentStatus(data).call({from: accounts[0]});
        if(isPay){
        getRole();
        }else{
          alert("Complete your payment for the product "+data+" to proceed with shipment");
          setShipOpen(false);
        }
      }
      else{
        setState("Current owner of product "+ data +" is "+eligible);
      }
      }catch(error){
        setState("Fake Product!!!!!!!!!! ");
      }
    }


    const getRole = () =>{

      var role=1;
    if(type==1){
      role=2;
    }else if(type==2){
      role=3;
    }else if(type==3){
      role=4;
    }
    Axios.post("http://localhost:3001/home", {
      role: role,}
    ).then(async (response)=>{ 
        const prodname=data;
        console.log(data);
            const states = await contract.methods.getTotalStates(prodname).call({ from: accounts[0]});
            console.log("role");
            console.log(type);
            console.log("states");
            console.log(states);
            
            if(type!=states){
                if(states==0){
                    setState("No such product. It is Fake!!!!!!!!!!!");
                }else if(states==1){
                    setState("Product at Manufacturer");
                }else if(states==2){
                    setState("Product at Distributor");
                }else if(states==3){
                    setState("Product at Retailer");
                }else{
                    setState("Product at Customer");
                }
            }else{
                setIsState(true);
                let select = document.querySelector("#selectNumber");
        for(let i=0;i<response.data.length;i++){
            let opt = response.data[i].username;
            let val = response.data[i].address;
            let e1 = document.createElement("option");
            e1.textContent = opt;
            console.log(opt);
            e1.value = [val, opt];
            console.log(val);
            select.appendChild(e1);
        }
            }
          });
    }

    const handleSelect = (e) => {
      const l1=(e.target.value).split(",");
      setPayer(l1[1]);
      setAddr(l1[0]);
    }

    const handleSubmit = async () => {
        const name = sessionStorage.getItem("name");
      console.log(name);
      var today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() +' ' + today.getHours() + ':' + today.getMinutes() +':'+ today.getSeconds();
      console.log(data);
      console.log(date);
      const user = payer;
      console.log(user);
      console.log(addr);
      try{
        if(sessionStorage.getItem("addr")==accounts[0]){
        const receipt = await contract.methods.addState(data, user, addr, date).send({ from: accounts[0] });
      console.log(receipt);
      alert("Successfully shipped to "+addr);}
      else{
        setState("ENsure your account address");
      }
      
      setShipOpen(false);
      }catch(error){
        console.log(error.message);
        console.log(error);
        setState("No such product. It is Fake!!!!!!!!!!!");
      }
    }

    return <div className="shipBackground">
    <div className="shipContainer">
    <div className="ship">Ship a Product</div>
      <div className="body">
          <button type="button" onClick={handleClick} hidden="hidden">Scan QR code</button>
        <input
          type="file"
          id="file-upload"
          name="data"
          className="d-none"
          accept=".png, .jpg, .jpeg"
          ref={qrRef}
          onChange={retrieveFile}
        /><br/>
        <form id="myForm">
        <select id="selectNumber" onChange={(e) => handleSelect(e)} required>
              <option className="address">--Ship to Person--</option>
            </select>
            { !isState && (<p>{state}</p>)}
          </form>
          <button onClick={handleSubmit} disabled={!data}>Ship</button>
        </div>
        <div className="footer">
            <button
              onClick={() => {
                setShipOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={()=>{setShipOpen(false);}} id="donebtn">Done</button>
          </div>
    </div></div>;
        
}

export default Ship;
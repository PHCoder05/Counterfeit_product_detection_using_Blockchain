import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import useEth from "../contexts/EthContext/useEth";
import "./Ship.css";
import "./Pay.css";

const Pay =({setPayOpen}) => {
    const [data, setData] = useState('');
    const [file,setFile] = useState(null);
    const [details,setDetails] = useState('');
    const qrRef = useRef(null);
    const { state: { contract, accounts }, web } = useEth();
    
    const handleClick =() => {
        qrRef.current.click();
    }
      
    const retrieveFile = async (e) => {
        const qrdata = e.target.files[0]; //files array of files object
        setFile(qrdata);
        const result = await QrScanner.scanImage(qrdata);
        setData(result);
    };

    const handleSubmit = async () => {
        const prodname=data;
        console.log(prodname);
        try{
          const name=sessionStorage.getItem("name");
          const eligible = await contract.methods.getLatestOwner(data).call({ from: accounts[0]});
      console.log(eligible);
      console.log(name);
      if(eligible==name && sessionStorage.getItem("addr")==accounts[0]){
          const receipt = await contract.methods.getPayDetais(prodname).call({ from: accounts[0] });
        console.log(receipt[0]);
        console.log(receipt[1]);
        console.log(receipt[2]);
        const name=sessionStorage.getItem("name");
        console.log(name);
        if(receipt[0]){
            setDetails("Payment to this product is completed");
        }else{
            setDetails("You can proceed with payment");
            console.log(details);
        await contract.methods.pay(prodname).send({
            from: accounts[0],
            value: web.utils.toWei(receipt[2],'ether')
          });
          //await contract.methods.pay(prodname).send({ from: accounts[0] });
          alert("Payment Successful");
          setPayOpen(false);
        }}else{
          setDetails("Current owner of product "+ data +" is "+eligible);
        }
        }catch(error){
          setDetails("No such product. It is Fake!!!!!!!!!!!");
        }
    }

    return <div className="payBackground">
     <div className="payContainer">
     <div className="pay">Pay for a product</div>
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
     />
     <br/>
     <div className="check-details">
       { data && (<p>Product Name: {data}</p>)}
       <button onClick={handleSubmit} >Proceed to Pay</button>
        { details && (<p>{details}</p>)}
    </div>
    </div>
    <div className="footer">
            <button
              onClick={() => {
                setPayOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={()=>{setPayOpen(false);}} id="donebtn" >Done</button>
    </div>
    </div></div>;
}
export default Pay;
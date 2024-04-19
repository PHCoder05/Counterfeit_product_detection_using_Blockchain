import { useState, useRef } from "react";
import QrScanner from "qr-scanner";
import useEth from "../contexts/EthContext/useEth";
import "./check.css";

const Check = ({setCheckOpen}) => {
    const [data, setData] = useState('');
    const [file,setFile] = useState(null);
    const [details,setDetails] = useState('');
    const qrRef = useRef(null);
    const { state: { contract, accounts } } = useEth();

    const handleSubmit = async () => {
      const prodname=data;
      console.log(prodname);
      try{
        const receipt = await contract.methods.searchProduct(prodname).call({ from: accounts[0] });
      console.log(receipt);
      setDetails(receipt);
      }catch(error){
        setDetails("No such product. It is Fake!!!!!!!!!!!");
      }
    }

    const handleClick =() => {
      qrRef.current.click();
    }
    
    const retrieveFile = async (e) => {
      const qrdata = e.target.files[0]; //files array of files object
      setFile(qrdata);
      const result = await QrScanner.scanImage(qrdata);
      setData(result);
    };

    return <>
    <div className="checkBackground">
        <div className="checkContainer">
          <div className="check">Scan a QRCode </div>
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
        /><br />
        <div className="check-details">
          { data && (<p>Product Name: {data}</p>)}
          <button onClick={handleSubmit} >Get Details</button>
          { details && (<p>Details : {details}</p>)}
        </div>
          </div>
          <div className="footer">
            <button
              onClick={() => {
                setCheckOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={()=>{setCheckOpen(false);}} id="donebtn" >Done</button>
          </div>
        </div>
      </div>
    </>;
}

export default Check;
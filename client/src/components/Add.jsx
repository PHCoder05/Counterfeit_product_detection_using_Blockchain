import QRCode from "qrcode";
import {useState} from "react";
import useEth from "../contexts/EthContext/useEth";
import "./Add.css";

const Add = ({setAddOpen, username}) => {

    const [text, setText] = useState('');
    const [cost,setCost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { state: { contract, accounts } } = useEth();


    const generateQrCode = async (e) => {
      const name = sessionStorage.getItem("name");
      console.log(name);
      var today = new Date();
      console.log(cost);
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() +' ' + today.getHours() + ':' + today.getMinutes() +':'+ today.getSeconds();
      if(sessionStorage.getItem("addr")==accounts[0]){
      console.log(date);
        try {
          await contract.methods.newItem(text,cost,name,date).send({ from: accounts[0] }).then(async receipt => {
              console.log(receipt);
              const response = await QRCode.toDataURL(text);
              setImageUrl(response);
            });
        }catch (error) {
          alert("Product already exists");
          console.log(error.message);
        }
      }else{
        alert("Ensure your account address and proceed further");
      }
    }

    return (<div className="addBackground">
    <div className="addContainer">
      <div className="add">Add a new product</div>
      <div className="body">
        <input type="text" placeholder="Enter Product Name" onChange={(e) => setText(e.target.value)}/>
        <input type="number" placeholder="Enter Product Cost " onChange={(e)=>{setCost(e.target.value)}}/>
        <button className="generate" variant="contained" color="primary" onClick={() => generateQrCode()}>
          Generate</button>
        <br/>
        <br/>
        {imageUrl ? (<a href={imageUrl} download="qr.png">
                      <img src={imageUrl} alt="img"/>
                      </a>) : null}
        </div>
        <div className="footer">
            <button
              onClick={() => {
                setAddOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            
            <button onClick={()=>{setAddOpen(false);}} id="donebtn" disabled={!imageUrl} >Done</button>
          
    </div></div></div>);
}

export default Add;
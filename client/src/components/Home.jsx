import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useEth from "../contexts/EthContext/useEth";
import Add from "./Add";
import Ship from "./Ship";
import Check from "./Check";
import Pay from "./Pay";
import "./Home.css";


const Home = () => {
    const [shipOpen, setShipOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [checkOpen, setCheckOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const navigate = useNavigate();
    const type=sessionStorage.getItem("role");

    const { state: { contract, accounts }, web } = useEth();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
    }
  }, [navigate]);

  const handleShipment = (e) => {
    setShipOpen(true);
  }
  const current_theme = localStorage.getItem('current_theme');
  const [theme,setTheme] = useState(current_theme ? current_theme: 'dark');

    return (<>
    {checkOpen && (<Check setCheckOpen={setCheckOpen}></Check>)}
    {addOpen &&(<Add setAddOpen={setAddOpen} name={sessionStorage.getItem("username")} ></Add>)}
    {shipOpen && (
        <Ship setShipOpen={setShipOpen} ></Ship>
      )}
    {payOpen && (<Pay setPayOpen={setPayOpen} ></Pay>)}
    
    <div className="container">
      <div className="homePage">
        <form>
        {!checkOpen && (<button className="button-86" onClick={() =>setCheckOpen(true)}>Check Details</button>)}
        
        {(type==1 && !addOpen) && (<button className="button-86" onClick={() => setAddOpen(true)}>Add Product</button>)}

        {(type!=1 && !payOpen) && (<button className="button-86" onClick={()=>setPayOpen(true)}>Payment</button>)}
              
        {(type!=4 && !shipOpen) && (
        <button className="button-86" onClick={handleShipment}>
          Shipment
        </button>
      )}
        <button
            className="button-86"
            onClick={() => {
              sessionStorage.removeItem("userId");
              navigate("/");
            }}
          >
            Logout
          </button>
          </form>
        </div>
    </div></>);
}

export default Home;
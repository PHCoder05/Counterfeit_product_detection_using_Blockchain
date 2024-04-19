const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "supplychain"
})

app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const type= req.body.type;
    const addr = req.body.addr;

    con.query("INSERT INTO users (email, username, password, role, address) VALUES (?, ?, ?, ?, ?)", [email, username, password, type, addr], 
        (err, result) => {
            if(result){
                res.send(result);
            }else{
                res.send({message: "ENTER CORRECT ASKED DETAILS!"})
            }
        }
    )
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const addr = req.body.addr;
    con.query("SELECT * FROM users WHERE username = ? AND password = ? AND address = ?", [username, password, addr], 
        (err, result) => {
            if(err){
                req.setEncoding({err: err});
            }else{
                if(result.length > 0){
                    res.send(result);
                }else{
                    res.send({message: "WRONG USERNAME OR PASSWORD OR CONNECT TO RIGHT ACCOUNT!"})
                }
            }
        }
    )
})

app.post("/home", (req, res) => {
    const role = req.body.role;
    con.query("SELECT * FROM users WHERE role = ?", [role], 
        (err, result) => {
            if(err){
                req.setEncoding({err: err});
            }else{
                if(result.length > 0){
                    res.send(result);
                }else{
                    res.send({message: "WRONG USERNAME OR PASSWORD!"})
                }
            }
        }
    )
})
app.listen(3001, () => {
    console.log("running backend server");
})
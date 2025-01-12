const express = require("express"); 
const app = express(); 
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/",(req,res)=>{
  res.redirect("/index.html");
});


//create
app.post("/create", (req, res) => {   
  console.log(req.body.name);
  var name = req.body.name;
  var email = req.body.email;
  try {
    connection.query(
      "INSERT into users (name,email) values(?,?)",  
      [name, email],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {  
          res.redirect("/data"); 
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//read operation 
app.get("/data", (req, res) => {
  const allData = "select * from users";
  connection.query(allData, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.render("read.ejs", { rows });
    }
  });
});


//delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from users where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});

//passing data to update page
app.get("/update-data", (req, res) => {
  const updateData = "select * from users where id=?";
  connection.query(updateData, req.query.id, (err, eachRow) => {
    if (err) {
      res.send(err);
    } else {
      console.log(eachRow[0]);
      result = JSON.parse(JSON.stringify(eachRow[0]));  
      res.render("edit.ejs", { data: eachRow[0] });
    }
  });
});

//final update
app.post("/update", (req, res) => {
  const id_data = req.body.hidden_id;
  const name_data = req.body.name;
  const email_data = req.body.email;

  console.log("id...", req.body.name, id_data);

  const updateQuery = "update users set name=?, email=? where id=?";

  connection.query(
    updateQuery,
    [name_data, email_data, id_data],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/data");
      }
    }
  );
});



app.listen(process.env.PORT, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});
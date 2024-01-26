//servidor simple: npm start y accedemos a nuestro servidor localhost:3000/
/*const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
app.get("/", (req, res) => {
  res.send("API running");
});
app.listen(3000);
*/

const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db.js");

dotenv.config();
//las solicitudes codificadas en URL. Precisa extended: trueque el req.bodyobjeto contendrá valores de cualquier tipo en lugar de solo cadenas
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
//puedes cargar los archivos que están en el public y views directorio 
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

//read
app.get("/data", (req, res) => {
  const allData = "select * from demo_table";
  connection.query(allData, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      // res.json({ rows });
      res.render("read.ejs", { rows });
    }
  });
});

//create
app.post("/create", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  try {
    connection.query(
      "INSERT into demo_table (name,email) values(?,?)",
      [name, email],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from demo_table where id=?";
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
    const updateData = "select * from  demo_table where id=?";
    connection.query(updateData, req.query.id, (err, eachRow) => {
      if (err) {
        res.send(err);
      } else {
        console.log(eachRow[0]);
        result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
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
  
    const updateQuery = "update demo_table set name=?, email=? where id=?";
  
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

app.listen(process.env.PORT || 3000, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});
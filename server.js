const express = require("express")
const mysql = require("mysql")
const BodyParser = require("body-parser")
const app = express();

app.use(BodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.set("views","views")

const db = mysql.createConnection({
    host: "localhost",
    database: "db_kelas",
    user: "root",
    password: "",
})

db.connect((err) => {
    if (err) throw err
    console.log("database connected...")

    
    app.get("/", (req,res) => {
        const sql ="SELECT * FROM data_kelas"
        db.query(sql, (err, result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render("index",{users: users,title: "DATA KELAS"})
        })   
    })   
    //tambah data
    app.post("/tambah",(req,res) => {
     const insertSql = `INSERT INTO data_kelas (Nama, Kelas) VALUES ('${req.body.Nama}','${req.body.Kelas}');`
     db.query(insertSql,(err,result)=>{
        if (err) throw err
        res.redirect("/")
        })
    })
    //edit data
    app.get("/edit/:id", (req, res) => {
        const userId = req.params.id;
        const selectSql = `SELECT * FROM data_kelas WHERE id = ${userId}`;
        db.query(selectSql, (err, result) => {
          if (err) throw err;
          const userData = JSON.parse(JSON.stringify(result[0]));
          res.render("edit", { user: userData, title: "EDIT DATA" });
        });
      });

      app.post("/edit/:id", (req, res) => {
        const userId = req.params.id;
        const updateSql = `UPDATE data_kelas SET Nama = '${req.body.Nama}', Kelas = '${req.body.Kelas}' WHERE id = ${userId}`;
        db.query(updateSql, (err, result) => {
          if (err) throw err;
          res.redirect("/");
        });
      });

       // Tambahkan rute untuk menghandle delete
    app.get("/delete/:id", (req, res) => {
        const userId = req.params.id;
        const deleteSql = `DELETE FROM data_kelas WHERE id = ${userId}`;
        db.query(deleteSql, (err, result) => {
        if (err) throw err;
        res.redirect("/");
        });
    });

   
})

app.listen(8000,() =>{
    console.log("Server siap..")
})

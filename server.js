 const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SIBILROCKERS15601!", 
    database: "pokemon_game"
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected!");
    }
});

// CREATE
app.post("/register", (req, res) => {

    const { username, email, age, password } = req.body;

    db.query(
        "INSERT INTO trainers(username,email,age,password) VALUES(?,?,?,?)",
        [username, email, age, password],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Trainer Added!" });
        }
    );
});

// READ
app.get("/trainers", (req, res) => {

    db.query("SELECT * FROM trainers", (err, result) => {

        if (err) return res.json(err);

        res.json(result);

    });

});

// UPDATE
app.put("/trainers/:id", (req, res) => {

    const { username, email, age } = req.body;

    db.query(
        "UPDATE trainers SET username=?, email=?, age=? WHERE id=?",
        [username, email, age, req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Updated!" });
        }
    );

});

// DELETE
app.delete("/trainers/:id", (req, res) => {

    db.query(
        "DELETE FROM trainers WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Deleted!" });
        }
    );

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
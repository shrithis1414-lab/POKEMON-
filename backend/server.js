require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected!");
    }
});

function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {

        return res.status(401).json({

            message: "Access Denied! No Token."

        });

    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {

            return res.status(403).json({

                message: "Invalid Token!"

            });

        }

        req.user = decoded;

        next();

    });

}

function verifyAdmin(req, res, next) {

    if (req.user.email !== "admin@gmail.com") {

        return res.status(403).json({
            message: "Access Denied! Admins only."
        });

    }

    next();

}


app.post("/register", async (req, res) => {

    const { username, email, age, password } = req.body;

    // Check if email already exists
    db.query(
        "SELECT * FROM trainers WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.json(err);
            }

            if (result.length > 0) {
                return res.json({
                    message: "Email already registered!"
                });
            }

            try {

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Store hashed password
                db.query(
                    "INSERT INTO trainers(username, email, age, password) VALUES(?,?,?,?)",
                    [username, email, age, hashedPassword],
                    (err) => {

                        if (err) {
                            return res.json(err);
                        }

                        res.json({
                            message: "Trainer Registered Successfully!"
                        });

                    }
                );

            } catch (error) {

                res.status(500).json({
                    message: "Something went wrong!"
                });

            }

        }
    );

});


app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM trainers WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.json(err);
            }

            if (result.length === 0) {
                return res.json({
                    message: "Invalid Email or Password!"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.json({
                    message: "Invalid Email or Password!"
                });
            }

            const token = jwt.sign(

                {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },

                JWT_SECRET,

                {
                    expiresIn: "1h"
                }

            );

            res.json({

                message: "Login Successful!",

                token,

                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    age: user.age
                }

            });

        }

    );

});

app.get("/trainers", verifyToken, verifyAdmin, (req, res) => {

    db.query("SELECT * FROM trainers", (err, result) => {

        if (err) return res.json(err);

        res.json(result);

    });

});

app.put("/progress", verifyToken, (req, res) => {

    const { score, level, streak } = req.body;

    db.query(
        "UPDATE trainers SET score=?, level=?, streak=? WHERE id=?",
        [score, level, streak, req.user.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Progress saved!" });
        }
    );

});

app.get("/progress", verifyToken, (req, res) => {

    db.query(
        "SELECT score, level, streak FROM trainers WHERE id=?",
        [req.user.id],
        (err, result) => {
            if (err) return res.json(err);
            res.json(result[0]);
        }
    );

});

app.get("/pokemon", (req, res) => {

    db.query("SELECT * FROM pokemon", (err, result) => {

        if (err) return res.json(err);

        res.json(result);

    });

});


// UPDATE
app.put("/trainers/:id", verifyToken, verifyAdmin, (req, res) => {

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
app.delete("/trainers/:id", verifyToken, verifyAdmin, (req, res) => {

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
require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const port = 3000;

// data
const data = [{
        email: "p1@gmail.com",
        name: "person1",
        gender: "male",
        age: 30
    },
    {
        email: "p2@gmail.com",
        name: "person2",
        gender: "female",
        age: 25
    }
];


// get the data based on authorization
app.get('/data', authenticateToken, (req, res) => {
    const response = data.filter(d => d.email === req.payload.email).map(d => {
        return { 'name': d.name, 'gender': d.gender, 'age': d.age };
    })
    res.json(response);
});


// middleware to authenticate token to access data
function authenticateToken(req, res, next) {
    // authorization header will be sent as request to access data
    // format: Bearer TOKEN
    const authHeader = req.headers['authorization'];
    const TOKEN = authHeader && authHeader.split(' ')[1]
    if (TOKEN == null) return res.status(401).send("Authorization token is not provided or invalid"); // 401: unauthorize
    // verify TOKEN
    // format: jwt.verify(payload, SECRET_KEY,callback)
    jwt.verify(TOKEN, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.status(403).send("You are not authorized to access data"); // 403: forbidden
        req.payload = payload;
        next();
    });
};


// server listening
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
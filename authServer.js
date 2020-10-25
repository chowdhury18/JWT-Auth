require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const port = 4000;

// store refreshToken
let refreshTokens = [];


// login and generate access token and refresh token
app.post('/login', (req, res) => {
    // Authenticate first [this code does not include any authentication code, authorization only]
    const email = req.body.email;
    const payload = { email: email };

    // generate JWT token 
    const accessToken = generateAccessToken(payload);

    // generate refresh token
    const refreshToken = generateRefreshToken(payload);

    // storing the refreshToken for future authorization
    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});


// generate access token based on refresh token
app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null) return res.status(401).json("Authorization token is not provided or invalid");

    if (!refreshTokens.includes(refreshToken)) return res.status(403).json("You are not authorized to access data");

    // verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return res.send("You are not authorized to access data", 403); // 403: forbidden
        const accessToken = generateAccessToken({ email: payload.email });
        res.json({ accessToken: accessToken });
    });
});


// delete the refresh tokens
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.sendStatus(204); // 204: Content Not Found
});

// Generate access token and refresh token
function generateAccessToken(payload) {
    // format: jwt.sign(payload, ACCESS_TOKEN_SECRET)
    const accessToken = jwt.sign(payload,
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    return accessToken;
}

function generateRefreshToken(payload) {
    // format: jwt.sign(payload, ACCESS_TOKEN_SECRET)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    return refreshToken;
}

// Sever listening
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
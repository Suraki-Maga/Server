
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { PORT } = require("./config")
const { NotFoundError } = require("./utils/errors")
const security=require("./middleware/security")
var cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth")
const driverRoutes = require("./routes/driverauth")
const sessions = require('express-session');

const app = express()
app.use(cookieParser());

// enable cross-origin resource sharing for all origins for all requests
// NOTE: in production, we'll want to restrict this to only the origin
// hosting our frontend.
app.use(cors())
// parse incoming requests with JSON payloads
app.use(express.json())
// log requests info
app.use(morgan("tiny"))

const oneHour = 1000 * 60 * 60;
app.use(sessions({
  secret: process.env.SECRET_KEY,
  saveUninitialized:true,
  cookie: { maxAge: oneHour },
  resave: false
}));

//for every request, check  whether a token exist in the authorization header.
//if it does, attach the decoded user to res.local

app.use(security.extractUserfromJwt)

app.use("/auth", authRoutes) 

app.use("/driverauth", driverRoutes) 

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError())
})
 
/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    error: { message, status },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { userInfoRoute } from './routes/userInfo.js';
import session from 'express-session';



const __dirname = import.meta.dirname;
const staticPath = path.join(__dirname,'..','front-end','public');
const app = express();
const port = 3000;

const URI = 'mongodb://localhost:27017/WebCup2025'
// Use the session middleware
const sessionOptions = {
  secret: 'super secret secret',
  cookie: { maxAge: 86400000 }, // 24 hours
  resave: false,
  saveUninitialized: false
};

app.use(session(sessionOptions));



// logger middleware
app.use((req,res,next) =>{
  console.log(req.method,req.hostname, req.path);
  next();
});

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON
app.use(express.json());


// Deliver static pages
app.use(express.static(staticPath));

// Profile info route
app.use("/profile-info", userInfoRoute);






app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const userRoutes = require('./routes/user');


const port = process.env.PORT || 3232;

// creates server instance
const server = http.createServer(app);

// all middlewares goes here
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger(':method :url :status :res[content-length] - :response-time ms'))
// route request to specific file based on path of the route
app.use('/users',userRoutes);

// api error handlers
app.use((req,res,next)=>{
  next(new Error("Path Not Found"))
});
app.use((err,req,res,next)=>{
  if(err.status == 500) console.log('internal error: \n',err);
  res.status(500).json({
    Error:err.message
  })
})

server.listen(port,()=>{
  console.log(`Server listening on port: ${port}`)
});
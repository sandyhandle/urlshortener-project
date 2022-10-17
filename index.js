require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
const urlparser = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });


const schema = new mongoose.Schema({url: "string"});
const Url = mongoose.model("Url",schema);

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl",function(req,res) {
  console.log(req.body);
  const bodyurl = req.body.url;

  const something = dns.lookup(urlparser.parse(bodyurl).hostname,
  (error, address )  => {
    if (!address) {
      res.json({error: "Invalic URL"})
    }else {
      const url = new Url({url : bodyurl})
      url.save((err,data) => {
        res.json({
          original_url: data.url,
          short_url: data.id
        })
      })
    }
    // console.log("dns",error);
    // console.log("address", address);
  })
  // console.log("something",something)
  // const url = new Url({url: req.body.url})
  // url.save((err,data) => {
  //   res.json({created: true})
  // })
  // res.json({
  //   body: req.body,
  //   work: "working"
  // })
})

app.get("/app/shorturl/:id",(req,res) => {
  const id = req.params.id;
  console.log(req.params.id);
  console.log(Url.findById(id));
  Url.findById(id, (err,data) => {
    if (!data) {
      res.json({error: "Invalid Url"})
    }else{
      res.redirect(data.url)
    }
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

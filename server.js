const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const dotenv = require('dotenv').config()

const app = express()

// console.log(process.env);

// console.log(process.env.MONGO_URI);
// console.log(process.env.PORT)


mongoose.connect(process.env.MONGO_URI, 
{
  useNewUrlParser: true, useUnifiedTopology: true,      useFindAndModify: false,

},
() => console.log('connected to db')
);



app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });


  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404);

 

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

console.log(process.env.PORT)

app.listen( process.env.PORT || 3000,()=>{
  console.log(`Server started on http://localhost:3000`);
});
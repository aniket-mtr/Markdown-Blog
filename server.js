const express = require('express')
const mogoose = require('mongoose')
const article = require('./routes/articles.js')
const Article = require('./models/article.js')
const methodOverride = require('method-override')
const path = require('path')

const app = express()
const port = 3000

mogoose.connect('mongodb://localhost:27017/blog')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }))
app.use('/articles', article) //articles route
app.use(methodOverride('_method')) //this is required to process delete/put request etc. in forms

app.get('/', async(req, res)=>{
    let articles = await Article.find({}).sort({createDate:'desc'})
    res.render('./articles/index', {article : articles})
})
app.listen(port, ()=>{
    console.log("listening")
})
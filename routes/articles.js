const express = require('express')
const Article = require('../models/article.js')

const router = express.Router()

router.get('/new', (req, res)=>{
    res.render("./articles/new", {article: new Article({})}) //pass blank article
})

router.get('/:slug', async (req, res)=>{
    let article = await Article.findOne({slug:req.params.slug})
   if(article)
    {
        res.render('articles/readArticle', {article:article})
    }
    else res.redirect('/')
    // res.send(`the is is ${req.params.id}`)
})

router.post('/', async(req, res)=>{
    let article = new Article({ //to use req.body must have app.use(express.urlEncoded({extended:false})) in server.js before the articles route
        title:req.body.title.trim(),
        description:req.body.description.trim(),
        markdown:req.body.markdown.trim()
    })
    try {
        article = await article.save() //update article with the id of the created article
        res.redirect(`/articles/${article.slug}`)
    } catch (error) {
        console.log(error)
        res.render('articles/new',{article:article}) //pass the previous incomplete article so no need to fill again
    }
})


// router.delete('/:id', async(req, res)=>{
//     await Article.findByIdAndDelete(req.params.id)
//     res.redirect('/')
// })

router.post('/delete/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.get('/edit/:slug', async(req, res)=>{
    let article = await Article.findOne({slug:req.params.slug})
    if(article)
        {
            res.render('articles/edit', {article:article})
        }
    else 
    {
        console.log("article not found")
        res.redirect('/')
    }
})

router.post('/edit/:id', async (req, res) => {
    try {
        let article = await Article.findById(req.params.id);
        if (!article) {
            return res.redirect('/'); 
        }

        article.title = req.body.title.trim();
        article.description = req.body.description.trim();
        article.markdown = req.body.markdown.trim();

        await article.save();
        res.redirect(`/articles/${article.slug}`)
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

module.exports = router
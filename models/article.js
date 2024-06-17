const mongoose = require('mongoose')
const slugify = require('slugify')
const { marked } = require('marked'); //to implement markdown
const createDomPurifier = require('dompurify')
const {JSDOM} = require('jsdom')

const dompurify = createDomPurifier(new JSDOM().window)
const articleSchema = new mongoose.Schema({
    title : {type:String, required:true},
    description : {type:String},
    markdown : {type:String, required:true},
    createDate : {
        type:Date,
        default:Date.now
    },
    slug : {
        type:String,
        required:true,
        unique:true,
    },
    sanitizedHTML :{
        type:String,
        required:true
    }
})

articleSchema.pre('validate', function(next){  //DO NOT USE ARROW FUNCTION
    if(this.title)
        {
            this.slug = slugify(this.title, {lower:true,
                strict:true
            })
        }
    if(this.markdown)
        {
            this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
            
        }
    next()
})

const Article = mongoose.model('Article', articleSchema)


module.exports = Article
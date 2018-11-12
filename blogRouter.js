const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./model');


BlogPosts.create(
 'Tech companies', 'Amazon, Google, Facebook, Apple are examles of tech company', 'sowmya'
);

BlogPosts.create(
 'Post', 'Example blog post', 'xyz'
);

router.get('/', (req, res) => {
 res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req,res) => {
 const reqFields = ['title', 'content', 'author'];
 for(let i=0; i<reqFields.length; i++) {
     const field = reqFields[i];
     if(!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
     }
 }

 const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
 res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
 const reqFields = ['id', 'title', 'content', 'author'];
 for(let i=0; i< reqFields.length; i++) {
     const field = reqFields[i];
     if(!(field in req.body)) {
         const message = `Missing \`${field}\` in request body`
         console.error(message);
         return res.status(400).send(message);
     }
 }

 if(req.params.id !== req.body.id) {
    const message = 
        `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
      console.error(message);
      return res.status(400).send(message);
 }

 console.log(`Updating shopping list item \`${req.params.id}\``);
 try {
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
}
catch(err) {
    const message = `ID ${req.params.id} doesnt exist`
    res.status(400).send(message);
}
});
module.exports = router;
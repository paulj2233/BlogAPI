const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


//we're going to add some items to blog so there's some data to look at.
BlogPosts.create('Hey There', 'Hey there my name is Paul, great to meet you', 'Paul Johnson', 2018);
BlogPosts.create('Hey There', 'Hey there my name is Amy, great to meet you', 'Amy Johnson', 2018);

//When root of this route is called with GET, return all blog posts my calling "BlogPosts.get()"
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

//When root of this route is called with POST, ensure 'title, content, author name' are in request body
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
		for(let i =0; i < requiredFields.length; i++) {
			const field = requiredFields[i];
			if (!(field in req.body)){
				const message= `missing \`${field}\` in request body`;
				console.error(message);
				return res.status(400).send(message);
			}
		}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).send(item);

})


//When root of this route is called with DELETE, delete post with the id from the request params

// add endpoint for DELETE requests. These requests should
// have an id as a URL path variable and call
// `BlogPosts.delete()`
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	Console.log(`Deleted Blog Post \`${req.params.id}\``);
	res.status(204).end();
})



router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
		for(let i = 0; i < requiredFields.length; i++) {
			const field = requiredFields;
			if (!(field in req.body)){
				const message = `missing \`${field}\` in request body`;
				console.error(message);
				return res.status(400).send(message);
			}
		}
		if(req.params.id !== req.body.id) {
			const message = `The request path id \`${req.params.id}\` and request body id \`${req.body.id}\` must match`;
			console.error(message);
			return res.status(401).send(message);
		}
		console.log('Updating blog post with id')
	const item = BlogPosts.update({
	id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
	});
	res.status(204).end();
})


module.exports = router;
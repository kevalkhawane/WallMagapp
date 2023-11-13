const express = require('express');
const adminController = require('../controllers/adminController');


const router = express.Router();
const auth = require('../config/authcheck'); 

router.get('/dashboard',auth.check,adminController.getDashboard);

router.get('/profile',auth.check,adminController.getProfile);

router.get('/addpost',auth.check,adminController.getAddPost);

router.get('/slider',auth.check,adminController.getSlider);

router.get('/edit/:id',auth.check,adminController.getEditPage);

router.get('/tag/:tag',auth.check,adminController.getTagPage);



// Post routes

router.post('/createpost',auth.check,adminController.createPost);

router.get('/allposts',auth.check,adminController.getPosts);

router.get('/post/:id',auth.check,adminController.getPost);

router.post('/edit',auth.check,adminController.getEdit);

router.get('/delete/:id',auth.check,adminController.deletePost);


// topic routes 
router.get('/topics',auth.check,adminController.getAllTopics);

router.get('/topic/:topicId',auth.check,adminController.getTopic);

router.get('/addtopic',auth.check,adminController.getAddTopic);

router.post('/addtopic',auth.check,adminController.postAddTopic);

router.get('/updatetopic/:topicid',auth.check,adminController.getEditTopic);

router.post('/updatetopic',auth.check,adminController.postEditTopic);

router.get('/deletetopic/:id',auth.check,adminController.deleteTopic);

//slider

router.post('/slider',auth.check,adminController.updateSlider);

module.exports = router;
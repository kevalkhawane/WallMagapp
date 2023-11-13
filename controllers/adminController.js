
const marked = require('marked');
const PostModel = require('../models/post-model');
const TopicModel = require('../models/topic-model');
const SliderModel = require('../models/sliderModel');


exports.getDashboard = (req, res, next) => {
    res.render('dashboard.ejs');    
   };

exports.getProfile = (req, res, next) => {
    const username = req.user.username;
    const thumbnail = req.user.thumbnail;
    
    res.render('profile.ejs',{username,thumbnail});    
   };

exports.getAddPost = (req, res, next) => {
    res.render('addpost.ejs');    
   };

//create new post 
exports.createPost = async (req, res, next) => {
    try {
      
      const _tags = req.body.tags;
      let _haveContent = true;
  
      if (req.body.post_content === "") {
        _haveContent = false;
      }
  
      const addPost = new PostModel({
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        topic: req.body.topic,
        part: req.body.part,
        content: req.body.post_content,
        tags: _tags.replace(/\s+/g, ' ').split(',').map(str => str.trim()),
        haveContent: _haveContent,
      });
  
      await addPost.save();
      console.log("Post Added successfully!");
      res.redirect('/admin/allposts');
    } catch (error) {
      console.error(error);
    }
  };
  
//read all posts
exports.getPosts = async (req, res) => {
  try {
    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    let page = 1;
    if(req.query.page){
        page = req.query.page;

    }

    let limit = 6;
    if(req.query.limit){
        limit = req.query.limit;
    }

   
    const posts = await PostModel.find({
        $or:[
            { title:{ $regex:'.*'+search+'.*',$options:'i' }},
            { topic:{ $regex:'.*'+search+'.*',$options:'i' }},
            { content:{ $regex:'.*'+search+'.*',$options:'i' }},
            { tags:{ $regex:'.*'+search+'.*',$options:'i' }}
        ]
  }).limit(limit)
    .skip((page-1) * limit)    
    .exec();

    const count = await PostModel.find({
        $or:[
            { title:{ $regex:'.*'+search+'.*',$options:'i' }},
            { topic:{ $regex:'.*'+search+'.*',$options:'i' }},
            { content:{ $regex:'.*'+search+'.*',$options:'i' }},
            { tags:{ $regex:'.*'+search+'.*',$options:'i' }}
        ]
  }).countDocuments();

    res.render('allposts.ejs', { posts: posts,totalpages: Math.ceil(count/limit),currentPage:page,searchquery:search});
  } catch (error) {
    console.error(error);
    // Handle the error as needed.
  }
};

//Edit a post Page
exports.getEditPage = async (req, res, next) => {
  const id = req.params.id;
  
  await PostModel.findById(id).then(function(post){  
    res.render('updatepost.ejs',{post});          
  }); 
 };

//Edit a post
exports.getEdit = async (req, res, next) => {
  const id = req.body._id;
  const _title = req.body.title;
  const _part= req.body.part;
  const _thumbnail = req.body.thumbnail;
  const _topic = req.body.topic;
  const _content = req.body.post_content;
  const _tags = req.body.tags;
  
  
      let _haveContent = true;
  
      if (req.body.post_content === "") {
        _haveContent = false;
      }
  
  await PostModel.updateOne({_id:id},{$set: {title:_title,thumbnail:_thumbnail,topic:_topic,part:_part,content:_content,tags:_tags.replace(/\s+/g, ' ').split(',').map(str => str.trim()),haveContent:_haveContent,lastUpdated:Date.now()}}).then((result) => {
    console.log("Post Updated succesfully");
}).catch((err) => {
    console.error(err.message);
});
res.redirect('/admin/allposts');
};

//View a post
exports.getPost = async (req, res, next) => {
  const id = req.params.id;
  
  await PostModel.findById(id).then(function(post){  
    post.content = marked.parse(post.content);
    
    res.render('viewpost.ejs',{post});          
  }); 
 };


 //Delete a post
exports.deletePost = async (req, res, next) => {
  const id = req.params.id;
  
  await PostModel.deleteOne({_id: id}).then((result) => {
    console.log("Post deleted succesfully")
}).catch((error) => {
    console.error(err.message);
});
    
res.redirect('/admin/allposts');
        
}; 

//get Tag Page 
exports.getTagPage = async (req, res, next) => {
  let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
 
    let limit = 6;
    if(req.query.limit){
        limit = req.query.limit;
    }
  tag = req.params.tag;
  const count = await PostModel.find({tags:{ $regex: tag, $options: 'i' }}).countDocuments();

  const posts = await PostModel.find({tags:{ $regex: tag, $options: 'i' }}).limit(limit)
.skip((page-1) * limit)
.exec();
 res.render('tag.ejs',{ posts: posts,totalpages: Math.ceil(count/limit),currentPage:page,searchquery:tag,limit:limit});
 
 };

 exports.getTopic = async (req, res, next) => {
  
  let page = 1;
    if(req.query.page){
        page = req.query.page;

    }

    let search = '';
    if(req.query.search){
        search = req.query.search;
    }


    let limit = 6;
    if(req.query.limit){
        limit = req.query.limit;
    }

  const topicid = req.params.topicId;
  //res.send(topic)
  const topic = await TopicModel.findById(topicid);  

  const posts = await PostModel.find({$and:[{topic:topicid} , {
    $or:[
        { title:{ $regex:'.*'+search+'.*',$options:'i' }},
        { content:{ $regex:'.*'+search+'.*',$options:'i' }},
        { tags:{ $regex:'.*'+search+'.*',$options:'i' }}
    ]
}]}).limit(limit)
.skip((page-1) * limit)    
.exec();

const count = await PostModel.find({$and:[{topic:topicid} , {
  $or:[
      { title:{ $regex:'.*'+search+'.*',$options:'i' }},
      { content:{ $regex:'.*'+search+'.*',$options:'i' }},
      { tags:{ $regex:'.*'+search+'.*',$options:'i' }}
  ]
}]})
.countDocuments();
  
res.render('topic.ejs',{topic:topic, posts: posts,totalpages: Math.ceil(count/limit),currentPage:page,searchquery:search,limit:limit});

 };


 exports.getAddTopic = async (req, res, next) => {
  res.render('addtopic');  
 };


 exports.postAddTopic = async (req, res, next) => {
  
  const addTopic = new TopicModel({
    name: req.body.name,
    thumbnail: req.body.thumbnail,
    topic: req.body.topic,
    description: req.body. description
    
  });

  await addTopic.save();
  
  res.redirect('/admin/topics');
}

exports.getAllTopics = async (req, res, next) => {
  try {
    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    let page = 1;
    if(req.query.page){
        page = req.query.page;

    }

    let limit = 6;
    if(req.query.limit){
        limit = req.query.limit;
    }

   
    const topics = await TopicModel.find({
        $or:[
            { name:{ $regex:'.*'+search+'.*',$options:'i' }},
            { description:{ $regex:'.*'+search+'.*',$options:'i' }}
        ]
  }).limit(limit)
    .skip((page-1) * limit)    
    .exec();

    const count = await TopicModel.find({
      $or:[
          { name:{ $regex:'.*'+search+'.*',$options:'i' }},
          { description:{ $regex:'.*'+search+'.*',$options:'i' }}
      ]
}).countDocuments();

    res.render('topics.ejs', { topics: topics,totalpages: Math.ceil(count/limit),currentPage:page,searchquery:search});
  } catch (error) {
    console.error(error);
    // Handle the error as needed.
  }
};

exports.getEditTopic = async (req, res, next) => {
  const id = req.params.topicid;
  
  const topic = await TopicModel.findById(id)
    res.render('updatetopic.ejs',{topic});          
  //console.log(topic);
 };

exports.postEditTopic = async (req, res, next) => {
  const id = req.body._id;
  const _name = req.body.name;
  const _description= req.body.description;
  const _thumbnail = req.body.thumbnail;

await TopicModel.updateOne({_id: id}, {$set:{name: _name,description:_description,thumbnail:_thumbnail}});
res.redirect('/admin/topics');
};


exports.deleteTopic = async (req, res, next) => {
  const id = req.params.id;
  
  await TopicModel.deleteOne({_id: id});
    
res.redirect('/admin/topics');
        
};


exports.getSlider = async (req, res, next) => {
  const id = process.env.SLIDER_ID;
  
  const slider = await SliderModel.findOne();
  if(slider===null){
    const addSlider = new SliderModel({
    tags:["Tags"],
    topic:"topic",
    tag:"tag",
    post1:"post",
    post2:"post",
    post3:"post",
    post4:"post",
    post5:"post",
    topic1:"topic1",
    topic2:"topic2",
    topic3:"topic3",
    topic4:"topic4",
    topic5:"topic5"

    });
    await addSlider.save();
  }
    res.render('slider.ejs',{ slider });    
};


exports.updateSlider = async (req, res, next) => { 

  const tags = req.body.tags;
  const topic = req.body.topic;
  const tag = req.body.tag;
  const post1 = req.body.post1;
  const post2 = req.body.post2;
  const post3 = req.body.post3;
  const post4 = req.body.post4;
  const post5 = req.body.post5;
  const topic1 = req.body.topic1;
  const topic2 = req.body.topic2;
  const topic3 = req.body.topic3;
  const topic4 = req.body.topic4;
  const topic5 = req.body.topic5;

  await SliderModel.updateOne( {$set:{tags: tags.replace(/\s+/g, ' ').split(',').map(str => str.trim()),topic:topic,tag:tag,post1:post1,post2:post2,post3:post3,post4:post4,post5:post5,topic1:topic1,topic2:topic2,topic3:topic3,topic4:topic4,topic5:topic5}});
    
res.redirect('/admin/dashboard');
        
};
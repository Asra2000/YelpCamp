var mongoose = require('mongoose'),
    Campgrounds = require('./models/campground');
    var Comment = require('./models/comment');
 var data = [
     {
         name: 'Clouds REst',
         image:'https://images.unsplash.com/photo-1588080087490-82089aa465cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
         description: 'blah blah blah'
     },
     {
        name: 'Brisky hill',
        image:'https://images.unsplash.com/photo-1588094504781-0a67bc2306f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        description: 'blah blah blah'
    },
    {
        name: 'commotion',
        image:'https://images.unsplash.com/photo-1588025256565-a5d391d180ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis deleniti quia aspernatur ratione nihil quae veritatis officia molestias quam. A voluptate natus iure distinctio iusto, nisi repellendus vel molestias similique?"
    }

 ]
function seedDB(){
    //remove all the campgrounds
Campgrounds.deleteMany({}, (err)=>{
    if(err){
        console.log(err);
    }else{
        // console.log('removed campgrounds!');
        // adding few campgrounds
data.forEach((seed)=>{
    Campgrounds.create(seed, (err, campground)=>{
        if(err){
            console.log(err);
        }else{
            // console.log('added a camp');
            Comment.create({
                text: 'This place is great but I wish there was internet',
                author: 'Asra'
            }, (err, comment)=>{
                if (err){
                    console.log(err);
                }else{
                    // console.log('comment added');
                    campground.comments.push(comment);
                    campground.save();
                }
            });
        }
    });
});

}
});
}

module.exports = seedDB;
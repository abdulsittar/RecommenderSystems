var Request = require("request");      
//var Categories = require.main.require('./models/Categories');   
var Users = require.main.require('./models/User');   
var Posts = require.main.require('./models/Post');
const controller = 'User'; 
const module_name = 'User'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

/** 
 *  list
 *  Purpose: This function is used to show listing of all arecord
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json   
*/
async function list(req, res) { 

res.set('content-type' , 'text/html; charset=mycharset'); 
allRecord = {};    
action = 'list'; 
//const allRecord = await Users.findAll();   
allRecord = await Users.find({}); 
//console.log("all users")
res.set('content-type' , 'text/html; charset=mycharset'); 
//console.log(allRecord)
//res.redirect(nodeAdminUrl+'/Users/add');
//res.redirect(nodeAdminUrl+'/Users/list');
//res.redirect(nodeAdminUrl+'/Users/list', {page_title:" List", data:allRecord, controller:controller, action:action, module_name:module_name});
res.render('admin/'+controller+'/list',{page_title:"List", data:allRecord, controller:controller,action:action, module_name:module_name});
//res.render(nodeAdminUrl+'/'+controller+'/list', {page_title:" List", data:allRecord, controller:controller, action:action, module_name:module_name});
};      
exports.list = list;

/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function edit(req, res) { 

res.set('content-type' , 'text/html; charset=mycharset'); 
var action = 'edit';
var entityDetail = {}; 
var errorData = {};
console.log("Editing a post");
console.log(req.files);
console.log(req.params);
console.log(req.body);

if(req.body.readPosts == ''){ req.body.readPosts = [] }
if(req.body.viewedPosts == ''){ req.body.viewedPosts = [] }

if(req.params.id){
    var id =  req.params.id; 
    const selectedUser = await Users.findById(id).populate([{path : "followers", model: "User"},{path : "followings", model: "User"},{path : "viewedPosts", model: "Post"},{path : "readPosts", model: "Post"} ]).exec(); 

    console.log(selectedUser)
    if(selectedUser == 0){     
        req.flash('error', 'Invalid url')  
        return res.redirect(nodeAdminUrl+'/Users/list');  
    }     
    if (req.method == "POST") {  
        var input = JSON.parse(JSON.stringify(req.body)); 
        
        console.log(req.body); console.log('Here');  
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('email', 'email is required').notEmpty(); 
        var errors = req.validationErrors();   
        console.log(errors); 
        if(errors){	   
            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    var msg = errors1.msg; 
                    errorData[field1] = msg;   
                    entityDetail.field1 = req.field1;
                }); 
            }    
        } else {  
            var saveResult = '';  
            // Upload Image  
            if (req.files && req.files.profilePicture !== "undefined") { 
                let profile_pic = req.files.profilePicture;  
                var timestamp = new Date().getTime();   
                filename = timestamp+'-'+profile_pic.name;  
                console.log(filename);
                input.profilePicture =   filename; 
                console.log('Editing and uploading picture'); 
                profile_pic.mv('public/upload/'+filename, function(err) {
                    if (err){    
                        console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Users/'+action); 
                    }     
                });  
            }   
            console.log('Editing and uploading other content'); 
            var msg =  controller+' updated successfully.'; 
            console.log(input); 
            var saveResult = await Users.findByIdAndUpdate({"_id": req.params.id}, {$set: input});
            //console.log(saveResult); 
            req.flash('success', msg)    
            res.locals.message = req.flash(); 
            console.log("saving edited username");
            //console.log(saveResult);
            if(saveResult){     
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            }        
        }  
    }
    var postData = {};
    postData = await Posts.find({}); 
    allUsers = await Users.find({});  
    console.log(selectedUser.followers.length);
    console.log(postData.length);
    res.render('admin/'+controller+'/edit',{page_title:" Edit",data:selectedUser, errorData:postData, allUsers:allUsers, controller:controller, action:action});  
} else { 
    req.flash('error', 'Invalid url.');  
    return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
}   
};          
exports.edit = edit;  

/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function add(req, res) { 

res.set('content-type' , 'text/html; charset=mycharset'); 
var page_title = 'Add'; 
var errorData = {}; 
var data = {};  
allUsers = {};  
allPosts = {};
allPosts = await Posts.find({}); 
allUsers = await Users.find({}); 


var action = 'add'; 
var errorData = {};     
if (req.method == "POST") { 
    var input = JSON.parse(JSON.stringify(req.body));  
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty(); 
    req.checkBody('email', 'email is required').notEmpty();  
    var errors = req.validationErrors();    
    if(errors){	  
        if(errors.length > 0){
            errors.forEach(function (errors1) {
                var field1 = String(errors1.param); 
                console.log(errors1);
                var msg = errors1.msg; 
                errorData[field1] = msg;   
                data.field1 = req.field1; 
            }); 
        }     
        data = input;   
    }else{ 
        // Upload Image 
        if (req.files && req.files.profilePicture !== "undefined") { 
            let profile_pic = req.files.profilePicture;  
            var timestamp = new Date().getTime(); 
            var imagePath = '';   
            filename = timestamp+'-'+profile_pic.name;   
            input.profile_pic =   filename; 
            profile_pic.mv('public/upload/'+filename, function(err) { 
                if (err){    
                    //console.log(err);    
                    req.flash('error', 'Could not upload image. Please try again!')  
                    res.locals.message = req.flash();   
                    return res.redirect(nodeAdminUrl+'/Users/add'); 
                }     
            }); 
        }  
        // Decrypt password with password hash
        var salt = bcrypt.genSaltSync(saltRounds);
        var password = bcrypt.hashSync(input.password, salt);
        input.password = password;    
        
        // create new user
        const newUser = new Users({username: input.username, email: input.email, password: password, followers:input.followers, followings: input.followings, viewedPosts:input.viewedPosts , readPosts:input.readPosts , pool:input.pool ,  desc:input.desc, city:input.city, from:input.from, relationship:input.relationship});

        // save user and send response



        const SaveData = await newUser.save();
        
        //const SaveData = new Users(input);
        //var saveResult=   await SaveData.save();   
        //console.log(SaveData);
        //console.log("Result");
        if(SaveData){    
            req.flash('success', controller+' added successfully.');  
            res.locals.message = req.flash();  
            res.set('content-type' , 'text/html; charset=mycharset');  
            return res.redirect(nodeAdminUrl+'/'+controller+'/list');  
            //console.log("Success");  
        }else{
            req.flash('error', 'Could not save record. Please try again')  
            res.locals.message = req.flash(); 
            //console.log("Fail"); 
        }      
    } 
}   
res.render('admin/'+controller+'/add',{page_title:page_title, data:allUsers, errorData:allPosts, controller:controller, action:action});    
};          
exports.add = add; 

/** 
 *  delete
 *  Purpose: This function is used to get constructor delete
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function deleteRecord(req, res) { 

var categoryDetail = {}; 
if(req.params.id){ 
    categoryDetail = await Users.findByIdAndRemove(req.params.id);    
    console.log(categoryDetail) ;
    if(!categoryDetail){      
        req.flash('error', 'Invalid url')  
        return res.redirect(nodeAdminUrl+'/'+controller+'/list'); 
    }else{
        req.flash('success', 'Record deleted succesfully.');    
        return res.redirect(nodeAdminUrl+'/'+controller+'/list');  
    }    
}else{  
    req.flash('error', 'Invalid url.');   
    return res.redirect(nodeAdminUrl+'/'+controller+'/list');      
}    
};          
exports.deleteRecord = deleteRecord;  


var Request = require("request");      
//var Categories = require.main.require('./models/Categories');   
var Posts = require.main.require('./models/Post');   
const controller = 'Post'; 
const module_name = 'Post'; 
var Users = require.main.require('./models/User'); 
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
allRecord = await Posts.find({}); 
//console.log("all posts")
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
allUsers = {};  
allUsers = await Users.find({}); 
var errorData = {};
if(req.params.id){
    var id =  req.params.id; 
    const entityDetail = await Posts.findById({_id:id});    
    if(entityDetail == 0){     
        req.flash('error', 'Invalid url')  
        return res.redirect(nodeAdminUrl+'/User/list');  
    }     
    if (req.method == "POST") {  
        var input = JSON.parse(JSON.stringify(req.body)); 
        
        //console.log(input); console.log('Here');  
        req.checkBody('userId', 'User ID is required').notEmpty();
        req.checkBody('desc', 'Post text is required').notEmpty();  
        var errors = req.validationErrors();    
        if(errors){	   
            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    var msg = errors1.msg; 
                    errorData[field1] = msg;   
                    entityDetail.field1 = req.field1;
                }); 
            }    
        }else{  
            var saveResult = '';  
            // Upload Image  
            if (req.files && req.files.profile_pic !== "undefined") { 
                let profile_pic = req.files.profile_pic;  
                var timestamp = new Date().getTime();   
                filename = timestamp+'-'+profile_pic.name;   
                input.profile_pic =   filename; 
                profile_pic.mv('public/upload/'+filename, function(err) {
                    if (err){    
                        //console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Users/'+action); 
                    }     
                });  
            }   
            var msg =  controller+' updated successfully.';  
            var saveResult = await Posts.findByIdAndUpdate(req.params.id, {$set: input});  
            req.flash('success', msg)    
            res.locals.message = req.flash(); 
            if(saveResult){     
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            }        
        }  
    }  
    res.render('admin/'+controller+'/edit',{page_title:" Edit",data:entityDetail,errorData:errorData,allUsers:allUsers,controller:controller,action:action});  
}else{ 
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
allUsers = await Users.find({}); 
var action = 'add'; 
var errorData = {};    
//console.log("I am here");
if (req.method == "POST") { 
    var input = JSON.parse(JSON.stringify(req.body));  
    console.log(input)
    req.checkBody('userId', 'User ID is required').notEmpty();
    req.checkBody('desc', 'Post text is required').notEmpty();  
    var errors = req.validationErrors();    
    if(errors){	  
        if(errors.length > 0){
            errors.forEach(function (errors1) {
                var field1 = String(errors1.param); 
                //console.log(errors1);
                var msg = errors1.msg; 
                errorData[field1] = msg;   
                data.field1 = req.field1; 
            }); 
        }     
        data = input;   
    } else { 
        // Upload Image 
        if (req.files && req.files.profile_pic !== "undefined") { 
            let profile_pic = req.files.profile_pic;  
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
        
        // create new user
        const newPost = new Posts({userId: input.userId, desc: input.desc, likes: input.likes, dislikes: input.dislikes});

        // save user and send response
        const SaveData = await newPost.save();
        
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
res.render('admin/'+controller+'/add',{page_title:page_title,data:allUsers, errorData:errorData,controller:controller,action:action});    
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
    categoryDetail = await Posts.findByIdAndRemove(req.params.id);     
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


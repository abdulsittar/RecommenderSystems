var express = require('express');
var router = express.Router(); 
var AdminController    =  require('../controllers/admin/AdminController');   
var UsersController    =  require('../controllers/admin/UsersController');   
var PostsController    =  require('../controllers/admin/PostsController'); 
var CommentsController =  require('../controllers/admin/CommentsController'); 

/** Routes for admin  */     
//router.get('/login', AdminController.login);     
router.post('/login', AdminController.login);     
router.get('/login', AdminController.login);     
router.get('/Dashboard', requiredAuthentication, AdminController.dashboard);  
router.get('/logout', AdminController.logout);         

/** Routes for users module  */ 
router.get('/User/list',requiredAuthentication,  UsersController.list);     
router.get('/User/edit/:id', requiredAuthentication, UsersController.edit);     
router.post('/User/edit/:id',requiredAuthentication,  UsersController.edit); 
router.post('/User/add',requiredAuthentication, UsersController.add); 
router.get('/User/add', requiredAuthentication, UsersController.add); 
router.get('/User/delete/:id', requiredAuthentication, UsersController.deleteRecord);

/** Routes for posts module  */ 
router.get('/Post/list',requiredAuthentication,  PostsController.list);     
router.get('/Post/edit/:id', requiredAuthentication, PostsController.edit);     
router.post('/Post/edit/:id',requiredAuthentication,  PostsController.edit); 
router.post('/Post/add',requiredAuthentication, PostsController.add); 
router.get('/Post/add', requiredAuthentication, PostsController.add); 
router.get('/Post/delete/:id', requiredAuthentication, PostsController.deleteRecord);

/** Routes for comments module  */ 
router.get('/Comment/list',requiredAuthentication,  CommentsController.list);     
router.get('/Comment/edit/:id', requiredAuthentication, CommentsController.edit);     
router.post('/Comment/edit/:id',requiredAuthentication,  CommentsController.edit); 
router.post('/Comment/add',requiredAuthentication, CommentsController.add); 
router.get('/Comment/add', requiredAuthentication, CommentsController.add); 
router.get('/Comment/delete/:id', requiredAuthentication, CommentsController.deleteRecord);


module.exports = router;        


function requiredAuthentication(req, res, next) { 
if(req.session){
    LoginUser = req.session.LoginUser; 
    if(LoginUser){    
        next();   
    }else{
        res.redirect(nodeAdminUrl+'/login');       
    } 
}else{
    res.redirect(nodeAdminUrl+'/login');       
}
}
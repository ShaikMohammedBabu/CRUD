const express = require('express');
const router = express.Router();

let users = [
    {id:0,name:'babu',email:"mohammed@gmail.com"},
    {id:1,name:'super',email:"super@gmail.com"},
    {id:2,name:'babu',email:"mohammed@gmail.com"},
    {id:3,name:'super',email:"super@gmail.com"},
    {id:4,name:'babu',email:"mohammed@gmail.com"},
    {id:5,name:'super',email:"super@gmail.com"},
    {id:6,name:'babu',email:"mohammed@gmail.com"},
    {id:7,name:'super',email:"super@gmail.com"}
]

let totalUsers = users.length;

router.get('/getUsers',(req,res)=>{
    console.log('get')
    return res.status(200).json({users});
});

router.post('/createUser',(req,res)=>{
    const body = req.body;
    console.log('post',body,totalUsers)
    users.push({id:totalUsers++,...body});
    return res.status(200).json({users});
});

router.put('/updateUser/:userIndex',(req,res)=>{
    const body = req.body;
    if(req.params.userIndex === '') return res.status(404).json({Error:"No user found"});
    const index = req.params.userIndex
    console.log(index,users[index]);
    users[index].name = body.name;
    users[index].email = body.email;
    return res.status(200).json({users});
});

router.post('/deleteManyUsers',(req,res)=>{
    const body = req.body;
    if(body.deleteAll) users.length = 0;
    else {
        body.selectedRows.forEach((selectedUserId)=>{
            const index = users.findIndex(user => user.id === +selectedUserId);
            if(index > -1) users.splice(index,1)
        })
    }
    return res.status(200).json({users});
});
module.exports = router;
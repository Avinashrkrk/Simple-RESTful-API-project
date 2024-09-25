const express = require("express")
const users = require('./MOCK_DATA.json')
const fs = require('fs')

const app = express()
const PORT = 8000

// Middleware -- Plugin
app.use(express.urlencoded({extended: false}));

app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

// REST API
app.get('/api/users', (req, res) =>{
    return res.json(users)
})

app.route('/api/users/:id')
.get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user)
})
.patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if(userIndex !== -1){
        const updateUser = {...users[userIndex], ...req.body}
        users[userIndex] = updateUser;
        return res.json({status: 'Sucess'})
    }else {
        return res.status(404).json({ message: 'User not found' });
    }
})
.delete((req, res) => {
    const id = Number(req.params.id)
    const userIndex = users.findIndex((user) => user.id === id)

    if(userIndex !== -1){
        users.splice(userIndex, 1)
        return res.json({message: 'User deleted successfully'})
    }
    else{
        return res.status(404).json({message: 'User Not Found'})
    }

    return res.json({status: 'Pending'})
})



app.post('/api/users', (req, res) => {
    const body = req.body
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {

    })

    return res.json({status: 'Sucess', id: users.length})
})

app.listen(PORT, () => console.log("Serer Started at port " + PORT ))
const express = require('express');
const app = express();
app.use(express.static('root'))

// app.get('/', (req, res)=>{
//     res.sendFile(__dirname + '/root/index.html');
// })
// app.get('/style.css', (req, res) =>{
//     res.sendFile(__dirname + '/style.css')
// });

app.listen(3000, ()=>{
    console.log('server is listening to post 300, http://localhost:3000');
})
const express = require('express')
const app = express()
const port = 5000

const mongoose_con = require('mongoose');
mongoose_con.connect('mongodb+srv://coyjennings:Coydesign1985$@boiler-plate.jwpvc.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connnected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
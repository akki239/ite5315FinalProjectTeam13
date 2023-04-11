const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hbs = require('express-handlebars')
const dotenv = require('dotenv')
var path = require('path')

dotenv.config()

const port = process.env.PORT || 8000


const db = process.env.MONGODB_URI


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

mongoose
    .connect(db, {
        dbName: 'sample_supplies',
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.log(err))


app.engine(
    '.hbs',
    hbs.engine(
        {
            extname: '.hbs'
        }
    )

)

app.set(
    'view engine',
    '.hbs'
)


const salesData = require('./routes/api/sales')

app.get('/', (req, res) => {
    res.render(
        'search',
        {
            title: 'Akshay'
        }
    )
});

// actual routes
app.use('/api/sales', salesData);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hbs = require('express-handlebars')
const dotenv = require('dotenv')
const url = require('url')
var path = require('path')

dotenv.config()

const port = process.env.PORT || 8000


const db = process.env.MONGODB_URI

const Sale = require('./models/Sale');


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
            title: 'Group 13'
        }
    )
});


app.get("/search", (req, res) => {
    res.sendFile(path.join(__dirname + '/static-files/search.html'))
})


app.get('/sales', async (req, res) => {

    try {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.perPage);
        const storeLocation = req.query.storeLocation;

        if (isNaN(page) || isNaN(perPage)) {
            return res.status(400).send('Invalid query parameters');
        }

        console.log(storeLocation)

        const filter = storeLocation ? { storeLocation } : {};

        console.log("hiiii")

        const sales = await Sale.find(filter)
            .lean()
            .sort({ date: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const count = await Sale.countDocuments(filter);

        // res.status(200).json({
        //     sales: sales,
        //     currentPage: page,
        //     totalPages: Math.ceil(count / perPage)
        // });


        res.render(
            'search',
            {
                title: 'Sales Data',
                data: sales
            }
        )


    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while processing your request');
    } 

})


// actual routes
app.use('/api/sales', salesData);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

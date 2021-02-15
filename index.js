
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const { STATUS_CODES } = require('http')
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
app.use(express.json())

const PORT=8081;

const db = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12393087',
    password: 'wp7P7ijbnm',
    database: 'sql12393087'
});


db.connect(function (err) {
    if (err) console.log(err);
    else console.log("connected !!");
    const sqlRetrieve = "select * from details order by id DESC limit 100";
    db.query(sqlRetrieve, (err, result) => {
        if (err)
            console.log(err);
        else
            console.log(result);
            // res.send(result);
    })


    app.post('/memes', (req, res) => {

        let name = req.body.name;
        let url = req.body.url;
        let caption = req.body.caption;

        if (req.query != null && name == null && url == null && caption == null) {
            name = req.query.name;
            url = req.query.url;
            caption = req.query.caption;
        }
        let value = [[name, url, caption]];
        const sqlGet = "select * from details where name=? and caption=? and url=? ";
        db.query(sqlGet, [name, caption, url], (err, result) => {
            if (err)
                console.log(err);
            else if (result.length==0) {
                const sqlInsert = "insert into details (name,url,caption) values ?";
                db.query(sqlInsert, [value], (err, results) => {
                    if (err)
                        console.log(err);
                    else {
                        // console.log(result.insertId);
                        let x = { id: results.insertId }
                        res.send(x);
                    }
                })
            }
            else {
                res.send("409 Duplicate Request");
            }

            // res.send(result);
        })


        // const sqlInsert="insert into details (name,url,caption) values ?";
        // db.query(sqlInsert,[value],(err,result)=>{
        //     if(err)
        //     console.log(err);
        //     else
        //     {
        //         // console.log(result.insertId);
        //         let x={id:result.insertId}

        //         res.send(x);
        //     }
        // })
    })

    app.get('/memes', (req, res) => {
        const sqlRetrieve = "select * from details order by id DESC limit 100";
        db.query(sqlRetrieve, (err, result) => {
            if (err)
                console.log(err);
            else
                console.log(result);
                res.send(result);
        })

        // const sqlGet="select max(id) from details";
        // db.query(sqlGet,(err,result)=>{
        //     if(err)
        //     console.log(err);
        //     else
        //     {
        //         let x=(result[0]);
        //         console.log(x);
        //     }

        // })
    })

    app.get('/memes/:id', (req, res) => {
        const sqlGet = "select * from details where id= " + mysql.escape(req.params.id)
        db.query(sqlGet, (err, result) => {
            if (err) {
                console.log(err);
            }

            else if (result.length) {
                result = JSON.stringify(result)
                console.log(result);
                res.send(result);
            }
            else
                res.send("404 NOT FOUND")

        })
    })

    app.patch('/memes/:id', (req, res) => {

        let name = req.body.name;
        let url = req.body.url;
        let caption = req.body.caption;

        if (req.query != null && name == null && url == null && caption == null) {
            name = req.query.name;
            url = req.query.url;
            caption = req.query.caption;
        }

        const sqlUpdate = "update details set caption=?,url=? where id=?";
        db.query(sqlUpdate, [caption, url, req.params.id], (err, result) => {
            if (err)
                console.log(err);
            else {
                console.log(result);
            }
        })
    })
});



app.listen(process.env.PORT || PORT, () => {
    console.log("Running on port "+ PORT);
})
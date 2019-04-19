const express = require('express');

const router = express.Router();

const controller = require('../controller/apiController');

router.get('/home', (req, res, next) => {
    console.log("Hello World\n");
});

router.post('/', controller.getData);

router.get('/', (req, res, next) => {
    res
        .status(200)
        .render('index', {data: "", params: []});

router.post("/get", (req, res, next) => {
    console.log(req.body);
    return  res .status(200).json({status: "Success"})
})
})

module.exports = router;
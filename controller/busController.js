const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

const Bus = require('../model/bus');
const Schedule = require('../model/schedule');
const City = require('../model/city');

router.get("/", (req, res, next) => {
    Bus.list()
      .then( ([busList, metadata]) => {
			res.render('buses/busList', {busList: busList});
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
    
});

router.get("/showNewForm", (req, res, next) => {
    res.render('buses/busForm', { pageTitle: "Nowy autobus", formAction: "add", bus: {} });
});

router.get("/showEditForm", (req, res, next) => {
	const id = req.param('bus_id');
	Bus.details(id)
	.then( ([bus, metadata]) => {
		res.render('buses/busEdit', { pageTitle: "Edytuj autobusa", formAction: "edit", bus: bus[0] });
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
    
});

router.post("/add", (req, res, next) => {
    const newBus = new Bus(req.body.name, req.body.seats, req.body.number, req.body.date, req.body.mileage);
    
	Bus.add(newBus)
	.then(() => {
        res.redirect("/buses");
      })
      .catch(err => {
        console.log(err);
      });
    
});

router.post("/edit", (req, res, next) => {
    //FIXME
	const bus = new Bus(req.body.name, req.body.seats, req.body.number, req.body.date, req.body.mileage, req.body.bus_id);
	
	Bus.edit(bus)
	.then(() => {
        res.redirect("/buses");
      })
      .catch(err => {
        console.log(err);
      });
});

router.get("/showDetails", (req, res, next) => {
    //FIXME
	const id = req.param('bus_id');
	const cityList = City.list();
	
	City.list()
	.then( ([cityList, metadata]) => {
		var cities = cityList;
		
		db.execute('select * from schedule where bus ='+id)
		.then( ([scheduleList, metadata]) => {
			res.render('buses/busDetails', {scheduleList: scheduleList, cityList: cities});
		})
		.catch(err => {
			console.log(err);
			});
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
    
});

router.get("/delete", (req, res, next) => {
    //FIXME
	const id = req.param('bus_id');
	Bus.delete(id)
	.then(() => {
        res.redirect("/buses");
      })
      .catch(err => {
        console.log(err);
      });
});


module.exports.route = router; 
const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

const Driver = require('../model/driver');
const Schedule = require('../model/schedule');
const City = require('../model/city');

router.get("/", (req, res, next) => {
    Driver.list()
      .then( ([driverList, metadata]) => {
			res.render('drivers/driverList', {driverList: driverList});
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
	  
});

router.get("/showNewForm", (req, res, next) => {
    res.render('drivers/driverForm', { pageTitle: "Nowy kierowca", formAction: "add", driver: {} });
});

router.get("/showEditForm", (req, res, next) => {
	const id = req.param('driver_id');
	Driver.details(id)
	.then( ([driver, metadata]) => {
		res.render('drivers/driverEdit', { pageTitle: "Edytuj kierowce", formAction: "edit", driver: driver[0] });
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
    
});

router.post("/add", (req, res, next) => {
    const newDriver = new Driver(req.body.first_name, req.body.last_name, req.body.date, req.body.experience, req.body.salary);
    
	Driver.add(newDriver)
	.then(() => {
        res.redirect("/drivers");
      })
      .catch(err => {
        console.log(err);
      });
  
});

router.post("/edit", (req, res, next) => {
    //FIXME
	const driver = new Driver(req.body.first_name, req.body.last_name, req.body.date, req.body.experience, req.body.salary, req.body.driver_id);
	Driver.edit(driver)
	.then(() => {
        res.redirect("/drivers");
      })
      .catch(err => {
        console.log(err);
      });
});

router.get("/showDetails", (req, res, next) => {
    //FIXME
	const id = req.param('driver_id');
	const cityList = City.list();
	
	City.list()
	.then( ([cityList, metadata]) => {
		var cities = cityList;
		
		db.execute('select * from schedule where driver ='+id)
		.then( ([scheduleList, metadata]) => {
			res.render('drivers/driverDetails', {scheduleList: scheduleList, cityList: cities});
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
	const id = req.param('driver_id');
	Driver.delete(id)
		.then(() => {
			res.redirect("/drivers");
		})
		.catch(err => {
			console.log(err);
		});
	
});


module.exports.route = router; 
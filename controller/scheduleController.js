const express = require('express');
const router = express.Router();

const Schedule = require('../model/schedule');
const Driver = require('../model/driver');
const Bus = require('../model/bus');
const City = require('../model/city');

router.get("/", (req, res, next) => {
	
	City.list()
	.then( ([cityList, metadata]) => {
		var cities = cityList;
		
		Schedule.list()
			.then( ([scheduleList, metadata]) => {
				res.render('schedules/scheduleList', {scheduleList: scheduleList, cityList: cities});
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
				});
		
	}).catch(err => {
        //błąd komunikacji z bazą danych
        console.log(err);
      });
	  
	
});

router.get("/showNewForm", (req, res, next) => {
		var drivers;
		Driver.list()
		.then( ([driverList, metadata]) => {
			drivers = driverList;
			
			var buses;
			Bus.list()
			.then( ([busList, metadata]) => {
				buses = busList;
						
					var cities;
					City.list()
					.then( ([cityList, metadata]) => {
						cities = cityList;
						res.render('schedules/scheduleForm', { pageTitle: "Nowy rozklad", formAction: "add", schedule: {}, driverList: drivers, busList: buses, cityList: cities});

					}).catch(err => {
							//błąd komunikacji z bazą danych
							console.log(err);
						});
						
			}).catch(err => {
					//błąd komunikacji z bazą danych
					console.log(err);
				});
			
		}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
			});
});

router.get("/showEditForm", (req, res, next) => {
	const id = req.param('schedule_id');
	const driverList = Driver.list();
	const busList = Bus.list();
	const cityList = City.list();

	Schedule.details(id)
	.then(([schedule, metadata]) => {
		scheduleExt = schedule[0];
		
		var drivers;
		Driver.list()
		.then( ([driverList, metadata]) => {
			drivers = driverList;
			
			var buses;
			Bus.list()
			.then( ([busList, metadata]) => {
				buses = busList;
				
				var cities;
				City.list()
				.then( ([cityList, metadata]) => {
					cities = cityList;
					
					res.render('schedules/scheduleEdit', { pageTitle: "Edytuj rozklad", formAction: "edit", schedule: scheduleExt, driverList: drivers, busList: buses, cityList: cities});

				}).catch(err => {
						//błąd komunikacji z bazą danych
						console.log(err);
					});
			
			}).catch(err => {
					//błąd komunikacji z bazą danych
					console.log(err);
				});
		
		}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
			});
		
	}).catch(err => {
			//błąd komunikacji z bazą danych
			console.log(err);
      });
});

router.post("/add", (req, res, next) => {
    const newSchedule = new Schedule(req.body.cityFrom, req.body.cityTo, req.body.departure, req.body.arrival, req.body.departureTime, req.body.arrivalTime, req.body.price, req.body.driver, req.body.bus);
    Schedule.add(newSchedule)
	.then(() => {
        res.redirect("/schedules");
      })
      .catch(err => {
        console.log(err);
      });
});

router.post("/edit", (req, res, next) => {
    //FIXME
	const schedule = new Schedule(req.body.cityFrom, req.body.cityTo, req.body.departure, req.body.arrival, req.body.departureTime, req.body.arrivalTime, req.body.price, req.body.driver, req.body.bus, req.body.schedule_id);
	Schedule.edit(schedule)
	.then(() => {
        res.redirect("/schedules");
      })
      .catch(err => {
        console.log(err);
      });
});

router.get("/showDetails", (req, res, next) => {
    //FIXME
	const id = req.param('schedule_id');
	var scheduleExt;
	
	Schedule.details(id)
	.then(([schedule, metadata]) => {
		scheduleExt = schedule[0];
		
		var driverExt;
			Driver.details(scheduleExt.driver)
			.then( ([driver, metadata]) => {
				driverExt = driver[0];
				
				var busExt;
					Bus.details(scheduleExt.bus)
					.then( ([bus, metadata]) => {
						busExt = bus[0];
						
						var cityFrom;
							City.details(scheduleExt.cityFrom)
							.then( ([city, metadata]) => {
								cityFrom = city[0];
								
								var cityTo;
									City.details(scheduleExt.cityTo)
									.then( ([city, metadata]) => {
										cityTo = city[0];
										res.render('schedules/scheduleDetails', {schedule: scheduleExt, driver: driverExt, bus: busExt, cityFrom: cityFrom, cityTo: cityTo});
									}).catch(err => {
										//błąd komunikacji z bazą danych
										console.log(err);
									});
								
							}).catch(err => {
								//błąd komunikacji z bazą danych
								console.log(err);
							});
					
					}).catch(err => {
						//błąd komunikacji z bazą danych
						console.log(err);
					});
				
				
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
			});

	}).catch(err => {
        console.log(err);
      });
	  
});

router.get("/delete", (req, res, next) => {
    //FIXME
	const id = req.param('schedule_id');
	Schedule.delete(id)
	.then(() => {
        res.redirect("/schedules");
      })
      .catch(err => {
        console.log(err);
      });
	
});


module.exports.route = router; 
const db = require('../db/mysql');

//licznik id
let nextId = 1;
//ekstensja klasy (wszystkie obiekty)
const scheduleExtent = [];

const Driver = require('../model/driver');
const Bus = require('../model/bus');

class Schedule {
    //parametr id jest na końcu, bo jest opcjonalny
    constructor(cityFrom, cityTo, departure, arrival, departureTime, arrivalTime,  price, driver, bus, id) {
        this.cityFrom =  cityFrom;
		this.cityTo =  cityTo;
		this.departure = departure;
		this.arrival = arrival;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.price = price;
		this.driver = driver;
		this.bus = bus;
		this.id = id;
    }
	
	 //dodawanie obiektu do bazy
    static add(schedule) {
		if(this.validate(schedule)){
			
			var Id = nextId;
			nextId++;
			
			//wywołuje polecenie sql i zwraca promesę (Promise)
			return db.execute(
			'insert into schedule (id, cityFrom, cityTo, departure, arrival, departureTime, arrivalTime, price, driver, bus) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[Id, schedule.cityFrom, schedule.cityTo, schedule.departure, schedule.arrival, schedule.departureTime, schedule.arrivalTime, schedule.price, schedule.driver, schedule.bus]
			);
			
		}
		else{
			console.log("Wprowadzone dane sa niepoprawne");
		}
    }
	
	//pobranie listy obiektów
    //metoda nie powinna pobierać nadmiarowych danych
    //(np. przez złączenia JOIN w relacyjnej bazie danych)
    //które nie będą wyświetlane na liście
    static list() {
        return db.execute('select * from Schedule');
    }
	
	
	static listDrivers(id){
		const list = [];
		
		var i;
		for (i = 0; i<scheduleExtent.length; i++){
			if(id == scheduleExtent[i].driver){
				list.push(scheduleExtent[i]);
			}				
		}
		
		return list;
	}
	
	static listBuses(id){
		const list = [];
		
		var i;
		for (i = 0; i<scheduleExtent.length; i++){
			if(id == scheduleExtent[i].bus){
				list.push(scheduleExtent[i]);
			}				
		}
		
		return list;
	}
	
	 //edycja obiektu
    static edit(schedule) {
        //FIXME
		if(this.validate(schedule)){
			
			return db.execute(
			"update schedule set cityFrom='"+schedule.cityFrom+
			"', cityTo='" +schedule.cityTo+
			"', departure='"+schedule.departure+
			"', arrival='"+schedule.arrival+
			"', departureTime='" +schedule.departureTime+
			"', arrivalTime='"+schedule.arrivalTime+
			"', price="+schedule.price+
			", driver="+schedule.driver+
			", bus="+schedule.bus+
			" where id="+schedule.id);
			
		}
		else{
			console.log("Wprowadzone dane sa niepoprawne");
		}
		
		
    }
    //usuwanie obiektu po id
    static delete(id) {
        //FIXME
		return db.execute('delete from schedule where id ='+id);
    } 
    //pobieranie obiektu do widoku szczegółów
    //może być potrzebne pobranie dodatkowych danych
    //np. przez złączenia JOIN w relacyjnej bazie danych
    static details(id) {
        //FIXME
		return db.execute('select * from schedule where id='+id);
    }
	
	static validate(schedule){
		var isCorrect = true;
		
		//to
		if(schedule.cityTo == schedule.cityFrom){
		isCorrect = false;
		}
		
		//departure
		var minDate = new Date(2000, 0, 1).toISOString().slice(0, 10);
		var maxDate = new Date(2050, 0 ,1).toISOString().slice(0, 10);
		
		if(schedule.departure <= minDate || schedule.departure > maxDate){
			isCorrect = false;
		}
		
		//arrival
		var minDate = schedule.departure;
		
		if(schedule.arrival < minDate || schedule.arrival > maxDate){
			isCorrect = false;
		}
		
		//departureTime
		if(schedule.departureTime < '00:00'){
			isCorrect = false;
		}
		
		//arrivalTime
		var arrivalDate = new Date(schedule.arrival);
		var departureDate = new Date(schedule.departure);
		
		if(arrivalDate <= departureDate && schedule.departureTime >= schedule.arrivalTime){
			isCorrect = false;
		}
		
		//price
		if(schedule.price.length > 3 ||
		schedule.price < 5){
			isCorrect = false;
		}
		
		
		return isCorrect;
	}
	
    //metoda resetuje stan bazy i dodaje rekordy testowe
    //przydatna do testów
    static initData() {
        //resetujemy licznik id
        db.execute('select * from schedule where id = (select Max(id) from Schedule)')
			.then( ([schedule, metadata]) => {
				var tmpSchedule = schedule[0];
				nextId = tmpSchedule.id + 1;
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
		});
   
    }
}

Schedule.initData();

module.exports = Schedule;
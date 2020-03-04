const db = require('../db/mysql');

//licznik id
let nextId = 1;
//ekstensja klasy (wszystkie obiekty)
const busExtent = [];

class Bus {
    //parametr id jest na końcu, bo jest opcjonalny
    constructor(name, seats, number, date, mileage, id) {
        this.id = id;
        this.name = name;
        this.seats = seats;
		this.number = number;
		this.date = date;
		this.mileage = mileage;
    }
	
	 //dodawanie obiektu do bazy
    static add(bus) {
		
		if(this.validate(bus)){
			
			var Id = nextId;
			nextId++;
			
			//wywołuje polecenie sql i zwraca promesę (Promise)
			try{
			return db.execute(
			'insert into bus (id, name, seats, number, date, mileage) values (?, ?, ?, ?, ?, ?)',
			[Id, bus.name, bus.seats, bus.number, bus.date, bus.mileage]
			);
			}catch (e) {}
			
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
        return db.execute('select * from Bus');
    }
	
	 //edycja obiektu
    static edit(bus) {
        //FIXME
		
		if(this.validate(bus)){
			
			return db.execute(
			"update bus set name='"+bus.name+
			"', seats=" +bus.seats+
			", number='"+bus.number+"', date='"+bus.date+
			"', mileage="+bus.mileage+" where id="+bus.id);
		}
		else{
			console.log("Wprowadzone dane sa niepoprawne");
			return db.execute('select * from bus where id='+id);
		}
		
    }
    //usuwanie obiektu po id
    static delete(id) {
        //FIXME
		return fn(id).then(v => {
			
		});
    } 
	
	static check(id){
		var canDelete = true;
		return db.execute('select * from schedule where bus ='+id)
			.then( ([scheduleList, metadata]) => {
				var FirstSchedule = scheduleList[0];
				
				if(typeof FirstSchedule == 'undefined'){
					canDelete = true;
					return canDelete;
				}
				else{
					console.log("Nie moge usunac dany autobus poniewaz jest on przypisany do rozkladu jazdy");
					canDelete = false;
					return canDelete;
				}
				
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
				return;
		});
	}
	
	static validate(bus){
		var isCorrect = true;
		
		//name
		if(bus.name.trim().length < 3 ||
		bus.name.trim().length > 30){
			isCorrect = false;
		}
		
		//seats
		if(bus.seats < 0 || 
		bus.seats > 200){
			isCorrect = false;
		}
		
		//number
		if(bus.number.trim().length < 3 ||
		bus.number.trim().length > 10){
			isCorrect = false;
		}
		
		//date
		var minDate = new Date(2000, 0, 1).toISOString().slice(0, 10);
		var maxDate = new Date().toISOString().slice(0, 10);
		
		if(bus.date <= minDate || bus.date > maxDate){
			isCorrect = false;
		}
		
		//mileage
		if(bus.mileage.length > 8 || bus.mileage.length < 1 ||
		bus.mileage < 0){
			isCorrect = false;
		}
		
		return isCorrect;
	}
	
    //pobieranie obiektu do widoku szczegółów
    //może być potrzebne pobranie dodatkowych danych
    //np. przez złączenia JOIN w relacyjnej bazie danych
    static details(id) {
        //FIXME
		return db.execute('select * from bus where id='+id);
    }
    //metoda resetuje stan bazy i dodaje rekordy testowe
    //przydatna do testów
    static initData() {
        //resetujemy licznik id
        db.execute('select * from Bus where id = (select Max(id) from Bus)')
			.then( ([bus, metadata]) => {
				var tmpBus = bus[0];
				nextId = tmpBus.id + 1;
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
		});
    }
}

async function fn(id){
	const canDelete = await Bus.check(id);
	if(canDelete){
		return db.execute('delete from bus where id ='+id);
	}
	else{
		return db.execute('select * from bus where id='+id);
	}
}

Bus.initData();

module.exports = Bus;
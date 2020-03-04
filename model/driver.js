const db = require('../db/mysql');

//licznik id
let nextId = 1;
//ekstensja klasy (wszystkie obiekty)
const driverExtent = [];

class Driver {
    //parametr id jest na końcu, bo jest opcjonalny
    constructor(firstName, lastName, date, experience, salary, id) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
		this.date = date;
		this.experience = experience;
		this.salary = salary;
    }
	
	 //dodawanie obiektu do bazy
    static add(driver) {
		if(this.validate(driver)){

			var Id = nextId;
			nextId++;
			
			//wywołuje polecenie sql i zwraca promesę (Promise)
			return db.execute(
			'insert into driver (id, firstName, lastName, date, salary, experience) values (?, ?, ?, ?, ?, ?)',
			[Id, driver.firstName, driver.lastName, driver.date, driver.salary, driver.experience]
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
        return db.execute('select * from Driver');
    }
	
	 //edycja obiektu
    static edit(driver) {
        //FIXME
		
		if(this.validate(driver)){
			
			return db.execute(
			"update driver set firstName='"+driver.firstName+
			"', lastName='" +driver.lastName+
			"', date= '"+driver.date+"', salary="+driver.salary+
			", experience="+driver.experience+" where id="+driver.id);
			
		}
		else{
			console.log("Wprowadzone dane sa niepoprawne");
			return db.execute('select * from driver where id='+id);
		}
		
		
		
		
		//driverExtent[index].firstName = driver.firstName;
		//driverExtent[index].lastName = driver.lastName;
		//driverExtent[index].date = driver.date;
		//driverExtent[index].experience = driver.experience;
		//driverExtent[index].salary = driver.salary;
		
    }
    //usuwanie obiektu po id
    static delete(id) {
        //FIXME 
		return fn(id).then(v => {
			
		});

    }
	
	
	
	
	static check(id){
		var canDelete = true;
		return db.execute('select * from schedule where driver ='+id)
			.then( ([scheduleList, metadata]) => {
				var FirstSchedule = scheduleList[0];
				
				if(typeof FirstSchedule == 'undefined'){
					canDelete = true;
					return canDelete;
				}
				else{
					console.log("Nie moge usunac danego kierowce poniewaz jest on przypisany do rozkladu jazdy");
					canDelete = false;
					return canDelete;
				}
				
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
				return;
		});
	}
	
	static validate(driver){
		var isCorrect = true;
		
		//firstName
		if(driver.firstName.trim().length < 3 || 
		driver.firstName.trim().length > 30){
			isCorrect = false;
		}

        //lastName
		if(driver.lastName.trim().length < 3 || 
		driver.lastName.trim().length > 30){
			isCorrect = false;
		}

		//date
		var minDate = new Date(2000, 0, 1).toISOString().slice(0, 10);
		var maxDate = new Date().toISOString().slice(0, 10);
		
		if(driver.date <= minDate || driver.date > maxDate){
			isCorrect = false;
		}
		
		//experience
		if(driver.experience.length > 2 ||
		driver.experience.length < 1 ||
		driver.experience < 0){
			isCorrect = false;
		}
		
		//salary
		if(driver.salary.length > 5 ||
		driver.salary < 500){
			isCorrect = false;
		}
		
		return isCorrect;
	}
	
    //pobieranie obiektu do widoku szczegółów
    //może być potrzebne pobranie dodatkowych danych
    //np. przez złączenia JOIN w relacyjnej bazie danych
    static details(id) {
        //FIXME
		return db.execute('select * from driver where id='+id);
		
    }
    //metoda resetuje stan bazy i dodaje rekordy testowe
    //przydatna do testów
    static initData() {        
        //resetujemy licznik id
		
        db.execute('select * from driver where id = (select Max(id) from Driver)')
			.then( ([driver, metadata]) => {
				var tmpDriver = driver[0];
				nextId = tmpDriver.id + 1;
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
		});
    }
}

async function fn(id){
	const canDelete = await Driver.check(id);
	if(canDelete){
		return db.execute('delete from driver where id ='+id);
	}
	else{
		return db.execute('select * from driver where id='+id);
	}
}

Driver.initData();

module.exports = Driver;
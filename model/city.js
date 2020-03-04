const db = require('../db/mysql');

//licznik id
let nextId = 1;
//ekstensja klasy (wszystkie obiekty)
const cityExtent = [];

class City {
    //parametr id jest na końcu, bo jest opcjonalny
    constructor(cityName, id) {
        this.id = id;
        this.cityName = cityName;
    }
	
	//pobranie listy obiektów
    //metoda nie powinna pobierać nadmiarowych danych
    //(np. przez złączenia JOIN w relacyjnej bazie danych)
    //które nie będą wyświetlane na liście
    static list() {
        return db.execute('select * from City');
    }
	
	 //dodawanie obiektu do bazy
    static add(city) {
		
		var Id = nextId;
		nextId++;
			
		//wywołuje polecenie sql i zwraca promesę (Promise)
		return db.execute(
		'insert into city (id, cityName) values (?, ?)',
		[Id, city.cityName]);
		
    }
	
    //pobieranie obiektu do widoku szczegółów
    //może być potrzebne pobranie dodatkowych danych
    //np. przez złączenia JOIN w relacyjnej bazie danych
    static details(id) {
        //FIXME
		return db.execute('select * from City where id='+id);
    }
    //metoda resetuje stan bazy i dodaje rekordy testowe
    //przydatna do testów
    static initData() {
        
        //resetujemy licznik id
        db.execute('select * from city where id = (select Max(id) from City)')
			.then( ([city, metadata]) => {
				var tmpCity = city[0];
				nextId = tmpCity.id + 1;
			}).catch(err => {
				//błąd komunikacji z bazą danych
				console.log(err);
		});
		
    }
}

City.initData();

module.exports = City;
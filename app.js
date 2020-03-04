const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// parsuje dane typu application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));


// baza danych
const db = require('./db/mysql');
let dbSchemaScript = fs.readFileSync(path.join(__dirname, '/db/schema.sql')).toString();
console.log(`Attempt to run schema.sql...`);
console.log(dbSchemaScript);
db.query(dbSchemaScript)
  .then( () => {
    //test pobierania danych z bazy
    //przykład sekwencjonowania wywołań asynchronicznych -
    //zwrócona promesa będzie obsłużowna w następnym bloku then()
    return db.execute('select * from City');
  })
  .then(([City, metadata]) => {
    console.log(City);
  })
  .catch(err => {
    console.log(err);
  })
; 




const driverController = require('./controller/driverController');
app.use('/drivers', driverController.route);

const busController = require('./controller/busController');
app.use('/buses', busController.route);

const scheduleController = require('./controller/scheduleController');
app.use('/schedules', scheduleController.route);

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});

-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2020-01-05 10:36:40.757

-- tables
-- Table: Bus
CREATE TABLE IF NOT EXISTS Bus (
    id integer  NOT NULL,
    name varchar(30)  NOT NULL,
    seats integer  NOT NULL,
    number varchar(10)  NOT NULL,
    date date  NOT NULL,
    mileage integer  NOT NULL,
    CONSTRAINT Bus_pk PRIMARY KEY (id)
) ;

-- Table: City
CREATE TABLE IF NOT EXISTS City (
    id integer  NOT NULL,
    cityName varchar(50)  NOT NULL,
    CONSTRAINT City_pk PRIMARY KEY (id)
) ;

-- Table: Driver
CREATE TABLE IF NOT EXISTS Driver (
    id integer  NOT NULL,
    firstName varchar(30)  NOT NULL,
    lastName varchar(30)  NOT NULL,
    date date  NOT NULL,
    experience integer  NOT NULL,
    salary integer  NOT NULL,
    CONSTRAINT Driver_pk PRIMARY KEY (id)
) ;

-- Table: Schedule
CREATE TABLE IF NOT EXISTS Schedule (
    id integer  NOT NULL,
    departure date  NOT NULL,
    arrival date  NOT NULL,
    departureTime time  NOT NULL,
    arrivalTime time  NOT NULL,
    cityFrom integer  NOT NULL,
    cityTo integer  NOT NULL,
    driver integer  NOT NULL,
    bus integer  NOT NULL,
    price integer  NOT NULL,
    CONSTRAINT Schedule_pk PRIMARY KEY (id)
) ;


-- foreign keys
-- Reference: Rejs_Autobus (table: Schedule)
set @var=if((SELECT true FROM information_schema.TABLE_CONSTRAINTS WHERE
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'Schedule' AND
            CONSTRAINT_NAME   = 'Rejs_Autobus' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY') = false,'ALTER TABLE Schedule ADD CONSTRAINT Rejs_Autobus
    FOREIGN KEY (bus)
    REFERENCES Bus (id)','select 1');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;


-- Reference: Rejs_Kierowca (table: Schedule)
set @var=if((SELECT true FROM information_schema.TABLE_CONSTRAINTS WHERE
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'Schedule' AND
            CONSTRAINT_NAME   = 'Rejs_Kierowca' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY') = false,'ALTER TABLE Schedule ADD CONSTRAINT Rejs_Kierowca
    FOREIGN KEY (driver)
    REFERENCES Driver (id)','select 1');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;


-- Reference: Rejs_MiastoOdjazdu (table: Schedule)
set @var=if((SELECT true FROM information_schema.TABLE_CONSTRAINTS WHERE
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'Schedule' AND
            CONSTRAINT_NAME   = 'Rejs_MiastoOdjazdu' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY') = false,'ALTER TABLE Schedule ADD CONSTRAINT Rejs_MiastoOdjazdu
    FOREIGN KEY (to)
    REFERENCES City (id)','select 1');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;



-- Reference: Rejs_MiastoPrzyjazdu (table: Schedule)
set @var=if((SELECT true FROM information_schema.TABLE_CONSTRAINTS WHERE
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'Schedule' AND
            CONSTRAINT_NAME   = 'Rejs_MiastoPrzyjazdu' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY') = false,'ALTER TABLE Schedule ADD CONSTRAINT Rejs_MiastoPrzyjazdu
    FOREIGN KEY (from)
    REFERENCES City (id)','select 1');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;


-- Insert data
INSERT IGNORE INTO Driver(id, firstName, lastName, date, experience, salary) VALUES 
	(1, 'Jan', 'Kowalski', '2017-1-1', 4, 3000),
	(2, 'Anna', 'WiÅ›niewska', '2018-1-2', 3, 2500),
	(3, 'Andrzej', 'Nowak', '2019-1-3', 2, 2000);
  
  
INSERT IGNORE INTO Bus (id, name, seats, number, date, mileage) VALUES
	(1, 'Neoplan', 57, 'BR123A', '2017-0-1', 30000),
	(2, 'Setra', 49, 'AT002B', '2018-1-2', 45000),
	(3, 'MAN', 60, 'CW734C', '2019-2-3', 22000);
	
	
INSERT IGNORE INTO City (id, cityName) VALUES	
	(1, 'Warszawa'),
	(2, 'Kraków'),
	(3, 'Lódz'),
	(4, 'Lublin'),
	(5, 'Wroclaw'),
	(6, 'Gdansk');


INSERT IGNORE INTO Schedule (id, departure, arrival, departureTime, arrivalTime, cityFrom, cityTo, driver, bus, price) VALUES
(1, '2017-01-01', '2017-01-01', '11:00', '12:30', 1, 2, 1, 3, 100),
(2, '2017-02-03', '2017-02-03', '14:15', '16:30', 2, 3, 2, 1, 80),
(3, '2017-03-01', '2017-03-01', '10:00', '12:00', 3, 1, 1, 1, 90);

-- End of file.


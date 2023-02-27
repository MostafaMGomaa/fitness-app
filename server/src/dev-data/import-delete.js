/***** NPM PACKAGE HASE SOME METHOD READ AND HANDLE THE JSON FILES */
const jsonfile = require('jsonfile');
const moment = require('moment');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const random_date = require('random-date-generator');
const fs = require('fs');

// dotenv.config({ path: require('find-config')('config.env') });

let DB = '';
if (process.env.LOCAL) {
  DB = process.env.DATABASE_LOCAL;
} else {
  DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
}
console.log(DB);

// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

mongoose.connect(DB).then(() => console.log('Connected Successfully'));

/***
 * return random date using random-date-generator package
 */
const randomDate = () => {
  const startDate = new Date(2023, 1, 1);
  const endDate = new Date(2023, 12, 31);
  return random_date.getRandomDateInRange(startDate, endDate);
};

/***
 * COUNTERIES THAT OUR PROJECT SUPPORT
 * ADD MORE COUNTRIES IF NEEDED
 */
const countries = [
  'Egypt',
  'France',
  'Saudi Arabia',
  'United Arab Emirates',
  'Russia',
  'Spain',
  'United Kingdom',
  'Italy',
];

const data = [];

/***
 * READ THE FILE
 * THEN FILTER THE FILE TO GET THE ONLY THE AIRPORTS AND THE SUPPORTED COUNTRIES
 * THEN PUSH IT TO THE DATA ARRAY
 */
const file = jsonfile
  .readFileSync(`${__dirname}/airports.json`)
  .forEach((e) => {
    if (e.type === 'Airports' && countries.includes(e.country)) {
      const obj = {
        name: e.name,
        city: e.city,
        country: e.country,
        state: e.state,
      };
      data.push(obj);
    }
  });

/**
 * GENERATE SOME FLIGHTS FROM THE DATA ARRAY
 * GENERATE A FLIGHT FROM EACH ELEMENT TO A RANDOM ELEMENT
 * GENERATE A RANDOM PRICE BETWEEN 500$-1000$
 * CURRENT DATE AND TIME
 * PUSH THIS FLIGHT TO THE FLIGHTS ARRAY
 */

const generateFlights = () => {
  const flights = [];

  data.forEach((from, idx) => {
    let toIdx = Math.trunc(Math.random() * data.length);
    while (idx === toIdx) toIdx = Math.trunc(Math.random() * data.length);
    const to = data[toIdx];
    const flight = {
      fromCountry: from.country,
      fromCity: from.city || from.country,
      fromSite: from.name || from.city,
      toCountry: to.country,
      toCity: to.city || to.country,
      toSite: to.name || to.city,
      name: `a Tour from ${from.city || from.country} to ${
        to.city || to.country
      }`,
      price: Math.trunc(Math.random() * 1001),
      startDates: [randomDate(), randomDate(), randomDate()],
      duration: Math.trunc(Math.random() * 21) + 1,
      description: `a fantastic Tour start in '${moment(randomDate()).format(
        'MMMM Do YYYY'
      )}' and take about '${
        Math.trunc(Math.random() * 21) + 1
      }hrs', to enjoy in ${to.city} }`,
      summary: `a Tour from ${from.city || from.country} to ${
        to.city || to.country
      }`,
    };
    flights.push(flight);
  });
  return flights;
};

// Read data from file.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importDataToDB = async () => {
  try {
    await Tour.create(tours);
    console.log('Inserted Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteDataFromDB = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();

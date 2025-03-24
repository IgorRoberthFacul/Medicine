import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/medicine');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'conection error:'));
db.once (
  'open',function (){
    console.log('Database connected sucessgfully');
  }
);

export default db;
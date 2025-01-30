// const mongoose=require("mongoose");
// const initData=require("./data.js");
// const Listing=require("../models/listing.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// main().then((req,res)=>{
//     console.log("connect to DB");
// }).catch((err)=>{
//     console.log(err);
// });

// async function main(){
//     await mongoose.connect(MONGO_URL);
// };



// const initDB=async()=>{
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");

// };


// initDB();


//  create chat gtp..........................................................


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6778d83038d3e48187b59499",
   image: obj.image.url, // Ensure `image` is a string
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();










// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// // Connect to MongoDB
// async function main() {
//   try {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to DB");
//   } catch (err) {
//     console.error("Error connecting to DB:", err);
//   }
// }

// // Initialize the database with sample data
// const initDB = async () => {
//   try {
//     await Listing.deleteMany({}); // Clear the existing collection
//     const formattedData = initData.data.map((obj) => ({
//       ...obj,
//       owner: "6778d83038d3e48187b59499",
//       image: obj.image.url, // Use the correct property to access the image URL
//     }));
//     await Listing.insertMany(formattedData); // Insert the formatted data
//     console.log("Data has been initialized");
//   } catch (err) {
//     console.error("Error initializing data:", err);
//   }
// };

// // Run the initialization
// (async () => {
//   await main();
//   await initDB();
// })();

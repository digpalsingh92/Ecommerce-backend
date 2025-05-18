import mongoose from "mongoose";

export default async function DBConnect() {
   try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("MongoDb Connected");
   } catch (error) {
    console.error("error Connecting to Database");
    process.exit(1);
   }
}

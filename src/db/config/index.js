import mongoose from "mongoose";

const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db success connect");
  })
  .catch((error) => {
    console.log("error connecting to database: ");
    console.log(error.message);
  });

import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import users from "./routes/user.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI,
      dbName: "calendar",
      collectionName: "sessions"
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use("/user", users);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
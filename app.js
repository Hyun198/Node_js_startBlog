require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUnitailized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
    }),
  })
);

app.use(express.static("public"));
//Templateing engine
app.use(expressLayout);
app.set("layout", "./layouts/template");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.locals.isActiveRoute = isActiveRoute;

//connect DB
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});

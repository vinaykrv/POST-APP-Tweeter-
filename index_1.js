const express = require("express");
const app = express();
const port = 8080;

const Tweet = require("./models/posts");
const path = require("path");

// const { v4: uuidv4 } = require("uuid"); // ye hume unique id dega har post ke liye.
// // uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

main()
  .then(() => console.log("Connection ho gaya - Tweeter")) // yaha main() run kiya aur database se connection banaya jo ki ek asynchronous code hai.
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tweeter"); // yaha meChat database use kr rahe hai.
}

// 1st chat insert
let tweet1 = new Tweet({
  username: "Shreyas",
  content: "kami kaya hai mere main ?",
  created_at: new Date(),
});

// tweet1
//   .save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// iss array se bhi hum data le sakte hai aur UI par dikha sakte hai bina database use kiye.
/*
let posts_arr = [
  {
    id: uuidv4(),
    username: "virat",
    content: "Main hu Pakistan ka papa",
  },
  {
    id: uuidv4(),
    username: "rohit",
    content: "Daddy of Daddy hundreds",
  },
  {
    id: uuidv4(),
    username: "hardik",
    content: "Best allrounder hard hitting pandiya",
  },
  {
    id: uuidv4(),
    username: "bumrah",
    content: "Yorker king death over specialist",
  },
];

*/

// post wall ko display krna UI par.
app.get("/posts", async (req, res) => {
  let posts_arr = await Tweet.find();
  res.render("index.ejs", { posts_arr });
});

// jab UI par Create new post karenge toh ye route hit hoga.
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// new post create krna UI se.
app.post("/posts", (req, res) => {
  console.log(req.body);

  let { username, content } = req.body;

  let tweet1 = new Tweet({
    username: username,
    content: content,
    created_at: new Date(),
  });

  tweet1
    .save()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  //   res.send("Post request working");
  res.redirect("/posts");
});

// see in details button par ye route hit hoga.
app.get("/posts/:id", async (req, res) => {
  let { id } = req.params; // ye "id" jo hai params object ke andar ki "id" hai.

  // console.log(id);

  let ipost = await Tweet.findById(id);

  res.render("single.ejs", { ipost });
});

// jab hum click to edit par click karenge toh ye route hit hoga.
app.get("/posts/:id/edit", async (req, res) => {
  let { id } = req.params;
  let ipost = await Tweet.findById(id);
  res.render("edit.ejs", { ipost });
});

// click to edit ke baad edit krne ke badd submit click karne par ye route hit hoga.
app.patch("/posts/:id", async (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  // console.log(newContent);
  let ipost = await Tweet.findById(id);
  ipost.content = newContent;
  // console.log("updated dikhao",ipost);
  ipost
    .save()
    .then((res) => console.log("ye gaya hai update hoke DB main",res))
    .catch((err) => console.log(err));

  res.redirect("/posts");
});

// delete a post
app.delete("/posts/:id", async (req, res) => {
  let { id } = req.params;
  let delPost = await Tweet.findByIdAndDelete(id);
  console.log("del",delPost);

  res.redirect("/posts");
});

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});

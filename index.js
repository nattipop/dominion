if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const { DominionPhoto, DominionService} = require("./models");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const mongoose = require("mongoose");
const { off } = require("process");
mongoose.connect("mongodb+srv://natvita:ccthp2ZOBD5InClT@rlcluster.e9w3anc.mongodb.net/");
const db = mongoose.connection;
db.on("error", error => console.log(error))
db.once("open", () => console.log("connected to database"))

app.get("/", cors(), async (req, res) => {
  res.send("this is working")
})

// PHOTOS API CALLS START
app.get("/all-dominion-photos", cors(), (req, res) => {
  DominionPhoto.find({}).then((err, photos) => {
    if(err){
      return res.send(err);
    }

    if(!photos){
      return res.status(404).send("No photos to show.")
    }
    res.status(200).send(photos)
  })
});

app.get("/dominion-photos/:category", cors(), async (req, res) => {
  const category = req.params.category;

  await DominionPhoto.find({ category: category }).then(photos => {
    if(!photos){
      return res.status(404).send("No photos to show.")
    }
    
    res.status(200).send(photos)
  })
});

app.get("/dominion-photo-by-id/:photo_id", cors(), async (req, res) => {
  const photo_id = req.params.photo_id;

  await DominionPhoto.findOne({ photo_id: photo_id }).then(photo => {
    if(!photo){
      res.status(404).send("Could not find photo with that id.")
    };

    res.status(200).send(photo)
  })
});

app.post("/new-dominion-photo", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Photo title required.");
  if(!data.photo_id) res.status(422).send("Photo id required.");
  if(!data.url) res.status(422).send("Photo url required.");
  if(!data.category) res.status(422).send("Photo category required.");

  const photo = new DominionPhoto({
    title: data.title,
    photo_id: data.photo_id,
    url: data.url,
    category: data.category
  });
  photo.save();
  res.status(200).send("Successfully added photo.")
});
// PHOTOS API CALLS END

// SERVICES API CALLS START
app.get("/all-dominion-services", cors(), (req, res) => {
  DominionService.find({}).then((err, services) => {
    if(err){
      return res.send(err);
    }
  
    if(!services){
      return res.status(404).send("No services to show.")
    }
    res.status(200).send(services)
  })
});

app.post("/new-dominion-service", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Service title required.");
  if(!data.service_id) res.status(422).send("Service id required.");
  if(!data.price) res.status(422).send("Service price required.");
  if(!data.category) res.status(422).send("Service category required.");

  const service = new DominionService({
    title: data.title,
    service_id: data.service_id,
    price: data.price,
    description: data.description,
    picture_url: data.picture_url,
    category: data.category,
    order: data.order
  });

  service.save()
  res.status(200).send("Successfully added service.")
});

app.get("/dominion-service/:category", cors(), async (req, res) => {
  const category = req.params.category;

  await DominionService.find({ category: category }).then(services => {
    if(!services){
      return res.status(404).send("No Services to show.")
    }
    
    res.status(200).send(services)
  })
});

app.get("/dominion-service-by-id/:service_id", cors(), async (req, res) => {
  const service_id = req.params.service_id;

  await Service.findOne({ service_id: service_id }).then(service => {
    if(!service){
      return res.status(404).send("Could not find service with that id.")
    }

    res.status(200).send(service);
  })
});
// SERVICES API CALLS END

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:5000`)
})
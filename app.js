const express = require('express');
const multer = require('multer'); // For handling file uploads

const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017/";
const databaseName = "mydatabase";

const app = express();
const port = 3000;

async function connectToMongoDB() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

// Wrap the code inside an async function
async function startServer() {
  await connectToMongoDB().catch(console.error);

  app.use(express.json());

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage });

  app.post('/api/v3/app/events', upload.single('image'), async (req, res) => {
    const newEvent = {
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      description: req.body.description,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: req.body.rigor_rank,
      image: req.file ? req.file.path : '',
    };

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection('events');
      const result = await collection.insertOne(newEvent);
      console.log('Inserted document ID:', result.insertedId);
      res.status(200).send(result.insertedId);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error while inserting event');
      return;
    } finally {
      await client.close();

    }
  });

  app.delete('/api/v3/app/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const client = new MongoClient(uri);
    
    
    try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection('events');
      const result = await collection.deleteOne({ _id: { $eq: ObjectId.createFromHexString(eventId) } });
      
      if (result.deletedCount === 1) {
        res.status(200).send('Event deleted successfully');
      } else {
        res.status(404).send('Event not found');
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('Error while deleting event');
    } finally {
      await client.close();
    }
  });

  app.put('/api/v3/app/events/:id', upload.single('image'), async (req, res) => {
    const eventId = req.params.id;
    const fieldsToUpdate = ['name', 'tagline', 'schedule', 'description', 'moderator', 'category', 'sub_category', 'rigor_rank'];
    const updatedFields = {};
    
    for (const field of fieldsToUpdate) {
      if (req.body[field]) {
        updatedFields[field] = req.body[field];
      }
    }
    
    if (req.file) {
      updatedFields.image = req.file.path;
    }
  
    const client = new MongoClient(uri);
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      const database = client.db(databaseName);
      const collection = database.collection('events');
  
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(eventId) },
        { $set: updatedFields },
        { returnOriginal: false }
      );
  
      if (result.value) {
        res.status(200).send('Event updated successfully');
      } else {
        res.status(404).send('Event not found');
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('Error while updating event');
    } finally {
      await client.close();
    }
  });
  

  app.get('/api/v3/app/events/:id', async (req, res) => {
    const eventId = req.params.id; // Retrieve event_id from the URL parameter
  
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection('events');
      const event = await collection.findOne({ _id: new ObjectId(eventId) });
  
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).send('Event not found');
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('Error while fetching event');
    } finally {
      await client.close();
    }
  });

  app.get('/api/v3/app/events', async (req, res) => {
    const { type, limit, page } = req.query;

    let query = {};
  
    if (type === 'latest') {
      query = { schedule: { $lte: new Date().toISOString() } };
    }

    const skip = (page - 1) * limit;
    options = { limit: parseInt(limit), skip };
  
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection('events');
  
      // Fetch events based on the query and options
      const events = await collection.find(query, options).toArray();
  
      // Send the response with the fetched events
      res.json(events);

    } catch (e) {
      console.error(e);
      res.status(500).send('Error while fetching events');
    } finally {
      await client.close();
    }
  });
  
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Call the async function to start the server
startServer().catch(console.error);
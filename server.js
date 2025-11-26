import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';

config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const ItemSchema = new mongoose.Schema({ name: String, description: String });
const Item = mongoose.model('Item', ItemSchema);

app.get('/items', async (req, res) => {
  res.json(await Item.find());
});

app.post('/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log("API running on port 3000"));

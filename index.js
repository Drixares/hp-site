import express from 'express';
import router from './routes/start.js';

const app = express();
app.use(express.json());
app.use('/', router);
app.use(express.static('public'));


app.get('/:file', (req, res) => {
  res.sendFile(req.params.file + '.html', { root: 'public' });
})

const port = process.env.PORT || 3000;
const initializeApp = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

initializeApp();
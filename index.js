import express from 'express';
import ip from 'ip';
import router from './routes/_start.js';

const ipAdress = ip.address();

const app = express();
app.use(express.json());
app.use('/', router);
app.use(express.static('public'));


app.get('/:file', (req, res) => {
  return res.sendFile(req.params.file + '.html', { root: 'public' });
})

const port = process.env.PORT || 3000;
const initializeApp = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

initializeApp();
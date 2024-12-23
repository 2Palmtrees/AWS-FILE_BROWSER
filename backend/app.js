import express from 'express'
import bodyParser from 'body-parser';

import s3Routes from './routes/s3.js'


const app = express()
const port = 3000

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(s3Routes);


// This will be executed whenever an error is thrown or forwarded with 'next'
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
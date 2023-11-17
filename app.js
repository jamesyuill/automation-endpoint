import express from 'express';
import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs';
import { endpoints } from './endpoints.js';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ endpoints });
});

app.get('/applicants', async (req, res) => {
  try {
    const filePath = new URL('data/applicantData.json', import.meta.url);
    const applicants = await readFile(filePath, { encoding: 'utf8' });
    const parsed = JSON.parse(applicants);
    res.send(parsed);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/applicants/:id', async (req, res) => {
  const { id } = req.query;
  try {
    const filePath = new URL('data/applicantData.json', import.meta.url);
    const applicants = await readFile(filePath, { encoding: 'utf8' });
    const applicant = await JSON.parse(applicants).filter(
      (app) => app.id == id
    );
    res.send(applicant);
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/applicants/:id', async (req, res) => {
  const id = req.query.id;
  const { entryBooked } = req.body;
  try {
    const filePath = new URL('data/applicantData.json', import.meta.url);
    const applicants = await readFile(filePath, { encoding: 'utf8' });
    const updatedApplicants = await JSON.parse(applicants).map((app) => {
      if (app.id === id) {
        let newObj = {
          ...app,
          entryBooked,
        };
        return newObj;
      }
      return app;
    });

    writeFile(
      'data/applicantData.json',
      JSON.stringify(updatedApplicants),
      (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      }
    );

    const applicant = updatedApplicants.filter((app) => app.id == id);
    res.send(applicant);
  } catch (err) {
    console.error(err.message);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

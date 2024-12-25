import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// JSON Database Path
const DB_PATH = './data/db.json';

// Utility Functions
function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ jobs: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Routes
app.get('/', (req, res) => {
  const db = loadDatabase();
  res.render('index', { jobs: db.jobs });
});

// Add a New Job
app.post('/jobs', (req, res) => {
  const { link, description } = req.body;

  if (!link || !description) {
    return res.status(400).json({ error: 'Link and description are required.' });
  }

  const db = loadDatabase();
  const newJob = {
    id: db.jobs.length + 1,
    link,
    description,
    status: 'draft',
    resumes: [],
  };

  db.jobs.push(newJob);
  saveDatabase(db);

  io.emit('job_added', newJob); // Notify clients of the new job
  res.status(201).json(newJob);
});

// Tailor a Resume for a Job
app.post('/jobs/:id/tailor', (req, res) => {
  const jobId = parseInt(req.params.id);
  const db = loadDatabase();
  const job = db.jobs.find((job) => job.id === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  // Placeholder tailoring logic
  const tailoredResume = {
    name: "John Doe",
    tailoredFor: job.description,
  };

  // Save the tailored resume
  const resumePath = `./data/resumes/resume_${jobId}.json`;
  fs.writeFileSync(resumePath, JSON.stringify(tailoredResume, null, 2));
  job.resumes.push(resumePath);
  saveDatabase(db);

  io.emit('resume_tailored', { jobId, resumePath }); // Notify clients of the update
  res.json({ message: 'Resume tailored successfully.', resumePath });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

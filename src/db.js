import fs from 'fs';
const DB_PATH = './data/db.json';

// Load the database
export function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ jobs: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

// Save the database
export function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Add a new job
export function addJob(link, description) {
  const db = loadDatabase();
  const newJob = {
    id: db.jobs.length + 1,
    link,
    description,
    status: 'draft',
    resumes: []
  };
  db.jobs.push(newJob);
  saveDatabase(db);
  return newJob;
}

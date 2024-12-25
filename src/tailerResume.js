import { loadDatabase, saveDatabase } from './db.js';
import { generateResumeFromAI } from './aiIntegration.js'; // OpenAI logic

export async function tailorResumeForJob(jobId, jobDescription) {
  const db = loadDatabase();
  const job = db.jobs.find((job) => job.id === jobId);

  if (!job) {
    throw new Error(`Job with ID ${jobId} not found.`);
  }

  const tailoredResume = await generateResumeFromAI(jobDescription);
  const resumeFilePath = `./data/resumes/resume_${jobId}.json`;

  // Save the tailored resume
  fs.writeFileSync(resumeFilePath, JSON.stringify(tailoredResume, null, 2));
  job.resumes.push(resumeFilePath);

  saveDatabase(db);
  return resumeFilePath;
}

const fs = require('fs');
const { jsPDF } = require('jspdf');

require('dotenv').config();

const openaiApiKey = process.env.OPENAI_API_KEY;


// Load JSON file
function loadResume(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Save JSON file
function saveResume(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated resume saved to ${filePath}`);
}

// Modify JSON data
function modifyResume(resume) {
    resume.name = "John Doe";
    resume.contact.email = "john.doe@example.com";
    return resume;
}

// Generate PDF from JSON
function generatePdf(resume, outputFilePath) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(resume.name, 10, 10);
    doc.setFontSize(12);
    doc.text(`Email: ${resume.contact.email}`, 10, 20);

    doc.save(outputFilePath);
    console.log(`PDF generated: ${outputFilePath}`);
}

// Main execution
const resumeFilePath = './templates/base-resume-template.json';
const updatedResumePath = './generated/updated-resume.json';
const pdfOutputPath = './generated/resume.pdf';

// Load, modify, and save JSON
const resume = loadResume(resumeFilePath);
const updatedResume = modifyResume(resume);
saveResume(updatedResumePath, updatedResume);

// Generate PDF
generatePdf(updatedResume, pdfOutputPath);

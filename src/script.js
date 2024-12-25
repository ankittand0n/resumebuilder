import fs from "fs";

// Function to load JSON template
function loadBaseResume(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Function to save tailored resume
function saveTailoredResume(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Tailored resume saved to ${filePath}`);
}
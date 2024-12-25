import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

// Load the resume data
const formattedBaseResume = JSON.parse(
  fs.readFileSync("./data/templates/template.json", "utf-8")
);
// Generate PDF
const newres = generateResumeFromAI(
  `https://join.com/companies/limbiq/13164985-java-full-stack-developer-f-m-d?pid=e65242534431eadcb0c9`,
  formattedBaseResume
);


// Function to generate a tailored resume
async function generateResumeFromAI(jobDescription, baseResumeJson) {
  try {
    // Format the base resume JSON as a string
    const formattedBaseResume = JSON.stringify(baseResumeJson, null, 2);

    // Prepare the prompt
    const messages = [
      { role: "system", content: "You are a professional resume builder." },
      {
        role: "user",
        content: `Here is the job description on this webpage:\n${jobDescription}\n\nHere is the base resume (JSON):\n${formattedBaseResume}\n\nGenerate a tailored resume in valid JSON format.`,
      },
    ];

    // Call the OpenAI API
    const apiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    // Extract the result from the API response
    const tailoredResume = parseResponse(apiResponse.choices[0].message.content);

    console.log(tailoredResume);
    // Parse the tailored resume JSON for further processing
    // return JSON.parse(tailoredResume);
  } catch (error) {
    console.error("Error generating tailored resume:", error.message);
    throw error;
  }
}
// Validate and parse API response

function parseResponse(apiResponse) {
  const jsonMatch = apiResponse.match(/```json\s([\s\S]*?)```/);
  try {
    if (jsonMatch && jsonMatch[1]) {
      const tailoredResume = JSON.parse(jsonMatch[1]);
      saveTailoredResume("tailored-resume.json", tailoredResume);
      console.log("Tailored resume generated successfully!");
    } else {
      console.error(
        "The API response does not contain JSON data:",
        apiResponse
      );
      throw new Error("Invalid JSON returned by API");
    }
  } catch (parseError) {
    console.error(
      "Error tailoring resume:",
      error.response?.data || error.message
    );
  }
}
// Function to save tailored resume
function saveTailoredResume(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Tailored resume saved to ${filePath}`);
}

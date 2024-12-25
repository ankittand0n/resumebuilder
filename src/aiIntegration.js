import OpenAI from "openai";

const openai = new OpenAI();

// Function to generate a tailored resume
async function generateResumeFromAI(jobDescription, formattedBaseResume) {
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional resume builder." },
      {
        role: "user",
        content: `Here is the job description:\n${jobDescription}\n\nHere is the base resume (JSON):\n${formattedBaseResume}\n\nGenerate a tailored resume in valid JSON format.`,
      },
    ],
  });

  // Validate and parse API response
  const jsonMatch = response.match(/```json\s([\s\S]*?)```/);
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

  return response.choices[0].message.content;
}

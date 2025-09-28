import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be handled by the environment, but as a safeguard:
  console.error("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generatePolicyContent(policyName: string): Promise<string> {
  try {
    const prompt = `You are an expert in IT security and compliance. Write a comprehensive IT policy about "${policyName}".
The policy should be well-structured and ready for a corporate environment.
Use Markdown for formatting. Include the following sections:
1.  **Overview**: A brief introduction.
2.  **Purpose**: The goal of the policy.
3.  **Scope**: Who this policy applies to.
4.  **Policy**: The main rules and guidelines, using sub-sections if necessary.
5.  **Policy Compliance**: How compliance is measured and what happens in case of non-compliance.
6.  **Related Standards, Policies and Processes**: A list of related documents.
7.  **Definitions and Terms**: A list of key terms.
8.  **Revision History**: A table for tracking changes.

Start the document with a level 3 markdown heading like this: '### Consensus Policy Resource Community' and include a disclaimer about free use for the internet community from the SANS institute.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text ?? '';
  } catch (error) {
    console.error("Error generating policy content:", error);
    throw new Error("Failed to generate content from AI. Please check if your API key is configured correctly and try again.");
  }
}

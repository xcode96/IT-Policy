
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePolicyContent(policyName: string): Promise<string> {
    const prompt = `
        Act as an IT policy expert and corporate writer.
        Generate a comprehensive and professionally formatted document for the following IT policy: "${policyName}".

        The document should be well-structured and ready for corporate use. Include the following sections:
        1.  **Policy Name**: The full name of the policy.
        2.  **Policy ID**: A placeholder ID (e.g., CORP-IT-SEC-0XX).
        3.  **Version**: A placeholder version number (e.g., 1.0).
        4.  **Effective Date**: A placeholder date.
        5.  **Purpose**: A brief statement explaining why the policy exists.
        6.  **Scope**: Clearly define who and what this policy applies to.
        7.  **Policy Statements**: The core rules and guidelines of the policy. Use clear, direct language. This should be the most detailed section.
        8.  **Roles and Responsibilities**: Define the responsibilities of different groups (e.g., Employees, IT Department, Management).
        9.  **Enforcement**: State the consequences of non-compliance.
        10. **Related Documents**: List any related policies or standards (e.g., "Acceptable Use Policy").

        Format the output using Markdown for clear readability, including headings, bold text, and bullet points.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}

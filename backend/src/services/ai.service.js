const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'your_api_key',
});

const rankProposals = async (gigTitle, proposals) => {
  if (!proposals || proposals.length === 0) return [];

  const prompt = `You are an expert recruiter for GigSphere. 
  Gig Title: "${gigTitle}"
  
  Proposals:
  ${proposals.map((p, i) => `ID: ${i}, Freelancer Skills: ${p.skills.join(', ')}, Cover Letter: "${p.cover_letter}"`).join('\n\n')}
  
  Rank these proposals from 1 to 100 based on skill fit and quality of the cover letter. 
  Respond ONLY with a JSON array of objects: [{ "id": number, "score": number, "reason": string }].`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Simple parsing of JSON from the response
    const responseText = msg.content[0].text;
    const jsonMatch = responseText.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("AI Ranking Error:", error);
    return proposals.map((p, i) => ({ id: i, score: 50, reason: "Default score due to error" }));
  }
};

module.exports = { rankProposals };

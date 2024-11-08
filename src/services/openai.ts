import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateCityFacts(cityName: string): Promise<string> {
  console.log('Generating facts for city:', cityName);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: "You are a knowledgeable tour guide. Provide interesting and lesser-known facts about cities."
    }, {
      role: "user",
      content: `Tell me an interesting fact about ${cityName} that most people don't know. Keep it concise and engaging.`
    }],
  });

  const fact = response.choices[0]?.message?.content || "No facts available at the moment.";
  console.log('Generated fact:', fact);
  return fact;
}

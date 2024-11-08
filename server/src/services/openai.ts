import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInitialCityFacts(cityName: string): Promise<string[]> {
  console.log('Generating initial facts for city:', cityName);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [{
      role: "system",
      content: "You are a knowledgeable tour guide. Provide 10 interesting and lesser-known facts about cities. Each fact should be concise and engaging."
    }, {
      role: "user",
      content: `Please provide 10 interesting facts about ${cityName}. Each fact should be on a new line.`
    }],
  });

  const facts = response.choices[0]?.message?.content?.split('\n').filter(fact => fact.trim()) || [];
  console.log('Generated initial facts:', facts);
  return facts;
}

export async function generateTourGuideSpeech(cityName: string, facts: string[]): Promise<string> {
  console.log('Generating tour guide speech for:', cityName);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [{
      role: "system",
      content: "You are an engaging tour guide. Create natural, conversational speech using the provided facts. Be enthusiastic but professional."
    }, {
      role: "user",
      content: `Create a brief tour guide speech about ${cityName} using these facts: ${facts.join(". ")}. Keep it engaging and natural.`
    }],
  });

  const speech = response.choices[0]?.message?.content || "No tour guide speech available at the moment.";
  console.log('Generated speech:', speech);
  return speech;
}

export async function generateCityFacts(cityName: string, previousFacts: string[] = []): Promise<string> {
  console.log('Generating additional fact for city:', cityName);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [{
      role: "system",
      content: "You are a knowledgeable tour guide. Provide interesting and lesser-known facts about cities. Never repeat information that has been shared before."
    }, {
      role: "user",
      content: `Tell me an interesting fact about ${cityName} that most people don't know. Keep it concise and engaging. Here are facts already shared, please share something different: ${previousFacts.join(". ")}`
    }],
  });

  const fact = response.choices[0]?.message?.content || "No facts available at the moment.";
  console.log('Generated fact:', fact);
  return fact;
}
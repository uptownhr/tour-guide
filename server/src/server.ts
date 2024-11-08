import express from 'express';
import cors from 'cors';
import { generateInitialCityFacts, generateTourGuideSpeech, generateCityFacts } from './services/openai.ts';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory cache for city facts
const cityFactsCache: Record<string, string[]> = {};

app.get('/api/cities/:cityName/facts', async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // Check cache first
    if (!cityFactsCache[cityName]) {
      // Generate and cache if not found
      cityFactsCache[cityName] = await generateInitialCityFacts(cityName);
    }
    
    const facts = cityFactsCache[cityName];
    const tourGuideSpeech = await generateTourGuideSpeech(cityName, facts);
    
    res.json({ facts, tourGuideSpeech });
  } catch (error) {
    console.error('Error getting city facts:', error);
    res.status(500).json({ error: 'Failed to get city facts' });
  }
});

app.post('/api/cities/:cityName/fact', async (req, res) => {
  try {
    const { cityName } = req.params;
    const { existingFacts } = req.body;
    
    const fact = await generateCityFacts(cityName, existingFacts);
    res.json({ fact });
  } catch (error) {
    console.error('Error getting additional fact:', error);
    res.status(500).json({ error: 'Failed to get additional fact' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
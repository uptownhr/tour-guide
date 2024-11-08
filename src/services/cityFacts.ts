interface CityFacts {
  facts: string[];
  tourGuideSpeech?: string;
}

export async function getCityFacts(cityName: string): Promise<CityFacts> {
  const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}/facts`);
  if (!response.ok) {
    throw new Error('Failed to fetch city facts');
  }
  return response.json();
}

export async function getAdditionalFact(cityName: string, existingFacts: string[]): Promise<string> {
  const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}/fact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ existingFacts }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch additional fact');
  }
  const data = await response.json();
  return data.fact;
}
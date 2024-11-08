# Tour Guide
An AI tour guide powered by LLM. This guide will watch your location and pull interesting facts about the location that you are at.

## Requirements

1. This will be a web app
2. Request for location permissions
3. Once location permission is granted, start the application
4. Continuously watch the location and lookup what city the user is in
5. Given a city, look up interesting facts about the city.
6. If the user passes into a new city, notify user that they have entered a new city and also provide it with interesting facts about the city. 
7. Once the initial facts about the city has been given, continuously provide it more facts until the user requests to stop.
8. The user may request to stop by pressing a button on the page that says stop. 
9. Create interesting facts by creating a meaning LLM prompt to hit OpenAI's api to request it facts
10. Once facts are retreived, utilize text to speach and web audio to play and speak to the user

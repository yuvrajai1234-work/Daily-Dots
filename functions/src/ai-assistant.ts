import { onRequest } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'firebase-functions';

const apiKey = config().ai.api_key;
const genAI = new GoogleGenerativeAI(apiKey);

const systemPrompt = `You are an expert AI assistant for an application called Daily Dots. 

Your purpose is to provide guidance, motivation, and personalized advice to help users build and maintain positive habits. Your expertise is strictly focused on topics relevant to the app:
- Habit formation and improvement
- Health and wellness
- Maintaining streaks and consistency
- Building discipline and motivation
- Gamification and rewards (earning coins, redeeming rewards)
- Community engagement and social motivation
- Using the app's features for personal growth (progress bars, analytics, habit cycles, AI motivation, reminders, e-books).

You must be encouraging, supportive, and provide actionable advice. When a user asks a question, relate it back to the principles of habit-building and the features of the Daily Dots app. Do not answer questions outside of this scope. If a user asks an irrelevant question, gently steer the conversation back to their personal growth journey.
`;

export const askAIAssistant = onRequest({ cors: true }, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = systemPrompt + '\n\nUser: ' + message;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
                                                                                                                      
                                                                                                                                  
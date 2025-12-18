import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/googleai';
import * as z from 'zod';
import { gemini10Pro } from '@genkit-ai/googleai';
import { onFlow } from '@genkit-ai/firebase/functions';

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

const askAIAssistantFlow = defineFlow(
  {
      name: 'askAIAssistantFlow',
          inputSchema: z.object({
                messages: z.array(z.object({
                        role: z.enum(['user', 'model']),
                                content: z.array(z.object({ text: z.string() })),
                                      })),
                                          }),
                                              outputSchema: z.string(),
                                                },
                                                  async (input) => {
                                                      const response = await generate({
                                                            model: gemini10Pro,
                                                                  prompt: {
                                                                          system: systemPrompt,
                                                                                  messages: input.messages,
                                                                                        },
                                                                                              config: {
                                                                                                      temperature: 0.7,
                                                                                                            },
                                                                                                                });

                                                                                                                    return response.text();
                                                                                                                      }
                                                                                                                      );

                                                                                                                      export const askAIAssistant = onFlow({
                                                                                                                        flow: askAIAssistantFlow,
                                                                                                                        name: 'askAIAssistant',
                                                                                                                        httpsOptions: {
                                                                                                                          cors: true, // temporarily allow all origins
                                                                                                                        },
                                                                                                                      });
                                                                                                                      
                                                                                                                                  
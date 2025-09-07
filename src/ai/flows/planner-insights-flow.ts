
'use server';
/**
 * @fileOverview An AI flow to provide insights on a student's study plan.
 *
 * - getPlannerInsights - Analyzes a student's goals, assignments, and schedule to provide advice.
 * - GetPlannerInsightsInput - The input type for the flow.
 * - GetPlannerInsightsOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AssignmentSchema = z.object({
  title: z.string().describe('The title of the assignment.'),
  dueDate: z.string().describe('The due date of the assignment in ISO 8601 format.'),
});

const ScheduleItemSchema = z.object({
  time: z.string().describe('The time slot for the activity (e.g., "09:00 - 09:45").'),
  task: z.string().describe('The name of the task scheduled for that time slot.'),
  duration: z.number().describe('The duration in minutes allocated for the task.'),
});

const GetPlannerInsightsInputSchema = z.object({
  query: z.string().describe("The student's specific question or request for insights."),
  goal: z.string().describe('The long-term academic goal set by the student.'),
  assignments: z.array(AssignmentSchema).describe('A list of the student\'s upcoming assignments.'),
  schedule: z.array(ScheduleItemSchema).describe('The student\'s current study schedule, if one has been generated.'),
});
export type GetPlannerInsightsInput = z.infer<typeof GetPlannerInsightsInputSchema>;

const GetPlannerInsightsOutputSchema = z.object({
  insight: z.string().describe('A concise, actionable insight or answer based on the provided context.'),
});
export type GetPlannerInsightsOutput = z.infer<typeof GetPlannerInsightsOutputSchema>;


const plannerInsightPrompt = ai.definePrompt({
  name: 'plannerInsightPrompt',
  input: { schema: GetPlannerInsightsInputSchema },
  output: { schema: GetPlannerInsightsOutputSchema },
  prompt: `
    You are an expert academic advisor AI. Your goal is to provide concise, actionable insights to a student based on their academic context.

    Analyze the student's question in the context of their long-term goal, upcoming assignments, and their generated study schedule.

    Student's Question: "{{query}}"

    Context:
    - Long-Term Academic Goal: {{goal}}
    
    - Upcoming Assignments:
    {{#if assignments}}
      {{#each assignments}}
      - {{title}} (Due: {{dueDate}})
      {{/each}}
    {{else}}
      No upcoming assignments listed.
    {{/if}}

    - Current Study Schedule:
    {{#if schedule}}
      {{#each schedule}}
      - {{time}}: {{task}} ({{duration}} mins)
      {{/each}}
    {{else}}
      No study schedule has been generated yet.
    {{/if}}

    Instructions:
    1. Directly answer the student's question.
    2. Be encouraging and supportive.
    3. If the schedule seems misaligned with goals or deadlines, gently point it out and offer a specific suggestion.
    4. If the student asks for priorities, identify the most urgent tasks based on deadlines.
    5. Keep your response to 2-3 sentences to be easily digestible.
  `,
});

export async function getPlannerInsights(input: GetPlannerInsightsInput): Promise<GetPlannerInsightsOutput> {
  const { output } = await plannerInsightPrompt(input);
  if (!output) {
    throw new Error('Failed to generate an insight. The AI returned no output.');
  }
  return output;
}


'use server';
/**
 * @fileOverview An AI flow to generate a personalized study plan for a student.
 *
 * - generateStudyPlan - Creates a schedule based on a list of tasks and available time slots.
 * - GenerateStudyPlanInput - The input type for the flow.
 * - GenerateStudyPlanOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TaskSchema = z.object({
  name: z.string().describe('The name of the task or assignment.'),
  duration: z.number().describe('The estimated time in minutes to complete the task.'),
  deadline: z.string().describe('The due date for the task. Can be "Not specified".'),
});

const TimeSlotSchema = z.object({
  day: z.string().describe('The day of the week, or a relative term like "Today".'),
  start: z.string().describe('The start time of the available slot (e.g., "09:00").'),
  end: z.string().describe('The end time of the available slot (e.g., "12:00").'),
});

const GenerateStudyPlanInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('A list of tasks the student needs to complete.'),
  availableSlots: z.array(TimeSlotSchema).describe('The time slots when the student is free to study.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const ScheduleItemSchema = z.object({
  time: z.string().describe('The start time for the activity (e.g., "09:00 - 09:45").'),
  task: z.string().describe('The name of the task to be worked on. This can also be "Break".'),
  duration: z.number().describe('The duration in minutes allocated for this task or break.'),
});

const GenerateStudyPlanOutputSchema = z.object({
  schedule: z.array(ScheduleItemSchema).describe('The generated study schedule.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

const studyPlanPrompt = ai.definePrompt({
  name: 'studyPlanPrompt',
  input: { schema: GenerateStudyPlanInputSchema },
  output: { schema: GenerateStudyPlanOutputSchema },
  prompt: `
    You are an expert academic planner. Your goal is to create a customized, hour-by-hour study timetable for a student.

    Analyze the student's task list, their deadlines, and their available study slots.
    
    Your task is to generate a detailed, minute-by-minute schedule that fits the tasks into the available time slots to create a structured timetable.

    Instructions:
    1. Prioritize tasks with earlier deadlines.
    2. Break down longer tasks into manageable study blocks if necessary.
    3. Include short 5-10 minute breaks every 45-60 minutes to prevent burnout. Label these activities as "Break".
    4. Fill the available time slots as efficiently as possible, creating a continuous timetable for each slot.
    5. The output must be a valid schedule. The time format for each item should be a clear range, like "HH:MM - HH:MM".
    
    Student's Tasks:
    {{#each tasks}}
    - {{name}} ({{duration}} minutes, Due: {{deadline}})
    {{/each}}

    Available Study Time:
    {{#each availableSlots}}
    - {{day}}: {{start}} to {{end}}
    {{/each}}
  `,
});


export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  const { output } = await studyPlanPrompt(input);
  if (!output) {
    throw new Error('Failed to generate a study plan. The AI returned no output.');
  }
  return output;
}

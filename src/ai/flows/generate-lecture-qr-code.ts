'use server';
/**
 * @fileOverview Generates a unique QR code for each lecture.
 *
 * - generateLectureQrCode - A function that generates a QR code for a lecture.
 * - GenerateLectureQrCodeInput - The input type for the generateLectureQrCode function.
 * - GenerateLectureQrCodeOutput - The return type for the generateLectureQrCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLectureQrCodeInputSchema = z.object({
  lectureDescription: z.string().describe('The description of the lecture (e.g., \'Physics 101 - Introduction to Mechanics\').'),
});
export type GenerateLectureQrCodeInput = z.infer<typeof GenerateLectureQrCodeInputSchema>;

const GenerateLectureQrCodeOutputSchema = z.object({
  qrCodeDataUri: z.string().describe('The QR code as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type GenerateLectureQrCodeOutput = z.infer<typeof GenerateLectureQrCodeOutputSchema>;

export async function generateLectureQrCode(input: GenerateLectureQrCodeInput): Promise<GenerateLectureQrCodeOutput> {
  return generateLectureQrCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLectureQrCodePrompt',
  input: {schema: GenerateLectureQrCodeInputSchema},
  output: {schema: GenerateLectureQrCodeOutputSchema},
  prompt: `You are an assistant that generates QR codes for lectures. The user will provide a description of the lecture, and you will generate a QR code that encodes the lecture description. The QR code should be returned as a data URI.

Lecture Description: {{{lectureDescription}}}

Here is the QR code:
{{media type="qr" content=lectureDescription width=256 height=256}}`,
});

const generateLectureQrCodeFlow = ai.defineFlow(
  {
    name: 'generateLectureQrCodeFlow',
    inputSchema: GenerateLectureQrCodeInputSchema,
    outputSchema: GenerateLectureQrCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

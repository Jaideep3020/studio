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
import {googleAI} from '@genkit-ai/googleai';

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

const generateLectureQrCodeFlow = ai.defineFlow(
  {
    name: 'generateLectureQrCodeFlow',
    inputSchema: GenerateLectureQrCodeInputSchema,
    outputSchema: GenerateLectureQrCodeOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: `Generate a QR code that encodes the following text: ${input.lectureDescription}`,
    });
    
    if (media) {
      return { qrCodeDataUri: media.url };
    }
    
    throw new Error('Could not generate QR code');
  }
);

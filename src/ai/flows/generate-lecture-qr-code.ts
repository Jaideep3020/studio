
'use server';
/**
 * @fileOverview Generates a unique QR code for each lecture.
 *
 * - generateLectureQrCode - A function that generates a QR code for a lecture.
 * - GenerateLectureQrCodeInput - The input type for the generateLectureQrCode function.
 * - GenerateLectureQrCodeOutput - The return type for the generateLectureQrCode function.
 */
import QRCode from 'qrcode';
import {z} from 'genkit';
import { LecturePayload } from '@/lib/types';

const GenerateLectureQrCodeInputSchema = z.object({
  lectureDescription: z.object({
    id: z.string(),
    description: z.string(),
  }).describe('The lecture payload containing id and description.'),
});
export type GenerateLectureQrCodeInput = z.infer<typeof GenerateLectureQrCodeInputSchema>;

const GenerateLectureQrCodeOutputSchema = z.object({
  qrCodeDataUri: z.string().describe('The QR code as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type GenerateLectureQrCodeOutput = z.infer<typeof GenerateLectureQrCodeOutputSchema>;

export async function generateLectureQrCode(input: GenerateLectureQrCodeInput): Promise<GenerateLectureQrCodeOutput> {
  try {
    const qrCodeDataUri = await QRCode.toDataURL(JSON.stringify(input.lectureDescription));
    return { qrCodeDataUri };
  } catch (err) {
    console.error(err);
    throw new Error('Could not generate QR code');
  }
}

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

const GenerateLectureQrCodeInputSchema = z.object({
  lectureDescription: z.string().describe('The description of the lecture (e.g., \'Physics 101 - Introduction to Mechanics\').'),
});
export type GenerateLectureQrCodeInput = z.infer<typeof GenerateLectureQrCodeInputSchema>;

const GenerateLectureQrCodeOutputSchema = z.object({
  qrCodeDataUri: z.string().describe('The QR code as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type GenerateLectureQrCodeOutput = z.infer<typeof GenerateLectureQrCodeOutputSchema>;

export async function generateLectureQrCode(input: GenerateLectureQrCodeInput): Promise<GenerateLectureQrCodeOutput> {
  try {
    const qrCodeDataUri = await QRCode.toDataURL(input.lectureDescription);
    return { qrCodeDataUri };
  } catch (err) {
    console.error(err);
    throw new Error('Could not generate QR code');
  }
}

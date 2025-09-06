
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { QrCodeGenerator } from '@/components/teacher/QrCodeGenerator';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import type { Lecture } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function QrCodePage() {
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);

  const handleQrCodeGenerated = (lecture: Lecture, dataUri: string) => {
    setActiveLecture(lecture);
    setQrCodeDataUri(dataUri);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <QrCodeGenerator onQrCodeGenerated={handleQrCodeGenerated} />
            <Card>
              <CardHeader>
                <CardTitle>Active QR Code</CardTitle>
                <CardDescription>Students can scan this code to mark their attendance.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                {qrCodeDataUri ? (
                  <div className="text-center">
                     <div className="p-4 border rounded-lg inline-block bg-white">
                        <Image src={qrCodeDataUri} alt="Generated QR Code" width={200} height={200} />
                     </div>
                     <p className="text-sm text-muted-foreground mt-2">{activeLecture?.description}</p>
                  </div>
                ) : (
                  <div className="w-52 h-52 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <p>QR code will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function HolidayPartyPage() {
  const [guests, setGuests] = useState(1);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080?random=10')" }}
    >
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src="https://picsum.photos/600/400?random=11"
              alt="Holiday party decorations"
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="holiday decorations"
            />
          </div>
          <div className="p-6">
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <PartyPopper className="h-8 w-8 text-primary" />
              Holiday Party RSVP
            </CardTitle>
            <CardDescription>Let us know if you can make it!</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Restrictions</Label>
            <Select>
              <SelectTrigger id="dietary">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex justify-between">
              <span>Number of Guests</span>
              <span className="text-primary font-semibold">{guests}</span>
            </Label>
            <Slider
              id="guests"
              min={1}
              max={5}
              step={1}
              value={[guests]}
              onValueChange={(value) => setGuests(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea id="comments" placeholder="Let us know if you have any questions!" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Submit RSVP</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

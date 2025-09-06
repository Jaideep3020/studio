
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Castle, ChevronRight, Filter, Globe, Heart, Home, Menu, Search, Star, Tent, Trees, Users, Waves, Wind } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    { name: 'Castles', icon: <Castle className="h-6 w-6" /> },
    { name: 'Amazing pools', icon: <Waves className="h-6 w-6" /> },
    { name: 'Amazing views', icon: <Trees className="h-6 w-6" /> },
    { name: 'Windmills', icon: <Wind className="h-6 w-6" /> },
    { name: 'Countryside', icon: <Home className="h-6 w-6" /> },
    { name: 'Luxe', icon: <Star className="h-6 w-6" /> },
    { name: 'Ski-in/out', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" /></svg> },
    { name: 'Cabins', icon: <Home className="h-6 w-6" /> },
    { name: 'OMG!', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 2.1a.5.5 0 0 0-1 0V2a2 2 0 0 0-2 2v0a2 2 0 0 0-2 2v0a2 2 0 0 0-2 2v0a2 2 0 0 0-2 2v8.4a.5.5 0 0 0 .8.4l1.8-1.2a1 1 0 0 1 1.2 0l1.8 1.2a1 1 0 0 0 1.2 0l1.8-1.2a1 1 0 0 1 1.2 0l1.8 1.2a1 1 0 0 0 1.2 0l1.8-1.2a.5.5 0 0 0 .8-.4V10a2 2 0 0 0-2-2h0a2 2 0 0 0-2-2h0a2 2 0 0 0-2-2h0a2 2 0 0 0-2-2Z" /><path d="M8 14v-2" /><path d="M16 14v-2" /><path d="M12 16a2 2 0 0 0-2 2v2h4v-2a2 2 0 0 0-2-2Z" /></svg> },
    { name: 'Camping', icon: <Tent className="h-6 w-6" /> },
];

const listings = [
  {
    location: 'Gesves, Belgium',
    distance: 264,
    dates: 'Dec 5 - 10',
    price: 1163,
    rating: 4.88,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    imageSrc: 'https://picsum.photos/600/600?random=1',
    dataAiHint: 'castle evening'
  },
  {
    location: 'Gesves, Belgium',
    distance: 264,
    dates: 'Dec 5 - 10',
    price: 713,
    rating: 4.9,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    imageSrc: 'https://picsum.photos/600/600?random=2',
    dataAiHint: 'castle summer'
  },
  {
    location: 'Kirchhundem, Germany',
    distance: 113,
    dates: 'Nov 18 - 23',
    price: 245,
    rating: 4.88,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    imageSrc: 'https://picsum.photos/600/600?random=3',
    dataAiHint: 'castle courtyard'
  },
  {
    location: 'Stoumont, Belgium',
    distance: 205,
    dates: 'Nov 13 - 18',
    price: 211,
    rating: 4.97,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    imageSrc: 'https://picsum.photos/600/600?random=4',
    dataAiHint: 'castle hill'
  },
];

export default function AirbnbPage() {
    return (
        <div className="bg-background min-h-screen">
            <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-50 border-b">
                <div className="container mx-auto px-4">
                    {/* Desktop Header */}
                    <div className="hidden md:flex items-center justify-between h-20">
                        <Link href="#" className="flex items-center gap-2">
                             <svg width="32" height="32" viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true" role="presentation" focusable="false" className="text-primary"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0z m298.8 479.2c-2.8 1.6-63.6 37.2-111.2 64.8-48.8 28-84 50-84 81.2 0 22.8 21.6 34.4 52.4 34.4 20.4 0 42.4-5.6 63.6-14 31.6-12.8 55.6-20.8 74.4-20.8 26 0 46 14.8 46 45.6 0 25.2-11.2 41.2-30.8 52.4-28.4 16.4-66 26.8-112 26.8-62.4 0-113.6-22-154.8-65.6-28.8-31.2-43.2-69.2-43.2-114 0-59.2 32-106 96.4-139.6 44.8-23.2 101.2-44.4 102-44.8 1.2-.8 2.4-.8 3.6 0z m-112-162c-24.8 0-45.2 20.4-45.2 45.2s20.4 45.2 45.2 45.2 45.2-20.4 45.2-45.2-20.4-45.2-45.2-45.2z"></path></svg>
                             <span className="font-bold text-2xl text-primary">airbnb</span>
                        </Link>
                        <div className="flex-1 flex justify-center">
                            <div className="flex items-center border rounded-full shadow-sm hover:shadow-md transition-shadow">
                                <Button variant="ghost" className="rounded-full font-semibold px-4">Anywhere</Button>
                                <div className="border-l h-6" />
                                <Button variant="ghost" className="rounded-full font-semibold px-4">Any week</Button>
                                <div className="border-l h-6" />
                                <Button variant="ghost" className="rounded-full text-muted-foreground pl-4 pr-2 flex items-center gap-2">
                                    Add guests
                                    <div className="bg-primary rounded-full p-2 text-primary-foreground">
                                        <Search className="h-4 w-4" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="rounded-full font-semibold">Become a Host</Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Globe className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center border rounded-full p-1 gap-2">
                                <Menu className="h-5 w-5 ml-2" />
                                <div className="bg-foreground text-background rounded-full h-8 w-8 flex items-center justify-center">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-between h-16">
                         <div className="flex-1">
                           <Link href="#" className="flex items-center gap-2">
                             <svg width="32" height="32" viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true" role="presentation" focusable="false" className="text-primary"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0z m298.8 479.2c-2.8 1.6-63.6 37.2-111.2 64.8-48.8 28-84 50-84 81.2 0 22.8 21.6 34.4 52.4 34.4 20.4 0 42.4-5.6 63.6-14 31.6-12.8 55.6-20.8 74.4-20.8 26 0 46 14.8 46 45.6 0 25.2-11.2 41.2-30.8 52.4-28.4 16.4-66 26.8-112 26.8-62.4 0-113.6-22-154.8-65.6-28.8-31.2-43.2-69.2-43.2-114 0-59.2 32-106 96.4-139.6 44.8-23.2 101.2-44.4 102-44.8 1.2-.8 2.4-.8 3.6 0z m-112-162c-24.8 0-45.2 20.4-45.2 45.2s20.4 45.2 45.2 45.2 45.2-20.4 45.2-45.2-20.4-45.2-45.2-45.2z"></path></svg>
                           </Link>
                         </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon" className="rounded-full">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <div className="flex flex-col gap-4 py-4">
                                        <Button variant="ghost">Become a Host</Button>
                                        <Button variant="ghost">Log in</Button>
                                        <Button>Sign up</Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 overflow-x-auto whitespace-nowrap">
                         <div className="flex items-center gap-8 pr-12">
                            {categories.map((category) => (
                                <button key={category.name} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                                    {category.icon}
                                    <span className="text-xs font-semibold pb-2 border-b-2 border-transparent group-hover:border-foreground">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 pl-6">
                         <Button variant="outline" className="rounded-full">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                    {listings.map((listing, index) => (
                        <div key={index} className="group">
                           <Card className="border-none shadow-none rounded-xl overflow-hidden">
                                <div className="relative">
                                     <Carousel className="w-full">
                                        <CarouselContent>
                                            {listing.images.map((img, i) => (
                                                <CarouselItem key={i}>
                                                    <div className="aspect-square relative">
                                                        <Image src={listing.imageSrc} alt={listing.location} fill className="object-cover" data-ai-hint={listing.dataAiHint} />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden group-hover:flex" />
                                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex" />
                                    </Carousel>
                                    <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/75">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-semibold">{listing.location}</h3>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4" />
                                        <span className="text-sm">{listing.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{listing.distance} kilometers away</p>
                                    <p className="text-muted-foreground text-sm">{listing.dates}</p>
                                    <p className="mt-2"><span className="font-semibold">${listing.price}</span> night</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </main>

             <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                <Button className="rounded-full shadow-lg" size="lg">
                    Show map
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" /><path d="M6 12a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2Z" /><path d="M18.001 20a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z" /></svg>
                </Button>
            </div>
        </div>
    );
}

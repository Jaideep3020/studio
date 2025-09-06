
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, MoveRight } from 'lucide-react';
import { Lora } from 'next/font/google';
import Link from 'next/link';
import './ellipsus.css';

const lora = Lora({ subsets: ['latin'], weight: ['700'] });

export default function EllipsusPage() {
  return (
    <div className="bg-[#212121] text-[#E5E7EB] font-body">
      <div className="relative min-h-screen flex flex-col">
        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="text-2xl font-bold text-white">
                <Link href="#">ellipsus</Link>
              </div>
              <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors">
                    Product <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Features</DropdownMenuItem>
                    <DropdownMenuItem>Integrations</DropdownMenuItem>
                    <DropdownMenuItem>Pricing</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors">
                    Resources <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Blog</DropdownMenuItem>
                    <DropdownMenuItem>Case Studies</DropdownMenuItem>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="#" className="hover:text-white transition-colors">About</Link>
              </nav>
              <div className="hidden md:flex items-center gap-4">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">Log in</Button>
                <Button className="bg-[#111827] text-white hover:bg-gray-800">Sign up</Button>
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center text-center px-4">
          <div className="relative z-0">
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -ml-20 opacity-50">
              <svg width="100" height="100" viewBox="0 0 128 107" fill="none" xmlns="http://www.w3.org/2000/svg" className="sketch-arrow-left">
                  <path d="M60.5 106C47.3 92.8333 11.3 52.6 1 42L1.5 1" stroke="white" strokeWidth="2"/>
                  <path d="M1 42L54.5 35.5L67 1" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 -mr-20 opacity-50">
               <svg width="100" height="100" viewBox="0 0 128 107" fill="none" xmlns="http://www.w3.org/2000/svg" className="sketch-arrow-right">
                  <path d="M67.5 106C80.7 92.8333 116.7 52.6 127 42L126.5 1" stroke="white" strokeWidth="2"/>
                  <path d="M127 42L73.5 35.5L61 1" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h1 className={`${lora.className} text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in`}>
              Write better together.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl animate-fade-in-delay">
              Ellipsus is a collaborative writing tool made for human-to-human creativity.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold magnetic-button">
                Join the beta <MoveRight className="ml-2" />
              </Button>
            </div>
          </div>
        </main>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L59.5 102.7C119 85.3 238 50.7 357 52.8C476 55 595 94 714.5 100.2C834 106.3 953 79.7 1072.5 61.2C1192 42.7 1311 32.3 1370.5 27.7L1440 23V120H0Z" fill="#212121"/>
            <path d="M0 47.3C119 82 238 116.7 357 110.2C476 103.7 595 56 714.5 47.3C834 38.7 953 69 1072.5 82.2C1192 95.3 1311 91.3 1370.5 89.3L1440 87.3V120H0V47.3Z" fill="rgba(255,255,255,0.05)"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

    
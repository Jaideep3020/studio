
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { careerGuidanceFlow } from '@/ai/flows/career-guidance-flow';
import { LoaderCircle, Send, Sparkles, User, ArrowLeft, BookOpen, TrendingUp, Target, Lightbulb, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickStartTopics = [
  {
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    title: 'Study Path Guidance',
    question: 'What subjects should I focus on for a career in engineering?',
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    title: 'Future Job Market',
    question: 'What are the most promising career fields for the next 10 years?',
  },
  {
    icon: <Target className="h-5 w-5 text-primary" />,
    title: 'Career Planning',
    question: 'Help me create a 5-year career plan based on my interests in software.',
  },
  {
    icon: <Lightbulb className="h-5 w-5 text-primary" />,
    title: 'Skill Development',
    question: 'What skills should I develop to be successful in technology?',
  },
];

export default function CareerGuidancePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement> | null, question?: string) => {
    e?.preventDefault();
    const prompt = question || input;
    if (!prompt.trim()) return;

    setShowChat(true);
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await careerGuidanceFlow(prompt);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove the user message if AI fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTopics = () => {
    setShowChat(false);
    setMessages([]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header role="Student" />
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link href="/student/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        {showChat ? (
          <Card className="flex flex-col flex-1">
            <CardContent className="p-6 flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold font-headline">AI Career Advisor</h2>
                    <p className="text-muted-foreground text-sm">Now chatting...</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleBackToTopics}>Back to Topics</Button>
              </div>

              <ScrollArea className="flex-1 h-[400px] pr-4 -mr-4">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-prose p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                       {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                   {isLoading && (
                      <div className="flex items-start gap-4">
                          <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                              <Sparkles className="h-4 w-4" />
                              </AvatarFallback>
                          </Avatar>
                          <div className="max-w-prose p-3 rounded-lg bg-secondary flex items-center gap-2">
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              <p className="text-sm">Thinking...</p>
                          </div>
                      </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center text-center flex-1">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <div className="bg-primary rounded-full p-3">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold font-headline">AI Career Advisor</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
              Get personalized guidance for your future career path
            </p>

            <Card className="w-full max-w-3xl mt-10 text-left">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Quick Start Topics</h3>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Click on any topic to get started with your career exploration
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {quickStartTopics.map((topic) => (
                    <button
                      key={topic.title}
                      onClick={() => handleSendMessage(null, topic.question)}
                      className="p-4 border rounded-lg hover:bg-accent text-left transition-colors flex items-start gap-4"
                    >
                      <div>{topic.icon}</div>
                      <div>
                        <p className="font-semibold">{topic.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{topic.question}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

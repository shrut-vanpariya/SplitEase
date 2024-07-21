"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className='flex flex-col bg-background items-center min-h-screen w-full'>
      <section className="flex justify-center items-center h-[calc(100vh_-_56px)] w-full mt-[56px] bg-gradient-to-r from-primary to-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">Welcome to SplitEase</h1>
            <p className="text-xl md:text-2xl text-primary-foreground">
              An expense sharing app. Easily split bills and expenses with friends and family.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={'/login'}>
                <Button size="lg" className="px-8 py-3 text-lg font-medium">
                  Get Started
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="px-8 py-3 text-lg font-medium">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}



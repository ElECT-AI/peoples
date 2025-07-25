// src/app/politicians/page.tsx
"use client";

import { usePoliticianStore } from "@/hooks/use-politician-store";
import { PoliticianCard } from "@/components/politicians/politician-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function PoliticiansPage() {
  const { politicians } = usePoliticianStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl">Politician Directory</CardTitle>
              <CardDescription>
                An overview of political leaders, their track records, and legal standing.
              </CardDescription>
            </div>
            <Link href="/politicians/academic-life" passHref>
              <Button>
                <GraduationCap className="mr-2 h-4 w-4" />
                View Academic Life
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {politicians.map((politician) => (
          <PoliticianCard key={politician.id} politician={politician} />
        ))}
      </div>
    </div>
  );
}

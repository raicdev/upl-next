import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import Link from "next/link";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

interface HeroProps {
  title: string;
  subtitle: string;
  from: string;
  badge?: ReactNode;
  href?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, from, badge, href = "#" }) => {
  return (
    <Card className="w-[350px] ">
      <CardHeader>
        <CardTitle>{title} {badge ? (<Badge className="ml-3">{badge}</Badge>) : (<Badge className="ml-3">製品</Badge>) }</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>製品の登場日: {from}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
            <Link href={href} target="_blank">サイトにアクセス</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Hero;

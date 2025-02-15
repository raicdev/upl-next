"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 px-8 w-full items-center justify-between">
        <h1 className="text-xl font-semibold w-48">Deni AI</h1>
        <div className="flex w-full items-center justify-end space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="ml-3">
                <Link href="/" target="_blank">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
              <NavigationMenuItem className="ml-3">
                <Link href="/home" target="_blank">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    App
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
              <NavigationMenuItem className="ml-3">
                <Link
                  href="https://github.com/raicdev/upl-next"
                  target="_blank"
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Source Code
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}

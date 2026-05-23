"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HomepageNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="font-heading min-w-0 truncate text-sm font-semibold tracking-tight"
        >
          Fitnexx
        </Link>

        <nav
          className="hidden items-center gap-2 sm:flex"
          aria-label="Main navigation"
        >
          <ModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/features">Features</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mission">Mission</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
          <Show when="signed-out">
            <Button size="sm" asChild>
              <Link href="/app">Get started</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <div className="contents">
              <Button variant="outline" size="sm" asChild>
                <Link href="/app">Open app</Link>
              </Button>
              <UserButton />
            </div>
          </Show>
        </nav>
        <div className="flex items-center gap-1.5 sm:hidden">
          <ModeToggle />
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Open menu"
              >
                <Menu className="size-4" aria-hidden />
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton>
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <nav
                className="flex flex-col gap-1 pt-1"
                aria-label="Mobile navigation"
              >
                <DialogClose asChild>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/features">Features</Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/mission">Mission</Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/contact">Contact</Link>
                  </Button>
                </DialogClose>
                <Show when="signed-out">
                  <DialogClose asChild>
                    <Button className="justify-start" asChild>
                      <Link href="/app">Get started</Link>
                    </Button>
                  </DialogClose>
                </Show>
                <Show when="signed-in">
                  <DialogClose asChild>
                    <Button className="justify-start" variant="outline" asChild>
                      <Link href="/app">Open app</Link>
                    </Button>
                  </DialogClose>
                </Show>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

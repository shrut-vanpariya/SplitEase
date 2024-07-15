import Link from "next/link";
import { MenuIcon, Split } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle>
            <Button
              className="flex justify-center items-center pb-2 pt-1"
              variant="link"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <Split className="w-6 h-6 mr-1" />
                <h1 className="font-bold text-lg">SplitEase</h1>
              </Link>
            </Button>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}

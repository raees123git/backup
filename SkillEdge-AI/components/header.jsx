import React from "react";
//this is a testing change 
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  LayoutDashboard,
  StarIcon,
  FileText,
  PenBox,
  GraduationCap,
  MessageCircle,
  LogIn,
} from "lucide-react";

import { checkUser } from "../lib/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto py-3 px-6 h-16 flex item-center justify-between">
        <Link href="/">
          {/* <Image src="/skilledge_logo.png" alt="skill edge main picture" width={200} height={70} /> */}
          <h5 className="text-2xl mt-2">Skill Egde <span className="text-indigo-500">AI</span></h5>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4 ">
          <SignedIn>
            <Link href="/">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />

                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2  cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Feedback
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button variant="outline">
                <LogIn className="h-4 w-4" />
                <span className="hidden md:block">Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;

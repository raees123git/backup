"use client"
//this is a testing change 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}) {
  return <NextThemesProvider defaultTheme="light" {...props}>{children}</NextThemesProvider>
}

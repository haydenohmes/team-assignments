"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"

type NavigationProps = {
  activeItem?: "Programs" | "Teams" | "Ticketing" | "Edit Profile" | "Settings"
}

export default function Navigation({ activeItem = "Teams" }: NavigationProps) {
  const pathname = usePathname()
  const isTeams = activeItem === "Teams" || pathname?.includes("/teams")
  const isPrograms = activeItem === "Programs" || pathname?.includes("/programs")

  return (
    <div className="w-full bg-black">
      {/* Top Navigation Bar */}
      <div className="bg-[#101417] h-[48px] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Logo placeholder */}
          <div className="w-8 h-8 bg-[#506277] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          
          <Link
            href="/"
            className="text-[14px] text-[rgba(230,242,255,0.8)] hover:text-[#e6f2ff] px-4 h-[48px] flex items-center"
          >
            Home
          </Link>
          
          <Link
            href="/watch"
            className="text-[14px] text-[rgba(230,242,255,0.8)] hover:text-[#e6f2ff] px-4 h-[48px] flex items-center"
          >
            Watch Now
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Icon buttons */}
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-[#506277] rounded p-3 flex items-center justify-center" />
            <div className="w-5 h-5 bg-[#506277] rounded p-3 flex items-center justify-center" />
            <div className="w-5 h-5 bg-[#506277] rounded p-3 flex items-center justify-center" />
          </div>

          {/* User Avatar and Name */}
          <div className="flex items-center gap-2 px-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-[#0273e3] text-white text-[12px]">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="text-[14px] text-[#e6f2ff]">Jane Doe</span>
              <ChevronUp className="w-4 h-4 text-[#e6f2ff] rotate-180" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="bg-[#232a31] h-[48px] flex items-center gap-4 border-r border-[rgba(122,138,153,0.6)]">
        {/* Team Switcher */}
        <div className="flex items-center gap-2 px-4 border-r border-[rgba(122,138,153,0.6)] h-full w-[262px]">
          <Avatar className="w-7 h-7">
            <AvatarImage src="/placeholder-logo.png" alt="Elevation Volleyball" />
            <AvatarFallback className="bg-white text-[#13293f] text-xs">
              EV
            </AvatarFallback>
          </Avatar>
          <span className="text-[14px] text-[#e6f2ff] flex-1 truncate">
            Elevation Volleyball
          </span>
          <ChevronDown className="w-4 h-4 text-[#e6f2ff]" />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center h-full">
          <Link
            href="/programs"
            className={`px-4 h-full flex items-center text-[14px] ${
              isPrograms
                ? "bg-[#2c343e] text-[#c3cedb]"
                : "text-[rgba(230,242,255,0.8)] hover:bg-[#2c343e]"
            }`}
          >
            Programs
          </Link>
          <Link
            href="/teams"
            className={`px-4 h-full flex items-center text-[14px] ${
              isTeams
                ? "bg-[#2c343e] text-[#c3cedb]"
                : "text-[rgba(230,242,255,0.8)] hover:bg-[#2c343e]"
            }`}
          >
            Teams
          </Link>
          <Link
            href="/ticketing"
            className="px-4 h-full flex items-center text-[14px] text-[rgba(230,242,255,0.8)] hover:bg-[#2c343e]"
          >
            Ticketing
          </Link>
          <Link
            href="/edit-profile"
            className="px-4 h-full flex items-center text-[14px] text-[rgba(230,242,255,0.8)] hover:bg-[#2c343e]"
          >
            Edit Profile
          </Link>
          <Link
            href="/settings"
            className="px-4 h-full flex items-center text-[14px] text-[rgba(230,242,255,0.8)] hover:bg-[#2c343e]"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}





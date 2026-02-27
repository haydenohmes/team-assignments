"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Info } from "lucide-react"

// Image assets - using localhost URLs from Figma or placeholders
const imgAvatar = "http://localhost:3845/assets/b1dd324c3cd060008f44c7b2b245f33f1c8fe7a2.png"
const imgHudlLogoReversed = "http://localhost:3845/assets/acd44c4e069efc9ffdb1db90021476a29529105d.png"
const imgAvatar1 = "http://localhost:3845/assets/9116bd96fb5847c64197437737ef4f76e2abb52c.svg"
const imgVector = "http://localhost:3845/assets/9c3ca377679d1ff410bf151924ac7e56929e54ad.svg"
const imgAvatar2 = "http://localhost:3845/assets/40e56385261308d791a0848518b929fe480cb8ec.svg"
const imgVector23 = "http://localhost:3845/assets/d645ec5d0726882f55ec300cb547cdf2672581d4.svg"

type ProfileBannerProps = {
  className?: string
  breakpoint?: "xl" | "l" | "m" | "s"
}

function ProfileBanner({ className, breakpoint = "xl" }: ProfileBannerProps) {
  const isL = breakpoint === "l"
  return (
    <div
      className={`bg-gradient-to-b from-[rgba(11,33,57,0.9)] to-[rgba(0,0,0,0)] flex flex-col gap-0 items-start px-6 py-10 relative w-full ${className || ""}`}
    >
      <div className="flex flex-col gap-0 items-start relative shrink-0 w-full z-[1]">
        <div className="flex gap-4 items-center justify-center relative shrink-0 w-full">
          <div className="relative shrink-0 size-16">
            <img
              alt=""
              className="block max-w-none size-full"
              height={64}
              src={imgAvatar}
              width={64}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = "/placeholder-logo.png"
              }}
            />
          </div>
          <p className="bg-clip-text bg-gradient-to-b font-light from-[#e6f2ff] from-[40.104%] leading-[0.8] relative shrink-0 text-[72px] text-shadow-[2px_2px_0px_black] to-[#c3cedb] to-[80.208%] tracking-[5.76px] uppercase [font-family:'Teko:Light',sans-serif] [-webkit-text-fill-color:transparent] [background-clip:text]">
            Sporting Youth Soccer
          </p>
        </div>
      </div>
    </div>
  )
}

type DesktopNavbarProps = {
  className?: string
  isAuth?: boolean
}

function DesktopNavbar({ className, isAuth = false }: DesktopNavbarProps) {
  return (
    <div
      className={`bg-white flex flex-col items-start relative w-full ${isAuth ? "h-[48px]" : ""} ${className || ""}`}
    >
      <div
        className={`bg-[#101417] flex h-[48px] items-center justify-between relative shrink-0 w-full ${
          isAuth ? "pl-4" : "px-4"
        }`}
      >
        <div className="h-7 relative shrink-0 w-[86px]">
          <img
            alt="Hudl Logo"
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgHudlLogoReversed}
            onError={(e) => {
              e.currentTarget.src = "/placeholder-logo.png"
            }}
          />
        </div>
        {isAuth && (
          <div className="flex gap-0 h-full items-center relative shrink-0">
            <div className="flex h-[48px] items-start relative shrink-0 w-[264px]">
              <div className="flex h-full items-center px-[10px] relative shrink-0">
                <Avatar className="size-7">
                  <AvatarImage src={imgAvatar1} />
                  <AvatarFallback className="bg-[#0273e3] text-white text-[12px]">JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-1 flex-col h-full items-start justify-center min-h-px min-w-px pr-4 relative">
                <div className="flex items-center relative shrink-0 w-full">
                  <div className="flex flex-1 flex-col h-5 justify-end leading-[0] min-h-px min-w-px overflow-hidden relative text-[#e6f2ff] text-sm text-ellipsis whitespace-nowrap">
                    <p className="leading-[1.5] overflow-hidden">John Doe</p>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <ChevronDown className="size-4 text-[#e6f2ff]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type RegistrationCardProps = {
  price: string
  title: string
  startDate: string
  endDate: string
  eligibleAthletes?: string[]
  showAddAthlete?: boolean
}

function RegistrationCard({
  price,
  title,
  startDate,
  endDate,
  eligibleAthletes = [],
  showAddAthlete = true,
}: RegistrationCardProps) {
  return (
    <div className="bg-[var(--u-color-background-popover,#21262b)] flex flex-col gap-5 items-start max-w-[1365px] min-w-[768px] pb-6 pt-5 px-5 relative rounded-lg shrink-0 w-full">
      <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <p className="leading-[1.4] relative shrink-0 text-[color:var(--content-emphasis-foreground-contrast,#96ccf3)] text-lg">
            {price}
          </p>
          <Button variant="ghost" size="sm" className="h-8">
            <ChevronDown className="size-4" />
          </Button>
        </div>
        <div className="flex gap-4 items-end relative shrink-0 w-full">
          <div className="flex flex-1 flex-col gap-3 items-start min-h-px min-w-px relative">
            <div className="flex flex-col gap-1 items-start relative shrink-0 tracking-normal w-full">
              <p className="leading-[1.2] overflow-hidden relative shrink-0 text-xl text-[color:var(--u-color-base-foreground-contrast,#fefefe)] text-ellipsis w-full whitespace-pre-wrap font-bold">
                {title}
              </p>
              <div className="flex gap-1 h-5 items-center leading-[1.4] relative shrink-0 text-[color:var(--u-color-base-foreground,#c0c6cd)] w-full text-base">
                <p className="relative shrink-0">{startDate}</p>
                <p className="overflow-hidden relative shrink-0 text-ellipsis">-</p>
                <p className="flex-1 min-h-px min-w-px overflow-hidden relative text-ellipsis whitespace-nowrap">
                  {endDate}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 items-start relative shrink-0 w-[1075px]">
              {eligibleAthletes.length > 0 && (
                <div className="flex gap-0.5 items-center relative shrink-0 w-full">
                  <p className="leading-[1.4] relative shrink-0 text-[color:var(--u-color-base-foreground,#c0c6cd)] text-base tracking-normal">
                    Eligible Athletes:
                  </p>
                  <div className="flex gap-0.5 items-center relative shrink-0">
                    {eligibleAthletes.map((athlete, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="mx-1">,</span>}
                        <p className="leading-[1.4] relative shrink-0 text-[color:var(--u-color-base-foreground,#c0c6cd)] text-base tracking-normal">
                          {athlete}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              {showAddAthlete && (
                <div className="flex gap-0 items-center relative shrink-0 w-full">
                  <div className="flex flex-col items-center justify-center relative shrink-0">
                    <p className="leading-[1.4] relative shrink-0 text-[color:var(--content-emphasis-foreground-default,#0a93f5)] text-base tracking-normal cursor-pointer hover:underline">
                      Add or Connect Athlete
                    </p>
                    <div className="h-0 relative shrink-0 w-full">
                      <div className="absolute inset-[-1px_0]">
                        <img
                          alt=""
                          className="block max-w-none size-full"
                          src={imgVector23}
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 items-center justify-end relative shrink-0">
            <div className="flex gap-2 items-start relative shrink-0">
              <div className="flex items-center justify-center relative self-stretch shrink-0">
                <Info className="size-4 text-[var(--u-color-base-foreground,#c0c6cd)]" />
              </div>
              <div className="flex items-center justify-center relative shrink-0">
                <p className="leading-[1.4] relative shrink-0 text-[color:var(--u-color-base-foreground,#c0c6cd)] text-base tracking-normal">
                  Limited spots
                </p>
              </div>
            </div>
            <Button variant="default" size="default">
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Registration() {
  return (
    <div className="bg-[var(--u-color-background-canvas,#191f24)] flex flex-col gap-0 isolate items-start overflow-clip relative rounded-xl min-h-screen w-full">
      <DesktopNavbar className="bg-white flex flex-col h-[48px] items-start shrink-0 sticky top-0 w-full z-[2]" isAuth />
      <div className="flex flex-col isolate items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full z-[1]">
        <div className="flex flex-col items-center relative shrink-0 w-full z-[1]">
          <div className="w-full flex justify-center">
            <ProfileBanner
              breakpoint="l"
              className="bg-gradient-to-b flex flex-col from-[rgba(11,33,57,0.9)] gap-0 isolate items-start max-w-[1919px] min-w-[1366px] overflow-clip px-6 py-10 relative shrink-0 to-[rgba(0,0,0,0)] w-full"
            />
          </div>
          <div className="flex flex-col gap-6 items-start max-w-[1128px] pb-6 relative shrink-0 w-full px-4">
            <div className="flex flex-col gap-4 items-start max-w-[1365px] min-w-[768px] relative shrink-0 w-full">
              <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[color:var(--u-color-base-foreground-contrast,#fefefe)] text-[32px] tracking-[0.25px] w-full font-bold">
                  <p className="leading-[1.2] whitespace-pre-wrap">
                    Sporting Stripes & Stars Summer Camp | Summer 2025
                  </p>
                </div>
                <div className="flex gap-2 items-start leading-[1.4] relative shrink-0 text-[color:var(--content-base-foreground-default,#c0c6cd)] text-base tracking-normal w-full">
                  <p className="relative shrink-0">Camp</p>
                  <p className="relative shrink-0">·</p>
                  <div className="flex gap-1 items-center relative shrink-0">
                    <p className="relative shrink-0">Sep 24, 2025</p>
                    <p className="relative shrink-0">-</p>
                    <p className="relative shrink-0">Nov 1, 2025</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 items-start leading-[1.4] relative shrink-0 text-ellipsis tracking-normal w-full">
                <p className="min-w-full overflow-hidden relative shrink-0 text-base text-[color:var(--content-base-foreground-default,#c0c6cd)] w-[min-content] whitespace-pre-wrap">
                  {`Kick off your summer with Sporting's Stripes & Stars Camp — a high-energy, multi-day experience built for young athletes who want to sharpen their skills, stay active, and have fun. Our camp offers age-based training sessions focused on fundamentals, team play, and confidence-building, all led by experienced coaches in a supportive environment. Each day includes a mix of drills, small-sided games, and team challenges to keep athletes engaged and growing. Whether your athlete is just getting started or preparing for competitive play, Stripes & Stars is a gr...`}
                </p>
                <p className="overflow-hidden relative shrink-0 text-sm text-[color:var(--u-color-base-foreground,#c0c6cd)] font-bold cursor-pointer hover:underline">
                  read more
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-end relative shrink-0 w-full">
              <div className="flex flex-col items-start relative shrink-0 w-full">
                <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[10px] text-[color:var(--content-strong-background-default,#c0c6cd)] uppercase whitespace-nowrap font-bold">
                  <p className="leading-[1.2]">My Athletes</p>
                </div>
              </div>
              <div className="flex gap-1 items-center px-0 py-0 relative shrink-0 w-full">
                <div className="flex gap-0 items-center relative shrink-0">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#506277] text-white text-[12px]">HO</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex gap-0 items-center relative shrink-0">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#506277] text-white text-[12px]">+</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                <div className="flex items-center pb-1 relative shrink-0 w-full">
                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[color:var(--content-base-foreground-default,#c0c6cd)] text-[18px] tracking-normal whitespace-nowrap font-bold">
                    <p className="leading-[1.4]">Registrations</p>
                  </div>
                </div>
                <RegistrationCard
                  price="$410"
                  title="Boys & Girls Stripes | Ages: 13-14 (Parent - Child)"
                  startDate="Sep 24, 2025"
                  endDate="Sep 28, 2025"
                  eligibleAthletes={["Hayden Ohmes"]}
                  showAddAthlete={true}
                />
                <RegistrationCard
                  price="$410"
                  title="Boys & Girls Stripes | Ages: 14-15 (Parent - Child)"
                  startDate="Sep 24, 2025"
                  endDate="Sep 28, 2025"
                  eligibleAthletes={[]}
                  showAddAthlete={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


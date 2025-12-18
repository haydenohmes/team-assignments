"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, ChevronUp, ArrowLeft, Filter, Send, Check, GripVertical, X, LayoutGrid, List, ArrowUpDown, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Added Dialog components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

type AthleteStatus = "Assigned" | "Invited" | "Accepted" | "Rostered" | "Declined" | null

type Athlete = {
  id: string
  name: string
  initials: string
  position: string
  status: AthleteStatus
  birthdate: string
  registrations: string[] // Array of registration option names
}

const teams = [
  { id: "13-peak", name: "U13-Black", slots: 12, gender: "Male" },
  { id: "13-timberline", name: "U13-Red", slots: 12, gender: "Female" },
  { id: "13-ascent", name: "U13-Gold", slots: 12, gender: "Male" },
  { id: "14-peak", name: "U14-Black", slots: 12, gender: "Female" },
  { id: "14-ascent", name: "U14-Red", slots: 12, gender: "Male" },
  { id: "14-timberline", name: "U14-Gold", slots: 12, gender: "Female" },
  { id: "15-peak", name: "U15-Black", slots: 12, gender: "Male" },
  { id: "15-timberline", name: "U15-Red", slots: 12, gender: "Female" },
  { id: "15-ascent", name: "U15-Gold", slots: 12, gender: "Male" },
  { id: "16-peak", name: "U16-Black", slots: 12, gender: "Female" },
  { id: "16-ascent", name: "U16-Red", slots: 12, gender: "Male" },
  { id: "17-ascent", name: "U17-Black", slots: 12, gender: "Female" },
  { id: "17-timberline", name: "U17-Red", slots: 12, gender: "Male" },
]

const registrationOptions = [
  "U13",
  "U14",
  "U15",
  "U16",
  "U17",
  "U18",
  "U19",
]

// Helper function to assign registrations to athletes
const assignRegistrations = (athletes: Omit<Athlete, 'registrations'>[]): Athlete[] => {
  return athletes.map((athlete, index) => {
    // Distribute athletes across different registrations
    const registrationIndex = index % registrationOptions.length
    const registrations = [registrationOptions[registrationIndex]]
    
    // Some athletes have multiple registrations (every 4th athlete)
    if (index % 4 === 0 && index + 1 < athletes.length) {
      registrations.push(registrationOptions[(registrationIndex + 1) % registrationOptions.length])
    }
    
    return { ...athlete, registrations }
  })
}

const initialAthletesData: Omit<Athlete, 'registrations'>[] = [
  { id: "1", name: "Ava Miller", initials: "AM", position: "Setter", status: null, birthdate: "03/15/2010" },
  { id: "2", name: "Zoe Parker", initials: "ZP", position: "Outside Hitter", status: null, birthdate: "07/22/2010" },
  {
    id: "3",
    name: "Nora Harris",
    initials: "NH",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "11/08/2009",
  },
  { id: "4", name: "Lily Mitchell", initials: "LM", position: "Libero", status: null, birthdate: "01/30/2011" },
  { id: "5", name: "Mary Moore", initials: "MM", position: "Opposite", status: null, birthdate: "06/12/2010" },
  { id: "6", name: "Katie Schuler", initials: "KS", position: "Setter", status: null, birthdate: "09/25/2009" },
  { id: "7", name: "Fran Freedman", initials: "FF", position: "Outside Hitter", status: null, birthdate: "04/18/2010" },
  { id: "8", name: "Jan Doe", initials: "JD", position: "Middle Blocker", status: "Declined", birthdate: "12/05/2010" },
  { id: "9", name: "Emma Johnson", initials: "EJ", position: "Setter", status: null, birthdate: "02/14/2010" },
  {
    id: "10",
    name: "Olivia Williams",
    initials: "OW",
    position: "Outside Hitter",
    status: null,
    birthdate: "08/29/2009",
  },
  { id: "11", name: "Sophia Brown", initials: "SB", position: "Middle Blocker", status: null, birthdate: "10/17/2010" },
  { id: "12", name: "Isabella Garcia", initials: "IG", position: "Libero", status: "Invited", birthdate: "05/03/2011" },
  { id: "13", name: "Mia Davis", initials: "MD", position: "Opposite", status: null, birthdate: "07/09/2010" },
  {
    id: "14",
    name: "Charlotte Rodriguez",
    initials: "CR",
    position: "Right Side",
    status: null,
    birthdate: "03/21/2009",
  },
  { id: "15", name: "Amelia Martinez", initials: "AM", position: "Setter", status: null, birthdate: "11/16/2010" },
  {
    id: "16",
    name: "Harper Hernandez",
    initials: "HH",
    position: "Outside Hitter",
    status: null,
    birthdate: "01/08/2010",
  },
  { id: "17", name: "Evelyn Lopez", initials: "EL", position: "Middle Blocker", status: null, birthdate: "06/24/2009" },
  { id: "18", name: "Abigail Gonzalez", initials: "AG", position: "Libero", status: null, birthdate: "09/11/2010" },
  {
    id: "19",
    name: "Emily Wilson",
    initials: "EW",
    position: "Defensive Specialist",
    status: null,
    birthdate: "04/07/2011",
  },
  {
    id: "20",
    name: "Elizabeth Anderson",
    initials: "EA",
    position: "Outside Hitter",
    status: "Invited",
    birthdate: "12/19/2009",
  },
  { id: "21", name: "Sofia Thomas", initials: "ST", position: "Setter", status: null, birthdate: "02/26/2010" },
  { id: "22", name: "Avery Taylor", initials: "AT", position: "Middle Blocker", status: null, birthdate: "08/13/2010" },
  { id: "23", name: "Ella Jackson", initials: "EJ", position: "Right Side", status: null, birthdate: "10/30/2009" },
  {
    id: "24",
    name: "Scarlett Martin",
    initials: "SM",
    position: "Outside Hitter",
    status: null,
    birthdate: "05/15/2010",
  },
  { id: "25", name: "Grace Lee", initials: "GL", position: "Libero", status: null, birthdate: "07/02/2011" },
  {
    id: "26",
    name: "Chloe Thompson",
    initials: "CT",
    position: "Opposite",
    status: "Declined",
    birthdate: "03/28/2010",
  },
  { id: "27", name: "Victoria White", initials: "VW", position: "Setter", status: null, birthdate: "11/05/2009" },
  { id: "28", name: "Riley Harris", initials: "RH", position: "Outside Hitter", status: null, birthdate: "01/22/2010" },
  { id: "29", name: "Aria Sanchez", initials: "AS", position: "Middle Blocker", status: null, birthdate: "06/09/2010" },
  { id: "30", name: "Lily Clark", initials: "LC", position: "Libero", status: null, birthdate: "09/17/2009" },
  { id: "31", name: "Aubrey Lewis", initials: "AL", position: "Right Side", status: null, birthdate: "04/25/2011" },
  {
    id: "32",
    name: "Zoey Robinson",
    initials: "ZR",
    position: "Outside Hitter",
    status: "Invited",
    birthdate: "12/03/2009",
  },
  { id: "33", name: "Penelope Walker", initials: "PW", position: "Setter", status: null, birthdate: "02/11/2010" },
  { id: "34", name: "Layla Young", initials: "LY", position: "Middle Blocker", status: null, birthdate: "08/28/2010" },
  { id: "35", name: "Natalie Allen", initials: "NA", position: "Opposite", status: null, birthdate: "10/14/2009" },
  { id: "36", name: "Hannah King", initials: "HK", position: "Outside Hitter", status: null, birthdate: "05/21/2010" },
  { id: "37", name: "Brooklyn Wright", initials: "BW", position: "Libero", status: null, birthdate: "07/08/2011" },
  {
    id: "38",
    name: "Addison Scott",
    initials: "AS",
    position: "Defensive Specialist",
    status: null,
    birthdate: "03/16/2010",
  },
  { id: "39", name: "Leah Torres", initials: "LT", position: "Setter", status: null, birthdate: "11/23/2009" },
  {
    id: "40",
    name: "Savannah Nguyen",
    initials: "SN",
    position: "Outside Hitter",
    status: null,
    birthdate: "01/10/2010",
  },
  {
    id: "41",
    name: "Audrey Hill",
    initials: "AH",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "06/27/2010",
  },
  { id: "42", name: "Claire Flores", initials: "CF", position: "Right Side", status: null, birthdate: "09/04/2009" },
  { id: "43", name: "Skylar Green", initials: "SG", position: "Opposite", status: null, birthdate: "04/12/2011" },
  { id: "44", name: "Bella Adams", initials: "BA", position: "Outside Hitter", status: null, birthdate: "12/29/2009" },
  { id: "45", name: "Aaliyah Nelson", initials: "AN", position: "Libero", status: null, birthdate: "02/17/2010" },
  { id: "46", name: "Anna Baker", initials: "AB", position: "Setter", status: null, birthdate: "08/05/2010" },
  {
    id: "47",
    name: "Samantha Hall",
    initials: "SH",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/22/2009",
  },
  {
    id: "48",
    name: "Caroline Rivera",
    initials: "CR",
    position: "Outside Hitter",
    status: "Declined",
    birthdate: "05/09/2010",
  },
  { id: "49", name: "Kennedy Campbell", initials: "KC", position: "Right Side", status: null, birthdate: "07/26/2011" },
  { id: "50", name: "Violet Mitchell", initials: "VM", position: "Libero", status: null, birthdate: "03/04/2010" },
  { id: "51", name: "Stella Carter", initials: "SC", position: "Opposite", status: null, birthdate: "11/11/2009" },
  { id: "52", name: "Maya Roberts", initials: "MR", position: "Setter", status: null, birthdate: "01/28/2010" },
  { id: "53", name: "Lucy Turner", initials: "LT", position: "Outside Hitter", status: null, birthdate: "06/15/2010" },
  {
    id: "54",
    name: "Paisley Phillips",
    initials: "PP",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "09/22/2009",
  },
  { id: "55", name: "Everly Campbell", initials: "EC", position: "Libero", status: null, birthdate: "04/30/2011" },
  {
    id: "56",
    name: "Madelyn Parker",
    initials: "MP",
    position: "Defensive Specialist",
    status: null,
    birthdate: "12/07/2009",
  },
  {
    id: "57",
    name: "Kinsley Evans",
    initials: "KE",
    position: "Outside Hitter",
    status: null,
    birthdate: "02/23/2010",
  },
  { id: "58", name: "Naomi Edwards", initials: "NE", position: "Setter", status: null, birthdate: "08/10/2010" },
  {
    id: "59",
    name: "Elena Collins",
    initials: "EC",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/27/2009",
  },
  { id: "60", name: "Hazel Stewart", initials: "HS", position: "Right Side", status: null, birthdate: "05/14/2010" },
  {
    id: "61",
    name: "Aurora Morris",
    initials: "AM",
    position: "Outside Hitter",
    status: null,
    birthdate: "07/01/2011",
  },
  { id: "62", name: "Savannah Rogers", initials: "SR", position: "Opposite", status: null, birthdate: "03/19/2010" },
  { id: "63", name: "Brooklyn Reed", initials: "BR", position: "Libero", status: null, birthdate: "11/26/2009" },
  { id: "64", name: "Bella Cook", initials: "BC", position: "Setter", status: "Invited", birthdate: "01/13/2010" },
  {
    id: "65",
    name: "Autumn Morgan",
    initials: "AM",
    position: "Outside Hitter",
    status: null,
    birthdate: "06/30/2010",
  },
  { id: "66", name: "Piper Bell", initials: "PB", position: "Middle Blocker", status: null, birthdate: "09/07/2009" },
  { id: "67", name: "Ruby Murphy", initials: "RM", position: "Libero", status: null, birthdate: "04/24/2011" },
  { id: "68", name: "Serenity Bailey", initials: "SB", position: "Right Side", status: null, birthdate: "12/01/2009" },
  {
    id: "69",
    name: "Willow Rivera",
    initials: "WR",
    position: "Outside Hitter",
    status: null,
    birthdate: "02/18/2010",
  },
  { id: "70", name: "Daisy Cooper", initials: "DC", position: "Setter", status: null, birthdate: "08/06/2010" },
  {
    id: "71",
    name: "Ivy Richardson",
    initials: "IR",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/23/2009",
  },
  { id: "72", name: "Genesis Cox", initials: "GC", position: "Opposite", status: "Declined", birthdate: "05/10/2010" },
  {
    id: "73",
    name: "Jasmine Howard",
    initials: "JH",
    position: "Outside Hitter",
    status: null,
    birthdate: "07/27/2011",
  },
  { id: "74", name: "Melody Ward", initials: "MW", position: "Libero", status: null, birthdate: "03/05/2010" },
  {
    id: "75",
    name: "Harmony Torres",
    initials: "HT",
    position: "Defensive Specialist",
    status: null,
    birthdate: "11/12/2009",
  },
  { id: "76", name: "Luna Peterson", initials: "LP", position: "Setter", status: null, birthdate: "01/29/2010" },
  { id: "77", name: "Nova Gray", initials: "NG", position: "Outside Hitter", status: null, birthdate: "07/16/2010" },
  { id: "78", name: "Aria Ramirez", initials: "AR", position: "Middle Blocker", status: "Invited", birthdate: "09/03/2009" },
  { id: "79", name: "Iris James", initials: "IJ", position: "Libero", status: null, birthdate: "04/20/2011" },
  { id: "80", name: "Jade Watson", initials: "JW", position: "Opposite", status: null, birthdate: "12/08/2009" },
  { id: "81", name: "Rose Brooks", initials: "RB", position: "Outside Hitter", status: null, birthdate: "02/25/2010" },
  { id: "82", name: "Lily Kelly", initials: "LK", position: "Setter", status: null, birthdate: "08/12/2010" },
  { id: "83", name: "Violet Sanders", initials: "VS", position: "Middle Blocker", status: null, birthdate: "10/29/2009" },
  { id: "84", name: "Daisy Price", initials: "DP", position: "Right Side", status: null, birthdate: "05/16/2010" },
  { id: "85", name: "Ivy Bennett", initials: "IB", position: "Outside Hitter", status: null, birthdate: "07/03/2011" },
  { id: "86", name: "Poppy Wood", initials: "PW", position: "Libero", status: "Invited", birthdate: "03/11/2010" },
  { id: "87", name: "Marigold Barnes", initials: "MB", position: "Opposite", status: null, birthdate: "11/18/2009" },
  { id: "88", name: "Sage Ross", initials: "SR", position: "Setter", status: null, birthdate: "01/05/2010" },
  { id: "89", name: "Juniper Henderson", initials: "JH", position: "Middle Blocker", status: null, birthdate: "06/22/2010" },
  { id: "90", name: "Willow Coleman", initials: "WC", position: "Defensive Specialist", status: null, birthdate: "09/09/2009" },
  { id: "91", name: "Aspen Jenkins", initials: "AJ", position: "Outside Hitter", status: null, birthdate: "04/26/2011" },
  { id: "92", name: "River Perry", initials: "RP", position: "Right Side", status: null, birthdate: "12/13/2009" },
  { id: "93", name: "Ocean Powell", initials: "OP", position: "Libero", status: null, birthdate: "02/01/2010" },
  { id: "94", name: "Sky Long", initials: "SL", position: "Setter", status: "Invited", birthdate: "08/18/2010" },
  { id: "95", name: "Storm Patterson", initials: "SP", position: "Middle Blocker", status: null, birthdate: "10/05/2009" },
  { id: "96", name: "Rain Hughes", initials: "RH", position: "Outside Hitter", status: null, birthdate: "05/23/2010" },
  { id: "97", name: "Sunny Flores", initials: "SF", position: "Opposite", status: null, birthdate: "07/10/2011" },
  { id: "98", name: "Breeze Washington", initials: "BW", position: "Libero", status: null, birthdate: "03/18/2010" },
  { id: "99", name: "Crystal Butler", initials: "CB", position: "Setter", status: null, birthdate: "11/25/2009" },
  { id: "100", name: "Diamond Simmons", initials: "DS", position: "Middle Blocker", status: null, birthdate: "01/12/2010" },
  { id: "101", name: "Pearl Foster", initials: "PF", position: "Outside Hitter", status: null, birthdate: "06/29/2010" },
  { id: "102", name: "Amber Gonzales", initials: "AG", position: "Right Side", status: "Invited", birthdate: "09/16/2009" },
  { id: "103", name: "Ruby Bryant", initials: "RB", position: "Libero", status: null, birthdate: "04/03/2011" },
  { id: "104", name: "Emerald Alexander", initials: "EA", position: "Defensive Specialist", status: null, birthdate: "12/20/2009" },
  { id: "105", name: "Sapphire Russell", initials: "SR", position: "Setter", status: null, birthdate: "02/07/2010" },
  { id: "106", name: "Opal Griffin", initials: "OG", position: "Middle Blocker", status: null, birthdate: "08/24/2010" },
  { id: "107", name: "Topaz Diaz", initials: "TD", position: "Outside Hitter", status: null, birthdate: "10/11/2009" },
  { id: "108", name: "Jade Hayes", initials: "JH", position: "Opposite", status: null, birthdate: "05/28/2010" },
  { id: "109", name: "Quinn Myers", initials: "QM", position: "Libero", status: null, birthdate: "07/15/2011" },
  { id: "110", name: "Rowan Ford", initials: "RF", position: "Setter", status: "Invited", birthdate: "03/22/2010" },
  { id: "111", name: "River Hamilton", initials: "RH", position: "Middle Blocker", status: null, birthdate: "11/29/2009" },
  { id: "112", name: "Phoenix Graham", initials: "PG", position: "Outside Hitter", status: null, birthdate: "01/16/2010" },
  { id: "113", name: "Sage Sullivan", initials: "SS", position: "Right Side", status: null, birthdate: "07/02/2010" },
  { id: "114", name: "Cedar Wallace", initials: "CW", position: "Libero", status: null, birthdate: "09/19/2009" },
  { id: "115", name: "Ash Woods", initials: "AW", position: "Defensive Specialist", status: null, birthdate: "04/06/2011" },
  { id: "116", name: "Maple Cole", initials: "MC", position: "Setter", status: null, birthdate: "12/23/2009" },
  { id: "117", name: "Birch West", initials: "BW", position: "Middle Blocker", status: null, birthdate: "02/10/2010" },
  { id: "118", name: "Oak Jordan", initials: "OJ", position: "Outside Hitter", status: "Invited", birthdate: "08/27/2010" },
  { id: "119", name: "Pine Owens", initials: "PO", position: "Opposite", status: null, birthdate: "10/14/2009" },
  { id: "120", name: "Elm Reynolds", initials: "ER", position: "Libero", status: null, birthdate: "05/31/2010" },
  { id: "121", name: "Cypress Fisher", initials: "CF", position: "Setter", status: null, birthdate: "07/18/2011" },
  { id: "122", name: "Spruce Ellis", initials: "SE", position: "Middle Blocker", status: null, birthdate: "03/25/2010" },
  { id: "123", name: "Fir Harrison", initials: "FH", position: "Outside Hitter", status: null, birthdate: "11/01/2009" },
  { id: "124", name: "Hemlock Gibson", initials: "HG", position: "Right Side", status: null, birthdate: "01/19/2010" },
  { id: "125", name: "Redwood Mcdonald", initials: "RM", position: "Libero", status: "Invited", birthdate: "06/05/2010" },
  { id: "126", name: "Sequoia Cruz", initials: "SC", position: "Defensive Specialist", status: null, birthdate: "09/12/2009" },
  { id: "127", name: "Cedar Marshall", initials: "CM", position: "Setter", status: null, birthdate: "04/29/2011" },
  { id: "128", name: "Pine Ortiz", initials: "PO", position: "Middle Blocker", status: null, birthdate: "12/16/2009" },
  { id: "129", name: "Fir Gomez", initials: "FG", position: "Outside Hitter", status: null, birthdate: "02/03/2010" },
  { id: "130", name: "Spruce Murray", initials: "SM", position: "Opposite", status: null, birthdate: "08/20/2010" },
]

// Create initialAthletes with registrations assigned
const initialAthletes = assignRegistrations(initialAthletesData)

type TeamAssignment = {
  [teamId: string]: {
    [slotIndex: number]: string // athlete id
  }
}

const getStatusBadgeStyle = (status: AthleteStatus) => {
  switch (status) {
    case "Assigned":
      return { bg: "bg-muted", text: "text-foreground" }
    case "Invited":
      return { bg: "bg-[#fff9e6]", text: "text-[#705c00]" }
    case "Accepted":
      return { bg: "bg-[#e7f3fd]", text: "text-[#0c4897]" }
    case "Rostered":
      return { bg: "bg-[#f5fcde]", text: "text-[#476600]" }
    case "Declined":
      return { bg: "bg-[#ffefed]", text: "text-destructive" }
    default:
      return null
  }
}

export default function AssignAthletesPage() {
  const router = useRouter()
  const [seasonExpanded, setSeasonExpanded] = useState(true)
  const [season2025Expanded, setSeason2025Expanded] = useState(true)
  const [maleExpanded, setMaleExpanded] = useState(true)
  const [femaleExpanded, setFemaleExpanded] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [athleteFilterOpen, setAthleteFilterOpen] = useState(false)
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set(["U13-Black"]))
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())

  // ADDED separate selection states for different contexts
  const [mainContentSelectedAthletes, setMainContentSelectedAthletes] = useState<Set<string>>(new Set())
  const [sidebarSelectedAthletes, setSidebarSelectedAthletes] = useState<Set<string>>(new Set())

  const [selectedAthleteForDrawer, setSelectedAthleteForDrawer] = useState<Athlete | null>(null)

  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment>({})
  const [athleteStatuses, setAthleteStatuses] = useState<{ [athleteId: string]: AthleteStatus }>({})
  const [draggedAthletes, setDraggedAthletes] = useState<string[]>([])
  const [dragOverSlot, setDragOverSlot] = useState<{ teamId: string; slotIndex: number } | null>(null)
  const [dragOverCollapsedTeam, setDragOverCollapsedTeam] = useState<string | null>(null)
  const [dragOverTeamContainer, setDragOverTeamContainer] = useState<string | null>(null)
  // ADDED state to track drag position for badge display

  const [filtersApplied, setFiltersApplied] = useState(false)

  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const [athleteSortOrder, setAthleteSortOrder] = useState<"asc" | "desc">("asc")

  const [athleteFilterSeasonExpanded, setAthleteFilterSeasonExpanded] = useState(true)
  const [athleteFilterProgramExpanded, setAthleteFilterProgramExpanded] = useState(true)

  const [ageRangeMin, setAgeRangeMin] = useState<string>("")
  const [ageRangeMax, setAgeRangeMax] = useState<string>("")
  const [selectedAthleteFilterGender, setSelectedAthleteFilterGender] = useState<string>("")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<string>("")

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [completeTeamsDrawerOpen, setCompleteTeamsDrawerOpen] = useState(false)
  const [expandedTeamsInDrawer, setExpandedTeamsInDrawer] = useState<Set<string>>(new Set())
  const [inviteModalStep, setInviteModalStep] = useState<"teams" | "email">("teams")
  const [selectedTeamsForInvite, setSelectedTeamsForInvite] = useState<Set<string>>(
    new Set(teams.slice(0, 5).map((t) => t.id)),
  )
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [selectedRegistration, setSelectedRegistration] = useState<string>("")
  const [hasSaved, setHasSaved] = useState(false)
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const seasonItems = [
    "U13-Black",
    "U13-Red",
    "U13-Gold",
    "U14-Black",
    "U14-Red",
    "U14-Gold",
    "U15-Black",
    "U15-Red",
    "U15-Gold",
    "U16-Black",
    "U16-Red",
    "U17-Black",
    "U17-Red",
  ]

  const programOptions = [
    "2025-2026 Tryouts (Aug 1 - May 31)",
    "2025-2026 Fall Tryouts (Sept 15 - Nov 30)",
    "2025-2026 Winter Tryouts (Dec 1 - Feb 28)",
    "2025-2026 Spring Tryouts (Mar 1 - May 15)",
  ]

  const ageOptions = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

  const activeFiltersCount = selectedSeasons.size

  const athleteFilterCount =
    (ageRangeMin ? 1 : 0) + 
    (ageRangeMax ? 1 : 0) + 
    (selectedAthleteFilterGender ? 1 : 0) +
    (selectedGrade ? 1 : 0) +
    (selectedGraduationYear ? 1 : 0)

  const getAssignedAthleteIds = () => {
    const assignedIds = new Set<string>()
    Object.values(teamAssignments).forEach((slots) => {
      Object.values(slots).forEach((athleteId) => {
        assignedIds.add(athleteId)
      })
    })
    return assignedIds
  }

  const getTeamStats = (teamId: string) => {
    const slots = teamAssignments[teamId] || {}
    const athleteIds = Object.values(slots)

    const stats = {
      accepted: 0,
      rostered: 0,
      assigned: 0,
      invited: 0,
      declined: 0,
    }

    athleteIds.forEach((athleteId) => {
      const status = athleteStatuses[athleteId] || "Assigned"
      if (status === "Accepted") stats.accepted++
      else if (status === "Rostered") stats.rostered++
      else if (status === "Assigned") stats.assigned++
      else if (status === "Invited") stats.invited++
      else if (status === "Declined") stats.declined++
    })

    return stats
  }

  const assignedAthleteIds = getAssignedAthleteIds()
  const availableAthletes = initialAthletes.filter((athlete) => !assignedAthleteIds.has(athlete.id))

  const [athleteSearchQuery, setAthleteSearchQuery] = useState("")
  const [teamSearchQuery, setTeamSearchQuery] = useState("")

  const searchedAthletes =
    !selectedProgram || !selectedRegistration
      ? []
      : availableAthletes
          .filter((athlete) => {
            // Filter by registration - athlete must have at least one matching registration
            const hasMatchingRegistration = selectedRegistration &&
              athlete.registrations.includes(selectedRegistration)
            return hasMatchingRegistration && athlete.name.toLowerCase().includes(athleteSearchQuery.toLowerCase())
          })
          .sort((a, b) => {
            if (athleteSortOrder === "asc") {
              return a.name.localeCompare(b.name)
            } else {
              return b.name.localeCompare(a.name)
            }
          })
          .slice(0, filtersApplied ? 20 : undefined)

  const handleDragStart = (e: React.DragEvent, athleteId: string) => {
    const isSidebarSelected = sidebarSelectedAthletes.has(athleteId)
    const isMainContentSelected = mainContentSelectedAthletes.has(athleteId)

    let athletesToDrag: string[]

    if (isSidebarSelected) {
      // Dragging from sidebar: use sidebar selections
      athletesToDrag = Array.from(sidebarSelectedAthletes)
    } else if (isMainContentSelected) {
      // Dragging from main content: use main content selections
      athletesToDrag = Array.from(mainContentSelectedAthletes)
    } else {
      // Not selected: just drag the single athlete
      athletesToDrag = [athleteId]
    }

    setDraggedAthletes(athletesToDrag)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", athletesToDrag.join(","))
  }

  const handleDragEnd = () => {
    setDraggedAthletes([])
    setDragOverSlot(null)
    setDragOverCollapsedTeam(null)
    setDragOverTeamContainer(null)
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())
  }

  const handleDragOver = (e: React.DragEvent, teamId: string, slotIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Stop propagation to prevent container handler from firing
    e.dataTransfer.dropEffect = "move"
    setDragOverSlot({ teamId, slotIndex })
    setDragOverTeamContainer(null) // Clear container hover when over specific slot
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, teamId: string, slotIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Stop propagation to prevent container handler from firing

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    let currentSlot = slotIndex
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (
        newAssignments[teamId][currentSlot] !== undefined &&
        currentSlot < teams.find((t) => t.id === teamId)!.slots
      ) {
        currentSlot++
      }
      if (currentSlot < teams.find((t) => t.id === teamId)!.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverSlot(null)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())

    // Trigger autosave after drop completes
    triggerAutosave()
  }

  const removeAthleteFromSlot = (teamId: string, slotIndex: number) => {
    const athleteId = teamAssignments[teamId]?.[slotIndex]
    const newAssignments = { ...teamAssignments }
    if (newAssignments[teamId]) {
      delete newAssignments[teamId][slotIndex]
    }

    if (athleteId) {
      const newStatuses = { ...athleteStatuses }
      delete newStatuses[athleteId]
      setAthleteStatuses(newStatuses)
    }

    setTeamAssignments(newAssignments)
  }

  const clearAthleteFilters = () => {
    setAgeRangeMin("")
    setAgeRangeMax("")
    setSelectedAthleteFilterGender("")
    setSelectedGrade("")
    setSelectedGraduationYear("")
    setFiltersApplied(false)
  }

  const clearFilters = () => {
    setSelectedSeasons(new Set())
  }

  const toggleSeason = (season: string) => {
    const newSelected = new Set(selectedSeasons)
    if (newSelected.has(season)) {
      newSelected.delete(season)
    } else {
      newSelected.add(season)
    }
    setSelectedSeasons(newSelected)
  }

  const toggleTeam = (teamId: string) => {
    const newExpandedTeams = new Set(expandedTeams)
    if (newExpandedTeams.has(teamId)) {
      newExpandedTeams.delete(teamId)
    } else {
      newExpandedTeams.add(teamId)
    }
    setExpandedTeams(newExpandedTeams)
  }

  const toggleTeamForInvite = (teamId: string) => {
    const newSelected = new Set(selectedTeamsForInvite)
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId)
    } else {
      newSelected.add(teamId)
    }
    setSelectedTeamsForInvite(newSelected)
  }

  const filteredTeams = teams.filter((team) => {
    if (selectedSeasons.size === 0) return false
    const matchesSeason = selectedSeasons.has(team.name)
    
    if (teamSearchQuery === "") {
      return matchesSeason
    }
    
    const searchLower = teamSearchQuery.toLowerCase()
    const matchesTeamName = team.name.toLowerCase().includes(searchLower)
    
    // Check if any assigned athlete matches the search
    const teamSlots = teamAssignments[team.id] || {}
    const assignedAthleteIds = Object.values(teamSlots)
    const matchesAthlete = assignedAthleteIds.some((athleteId) => {
      const athlete = initialAthletes.find((a) => a.id === athleteId)
      return athlete && athlete.name.toLowerCase().includes(searchLower)
    })
    
    return matchesSeason && (matchesTeamName || matchesAthlete)
  })

  // Auto-expand teams when search matches an athlete in a collapsed team
  useEffect(() => {
    if (teamSearchQuery === "") return

    const searchLower = teamSearchQuery.toLowerCase()
    const teamsToExpand = new Set<string>()

    // Check all teams that match the season filter
    teams
      .filter((team) => selectedSeasons.has(team.name))
      .forEach((team) => {
        // Check if team has an athlete matching the search
        const teamSlots = teamAssignments[team.id] || {}
        const assignedAthleteIds = Object.values(teamSlots)
        const hasMatchingAthlete = assignedAthleteIds.some((athleteId) => {
          const athlete = initialAthletes.find((a) => a.id === athleteId)
          return athlete && athlete.name.toLowerCase().includes(searchLower)
        })

        // If athlete matches and team is collapsed, expand it
        if (hasMatchingAthlete && !expandedTeams.has(team.id)) {
          teamsToExpand.add(team.id)
        }
      })

    // Expand all matching teams at once
    if (teamsToExpand.size > 0) {
      setExpandedTeams((prev) => {
        const newExpanded = new Set(prev)
        teamsToExpand.forEach((teamId) => newExpanded.add(teamId))
        return newExpanded
      })
    }
  }, [teamSearchQuery, teamAssignments, selectedSeasons, expandedTeams])

  // Autosave function - called explicitly after user actions complete
  const triggerAutosave = () => {
    setSaveStatus("saving")

    // Simulate save operation (replace with actual API call)
    setTimeout(() => {
      setSaveStatus("saved")
      setHasSaved(true)

      // Reset to idle after showing "Saved" for 2 seconds
      setTimeout(() => {
        setSaveStatus("idle")
      }, 2000)
    }, 500) // Short delay to simulate API call
  }

  // COMBINED selection states for drag operations
  const selectedAthletes = new Set([...mainContentSelectedAthletes, ...sidebarSelectedAthletes])

  // CLEAR selection states when selecting in main content
  const toggleMainContentAthleteSelection = (athleteId: string) => {
    setSidebarSelectedAthletes(new Set())

    const newSelected = new Set(mainContentSelectedAthletes)
    if (newSelected.has(athleteId)) {
      newSelected.delete(athleteId)
    } else {
      newSelected.add(athleteId)
    }
    setMainContentSelectedAthletes(newSelected)
  }

  // CLEAR selection states when selecting in sidebar
  const toggleSidebarAthleteSelection = (athleteId: string) => {
    setMainContentSelectedAthletes(new Set())

    const newSelected = new Set(sidebarSelectedAthletes)
    if (newSelected.has(athleteId)) {
      newSelected.delete(athleteId)
    } else {
      newSelected.add(athleteId)
    }
    setSidebarSelectedAthletes(newSelected)
  }

  const handleCollapsedTeamDragOver = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    setDragOverCollapsedTeam(teamId)
  }

  const handleCollapsedTeamDrop = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Find first available slot
    let currentSlot = 0
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (newAssignments[teamId][currentSlot] !== undefined && currentSlot < team.slots) {
        currentSlot++
      }
      if (currentSlot < team.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverCollapsedTeam(null)

    // Expand the team to show the assignment
    const newExpandedTeams = new Set(expandedTeams)
    newExpandedTeams.add(teamId)
    setExpandedTeams(newExpandedTeams)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())

    // Trigger autosave after drop completes
    triggerAutosave()
  }

  const handleCollapsedTeamDragLeave = () => {
    setDragOverCollapsedTeam(null)
  }

  const handleTeamContainerDragOver = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverTeamContainer(teamId)
  }

  const handleTeamContainerDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the container (not entering a child)
    if (e.currentTarget === e.target) {
      setDragOverTeamContainer(null)
    }
  }

  const handleTeamContainerDrop = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Find first available slot
    let currentSlot = 0
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (newAssignments[teamId][currentSlot] !== undefined && currentSlot < team.slots) {
        currentSlot++
      }
      if (currentSlot < team.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverTeamContainer(null)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())

    // Trigger autosave after drop completes
    triggerAutosave()
  }

  const handleMainContentClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMainContentSelectedAthletes(new Set())
      setSidebarSelectedAthletes(new Set())
    }
  }

  const handleRightSidebarClick = () => {
    // Currently main content doesn't have a separate selection state
    // but this handler is here for future use if needed
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f9' }}>
      {/* Header */}
      <header className="py-0" style={{ backgroundColor: '#fefefe' }}>
        <div className="max-w-[1600px] mx-auto px-3">
          <div className="relative flex items-center justify-between h-[56px]">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-[#36485c] hover:bg-transparent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#071c31] font-bold text-base text-center whitespace-nowrap" style={{ fontFamily: 'Barlow, sans-serif' }}>Assign Athletes</h1>

            <div className="flex items-center justify-end gap-2">
              {/* Autosave Indicator */}
              {saveStatus !== "idle" && (
                <div className="flex items-center gap-2 text-sm text-[#36485c] pr-4">
                  {saveStatus === "saving" && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#36485c]" />
                      <span>Saved</span>
                    </>
                  )}
                </div>
              )}
              <Button onClick={() => setInviteModalOpen(true)} className="bg-[#0273e3] hover:bg-[#0260c4] text-white gap-2 h-9 px-4" style={{ borderRadius: '2px' }}>
                Send Invitations
              </Button>
              <Button 
                onClick={() => setCompleteTeamsDrawerOpen(true)}
                className="bg-[#e0e1e1] hover:bg-[#c4c6c8] text-[#36485c] h-9 px-4" 
                style={{ borderRadius: '2px' }}
              >
                Review Teams
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-3 pt-3" style={{ backgroundColor: '#f8f8f9' }}>
        <div className="flex h-[calc(100vh-56px-12px)] overflow-hidden relative" style={{ gap: '8px' }}>
          {/* Left Sidebar - Filters */}
          <aside
            className={`bg-[#f8f8f9] transition-all duration-300 ease-in-out flex flex-col ${
              sidebarVisible ? "w-[320px]" : "w-0"
            }`}
          >
            <div
              className={`w-[320px] transition-opacity duration-300 overflow-y-auto flex-1 pl-0 pr-0 pt-0 pb-3 ${sidebarVisible ? "opacity-100" : "opacity-0"}`}
            >
              <div className="bg-[#fefefe] rounded p-4">
                <h2 className="text-[#071c31] font-bold text-base mb-0" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}>Teams</h2>

                {/* Teams Filter */}
                <div className="mt-4 space-y-1">
                  <button
                    className="flex items-center gap-2 text-[#071c31] text-sm font-bold h-8 w-full px-2 rounded hover:bg-[#e0e1e1] transition-colors"
                    onClick={() => setMaleExpanded(!maleExpanded)}
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    <div className="flex-none rotate-180">
                      {maleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    <span>Male</span>
                  </button>
                  {maleExpanded && (
                    <div className="ml-4 border-l border-[#c4c6c8] pl-1 space-y-0.5">
                      {teams
                        .filter((team) => team.gender === "Male")
                        .map((team) => (
                          <button
                            key={team.name}
                            onClick={() => toggleSeason(team.name)}
                            className={`text-sm h-8 px-2 rounded w-full text-left flex items-center justify-between transition-colors ${
                              selectedSeasons.has(team.name) 
                                ? "bg-[#e0e1e1] text-[#071c31] font-bold" 
                                : "text-[#36485c] font-medium hover:bg-[#e0e1e1]"
                            }`}
                            style={{ fontFamily: 'Barlow, sans-serif' }}
                          >
                            <span>{team.name}</span>
                            {selectedSeasons.has(team.name) && (
                              <div className="flex items-center justify-center pr-1">
                                <Check className="h-4 w-4 text-[#071c31]" />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  )}

                  <button
                    className="flex items-center gap-2 text-[#071c31] text-sm font-bold h-8 w-full px-2 rounded hover:bg-[#e0e1e1] transition-colors"
                    onClick={() => setFemaleExpanded(!femaleExpanded)}
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    <div className="flex-none rotate-180">
                      {femaleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    <span>Female</span>
                  </button>
                  {femaleExpanded && (
                    <div className="ml-4 border-l border-[#c4c6c8] pl-1 space-y-0.5">
                      {teams
                        .filter((team) => team.gender === "Female")
                        .map((team) => (
                          <button
                            key={team.name}
                            onClick={() => toggleSeason(team.name)}
                            className={`text-sm h-8 px-2 rounded w-full text-left flex items-center justify-between transition-colors ${
                              selectedSeasons.has(team.name) 
                                ? "bg-[#e0e1e1] text-[#071c31] font-bold" 
                                : "text-[#36485c] font-medium hover:bg-[#e0e1e1]"
                            }`}
                            style={{ fontFamily: 'Barlow, sans-serif' }}
                          >
                            <span>{team.name}</span>
                            {selectedSeasons.has(team.name) && (
                              <div className="flex items-center justify-center pr-1">
                                <Check className="h-4 w-4 text-[#071c31]" />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Center Content Area */}
          <main className="flex-1 overflow-hidden flex flex-col bg-[#fefefe] rounded p-3" onClick={handleMainContentClick}>
            {/* Toolbar container - sticky at top */}
            <div className="bg-[#fefefe] rounded p-0 mb-4 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#fefefe] rounded" style={{ borderRadius: '4px', height: '40px' }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 text-[#36485c] hover:bg-[#e0e1e1] rounded ${
                      sidebarVisible ? "bg-[#e0e1e1]" : ""
                    }`}
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                    style={{ borderRadius: '2px' }}
                  >
                    <Filter className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for athletes or teams"
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    className="w-full h-10 border border-[rgba(167,174,181,0.6)] text-[#13293f] placeholder:text-[rgba(19,41,63,0.4)] rounded"
                    style={{ borderRadius: '2px', fontSize: '16px', fontFamily: 'Helvetica, sans-serif' }}
                  />
                </div>
                <div className="flex items-center bg-[#fefefe] border border-[#c4c6c8] rounded" style={{ borderRadius: '4px', height: '40px' }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`h-10 w-10 rounded ${
                      viewMode === "list"
                        ? "bg-[#e0e1e1] text-[#36485c] hover:bg-[#e0e1e1]"
                        : "text-[#36485c] hover:bg-[#e0e1e1]"
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`h-10 w-10 rounded ${
                      viewMode === "grid"
                        ? "bg-[#e0e1e1] text-[#36485c] hover:bg-[#e0e1e1]"
                        : "text-[#36485c] hover:bg-[#e0e1e1]"
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Team cards - each in separate white box */}
              {filteredTeams.length > 0 ? (
                <div className={`${viewMode === "grid" ? "grid gap-3 items-start" : "space-y-3"}`} style={viewMode === "grid" ? { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" } : undefined}>
                  {filteredTeams.map((team) => {
                    const stats = getTeamStats(team.id)
                    const isCollapsedDragTarget = !expandedTeams.has(team.id) && dragOverCollapsedTeam === team.id
                    const isContainerDragTarget = expandedTeams.has(team.id) && dragOverTeamContainer === team.id

                    return (
                      <div 
                        key={team.id} 
                        className={`rounded p-3 min-w-0 transition-colors ${
                          isCollapsedDragTarget || isContainerDragTarget
                            ? "bg-[#e7f3fd] border border-[#085bb4] border-solid" 
                            : "bg-[#fefefe] border border-[#c4c6c8]"
                        }`}
                        style={{ borderRadius: '8px' }}
                        onDragOver={expandedTeams.has(team.id) ? (e) => handleTeamContainerDragOver(e, team.id) : undefined}
                        onDragLeave={expandedTeams.has(team.id) ? handleTeamContainerDragLeave : undefined}
                        onDrop={expandedTeams.has(team.id) ? (e) => handleTeamContainerDrop(e, team.id) : undefined}
                      >
                        <button
                          onClick={() => toggleTeam(team.id)}
                          onDragOver={
                            !expandedTeams.has(team.id) ? (e) => handleCollapsedTeamDragOver(e, team.id) : undefined
                          }
                          onDrop={!expandedTeams.has(team.id) ? (e) => handleCollapsedTeamDrop(e, team.id) : undefined}
                          onDragLeave={!expandedTeams.has(team.id) ? handleCollapsedTeamDragLeave : undefined}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-left flex-1">
                              <h3 className="text-[#071c31] font-bold text-sm mb-0.5" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.4' }}>{team.name}</h3>
                              <div className="flex items-center gap-3 text-xs text-[#36485c] flex-wrap" style={{ fontFamily: 'Barlow, sans-serif' }}>
                                <span className="whitespace-nowrap">
                                  Assigned: <span className="font-bold" style={{ fontFamily: 'Barlow, sans-serif' }}>{stats.assigned}</span>
                                </span>
                                <span className="whitespace-nowrap">
                                  Invited: <span className="font-bold" style={{ fontFamily: 'Barlow, sans-serif' }}>{stats.invited}</span>
                                </span>
                                <span className="whitespace-nowrap">
                                  Accepted: <span className="font-bold" style={{ fontFamily: 'Barlow, sans-serif' }}>{stats.accepted}</span>
                                </span>
                                <span className="whitespace-nowrap">
                                  Declined: <span className="font-bold" style={{ fontFamily: 'Barlow, sans-serif' }}>{stats.declined}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-center flex-shrink-0">
                              <div className="flex-none rotate-180">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#36485c] hover:bg-transparent"
                                  style={{ borderRadius: '2px' }}
                                >
                                  {expandedTeams.has(team.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </button>

                        {expandedTeams.has(team.id) && (() => {
                          const teamSlots = teamAssignments[team.id] || {}
                          const filledSlotIndices = Object.keys(teamSlots)
                            .map(Number)
                            .sort((a, b) => a - b)
                          const isEmpty = filledSlotIndices.length === 0
                          
                          return (
                            <div
                              className="rounded"
                              style={{ borderRadius: '8px', padding: isEmpty ? '4px 0 0 0' : '8px 0 0 0', marginTop: '16px' }}
                            >
                              {(() => {

                              // Render filled slots
                              const filledSlots = filledSlotIndices.map((slotIndex) => {
                                const assignedAthleteId = teamSlots[slotIndex]
                                const assignedAthlete = assignedAthleteId
                                  ? initialAthletes.find((a) => a.id === assignedAthleteId)
                                  : null
                                const isDropTarget =
                                  dragOverSlot?.teamId === team.id && dragOverSlot?.slotIndex === slotIndex
                                const athleteStatus = assignedAthleteId ? (athleteStatuses[assignedAthleteId] || "Assigned") : null
                                const statusStyle = athleteStatus ? getStatusBadgeStyle(athleteStatus) : null

                                return (
                                  <div
                                    key={slotIndex}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, assignedAthleteId)}
                                    onDragEnd={handleDragEnd}
                                    className="flex items-center gap-0 p-0 bg-[#f8f8f9] rounded hover:bg-[#f0f0f0] transition-colors cursor-move border border-[#c4c6c8]"
                                    style={{ height: '48px', borderRadius: '4px', marginBottom: '8px' }}
                                  >
                                    {assignedAthlete && (
                                      <>
                                        <div className="bg-[#eff0f0] flex items-center justify-center flex-shrink-0 h-full" style={{ width: '32px', padding: '0 4px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}>
                                          <GripVertical className="h-6 w-6 text-[#36485c]" />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-3">
                                          <div className="w-8 h-8 rounded-full bg-[#38434f] border border-[#fafafa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', letterSpacing: '-0.3px' }}>
                                            {assignedAthlete.initials}
                                          </div>
                                          <div className="flex-1 flex flex-col gap-0 justify-center min-w-0">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedAthleteForDrawer(assignedAthlete)
                                              }}
                                              className="text-[#36485c] text-sm font-bold text-left truncate"
                                              style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.4', letterSpacing: '0px' }}
                                            >
                                              {assignedAthlete.name}
                                            </button>
                                            <span className="text-[#36485c] text-xs font-medium" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', lineHeight: '1.4', letterSpacing: '0px' }}>{assignedAthlete.birthdate}</span>
                                          </div>
                                        </div>
                                        {statusStyle && athleteStatus && (
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <button
                                                onClick={(e) => e.stopPropagation()}
                                                className={`bg-[#e0e1e1] text-[#36485c] text-xs px-2 py-1 rounded font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                                style={{ borderRadius: '4px', fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}
                                              >
                                                {athleteStatus}
                                              </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-48 p-2" align="end">
                                              <div className="space-y-1">
                                                {(["Assigned", "Invited", "Accepted", "Declined"] as AthleteStatus[]).map((status) => {
                                                  const style = getStatusBadgeStyle(status)
                                                  return (
                                                    <button
                                                      key={status}
                                                      onClick={() => {
                                                        if (assignedAthleteId) {
                                                          setAthleteStatuses(prev => ({
                                                            ...prev,
                                                            [assignedAthleteId]: status
                                                          }))
                                                          // Trigger autosave after status change
                                                          triggerAutosave()
                                                        }
                                                      }}
                                                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                                                        style ? `${style.bg} ${style.text}` : 'bg-[#e0e1e1] text-[#36485c]'
                                                      } hover:opacity-80 ${athleteStatus === status ? 'ring-2 ring-[#0273e3]' : ''}`}
                                                      style={{ borderRadius: '4px', fontFamily: 'Barlow, sans-serif' }}
                                                    >
                                                      {status}
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </PopoverContent>
                                          </Popover>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-[#36485c] hover:text-[#36485c] hover:bg-transparent"
                                          onClick={() => removeAthleteFromSlot(team.id, slotIndex)}
                                          style={{ borderRadius: '4px' }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                )
                              })

                              const nextSlotIndex =
                                filledSlotIndices.length > 0 ? Math.max(...filledSlotIndices) + 1 : 0
                              const isEmptySlotDropTarget =
                                dragOverSlot?.teamId === team.id && dragOverSlot?.slotIndex === nextSlotIndex

                              const emptySlot = filledSlotIndices.length === 0 ? (
                                <div
                                  key="empty-slot"
                                  className="flex items-center justify-center"
                                  style={{ 
                                    minHeight: '60px',
                                    marginBottom: '0px',
                                    marginTop: '0px'
                                  }}
                                >
                                  <div
                                    className="flex items-center justify-center w-full"
                                    style={{
                                      border: '1px dashed #c4c6c8',
                                      borderRadius: '8px',
                                      padding: '12px',
                                      backgroundColor: '#ffffff'
                                    }}
                                  >
                                    <span className="text-[#36485c]" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px' }}>
                                      Add Athletes
                                    </span>
                                  </div>
                                </div>
                              ) : null

                              return emptySlot ? [emptySlot, ...filledSlots] : filledSlots
                            })()}
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-80px)]">
                  <p className="text-[#36485c] text-center" style={{ fontFamily: 'Barlow, sans-serif' }}>Filter your teams to start team assignments</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-[320px] bg-[#fefefe] rounded overflow-hidden flex flex-col" onClick={handleRightSidebarClick} style={{ borderRadius: '4px' }}>
            <div className="flex-shrink-0 px-4 py-0">
              <div className="flex items-center justify-between mb-4 pt-4">
                <h2 className="text-[#071c31] font-bold text-base" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}>Athletes</h2>
              </div>

              <div className="space-y-2 mb-2">
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="bg-[#fefefe] border border-[#c4c6c8] min-h-[40px] px-4 rounded text-[#36485c] text-base focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:border-transparent" style={{ borderRadius: '2px', fontFamily: 'Barlow, sans-serif', fontSize: '16px', lineHeight: '1.15' }}>
                    <SelectValue placeholder="2025 Spring Open Gym" />
                  </SelectTrigger>
                  <SelectContent>
                    {programOptions.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegistration} onValueChange={setSelectedRegistration} disabled={!selectedProgram}>
                  <SelectTrigger className="bg-[#fefefe] border border-[#c4c6c8] min-h-[40px] px-4 rounded text-[#36485c] text-base focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:border-transparent disabled:bg-[#f8f8f9] disabled:text-[rgba(54,72,92,0.4)] disabled:cursor-not-allowed" style={{ borderRadius: '2px', fontFamily: 'Barlow, sans-serif', fontSize: '16px', lineHeight: '1.15' }}>
                    <SelectValue placeholder="U15 Registration" />
                  </SelectTrigger>
                  <SelectContent>
                    {registrationOptions.map((registration) => (
                      <SelectItem key={registration} value={registration}>
                        {registration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center mb-4 gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for athletes"
                    value={athleteSearchQuery}
                    onChange={(e) => setAthleteSearchQuery(e.target.value)}
                    disabled={!selectedProgram}
                    className="w-full h-10 border border-[rgba(167,174,181,0.6)] text-[#13293f] placeholder:text-[rgba(19,41,63,0.4)] rounded disabled:bg-[#f8f8f9] disabled:text-[rgba(54,72,92,0.4)] disabled:cursor-not-allowed"
                    style={{ borderRadius: '2px', fontSize: '16px', fontFamily: 'Helvetica, sans-serif' }}
                  />
                </div>
                <Sheet open={athleteFilterOpen} onOpenChange={setAthleteFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-[#36485c] hover:bg-[#e0e1e1] relative rounded"
                      style={{ borderRadius: '2px' }}
                    >
                      <Filter className="h-5 w-5" />
                      {athleteFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#0273e3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {athleteFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="w-[380px] sm:max-w-[380px] bg-card flex flex-col p-0">
                    <SheetHeader className="flex-shrink-0 px-6 pt-4 pb-3">
                      <SheetTitle className="text-[#071c31] text-left">Filter Athletes by</SheetTitle>
                    </SheetHeader>
                    <div className="border-b border-border -mx-6 mb-4"></div>

                    <div className="flex-1 overflow-y-auto px-6">
                      <div className="space-y-6">
                        {/* Active Filters */}
                        {athleteFilterCount > 0 && (
                          <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                              <ChevronDown className="h-4 w-4 text-foreground" />
                              <span className="text-foreground text-sm font-medium">
                                {athleteFilterCount} Active Filter{athleteFilterCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <button onClick={clearAthleteFilters} className="text-[var(--u-color-emphasis-background-contrast)] text-sm hover:underline">
                              Clear
                            </button>
                          </div>
                        )}

                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="text-sm text-card-foreground font-medium mb-3 block">Minimum Age</label>
                            <Select value={ageRangeMin} onValueChange={setAgeRangeMin}>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                              <SelectContent>
                                {ageOptions.map((age) => (
                                  <SelectItem key={age} value={age}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <label className="text-sm text-card-foreground font-medium mb-3 block">Maximum Age</label>
                            <Select value={ageRangeMax} onValueChange={setAgeRangeMax}>
                              <SelectTrigger>
                                <SelectValue placeholder="Max" />
                              </SelectTrigger>
                              <SelectContent>
                                {ageOptions.map((age) => (
                                  <SelectItem key={age} value={age}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-card-foreground font-medium mb-3 block">Gender</label>
                          <Select value={selectedAthleteFilterGender} onValueChange={setSelectedAthleteFilterGender}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm text-card-foreground font-medium mb-3 block">Grade</label>
                          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {["9th", "10th", "11th", "12th"].map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm text-card-foreground font-medium mb-3 block">Graduation Year</label>
                          <Select value={selectedGraduationYear} onValueChange={setSelectedGraduationYear}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i - 2
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-border mt-4 px-6 pb-6">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setAthleteFilterOpen(false)}
                          variant="outline"
                          className="flex-1 border-border text-foreground hover:bg-muted"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setFiltersApplied(true)
                            setAthleteFilterOpen(false)
                          }}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 px-4 pb-4">
              {searchedAthletes.length > 0 ? (
                searchedAthletes.map((athlete) => {
                  const isAssigned = assignedAthleteIds.has(athlete.id)
                  return (
                  <div
                    key={athlete.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, athlete.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => toggleSidebarAthleteSelection(athlete.id)}
                    className={`flex items-center gap-0 p-0 bg-[#f8f8f9] rounded hover:bg-[#f0f0f0] transition-colors cursor-pointer ${
                      isAssigned ? "border border-[#c4c6c8]" : ""
                    } ${draggedAthletes.includes(athlete.id) ? "opacity-50" : ""}`}
                    style={{ height: '48px', borderRadius: '4px' }}
                  >
                    <div className="bg-[#eff0f0] flex items-center justify-center flex-shrink-0 h-full" style={{ width: '32px', padding: '0 4px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}>
                      <GripVertical className="h-6 w-6 text-[#36485c]" />
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-3">
                      <div className="w-8 h-8 rounded-full bg-[#38434f] border border-[#fafafa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', letterSpacing: '-0.3px' }}>
                        {athlete.initials}
                      </div>
                      <div className="flex-1 flex flex-col gap-0 justify-center min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAthleteForDrawer(athlete)
                          }}
                          className="text-[#36485c] text-sm font-bold text-left truncate"
                          style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.4', letterSpacing: '0px' }}
                        >
                          {athlete.name}
                        </button>
                        <span className="text-[#36485c] text-xs font-medium" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', lineHeight: '1.4', letterSpacing: '0px' }}>{athlete.birthdate}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center flex-shrink-0 pr-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={sidebarSelectedAthletes.has(athlete.id)}
                        onCheckedChange={() => toggleSidebarAthleteSelection(athlete.id)}
                        className="h-4 w-4 border-2 border-[#36485c] rounded data-[state=checked]:bg-[#085bb4] data-[state=checked]:border-[#085bb4]"
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-[#36485c] font-medium mb-1" style={{ fontFamily: 'Barlow, sans-serif' }}>No Athletes</p>
                    <p className="text-[#36485c] text-sm" style={{ fontFamily: 'Barlow, sans-serif' }}>Choose program and registration to get athletes.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Sheet open={!!selectedAthleteForDrawer} onOpenChange={(open) => !open && setSelectedAthleteForDrawer(null)}>
        <SheetContent className="w-[400px] sm:max-w-[400px] bg-card flex flex-col p-0">
          {selectedAthleteForDrawer && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {selectedAthleteForDrawer.initials}
                  </div>
                  <h3 className="text-[#071c31] font-semibold">{selectedAthleteForDrawer.name}</h3>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex gap-3 mt-auto">
                <Button
                  onClick={() => setSelectedAthleteForDrawer(null)}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={inviteModalOpen} onOpenChange={(open) => {
        setInviteModalOpen(open)
        if (!open) {
          setInviteModalStep("teams")
          setEmailSubject("")
          setEmailBody("")
        }
      }}>
        <DialogContent className="max-w-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-[#071c31] text-xl font-semibold">Invite Athletes</DialogTitle>
          </DialogHeader>

          {inviteModalStep === "teams" ? (
            <>
              <div className="px-6 pt-4 pb-6">
                <p className="text-card-foreground text-base mb-4">Choose which teams you would like to send invitations to.</p>

                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {teams.map((team) => {
                    const isSelected = selectedTeamsForInvite.has(team.id)
                    return (
                      <button
                        key={team.id}
                        onClick={() => toggleTeamForInvite(team.id)}
                        className="w-full flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <span className="text-foreground font-medium text-base">{team.name}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary" : "border-2 border-border"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  onClick={() => setInviteModalOpen(false)}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setInviteModalStep("email")
                    setEmailSubject("Team Invitation")
                    setEmailBody("You have been invited to join the team.")
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="px-6 pt-4 pb-6">
                <p className="text-card-foreground text-base mb-4">Compose your invitation email.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Email message"
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  onClick={() => setInviteModalStep("teams")}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    // Get all athletes assigned to the selected teams
                    const athleteIdsToInvite = new Set<string>()
                    selectedTeamsForInvite.forEach((teamId) => {
                      const teamSlots = teamAssignments[teamId] || {}
                      Object.values(teamSlots).forEach((athleteId) => {
                        athleteIdsToInvite.add(athleteId)
                      })
                    })

                    // Update status to "Invited" for all athletes in selected teams
                    setAthleteStatuses((prev) => {
                      const updated = { ...prev }
                      athleteIdsToInvite.forEach((athleteId) => {
                        updated[athleteId] = "Invited"
                      })
                      return updated
                    })

                    console.log("Sending invitations:", {
                      teams: Array.from(selectedTeamsForInvite),
                      athletes: Array.from(athleteIdsToInvite),
                      subject: emailSubject,
                      body: emailBody
                    })
                    setInviteModalOpen(false)
                    setInviteModalStep("teams")
                    setEmailSubject("")
                    setEmailBody("")
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={finalizeModalOpen} onOpenChange={setFinalizeModalOpen}>
        <DialogContent className="max-w-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-[#071c31] text-xl font-semibold">Finalize Teams</DialogTitle>
          </DialogHeader>

          <div className="px-6 pt-4 pb-6">
            <p className="text-card-foreground text-base mb-4">
              Are you sure you want to finalize your rosters for all your teams? This will contact your CSM to discuss your packaging options.
            </p>
            {assignedAthleteIds.size === 0 && (
              <div className="mt-4 text-destructive text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>You cannot finalize teams without any athletes assigned. Please assign at least one athlete to a team before finalizing.</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              onClick={() => setFinalizeModalOpen(false)}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Finalizing teams...")
                setFinalizeModalOpen(false)
              }}
              disabled={assignedAthleteIds.size === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalize
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Teams Preview Drawer */}
      <Sheet open={completeTeamsDrawerOpen} onOpenChange={setCompleteTeamsDrawerOpen}>
        <SheetContent className="w-[480px] sm:max-w-[480px] bg-[#fefefe] flex flex-col p-0 overflow-y-auto">
          <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#c4c6c8]">
            <SheetTitle className="text-[#071c31] font-bold text-lg" style={{ fontFamily: 'Barlow, sans-serif' }}>
              Review Teams
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-6 pt-1 pb-4">
            <div className="mb-4">
              <p className="text-[#36485c] text-sm leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.5' }}>
                Review your rosters, then confirm your teams. A Hudl account manager will finish setting up your teams. You can close this panel to keep working or make changes later if needed.
              </p>
            </div>
            <div className="space-y-2">
              {teams.map((team) => {
                const slots = teamAssignments[team.id] || {}
                const assignedAthleteIds = Object.values(slots).filter(id => id) as string[]
                const stats = getTeamStats(team.id)
                
                if (assignedAthleteIds.length === 0) {
                  return null // Skip teams with no assigned athletes
                }

                const isExpanded = expandedTeamsInDrawer.has(team.id)
                
                return (
                  <div
                    key={team.id}
                    className="bg-[#fefefe] border border-[#c4c6c8] rounded overflow-hidden"
                    style={{ borderRadius: '8px' }}
                  >
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedTeamsInDrawer)
                        if (isExpanded) {
                          newExpanded.delete(team.id)
                        } else {
                          newExpanded.add(team.id)
                        }
                        setExpandedTeamsInDrawer(newExpanded)
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#f8f8f9] transition-colors"
                      style={{ borderRadius: isExpanded ? '8px 8px 0 0' : '8px' }}
                    >
                      <h3 className="text-[#071c31] font-bold text-sm" style={{ fontFamily: 'Barlow, sans-serif' }}>
                        {team.name}
                      </h3>
                      <div className="flex-none">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-[#36485c]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#36485c]" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                      {assignedAthleteIds.map((athleteId) => {
                        const athlete = initialAthletes.find(a => a.id === athleteId)
                        if (!athlete) return null
                        
                        const athleteStatus = athleteStatuses[athleteId] || "Assigned"
                        const statusStyle = getStatusBadgeStyle(athleteStatus)
                        
                        return (
                          <div
                            key={athleteId}
                            className="flex items-center gap-2 p-2 bg-[#f8f8f9] rounded border border-[#c4c6c8]"
                            style={{ borderRadius: '4px' }}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#38434f] border border-[#fafafa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', letterSpacing: '-0.3px' }}>
                              {athlete.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[#36485c] text-sm font-bold truncate" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.4' }}>
                                {athlete.name}
                              </div>
                              <div className="text-[#36485c] text-xs font-medium" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
                                {athlete.birthdate}
                              </div>
                            </div>
                            {statusStyle && (
                              <div
                                className={`${statusStyle.bg} ${statusStyle.text} text-xs px-2 py-1 rounded font-bold`}
                                style={{ borderRadius: '4px', fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}
                              >
                                {athleteStatus}
                              </div>
                            )}
                          </div>
                        )
                      })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {teams.filter(team => {
              const slots = teamAssignments[team.id] || {}
              return Object.values(slots).filter(id => id).length > 0
            }).length === 0 && (
              <div className="text-center py-8 text-[#36485c] text-sm" style={{ fontFamily: 'Barlow, sans-serif' }}>
                No teams have assigned athletes yet.
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0 px-6 py-4 border-t border-[#c4c6c8] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setCompleteTeamsDrawerOpen(false)}
              className="bg-[#e0e1e1] hover:bg-[#c4c6c8] text-[#36485c] border-0"
              style={{ borderRadius: '2px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle submit logic here
                setCompleteTeamsDrawerOpen(false)
                // You can add your submit logic here
              }}
              className="bg-[#0273e3] hover:bg-[#0260c4] text-white"
              style={{ borderRadius: '2px' }}
            >
              Submit Teams
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronRight, ArrowLeft, ArrowRight, Send, Check, X, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

type AthleteStatus = "Assigned" | "Invited" | "Accepted" | "Rostered" | "Declined" | null

type Athlete = {
  id: string
  name: string
  initials: string
  position: string
  status: AthleteStatus
  birthdate: string
  registrations: string[]
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
    const registrationIndex = index % registrationOptions.length
    const registrations = [registrationOptions[registrationIndex]]
    
    if (index % 4 === 0 && index + 1 < athletes.length) {
      registrations.push(registrationOptions[(registrationIndex + 1) % registrationOptions.length])
    }
    
    return { ...athlete, registrations }
  })
}

const initialAthletesData: Omit<Athlete, 'registrations'>[] = [
  { id: "1", name: "Ava Miller", initials: "AM", position: "Setter", status: null, birthdate: "03/15/2010" },
  { id: "2", name: "Zoe Parker", initials: "ZP", position: "Outside Hitter", status: null, birthdate: "07/22/2010" },
  { id: "3", name: "Nora Harris", initials: "NH", position: "Middle Blocker", status: "Invited", birthdate: "11/08/2009" },
  { id: "4", name: "Lily Mitchell", initials: "LM", position: "Libero", status: null, birthdate: "01/30/2011" },
  { id: "5", name: "Mary Moore", initials: "MM", position: "Opposite", status: null, birthdate: "06/12/2010" },
  { id: "6", name: "Katie Schuler", initials: "KS", position: "Setter", status: null, birthdate: "09/25/2009" },
  { id: "7", name: "Fran Freedman", initials: "FF", position: "Outside Hitter", status: null, birthdate: "04/18/2010" },
  { id: "8", name: "Jan Doe", initials: "JD", position: "Middle Blocker", status: "Declined", birthdate: "12/05/2010" },
  { id: "9", name: "Emma Johnson", initials: "EJ", position: "Setter", status: null, birthdate: "02/14/2010" },
  { id: "10", name: "Olivia Williams", initials: "OW", position: "Outside Hitter", status: null, birthdate: "08/29/2009" },
  { id: "11", name: "Sophia Brown", initials: "SB", position: "Middle Blocker", status: null, birthdate: "10/17/2010" },
  { id: "12", name: "Isabella Garcia", initials: "IG", position: "Libero", status: "Invited", birthdate: "05/03/2011" },
  { id: "13", name: "Mia Davis", initials: "MD", position: "Opposite", status: null, birthdate: "07/09/2010" },
  { id: "14", name: "Charlotte Rodriguez", initials: "CR", position: "Right Side", status: null, birthdate: "03/21/2009" },
  { id: "15", name: "Amelia Martinez", initials: "AM", position: "Setter", status: null, birthdate: "11/16/2010" },
  { id: "16", name: "Harper Hernandez", initials: "HH", position: "Outside Hitter", status: null, birthdate: "01/08/2010" },
  { id: "17", name: "Evelyn Lopez", initials: "EL", position: "Middle Blocker", status: null, birthdate: "06/24/2009" },
  { id: "18", name: "Abigail Gonzalez", initials: "AG", position: "Libero", status: null, birthdate: "09/11/2010" },
  { id: "19", name: "Emily Wilson", initials: "EW", position: "Defensive Specialist", status: null, birthdate: "04/07/2011" },
  { id: "20", name: "Elizabeth Anderson", initials: "EA", position: "Outside Hitter", status: "Invited", birthdate: "12/19/2009" },
  { id: "21", name: "Sofia Thomas", initials: "ST", position: "Setter", status: null, birthdate: "02/26/2010" },
  { id: "22", name: "Avery Taylor", initials: "AT", position: "Middle Blocker", status: null, birthdate: "08/13/2010" },
  { id: "23", name: "Ella Jackson", initials: "EJ", position: "Right Side", status: null, birthdate: "10/30/2009" },
  { id: "24", name: "Scarlett Martin", initials: "SM", position: "Outside Hitter", status: null, birthdate: "05/15/2010" },
  { id: "25", name: "Grace Lee", initials: "GL", position: "Libero", status: null, birthdate: "07/02/2011" },
  { id: "26", name: "Chloe Thompson", initials: "CT", position: "Opposite", status: "Declined", birthdate: "03/28/2010" },
  { id: "27", name: "Victoria White", initials: "VW", position: "Setter", status: null, birthdate: "11/05/2009" },
  { id: "28", name: "Riley Harris", initials: "RH", position: "Outside Hitter", status: null, birthdate: "01/22/2010" },
  { id: "29", name: "Aria Sanchez", initials: "AS", position: "Middle Blocker", status: null, birthdate: "06/09/2010" },
  { id: "30", name: "Lily Clark", initials: "LC", position: "Libero", status: null, birthdate: "09/17/2009" },
  { id: "31", name: "Aubrey Lewis", initials: "AL", position: "Right Side", status: null, birthdate: "04/25/2011" },
  { id: "32", name: "Zoey Robinson", initials: "ZR", position: "Outside Hitter", status: "Invited", birthdate: "12/03/2009" },
  { id: "33", name: "Penelope Walker", initials: "PW", position: "Setter", status: null, birthdate: "02/11/2010" },
  { id: "34", name: "Layla Young", initials: "LY", position: "Middle Blocker", status: null, birthdate: "08/28/2010" },
  { id: "35", name: "Natalie Allen", initials: "NA", position: "Opposite", status: null, birthdate: "10/14/2009" },
  { id: "36", name: "Hannah King", initials: "HK", position: "Outside Hitter", status: null, birthdate: "05/21/2010" },
  { id: "37", name: "Brooklyn Wright", initials: "BW", position: "Libero", status: null, birthdate: "07/08/2011" },
  { id: "38", name: "Addison Scott", initials: "AS", position: "Defensive Specialist", status: null, birthdate: "03/16/2010" },
  { id: "39", name: "Leah Torres", initials: "LT", position: "Setter", status: null, birthdate: "11/23/2009" },
  { id: "40", name: "Savannah Nguyen", initials: "SN", position: "Outside Hitter", status: null, birthdate: "01/10/2010" },
  { id: "41", name: "Audrey Hill", initials: "AH", position: "Middle Blocker", status: "Invited", birthdate: "06/27/2010" },
  { id: "42", name: "Claire Flores", initials: "CF", position: "Right Side", status: null, birthdate: "09/04/2009" },
  { id: "43", name: "Skylar Green", initials: "SG", position: "Opposite", status: null, birthdate: "04/12/2011" },
  { id: "44", name: "Bella Adams", initials: "BA", position: "Outside Hitter", status: null, birthdate: "12/29/2009" },
  { id: "45", name: "Aaliyah Nelson", initials: "AN", position: "Libero", status: null, birthdate: "02/17/2010" },
  { id: "46", name: "Anna Baker", initials: "AB", position: "Setter", status: null, birthdate: "08/05/2010" },
  { id: "47", name: "Samantha Hall", initials: "SH", position: "Middle Blocker", status: null, birthdate: "10/22/2009" },
  { id: "48", name: "Caroline Rivera", initials: "CR", position: "Outside Hitter", status: "Declined", birthdate: "05/09/2010" },
  { id: "49", name: "Kennedy Campbell", initials: "KC", position: "Right Side", status: null, birthdate: "07/26/2011" },
  { id: "50", name: "Violet Mitchell", initials: "VM", position: "Libero", status: null, birthdate: "03/04/2010" },
  { id: "51", name: "Stella Carter", initials: "SC", position: "Opposite", status: null, birthdate: "11/11/2009" },
  { id: "52", name: "Maya Roberts", initials: "MR", position: "Setter", status: null, birthdate: "01/28/2010" },
  { id: "53", name: "Lucy Turner", initials: "LT", position: "Outside Hitter", status: null, birthdate: "06/15/2010" },
  { id: "54", name: "Paisley Phillips", initials: "PP", position: "Middle Blocker", status: "Invited", birthdate: "09/22/2009" },
  { id: "55", name: "Everly Campbell", initials: "EC", position: "Libero", status: null, birthdate: "04/30/2011" },
  { id: "56", name: "Madelyn Parker", initials: "MP", position: "Defensive Specialist", status: null, birthdate: "12/07/2009" },
  { id: "57", name: "Kinsley Evans", initials: "KE", position: "Outside Hitter", status: null, birthdate: "02/23/2010" },
  { id: "58", name: "Naomi Edwards", initials: "NE", position: "Setter", status: null, birthdate: "08/10/2010" },
  { id: "59", name: "Elena Collins", initials: "EC", position: "Middle Blocker", status: null, birthdate: "10/27/2009" },
  { id: "60", name: "Hazel Stewart", initials: "HS", position: "Right Side", status: null, birthdate: "05/14/2010" },
  { id: "61", name: "Aurora Morris", initials: "AM", position: "Outside Hitter", status: null, birthdate: "07/01/2011" },
  { id: "62", name: "Savannah Rogers", initials: "SR", position: "Opposite", status: null, birthdate: "03/19/2010" },
  { id: "63", name: "Brooklyn Reed", initials: "BR", position: "Libero", status: null, birthdate: "11/26/2009" },
  { id: "64", name: "Bella Cook", initials: "BC", position: "Setter", status: "Invited", birthdate: "01/13/2010" },
  { id: "65", name: "Autumn Morgan", initials: "AM", position: "Outside Hitter", status: null, birthdate: "06/30/2010" },
  { id: "66", name: "Piper Bell", initials: "PB", position: "Middle Blocker", status: null, birthdate: "09/07/2009" },
  { id: "67", name: "Ruby Murphy", initials: "RM", position: "Libero", status: null, birthdate: "04/24/2011" },
  { id: "68", name: "Serenity Bailey", initials: "SB", position: "Right Side", status: null, birthdate: "12/01/2009" },
  { id: "69", name: "Willow Rivera", initials: "WR", position: "Outside Hitter", status: null, birthdate: "02/18/2010" },
  { id: "70", name: "Daisy Cooper", initials: "DC", position: "Setter", status: null, birthdate: "08/06/2010" },
  { id: "71", name: "Ivy Richardson", initials: "IR", position: "Middle Blocker", status: null, birthdate: "10/23/2009" },
  { id: "72", name: "Genesis Cox", initials: "GC", position: "Opposite", status: "Declined", birthdate: "05/10/2010" },
  { id: "73", name: "Jasmine Howard", initials: "JH", position: "Outside Hitter", status: null, birthdate: "07/27/2011" },
  { id: "74", name: "Melody Ward", initials: "MW", position: "Libero", status: null, birthdate: "03/05/2010" },
  { id: "75", name: "Harmony Torres", initials: "HT", position: "Defensive Specialist", status: null, birthdate: "11/12/2009" },
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

const initialAthletes = assignRegistrations(initialAthletesData)

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isModalVariant = searchParams.get('variant') === 'modal' || searchParams.get('modal') === 'true'
  const [currentStep, setCurrentStep] = useState<"select">("select")
  const [expandedTeamsForInvite, setExpandedTeamsForInvite] = useState<Set<string>>(new Set())
  const [selectedAthletesForInvite, setSelectedAthletesForInvite] = useState<Map<string, Set<string>>>(new Map())
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [allowAcceptDecline, setAllowAcceptDecline] = useState(true)
  
  // Load state from localStorage on mount
  const [teamAssignments, setTeamAssignments] = useState<{ [teamId: string]: { [slotIndex: number]: string | null } }>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teamAssignments')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse teamAssignments from localStorage', e)
          return {}
        }
      }
    }
    return {}
  })
  
  const [athleteStatuses, setAthleteStatuses] = useState<{ [teamId: string]: { [athleteId: string]: AthleteStatus } }>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('athleteStatuses')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse athleteStatuses from localStorage', e)
          return {}
        }
      }
    }
    return {}
  })
  
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedSeasons')
      if (stored) {
        try {
          return new Set(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse selectedSeasons from localStorage', e)
          return new Set(["U13-Black"])
        }
      }
    }
    return new Set(["U13-Black"])
  })
  
  // Reload from localStorage when component mounts to ensure we have the latest data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTeamAssignments = localStorage.getItem('teamAssignments')
      const storedAthleteStatuses = localStorage.getItem('athleteStatuses')
      const storedSelectedSeasons = localStorage.getItem('selectedSeasons')
      
      if (storedTeamAssignments) {
        try {
          const parsed = JSON.parse(storedTeamAssignments)
          setTeamAssignments(parsed)
        } catch (e) {
          console.error('Failed to parse teamAssignments from localStorage', e)
        }
      }
      
      if (storedAthleteStatuses) {
        try {
          const parsed = JSON.parse(storedAthleteStatuses)
          setAthleteStatuses(parsed)
        } catch (e) {
          console.error('Failed to parse athleteStatuses from localStorage', e)
        }
      }
      
      if (storedSelectedSeasons) {
        try {
          const parsed = JSON.parse(storedSelectedSeasons)
          setSelectedSeasons(new Set(parsed))
        } catch (e) {
          console.error('Failed to parse selectedSeasons from localStorage', e)
        }
      }
    }
  }, [])
  
  const toggleTeamExpansionForInvite = (teamId: string) => {
    const newExpanded = new Set(expandedTeamsForInvite)
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId)
    } else {
      newExpanded.add(teamId)
    }
    setExpandedTeamsForInvite(newExpanded)
  }

  const toggleAthleteForInvite = (teamId: string, athleteId: string) => {
    const newSelected = new Map(selectedAthletesForInvite)
    const teamAthletes = newSelected.get(teamId) || new Set<string>()
    const newTeamAthletes = new Set(teamAthletes)
    
    if (newTeamAthletes.has(athleteId)) {
      newTeamAthletes.delete(athleteId)
    } else {
      newTeamAthletes.add(athleteId)
    }
    
    if (newTeamAthletes.size > 0) {
      newSelected.set(teamId, newTeamAthletes)
    } else {
      newSelected.delete(teamId)
    }
    
    setSelectedAthletesForInvite(newSelected)
  }

  const handleSend = () => {
    // Update status to "Invited" for all selected athletes
    // First, get the current state
    const currentStatuses = { ...athleteStatuses }
    const updated = { ...currentStatuses }
    
    selectedAthletesForInvite.forEach((athleteIds, teamId) => {
      const teamStatuses = updated[teamId] || {}
      const newTeamStatuses = { ...teamStatuses }
      
      // Change all selected athletes to "Invited" status
      athleteIds.forEach((athleteId) => {
        newTeamStatuses[athleteId] = "Invited"
      })
      
      updated[teamId] = newTeamStatuses
    })
    
    // Update state
    setAthleteStatuses(updated)
    
    // Save updated statuses to localStorage immediately (synchronously)
    if (typeof window !== 'undefined') {
      localStorage.setItem('athleteStatuses', JSON.stringify(updated))
      localStorage.setItem('teamAssignments', JSON.stringify(teamAssignments))
      localStorage.setItem('selectedSeasons', JSON.stringify(Array.from(selectedSeasons)))
    }

    // Collect all athlete IDs for logging
    const athleteIdsToInvite = new Set<string>()
    selectedAthletesForInvite.forEach((athleteIds) => {
      athleteIds.forEach((athleteId) => {
        athleteIdsToInvite.add(athleteId)
      })
    })
    
    console.log("Sending invitations:", {
      teams: Array.from(selectedAthletesForInvite.keys()),
      athletes: Array.from(athleteIdsToInvite),
      subject: emailSubject,
      body: emailBody
    })
    
    // Save toast data to localStorage to show on main page
    if (typeof window !== 'undefined') {
      localStorage.setItem('showInviteToast', JSON.stringify({
        athleteCount: athleteIdsToInvite.size
      }))
    }
    
    // Navigate back to main page - use replace to ensure fresh load
    router.replace('/')
  }

  const content = (
    <>
      {!isModalVariant && (
        <header className="py-0" style={{ backgroundColor: '#fefefe' }}>
          <div className="max-w-[1600px] mx-auto px-3">
            <div className="relative flex items-center justify-between h-[56px]">
              <div className="flex items-center">
                <Button 
                  onClick={() => router.push('/')}
                  variant="ghost" 
                  size="icon" 
                  className="text-[#36485c] hover:bg-transparent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#071c31] font-bold text-base text-center whitespace-nowrap" style={{ fontFamily: 'Barlow, sans-serif' }}>
                Invite Athletes
              </h1>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - Two Column Layout */}
      <div className={`flex-1 flex overflow-hidden ${!isModalVariant ? '' : 'h-full'}`} style={!isModalVariant ? { marginTop: '8px' } : {}}>
        {/* Left Section - Stepper and Step Content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#f8f8f9' }}>
          {/* Stepper - Only show in modal variant */}
          {isModalVariant && (
            <div className="px-8 pt-6 pb-3 flex-shrink-0">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-2 flex-1">
              {/* Step 1: Select */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-[#0273e3] border-[#0273e3] text-white">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <span className="text-sm font-medium text-[#0273e3]">Select Teams</span>
              </div>
            </div>
          </div>
          </div>
            )}

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-8 pt-4 pb-8">
              {currentStep === "select" && (
                <div className="space-y-6">
              <div>
                <h2 className="text-[#071c31] text-lg font-semibold mb-2">Select Teams & Athletes</h2>
                <p className="text-[#607081] text-base">Choose which teams and athletes you would like to send invitations to.</p>
              </div>

              <div className="space-y-4">
                {teams
                  .filter((team) => selectedSeasons.has(team.name))
                  .map((team) => {
                    const isExpanded = expandedTeamsForInvite.has(team.id)
                    const teamSlots = teamAssignments[team.id] || {}
                    const assignedAthleteIds = Object.values(teamSlots).filter(id => id !== null) as string[]
                    const teamSelectedAthletes = selectedAthletesForInvite.get(team.id) || new Set<string>()
                    const allAthletesSelected = assignedAthleteIds.length > 0 && assignedAthleteIds.every(id => teamSelectedAthletes.has(id))
                    const someAthletesSelected = assignedAthleteIds.some(id => teamSelectedAthletes.has(id))
                    
                    return (
                      <div key={team.id} className="border border-[#c4c6c8] rounded-lg overflow-hidden bg-white">
                        <div className="flex items-center justify-between py-3 px-4 hover:bg-[#f8f8f9] transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleTeamExpansionForInvite(team.id)}
                              className="flex items-center justify-center"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-[#36485c]" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-[#36485c]" />
                              )}
                            </button>
                            <span className="text-[#071c31] font-bold text-base" style={{ fontFamily: 'Barlow, sans-serif' }}>{team.name}</span>
                          </div>
                          <Checkbox
                            checked={assignedAthleteIds.length > 0 ? (allAthletesSelected ? true : someAthletesSelected ? "indeterminate" : false) : false}
                            onCheckedChange={(checked) => {
                              if (checked && assignedAthleteIds.length > 0) {
                                const newSelected = new Map(selectedAthletesForInvite)
                                newSelected.set(team.id, new Set(assignedAthleteIds))
                                setSelectedAthletesForInvite(newSelected)
                              } else {
                                const newSelected = new Map(selectedAthletesForInvite)
                                newSelected.delete(team.id)
                                setSelectedAthletesForInvite(newSelected)
                              }
                            }}
                            disabled={assignedAthleteIds.length === 0}
                            className="h-4 w-4 border-2 border-[#36485c] rounded data-[state=checked]:bg-[#085bb4] data-[state=checked]:border-[#085bb4] data-[state=indeterminate]:bg-[#085bb4] data-[state=indeterminate]:border-[#085bb4] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        {isExpanded && (
                          <div className="border-t border-[#c4c6c8] bg-[#fefefe]">
                            {assignedAthleteIds.length > 0 ? (
                              <>
                                {assignedAthleteIds.map((athleteId, index) => {
                                  const athlete = initialAthletes.find(a => a.id === athleteId)
                                  if (!athlete) return null
                                  const isAthleteSelected = teamSelectedAthletes.has(athleteId)
                                  const teamStatuses = athleteStatuses[team.id] || {}
                                  const athleteStatus = teamStatuses[athleteId] || "Assigned"
                                  const isInvited = athleteStatus === "Invited"
                                  return (
                                    <div
                                      key={athleteId}
                                      className={`flex items-center justify-between py-3 px-4 hover:bg-[#f8f8f9] transition-colors ${
                                        index > 0 ? 'border-t border-[#c4c6c8]' : 'pt-4'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-[#071c31] text-sm font-bold" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.4', letterSpacing: '0px' }}>{athlete.name}</span>
                                        {isInvited ? (
                                          <span className="bg-[#dbeafe] text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'Barlow, sans-serif', borderRadius: '4px', fontSize: '11px', lineHeight: '1.2' }}>
                                            Invited
                                          </span>
                                        ) : (
                                          <span className="bg-[#e0e1e1] text-[#071c31] text-xs font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'Barlow, sans-serif', borderRadius: '4px', fontSize: '11px', lineHeight: '1.2' }}>
                                            Assigned
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        {isInvited && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="bg-[#e0e1e1] text-[#071c31] text-xs font-bold px-2 py-0.5 rounded cursor-help" style={{ fontFamily: 'Barlow, sans-serif', borderRadius: '4px', fontSize: '11px', lineHeight: '1.2' }}>
                                                Invite Sent
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-black text-white border-black">
                                              <p>Already invited - this will resend</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                        <Checkbox
                                          checked={isAthleteSelected}
                                          onCheckedChange={() => toggleAthleteForInvite(team.id, athleteId)}
                                          className="h-4 w-4 border-2 border-[#36485c] rounded data-[state=checked]:bg-[#085bb4] data-[state=checked]:border-[#085bb4]"
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </>
                            ) : (
                              <div className="py-4 px-4 text-center">
                                <p className="text-[#607081] text-sm" style={{ fontFamily: 'Barlow, sans-serif' }}>
                                  No athletes assigned to this team
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Email Form */}
        <div className="w-[640px] bg-white flex flex-col flex-shrink-0">
          <div className="px-8 py-6 flex-shrink-0">
            <h2 className="text-[#071c31] text-lg font-semibold mb-2">Compose Your Invitation Email</h2>
            {(() => {
              const totalSelectedAthletes = Array.from(selectedAthletesForInvite.values()).reduce((sum, athleteSet) => sum + athleteSet.size, 0)
              return (
                <p className="text-[#607081] text-sm">
                  You are sending invites to <span className="font-bold text-[#071c31]">{totalSelectedAthletes}</span> athlete{totalSelectedAthletes !== 1 ? 's' : ''}.
                </p>
              )
            })()}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#071c31] mb-2">Subject</label>
                <Input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#071c31] mb-2">Message</label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Email message"
                  rows={12}
                  className="resize-none text-base"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Switch
                  checked={allowAcceptDecline}
                  onCheckedChange={setAllowAcceptDecline}
                />
                <label className="text-sm font-medium text-[#071c31] cursor-pointer" onClick={() => setAllowAcceptDecline(!allowAcceptDecline)}>
                  Allow Accept/Decline
                </label>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="px-8 py-6 flex items-center justify-end flex-shrink-0">
            <Button
              onClick={handleSend}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              disabled={selectedAthletesForInvite.size === 0}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  if (isModalVariant) {
    return (
      <Dialog open={true} onOpenChange={(open) => {
        if (!open) {
          router.push('/')
        }
      }}>
        <DialogContent className="max-w-[1200px] w-[90vw] h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#c4c6c8] flex-shrink-0">
            <DialogTitle className="text-[#071c31] text-xl font-semibold">Invite Athletes</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f9] flex flex-col">
      {content}
    </div>
  )
}


"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, ArrowUpDown, GripVertical, ChevronDown, ChevronUp, Info, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { toast } from "sonner"
import Navigation from "@/components/navigation"

type AthleteStates = {
  assigned: number
  invited: number
  accepted: number
  declined: number
  rostered: number
}

type Athlete = {
  id: string
  name: string
  initials: string
  position: string
  birthdate: string
  status: "Assigned" | "Invited" | "Accepted" | "Rostered" | "Declined"
}

type Team = {
  id: string
  teamName: string
  season: string
  gender: string
  athletes: number
  athleteStates: AthleteStates
  ageRange: string
  sport: string
  athleteList?: Athlete[]
}

// Mock athlete data
const generateAthletes = (count: number): Athlete[] => {
  const names = [
    "Ava Miller", "Zoe Parker", "Nora Harris", "Lily Mitchell", "Mary Moore",
    "Katie Schuler", "Fran Freedman", "Jan Doe", "Emma Johnson", "Olivia Williams",
    "Sophia Brown", "Isabella Davis"
  ]
  const positions = ["Setter", "Outside Hitter", "Middle Blocker", "Libero", "Opposite"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `athlete-${i + 1}`,
    name: names[i % names.length] || `Athlete ${i + 1}`,
    initials: names[i % names.length]?.split(' ').map(n => n[0]).join('') || 'AA',
    position: positions[i % positions.length],
    birthdate: `03/${String(15 + i).padStart(2, '0')}/2010`,
    status: "Assigned" as Athlete["status"],
  }))
}

const mockTeams: Team[] = Array.from({ length: 14 }, (_, i) => ({
  id: `team-${i + 1}`,
  teamName: "U14 Yellow",
  season: "2025-2026",
  gender: "Female",
  athletes: 12,
  athleteStates: {
    assigned: 12,
    invited: 0,
    accepted: 0,
    declined: 0,
    rostered: 0,
  },
  ageRange: "Jan 3, 2010 - Jan 3, 2026",
  sport: "Volleyball",
  athleteList: generateAthletes(12),
}))

export default function TeamsPage() {
  const [selectedSeason, setSelectedSeason] = useState("2025-2026")
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [selectedAge, setSelectedAge] = useState<string>("")
  const [selectedSport, setSelectedSport] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [notificationDismissed, setNotificationDismissed] = useState(false)
  const [notificationSentAt, setNotificationSentAt] = useState<Date | null>(null)

  const handleTeamSelect = (teamId: string) => {
    const newSelected = new Set(selectedTeams)
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId)
    } else {
      newSelected.add(teamId)
    }
    setSelectedTeams(newSelected)
  }

  // Filter teams based on selected filters
  const filteredTeams = teams.filter(team => {
    if (selectedGender && team.gender.toLowerCase() !== selectedGender.toLowerCase()) return false
    if (selectedSport && team.sport.toLowerCase() !== selectedSport.toLowerCase()) return false
    if (selectedSeason && team.season !== selectedSeason) return false
    if (searchQuery && !team.teamName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all visible teams
      setSelectedTeams(new Set(filteredTeams.map((team) => team.id)))
    } else {
      setSelectedTeams(new Set())
    }
  }

  const isAllSelected = filteredTeams.length > 0 && selectedTeams.size === filteredTeams.length && 
    filteredTeams.every(team => selectedTeams.has(team.id))

  const selectedTeamsData = teams.filter(team => selectedTeams.has(team.id))
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
  
  // Check if there are any teams
  const hasTeams = teams.length > 0

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams)
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId)
    } else {
      newExpanded.add(teamId)
    }
    setExpandedTeams(newExpanded)
  }

  const handleConfirmTeams = () => {
    setSelectedTeams(new Set())
    setNotificationSentAt(new Date())
    
    toast.custom((t) => (
      <div className="bg-[#fefefe] flex gap-4 items-stretch overflow-hidden relative rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.3),0px_0px_8px_0px_rgba(0,0,0,0.2)]">
        <div className="bg-[#548309] flex items-center p-2 rounded-bl-[4px] rounded-tl-[4px] shrink-0 self-stretch">
          <Info className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-1 flex-col gap-2 items-start min-h-0 min-w-0 py-4 relative">
          <p className="font-['Helvetica',sans-serif] leading-[15px] relative shrink-0 text-[14px] text-[#36485c] whitespace-pre-wrap" style={{ fontFamily: 'Helvetica, sans-serif', lineHeight: '15px' }}>
            Your Hudl account manager has been notified
          </p>
        </div>
        <div className="flex gap-0 items-start pr-2 py-2 relative shrink-0 self-start">
          <button
            onClick={() => toast.dismiss(t)}
            className="h-4 w-4 text-[#36485c] hover:text-[#13293f] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ), {
      position: "bottom-right",
    })
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#fefefe]">
      <Navigation activeItem="Teams" />
      
      <div className="w-full max-w-[1512px] mx-auto">
        {/* Content Container */}
        <div className="p-6">
          {/* Toolbar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[38px] font-bold text-[#13293f] leading-[46px]">
                Teams
              </h1>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-[#607081] text-white border-[#607081] hover:bg-[#607081]/90 h-[40px] px-4 rounded-[2px]"
                >
                  Assign Athletes
                </Button>
                <Button
                  variant="default"
                  className="bg-[#0273e3] text-white hover:bg-[#0273e3]/90 h-[40px] px-4 rounded-[2px]"
                >
                  Manage Teams
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-[237px] h-[40px]">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-[133px] h-[40px]">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="coed">Coed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger className="w-[133px] h-[40px]">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="u12">U12</SelectItem>
                    <SelectItem value="u13">U13</SelectItem>
                    <SelectItem value="u14">U14</SelectItem>
                    <SelectItem value="u15">U15</SelectItem>
                    <SelectItem value="u16">U16</SelectItem>
                    <SelectItem value="u17">U17</SelectItem>
                    <SelectItem value="u18">U18</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-[133px] h-[40px]">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volleyball">Volleyball</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-[256px]">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teams..."
                    className="h-[40px] pl-10 pr-10 rounded-[2px] border-[#c4c6c8] text-[#13293f] placeholder:text-[rgba(19,41,63,0.4)]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#36485c]" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#36485c] hover:text-[#13293f] flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Banner - before confirm: CTA; after confirm: notified message */}
            {hasTeams && (notificationSentAt && !notificationDismissed ? (
              <div className="mt-6 mb-1 bg-white border border-[#c4c6c8] rounded-[4px] flex items-center shadow-sm h-[40px] w-fit relative">
                <div className="bg-[#548309] rounded-l-[4px] flex items-center justify-center w-[40px] h-[40px] flex-shrink-0">
                  <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center">
                    <Info className="h-3 w-3 text-[#548309]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-0 h-full pr-10">
                  <p className="text-[#36485c] text-[15px] font-normal leading-[1.4] whitespace-nowrap" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    Your account manager was notified {notificationSentAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} to confirm your teams. They will be reaching out to you soon.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationDismissed(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-[#36485c] hover:text-[#13293f] rounded hover:bg-[#f8f8f9]"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : selectedTeams.size === 0 && !notificationDismissed && (
              <div className="mt-6 mb-1 bg-white border border-[#c4c6c8] rounded-[4px] flex items-center shadow-sm h-[40px] w-fit relative">
                <div className="bg-[#36485c] rounded-l-[4px] flex items-center justify-center w-[40px] h-[40px] flex-shrink-0">
                  <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center">
                    <Info className="h-3 w-3 text-[#36485c]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-0 h-full">
                  <p className="text-[#13293f] text-[15px] font-bold leading-[1.4] whitespace-nowrap" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    Confirm your draft teams to begin the season.
                  </p>
                  <p className="text-[#36485c] text-[15px] font-normal leading-[1.4] whitespace-nowrap" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    Select teams so your account manager can finish setup.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Selection Bar */}
          {selectedTeams.size > 0 && (
            <div className="mb-4 bg-[#0273e3] rounded-[4px] h-[48px] flex items-center justify-between px-4 relative shadow-sm">
              <p className="text-white text-[16px] font-bold leading-[1.4]" style={{ fontFamily: 'Barlow, sans-serif' }}>
                {selectedTeams.size} {selectedTeams.size === 1 ? 'Team' : 'Teams'} Selected
              </p>
              <div className="flex items-center gap-0">
                <Button
                  variant="ghost"
                  onClick={() => setDrawerOpen(true)}
                  className="text-white hover:bg-[#085bb4] h-auto px-4 py-2 flex items-center gap-2 rounded-none"
                >
                  Confirm {selectedTeams.size} {selectedTeams.size === 1 ? 'Team' : 'Teams'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="border-l border-[#085bb4] h-[48px] flex items-center justify-center min-w-[48px]">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTeams(new Set())}
                    className="text-white hover:bg-[#085bb4] h-8 w-8 p-0 rounded-none"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden bg-[#fefefe]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#85909e] bg-[#fefefe] hover:bg-[#fefefe]">
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className="h-4 w-4 rounded-[12px]"
                      />
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Team Name</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Season</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Gender</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Athletes</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Age Range</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                  <TableHead className="h-[36px] px-4 py-2 w-[209px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#071c31] leading-[1.4]">Sport</span>
                      <ArrowUpDown className="h-[10.889px] w-[9.679px] text-[#36485c]" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow
                    key={team.id}
                    className="border-b border-dashed border-[#c4c6c8] h-[48px] bg-[#fefefe] hover:bg-[#fefefe]"
                  >
                    <TableCell className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedTeams.has(team.id)}
                          onCheckedChange={() => handleTeamSelect(team.id)}
                          className="h-4 w-4 rounded-[12px]"
                        />
                        <span className="text-[14px] text-[#36485c] leading-[1.4] font-normal">{team.teamName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className="text-[14px] text-[#36485c] leading-[1.4] font-normal">{team.season}</span>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className="text-[14px] text-[#36485c] leading-[1.4] font-normal">{team.gender}</span>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-[#e0e1e1] text-[#36485c] text-[12px] font-bold px-2 py-1 h-[22px] min-w-[27px] rounded-[4px] inline-flex items-center justify-center cursor-pointer" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}>
                            {team.athletes}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-black text-white border-none px-3 py-2 rounded-[4px] text-[12px] font-normal [&>svg]:bg-black [&>svg]:fill-black"
                          side="bottom"
                          sideOffset={4}
                        >
                          <div className="space-y-0.5">
                            <div>Assigned: <span className="font-bold">{team.athleteStates.assigned}</span></div>
                            <div>Invited: <span className="font-bold">{team.athleteStates.invited}</span></div>
                            <div>Accepted: <span className="font-bold">{team.athleteStates.accepted}</span></div>
                            <div>Declined: <span className="font-bold">{team.athleteStates.declined}</span></div>
                            <div>Rostered: <span className="font-bold">{team.athleteStates.rostered}</span></div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className="text-[14px] text-[#36485c] leading-[1.4] font-normal">{team.ageRange}</span>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className="text-[14px] text-[#36485c] leading-[1.4] font-normal">{team.sport}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Confirm Teams Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="max-h-screen h-full w-[900px] max-w-[90vw] bg-[#f8f8f9] flex flex-col">
          {/* Header */}
          <div className="bg-[#fefefe] border-b border-[#c4c6c8] sticky top-0 z-[2] px-4 py-4 flex items-center justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-[16px] font-bold text-[#071c31] mb-0" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.2' }}>
                Confirm Teams
              </DrawerTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(false)}
              className="h-8 w-8 text-[#36485c] hover:bg-[#f8f8f9]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {/* Description Text */}
            <div className="mb-6">
              <p className="text-[14px] text-[#36485c] leading-[1.4]" style={{ fontFamily: 'Barlow, sans-serif' }}>
                Review your rosters, then confirm your teams. A Hudl account manager will finish setting up your teams. You can close this panel to keep working or make changes later if needed.
                <br /><br />
                If you have questions,{' '}
                <a href="#" className="text-[#085bb4] underline" style={{ textDecorationSkipInk: 'none' }}>
                  contact support
                </a>
                .
              </p>
            </div>

            {/* Team Cards */}
            <div className="space-y-2">
              {selectedTeamsData.map((team) => {
                const isExpanded = expandedTeams.has(team.id)
                return (
                  <div key={team.id} className="bg-[#fefefe] border border-[#c4c6c8] rounded-[8px] overflow-hidden">
                    {/* Team Card Header */}
                    <div 
                      className="flex items-center gap-2 h-[58px] px-4 py-4 cursor-pointer hover:bg-[#f8f8f9] transition-colors"
                      onClick={() => toggleTeamExpansion(team.id)}
                    >
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#071c31]" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.4' }}>
                            {team.teamName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#36485c]" style={{ fontFamily: 'Barlow, sans-serif', lineHeight: '1.4' }}>
                          <span className="font-normal">Assigned: {team.athleteStates.assigned}</span>
                          <span className="font-normal">Invited: {team.athleteStates.invited}</span>
                          <span className="font-normal">Accepted: {team.athleteStates.accepted}</span>
                          <span className="font-normal">Declined: {team.athleteStates.declined}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#36485c]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#36485c]" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Athletes List */}
                    {isExpanded && team.athleteList && (
                      <div className="border-t border-[#c4c6c8] p-4 space-y-2">
                        {team.athleteList.map((athlete) => {
                          const getStatusBadgeStyle = (status: Athlete["status"]) => {
                            switch (status) {
                              case "Assigned":
                                return { bg: "bg-[#e0e1e1]", text: "text-[#36485c]" }
                              case "Invited":
                                return { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" }
                              case "Accepted":
                                return { bg: "bg-[#dcfce7]", text: "text-[#166534]" }
                              case "Rostered":
                                return { bg: "bg-[#fef3c7]", text: "text-[#92400e]" }
                              case "Declined":
                                return { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" }
                              default:
                                return { bg: "bg-[#e0e1e1]", text: "text-[#36485c]" }
                            }
                          }
                          const statusStyle = getStatusBadgeStyle(athlete.status)
                          
                          return (
                            <div
                              key={athlete.id}
                              className="flex items-center gap-0 p-0 bg-[#f8f8f9] rounded"
                              style={{ height: '48px', borderRadius: '4px' }}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-3">
                                <div className="w-8 h-8 rounded-full bg-[#38434f] border border-[#fafafa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', letterSpacing: '-0.3px' }}>
                                  {athlete.initials}
                                </div>
                                <div className="flex-1 flex flex-col gap-0 justify-center min-w-0">
                                  <span className="text-[#36485c] text-sm font-bold text-left truncate" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', lineHeight: '1.4', letterSpacing: '0px' }}>
                                    {athlete.name}
                                  </span>
                                  <span className="text-[#36485c] text-xs font-medium" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '12px', lineHeight: '1.4', letterSpacing: '0px' }}>
                                    {athlete.birthdate}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 pr-3">
                                <span 
                                  className={`${statusStyle.bg} ${statusStyle.text} text-xs px-2 py-0.5 rounded font-bold`} 
                                  style={{ borderRadius: '4px', fontFamily: 'Barlow, sans-serif', fontSize: '11px', lineHeight: '1.2' }}
                                >
                                  {athlete.status}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#fefefe] border-t border-[#c4c6c8] sticky bottom-0 z-[3] px-4 py-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.25),0px_0px_4px_0px_rgba(0,0,0,0.2)] flex justify-end">
            <Button
              onClick={handleConfirmTeams}
              className="bg-[#0273e3] text-white hover:bg-[#0273e3]/90 h-[40px] px-4 rounded-[2px]"
            >
              {selectedTeams.size > 0 
                ? `Confirm ${selectedTeams.size} ${selectedTeams.size === 1 ? 'Team' : 'Teams'}`
                : 'Confirm Teams'
              }
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}


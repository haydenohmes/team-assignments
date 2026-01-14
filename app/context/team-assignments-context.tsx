"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

type TeamAssignment = {
  [teamId: string]: {
    [slotIndex: number]: string | null // athlete id
  }
}

type AthleteStatus = "Assigned" | "Invited" | "Accepted" | "Rostered" | "Declined" | null

type TeamAssignmentsContextType = {
  teamAssignments: TeamAssignment
  setTeamAssignments: React.Dispatch<React.SetStateAction<TeamAssignment>>
  athleteStatuses: { [teamId: string]: { [athleteId: string]: AthleteStatus } }
  setAthleteStatuses: React.Dispatch<React.SetStateAction<{ [teamId: string]: { [athleteId: string]: AthleteStatus } }>>
  selectedSeasons: Set<string>
  setSelectedSeasons: React.Dispatch<React.SetStateAction<Set<string>>>
  newAthletes: { [teamId: string]: Set<string> }
  setNewAthletes: React.Dispatch<React.SetStateAction<{ [teamId: string]: Set<string> }>>
}

const TeamAssignmentsContext = createContext<TeamAssignmentsContextType | undefined>(undefined)

export function TeamAssignmentsProvider({ children }: { children: ReactNode }) {
  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment>({})
  const [athleteStatuses, setAthleteStatuses] = useState<{ [teamId: string]: { [athleteId: string]: AthleteStatus } }>({})
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set(["U13-Black"]))
  const [newAthletes, setNewAthletes] = useState<{ [teamId: string]: Set<string> }>({})

  return (
    <TeamAssignmentsContext.Provider
      value={{
        teamAssignments,
        setTeamAssignments,
        athleteStatuses,
        setAthleteStatuses,
        selectedSeasons,
        setSelectedSeasons,
        newAthletes,
        setNewAthletes,
      }}
    >
      {children}
    </TeamAssignmentsContext.Provider>
  )
}

export function useTeamAssignments() {
  const context = useContext(TeamAssignmentsContext)
  if (context === undefined) {
    throw new Error('useTeamAssignments must be used within a TeamAssignmentsProvider')
  }
  return context
}


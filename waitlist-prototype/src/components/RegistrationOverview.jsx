import React, { useState, useEffect, useRef } from 'react';
import PageHeader from './PageHeader';
import DataWidget from './DataWidget';
import TableToolbar from './TableToolbar';
import RegistrantsTable from './RegistrantsTable';
import Toast from './Toast';
import UniformButton from './UniformButton';
import { IconDismiss, IconCopy, IconInformation } from './UniformIcons';

/**
 * RegistrationOverview Component - Individual registration detail page
 * Reuses program overview components without tab bar
 */
const RegistrationOverview = ({ 
  registration,
  onBack = () => {},
  onRegistrantClick = () => {},
  onRegistrantClickFromHere = () => {},
  onToggleChange = () => {},
  breadcrumbText = "Programs",
  widgets = [],
  registrants = [],
  widgetData = null
}) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  
  // Waitlist state
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [invitedAthletes, setInvitedAthletes] = useState(new Set());
  const [inviteStatusMap, setInviteStatusMap] = useState({}); // 'invited' | 'expired' | 'declined' per index
  const [removedAthletes, setRemovedAthletes] = useState(new Set());
  const [waitlistSearchQuery, setWaitlistSearchQuery] = useState('');
  const [isClosingWaitlist, setIsClosingWaitlist] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showAthleteDrawer, setShowAthleteDrawer] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [registrationLinks, setRegistrationLinks] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [messageHtml, setMessageHtml] = useState('');
  const messageContentEditableRef = useRef(null);
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [timeLimitValue, setTimeLimitValue] = useState('Time Limit');
  const [subjectText, setSubjectText] = useState('You\'re off the waitlist!');
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  const handleToggleChange = () => {
    const newValue = !registration.enabled;
    onToggleChange();
    // When registration is turned off, waitlist goes off too
    if (!newValue) setWaitlistOpen(false);
    setToastMessage(`${registration.title} registration ${newValue ? 'opened' : 'closed'}`);
  };

  // Handler for waitlist toggle
  const handleWaitlistToggle = () => {
    const newValue = !waitlistOpen;
    setWaitlistOpen(newValue);
    setToastMessage(newValue ? 'Waitlists opened' : 'Waitlists closed');
  };

  // Cycle status: Waitlist → Invited → Expired → Declined → Waitlist (any athlete can be changed anytime)
  const cycleInviteStatus = (index) => {
    if (removedAthletes.has(index)) return;
    if (invitedAthletes.has(index)) {
      const current = inviteStatusMap[index] || 'invited';
      if (current === 'declined') {
        // Back to Waitlist
        setInvitedAthletes(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
        setInviteStatusMap(prev => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      } else {
        const next = current === 'invited' ? 'expired' : 'declined';
        setInviteStatusMap(prev => ({ ...prev, [index]: next }));
      }
    } else {
      // Currently Waitlist: set to Invited
      setInvitedAthletes(prev => new Set(prev).add(index));
      setInviteStatusMap(prev => ({ ...prev, [index]: 'invited' }));
    }
  };

  // All waitlist athletes data
  const allWaitlistAthletesData = [
    { 
      name: 'Emma Richardson', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 1, 2025', 
      dob: 'Aug 12, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Michael Richardson', familyEmail: 'michael.richardson@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Aug 15, 2024' },
        { program: 'U17 Girls', season: '2023-2024', status: 'Completed', dateRegistered: 'Aug 10, 2023' }
      ]
    },
    { 
      name: 'Olivia Martinez', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 1, 2025', 
      dob: 'Sep 23, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jennifer Martinez', familyEmail: 'jennifer.martinez@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Aug 20, 2024' },
        { program: 'U17 Girls', season: '2023-2024', status: 'Completed', dateRegistered: 'Aug 12, 2023' }
      ]
    },
    { 
      name: 'Ava Garcia', age: 16, gender: 'Female', program: 'U17 Girls', dateAdded: 'Nov 2, 2025', 
      dob: 'Mar 15, 2008', grade: '10th Grade', graduationYear: '2027', 
      familyName: 'Robert Garcia', familyEmail: 'robert.garcia@email.com',
      registrationHistory: [
        { program: 'U17 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 1, 2024' }
      ]
    },
    { 
      name: 'Sophia Johnson', age: 15, gender: 'Female', program: 'U16 Girls', dateAdded: 'Nov 3, 2025', 
      dob: 'Jun 20, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Sarah Johnson', familyEmail: 'sarah.johnson@email.com',
      registrationHistory: [
        { program: 'U16 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 5, 2024' }
      ]
    },
    { 
      name: 'Isabella Williams', age: 14, gender: 'Female', program: 'U15 Girls', dateAdded: 'Nov 4, 2025', 
      dob: 'Dec 5, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'David Williams', familyEmail: 'david.williams@email.com',
      registrationHistory: [
        { program: 'U15 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 8, 2024' }
      ]
    },
    { 
      name: 'Mia Brown', age: 13, gender: 'Female', program: 'U14 Girls', dateAdded: 'Nov 5, 2025', 
      dob: 'Feb 10, 2010', grade: '8th Grade', graduationYear: '2029', 
      familyName: 'Lisa Brown', familyEmail: 'lisa.brown@email.com',
      registrationHistory: [
        { program: 'U14 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 10, 2024' }
      ]
    },
    { 
      name: 'Charlotte Davis', age: 12, gender: 'Female', program: 'U13 Girls', dateAdded: 'Nov 6, 2025', 
      dob: 'Apr 22, 2011', grade: '7th Grade', graduationYear: '2030', 
      familyName: 'James Davis', familyEmail: 'james.davis@email.com',
      registrationHistory: [
        { program: 'U13 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 12, 2024' }
      ]
    },
    { 
      name: 'Amelia Miller', age: 11, gender: 'Female', program: 'U12 Girls', dateAdded: 'Nov 7, 2025', 
      dob: 'Jul 8, 2012', grade: '6th Grade', graduationYear: '2031', 
      familyName: 'Patricia Miller', familyEmail: 'patricia.miller@email.com',
      registrationHistory: [
        { program: 'U12 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 15, 2024' }
      ]
    },
    { 
      name: 'Harper Wilson', age: 10, gender: 'Female', program: 'U11 Girls', dateAdded: 'Nov 8, 2025', 
      dob: 'Oct 30, 2012', grade: '5th Grade', graduationYear: '2032', 
      familyName: 'Christopher Wilson', familyEmail: 'christopher.wilson@email.com',
      registrationHistory: [
        { program: 'U11 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 18, 2024' }
      ]
    },
    { 
      name: 'Evelyn Moore', age: 9, gender: 'Female', program: 'U10 Girls', dateAdded: 'Nov 9, 2025', 
      dob: 'Jan 18, 2013', grade: '4th Grade', graduationYear: '2033', 
      familyName: 'Barbara Moore', familyEmail: 'barbara.moore@email.com',
      registrationHistory: [
        { program: 'U10 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 20, 2024' }
      ]
    },
    { 
      name: 'Abigail Taylor', age: 8, gender: 'Female', program: 'U9 Girls', dateAdded: 'Nov 10, 2025', 
      dob: 'May 3, 2014', grade: '3rd Grade', graduationYear: '2034', 
      familyName: 'Daniel Taylor', familyEmail: 'daniel.taylor@email.com',
      registrationHistory: [
        { program: 'U9 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 22, 2024' }
      ]
    },
    { 
      name: 'Lily Anderson', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 11, 2025', 
      dob: 'Jan 5, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Mark Anderson', familyEmail: 'mark.anderson@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Aug 25, 2024' }
      ]
    },
    { 
      name: 'Grace Thompson', age: 16, gender: 'Female', program: 'U17 Girls', dateAdded: 'Nov 12, 2025', 
      dob: 'Feb 14, 2008', grade: '10th Grade', graduationYear: '2027', 
      familyName: 'Kevin Thompson', familyEmail: 'kevin.thompson@email.com',
      registrationHistory: [
        { program: 'U17 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 2, 2024' }
      ]
    },
    { 
      name: 'Zoe White', age: 15, gender: 'Female', program: 'U16 Girls', dateAdded: 'Nov 13, 2025', 
      dob: 'Mar 22, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Steven White', familyEmail: 'steven.white@email.com',
      registrationHistory: [
        { program: 'U16 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 6, 2024' }
      ]
    },
    { 
      name: 'Chloe Harris', age: 14, gender: 'Female', program: 'U15 Girls', dateAdded: 'Nov 14, 2025', 
      dob: 'Apr 8, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Brian Harris', familyEmail: 'brian.harris@email.com',
      registrationHistory: [
        { program: 'U15 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 9, 2024' }
      ]
    },
    { 
      name: 'Madison Clark', age: 13, gender: 'Female', program: 'U14 Girls', dateAdded: 'Nov 15, 2025', 
      dob: 'May 17, 2010', grade: '8th Grade', graduationYear: '2029', 
      familyName: 'Jason Clark', familyEmail: 'jason.clark@email.com',
      registrationHistory: [
        { program: 'U14 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 11, 2024' }
      ]
    },
    { 
      name: 'Riley Lewis', age: 12, gender: 'Female', program: 'U13 Girls', dateAdded: 'Nov 16, 2025', 
      dob: 'Jun 3, 2011', grade: '7th Grade', graduationYear: '2030', 
      familyName: 'Eric Lewis', familyEmail: 'eric.lewis@email.com',
      registrationHistory: [
        { program: 'U13 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 13, 2024' }
      ]
    },
    { 
      name: 'Avery Walker', age: 11, gender: 'Female', program: 'U12 Girls', dateAdded: 'Nov 17, 2025', 
      dob: 'Jul 19, 2012', grade: '6th Grade', graduationYear: '2031', 
      familyName: 'Thomas Walker', familyEmail: 'thomas.walker@email.com',
      registrationHistory: [
        { program: 'U12 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 16, 2024' }
      ]
    },
    { 
      name: 'Sofia Hall', age: 10, gender: 'Female', program: 'U11 Girls', dateAdded: 'Nov 18, 2025', 
      dob: 'Aug 25, 2012', grade: '5th Grade', graduationYear: '2032', 
      familyName: 'Ryan Hall', familyEmail: 'ryan.hall@email.com',
      registrationHistory: [
        { program: 'U11 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 19, 2024' }
      ]
    },
    { 
      name: 'Aria Young', age: 9, gender: 'Female', program: 'U10 Girls', dateAdded: 'Nov 19, 2025', 
      dob: 'Sep 12, 2013', grade: '4th Grade', graduationYear: '2033', 
      familyName: 'Nicholas Young', familyEmail: 'nicholas.young@email.com',
      registrationHistory: [
        { program: 'U10 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 21, 2024' }
      ]
    },
    { 
      name: 'Scarlett King', age: 8, gender: 'Female', program: 'U9 Girls', dateAdded: 'Nov 20, 2025', 
      dob: 'Oct 7, 2014', grade: '3rd Grade', graduationYear: '2034', 
      familyName: 'Jonathan King', familyEmail: 'jonathan.king@email.com',
      registrationHistory: [
        { program: 'U9 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 23, 2024' }
      ]
    },
    { 
      name: 'Victoria Scott', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 21, 2025', 
      dob: 'Nov 15, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Matthew Scott', familyEmail: 'matthew.scott@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Aug 28, 2024' }
      ]
    },
    { 
      name: 'Natalie Green', age: 16, gender: 'Female', program: 'U17 Girls', dateAdded: 'Nov 22, 2025', 
      dob: 'Dec 1, 2008', grade: '10th Grade', graduationYear: '2027', 
      familyName: 'Andrew Green', familyEmail: 'andrew.green@email.com',
      registrationHistory: [
        { program: 'U17 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 3, 2024' }
      ]
    },
    { 
      name: 'Hannah Adams', age: 15, gender: 'Female', program: 'U16 Girls', dateAdded: 'Nov 23, 2025', 
      dob: 'Jan 10, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Joshua Adams', familyEmail: 'joshua.adams@email.com',
      registrationHistory: [
        { program: 'U16 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 7, 2024' }
      ]
    },
    { 
      name: 'Addison Baker', age: 14, gender: 'Female', program: 'U15 Girls', dateAdded: 'Nov 24, 2025', 
      dob: 'Feb 20, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Justin Baker', familyEmail: 'justin.baker@email.com',
      registrationHistory: [
        { program: 'U15 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 10, 2024' }
      ]
    },
    { 
      name: 'Eleanor Nelson', age: 13, gender: 'Female', program: 'U14 Girls', dateAdded: 'Nov 25, 2025', 
      dob: 'Mar 5, 2010', grade: '8th Grade', graduationYear: '2029', 
      familyName: 'Brandon Nelson', familyEmail: 'brandon.nelson@email.com',
      registrationHistory: [
        { program: 'U14 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 12, 2024' }
      ]
    },
    { 
      name: 'Luna Carter', age: 12, gender: 'Female', program: 'U13 Girls', dateAdded: 'Nov 26, 2025', 
      dob: 'Apr 12, 2011', grade: '7th Grade', graduationYear: '2030', 
      familyName: 'Tyler Carter', familyEmail: 'tyler.carter@email.com',
      registrationHistory: [
        { program: 'U13 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 14, 2024' }
      ]
    },
    { 
      name: 'Penelope Mitchell', age: 11, gender: 'Female', program: 'U12 Girls', dateAdded: 'Nov 27, 2025', 
      dob: 'May 25, 2012', grade: '6th Grade', graduationYear: '2031', 
      familyName: 'Jacob Mitchell', familyEmail: 'jacob.mitchell@email.com',
      registrationHistory: [
        { program: 'U12 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 17, 2024' }
      ]
    },
    { 
      name: 'Layla Perez', age: 10, gender: 'Female', program: 'U11 Girls', dateAdded: 'Nov 28, 2025', 
      dob: 'Jun 8, 2012', grade: '5th Grade', graduationYear: '2032', 
      familyName: 'Noah Perez', familyEmail: 'noah.perez@email.com',
      registrationHistory: [
        { program: 'U11 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 20, 2024' }
      ]
    },
    { 
      name: 'Nora Roberts', age: 9, gender: 'Female', program: 'U10 Girls', dateAdded: 'Nov 29, 2025', 
      dob: 'Jul 22, 2013', grade: '4th Grade', graduationYear: '2033', 
      familyName: 'Ethan Roberts', familyEmail: 'ethan.roberts@email.com',
      registrationHistory: [
        { program: 'U10 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 22, 2024' }
      ]
    },
    { 
      name: 'Stella Turner', age: 8, gender: 'Female', program: 'U9 Girls', dateAdded: 'Nov 30, 2025', 
      dob: 'Aug 15, 2014', grade: '3rd Grade', graduationYear: '2034', 
      familyName: 'Alexander Turner', familyEmail: 'alexander.turner@email.com',
      registrationHistory: [
        { program: 'U9 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 24, 2024' }
      ]
    },
    { 
      name: 'Aurora Phillips', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 1, 2025', 
      dob: 'Sep 30, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Benjamin Phillips', familyEmail: 'benjamin.phillips@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Aug 30, 2024' }
      ]
    },
    { 
      name: 'Zoe Bennett', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 11, 2025', 
      dob: 'Oct 10, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Christopher Bennett', familyEmail: 'christopher.bennett@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 1, 2024' }
      ]
    },
    { 
      name: 'Ruby Wood', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 12, 2025', 
      dob: 'Nov 5, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Anthony Wood', familyEmail: 'anthony.wood@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 2, 2024' }
      ]
    },
    { 
      name: 'Violet Barnes', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 13, 2025', 
      dob: 'Dec 12, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Kevin Barnes', familyEmail: 'kevin.barnes@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 3, 2024' }
      ]
    },
    { 
      name: 'Ivy Ross', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 14, 2025', 
      dob: 'Jan 20, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Brian Ross', familyEmail: 'brian.ross@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 4, 2024' }
      ]
    },
    { 
      name: 'Jade Henderson', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 15, 2025', 
      dob: 'Feb 15, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'George Henderson', familyEmail: 'george.henderson@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 5, 2024' }
      ]
    },
    { 
      name: 'Rose Coleman', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 16, 2025', 
      dob: 'Mar 22, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Edward Coleman', familyEmail: 'edward.coleman@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 6, 2024' }
      ]
    },
    { 
      name: 'Daisy Jenkins', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 17, 2025', 
      dob: 'Apr 8, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Ronald Jenkins', familyEmail: 'ronald.jenkins@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 7, 2024' }
      ]
    },
    { 
      name: 'Lily Perry', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 18, 2025', 
      dob: 'May 18, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Timothy Perry', familyEmail: 'timothy.perry@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 8, 2024' }
      ]
    },
    { 
      name: 'Iris Powell', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 19, 2025', 
      dob: 'Jun 25, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jason Powell', familyEmail: 'jason.powell@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 9, 2024' }
      ]
    },
    { 
      name: 'Marigold Long', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 20, 2025', 
      dob: 'Jul 12, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jeffrey Long', familyEmail: 'jeffrey.long@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 10, 2024' }
      ]
    },
    { 
      name: 'Poppy Patterson', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 21, 2025', 
      dob: 'Aug 28, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Ryan Patterson', familyEmail: 'ryan.patterson@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 11, 2024' }
      ]
    },
    { 
      name: 'Sunflower Hughes', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 22, 2025', 
      dob: 'Sep 15, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jacob Hughes', familyEmail: 'jacob.hughes@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 12, 2024' }
      ]
    },
    { 
      name: 'Tulip Flores', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 23, 2025', 
      dob: 'Oct 22, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Gary Flores', familyEmail: 'gary.flores@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 13, 2024' }
      ]
    },
    { 
      name: 'Dahlia Washington', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 24, 2025', 
      dob: 'Nov 8, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Nicholas Washington', familyEmail: 'nicholas.washington@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 14, 2024' }
      ]
    },
    { 
      name: 'Orchid Butler', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 25, 2025', 
      dob: 'Dec 18, 2008', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Eric Butler', familyEmail: 'eric.butler@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 15, 2024' }
      ]
    },
    { 
      name: 'Peony Simmons', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 26, 2025', 
      dob: 'Jan 3, 2009', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Stephen Simmons', familyEmail: 'stephen.simmons@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 16, 2024' }
      ]
    },
    { 
      name: 'Lavender Foster', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 27, 2025', 
      dob: 'Feb 14, 2009', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Andrew Foster', familyEmail: 'andrew.foster@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 17, 2024' }
      ]
    },
    { 
      name: 'Jasmine Gonzales', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 28, 2025', 
      dob: 'Mar 25, 2009', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Raymond Gonzales', familyEmail: 'raymond.gonzales@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 18, 2024' }
      ]
    },
    { 
      name: 'Magnolia Bryant', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 29, 2025', 
      dob: 'Apr 10, 2009', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Patrick Bryant', familyEmail: 'patrick.bryant@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 19, 2024' }
      ]
    },
    { 
      name: 'Azalea Alexander', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Dec 30, 2025', 
      dob: 'May 28, 2009', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jack Alexander', familyEmail: 'jack.alexander@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 20, 2024' }
      ]
    },
    { 
      name: 'Savannah Campbell', age: 16, gender: 'Female', program: 'U17 Girls', dateAdded: 'Dec 2, 2025', 
      dob: 'Oct 5, 2008', grade: '10th Grade', graduationYear: '2027', 
      familyName: 'Samuel Campbell', familyEmail: 'samuel.campbell@email.com',
      registrationHistory: [
        { program: 'U17 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 4, 2024' }
      ]
    },
    { 
      name: 'Audrey Parker', age: 15, gender: 'Female', program: 'U16 Girls', dateAdded: 'Dec 3, 2025', 
      dob: 'Nov 12, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Joseph Parker', familyEmail: 'joseph.parker@email.com',
      registrationHistory: [
        { program: 'U16 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 8, 2024' }
      ]
    },
    { 
      name: 'Brooklyn Evans', age: 14, gender: 'Female', program: 'U15 Girls', dateAdded: 'Dec 4, 2025', 
      dob: 'Dec 18, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Daniel Evans', familyEmail: 'daniel.evans@email.com',
      registrationHistory: [
        { program: 'U15 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 11, 2024' }
      ]
    },
    { 
      name: 'Bella Edwards', age: 13, gender: 'Female', program: 'U14 Girls', dateAdded: 'Dec 5, 2025', 
      dob: 'Jan 28, 2010', grade: '8th Grade', graduationYear: '2029', 
      familyName: 'William Edwards', familyEmail: 'william.edwards@email.com',
      registrationHistory: [
        { program: 'U14 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 13, 2024' }
      ]
    },
    { 
      name: 'Skylar Collins', age: 12, gender: 'Female', program: 'U13 Girls', dateAdded: 'Dec 6, 2025', 
      dob: 'Feb 25, 2011', grade: '7th Grade', graduationYear: '2030', 
      familyName: 'James Collins', familyEmail: 'james.collins@email.com',
      registrationHistory: [
        { program: 'U13 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 15, 2024' }
      ]
    },
    { 
      name: 'Lucy Stewart', age: 11, gender: 'Female', program: 'U12 Girls', dateAdded: 'Dec 7, 2025', 
      dob: 'Mar 30, 2012', grade: '6th Grade', graduationYear: '2031', 
      familyName: 'Michael Stewart', familyEmail: 'michael.stewart@email.com',
      registrationHistory: [
        { program: 'U12 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 18, 2024' }
      ]
    },
    { 
      name: 'Paisley Sanchez', age: 10, gender: 'Female', program: 'U11 Girls', dateAdded: 'Dec 8, 2025', 
      dob: 'Apr 18, 2012', grade: '5th Grade', graduationYear: '2032', 
      familyName: 'David Sanchez', familyEmail: 'david.sanchez@email.com',
      registrationHistory: [
        { program: 'U11 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 21, 2024' }
      ]
    },
    { 
      name: 'Everly Morris', age: 9, gender: 'Female', program: 'U10 Girls', dateAdded: 'Dec 9, 2025', 
      dob: 'May 28, 2013', grade: '4th Grade', graduationYear: '2033', 
      familyName: 'Richard Morris', familyEmail: 'richard.morris@email.com',
      registrationHistory: [
        { program: 'U10 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 23, 2024' }
      ]
    },
    { 
      name: 'Willow Rogers', age: 8, gender: 'Female', program: 'U9 Girls', dateAdded: 'Dec 10, 2025', 
      dob: 'Jun 14, 2014', grade: '3rd Grade', graduationYear: '2034', 
      familyName: 'Charles Rogers', familyEmail: 'charles.rogers@email.com',
      registrationHistory: [
        { program: 'U9 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Sep 25, 2024' }
      ]
    }
  ];
  
  // Filtered waitlist athletes data for this registration
  const [waitlistAthletesData, setWaitlistAthletesData] = useState(() => 
    allWaitlistAthletesData.filter(athlete => athlete.program === registration.title)
  );

  // Update waitlist data when registration changes
  useEffect(() => {
    setWaitlistAthletesData(
      allWaitlistAthletesData.filter(athlete => athlete.program === registration.title)
    );
  }, [registration.title]);

  const waitlistAthletes = waitlistAthletesData.map(a => a.name);
  
  // Filter waitlist athletes by search query
  const filterWaitlistBySearch = (athletes, query) => {
    if (!query || query.trim() === '') {
      return athletes;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const parentFirstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'James', 'Patricia', 'Christopher', 'Barbara', 'Daniel', 'Mark', 'Kevin', 'Steven', 'Brian', 'Jason', 'Eric', 'Thomas', 'Ryan', 'Nicholas', 'Jonathan', 'Matthew', 'Andrew', 'Joshua', 'Justin', 'Robert', 'John', 'Mary', 'William', 'Elizabeth', 'Richard'];
    
    return athletes.filter((athlete, index) => {
      // Check athlete name
      const athleteNameLower = athlete.name.toLowerCase();
      const athleteNameMatch = athleteNameLower.includes(lowerQuery);
      
      // Check primary contact name
      const athleteLastName = athlete.name.split(' ').pop();
      const parentFirstName = parentFirstNames[index % parentFirstNames.length];
      const parentName = `${parentFirstName} ${athleteLastName}`;
      const parentNameLower = parentName.toLowerCase();
      const parentNameMatch = parentNameLower.includes(lowerQuery);
      
      // Check primary contact email
      const parentEmail = `${parentFirstName.toLowerCase()}.${athleteLastName.toLowerCase()}@hudl.com`;
      const parentEmailMatch = parentEmail.toLowerCase().includes(lowerQuery);
      
      return athleteNameMatch || parentNameMatch || parentEmailMatch;
    });
  };
  
  // Apply search filter to waitlist athletes
  const filteredWaitlistAthletes = filterWaitlistBySearch(waitlistAthletesData, waitlistSearchQuery);
  
  // Handler to show remove modal
  const handleRemoveFromWaitlist = () => {
    setShowRemoveModal(true);
  };

  // Handler to confirm removal
  const handleConfirmRemove = () => {
    const removedCount = selectedRows.size;
    
    // Mark selected athletes as removed
    const newRemoved = new Set(removedAthletes);
    selectedRows.forEach(index => newRemoved.add(index));
    setRemovedAthletes(newRemoved);
    
    // Clear selection and close modal
    setSelectedRows(new Set());
    setShowRemoveModal(false);
    
    // Show toast message
    setToastMessage(
      removedCount === 1 
        ? 'Athlete removed from waitlist' 
        : `${removedCount} athletes removed from waitlist`
    );
  };

  // Get selected Primary Contact names with "+X more" when maxed out
  const getSelectedAthleteNames = (expanded = false) => {
    const parentFirstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'James', 'Patricia', 'Christopher', 'Barbara', 'Daniel', 'Mark', 'Kevin', 'Steven', 'Brian', 'Jason', 'Eric', 'Thomas', 'Ryan', 'Nicholas', 'Jonathan', 'Matthew', 'Andrew', 'Joshua', 'Justin', 'Robert', 'John', 'Mary', 'William', 'Elizabeth', 'Richard'];
    
    const selectedNames = Array.from(selectedRows)
      .sort((a, b) => a - b)
      .map(index => {
        const athlete = waitlistAthletesData[index];
        if (!athlete) return '';
        const athleteLastName = athlete.name.split(' ').pop();
        const parentFirstName = parentFirstNames[index % parentFirstNames.length];
        return `${parentFirstName} ${athleteLastName}`;
      })
      .filter(name => name); // Remove any undefined entries
    
    if (selectedNames.length === 0) return '';
    
    // If expanded, show all names
    if (expanded) {
      return selectedNames.join(', ');
    }
    
    // Show first 3 names, then "+X more" if there are more
    const maxVisible = 3;
    if (selectedNames.length > maxVisible) {
      const visibleNames = selectedNames.slice(0, maxVisible).join(', ');
      const remainingCount = selectedNames.length - maxVisible;
      return { text: visibleNames, moreCount: remainingCount, allNames: selectedNames };
    }
    
    return selectedNames.join(', ');
  };

  // Generate registration links for selected athletes
  const generateRegistrationLinks = () => {
    const links = Array.from(selectedRows)
      .sort((a, b) => a - b)
      .map(index => {
        const athlete = waitlistAthletesData[index];
        if (!athlete) return null;
        // Generate a unique token for each athlete (in production, this would be server-generated)
        const token = btoa(`${athlete.name}-${registration.title}-${Date.now()}-${index}`).replace(/[+/=]/g, '');
        const baseUrl = window.location.origin;
        return {
          athleteName: athlete.name,
          link: `${baseUrl}/register/${registration.title.toLowerCase().replace(/\s+/g, '-')}?token=${token}&athlete=${encodeURIComponent(athlete.name)}`
        };
      })
      .filter(link => link !== null);
    
    return links;
  };

  // Update registration links when drawer opens
  useEffect(() => {
    if (showInviteDrawer && !isClosingWaitlist && selectedRows.size > 0) {
      const links = generateRegistrationLinks();
      setRegistrationLinks(links);
      // Only pre-populate or append link when we have at least one link (guard against empty links)
      if (links.length > 0) {
        // Pre-populate message with placeholder text and registration link (formatted as HTML)
        if (!messageText.trim() && messageContentEditableRef.current) {
          const placeholderText = "Great news! You've been removed from the waitlist and are now invited to register for this program. We're excited to have you join us!";
          const linkHtml = `<a href="${links[0].link}" style="color: #0066cc; text-decoration: underline;">${links[0].link}</a>`;
          const htmlContent = `${placeholderText}<br><br>Register here: ${linkHtml}`;
          setMessageHtml(htmlContent);
          setMessageText(placeholderText + `\n\nRegister here: ${links[0].link}`);
          if (messageContentEditableRef.current) {
            messageContentEditableRef.current.innerHTML = htmlContent;
          }
        } else if (messageText && !messageText.includes(links[0].link) && messageContentEditableRef.current) {
          // If message exists but doesn't have link, add it
          const linkHtml = `<a href="${links[0].link}" style="color: #0066cc; text-decoration: underline;">${links[0].link}</a>`;
          const newHtml = messageHtml + `<br><br>Register here: ${linkHtml}`;
          setMessageHtml(newHtml);
          setMessageText(messageText + `\n\nRegister here: ${links[0].link}`);
          if (messageContentEditableRef.current) {
            messageContentEditableRef.current.innerHTML = newHtml;
          }
        }
      }
    } else if (!showInviteDrawer) {
      // Reset when drawer closes
      setRegistrationLinks([]);
      setMessageText('');
      setMessageHtml('');
      setSubjectText('You\'re off the waitlist!');
      if (messageContentEditableRef.current) {
        messageContentEditableRef.current.innerHTML = '';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInviteDrawer, isClosingWaitlist, selectedRows.size]);

  // Get registration link text for display
  const getRegistrationLinkText = () => {
    if (registrationLinks.length === 0) return '';
    if (registrationLinks.length === 1) {
      return registrationLinks[0].link;
    }
    // For multiple athletes, show all links (just the URLs)
    return registrationLinks.map(l => l.link).join('\n');
  };

  // Copy registration link to clipboard
  const handleCopyRegistrationLink = () => {
    const linkText = getRegistrationLinkText();
    if (linkText) {
      navigator.clipboard.writeText(linkText).then(() => {
        setToastMessage('Registration link copied to clipboard');
      });
    }
  };

  // Check if a registrant has overdue payments
  const isOverdue = (registrant) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
    
    return registrant.payments.some(payment => {
      if (payment.status === 'Scheduled') {
        const paymentDate = new Date(payment.date);
        return paymentDate < today;
      }
      return false;
    });
  };

  // Update registrant status to Overdue if they have past-due payments
  const updateOverdueStatuses = (registrants) => {
    return registrants.map(registrant => {
      if (isOverdue(registrant) && registrant.status === 'Current') {
        return { ...registrant, status: 'Overdue' };
      }
      return registrant;
    });
  };

  // Filter registrants by status
  const filterByStatus = (registrants, filter) => {
    if (filter === 'All') {
      return registrants;
    }

    return registrants.filter(registrant => {
      switch (filter) {
        case 'Current':
          return registrant.status === 'Current';
        case 'Overdue':
          return registrant.status === 'Overdue';
        case 'Completed':
          return registrant.status === 'Paid';
        case 'Refunded':
          // Show anyone with refunds > $0, regardless of status
          const refundAmount = parseFloat((registrant.refunded || '$0.00').replace(/[$,]/g, ''));
          return refundAmount > 0;
        case 'Canceled':
          return registrant.paymentPlanStatus === 'Canceled';
        default:
          return true;
      }
    });
  };

  // Filter registrants based on search query
  const filterBySearch = (registrants, query) => {
    if (!query || query.trim() === '') {
      return registrants;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return registrants.filter(registrant => {
      // Split athlete name into parts (first name, last name)
      const athleteParts = registrant.athlete.toLowerCase().split(' ');
      
      // Split primary contact name into parts (first name, last name)
      const contactParts = registrant.primaryContact.toLowerCase().split(' ');
      
      // Check if any part of athlete name matches
      const athleteMatch = athleteParts.some(part => part.includes(lowerQuery));
      
      // Check if any part of primary contact name matches
      const contactMatch = contactParts.some(part => part.includes(lowerQuery));
      
      return athleteMatch || contactMatch;
    });
  };

  // Apply overdue status updates first
  const registrantsWithOverdue = updateOverdueStatuses(registrants);

  // Apply status filter, then search filter
  const statusFiltered = filterByStatus(registrantsWithOverdue, filterValue);
  const filteredRegistrants = filterBySearch(statusFiltered, searchQuery);

  // Sort by registration date (newest to oldest)
  const sortedRegistrants = [...filteredRegistrants].sort((a, b) => {
    const dateA = new Date(a.registrationDate);
    const dateB = new Date(b.registrationDate);
    return dateB - dateA; // Reverse chronological order (newest first)
  });

  // Build widgets using widgetData if provided
  // Calculate completed registrants count (those with zero outstanding balance)
  const cancelledPaymentPlansCount = registrants.filter(r => r.outstanding === "$0.00").length;

  const displayWidgets = widgetData ? [
    {
      label: "Registrants",
      value: widgetData.count.toString(),
      size: "medium",
      avatar: null,
      subheader: null,
      rows: [
        { label: "Overdue", value: "0", hasButton: false, showCopyButton: false },
        { label: "Overdue Amount", value: "$0.00", hasButton: false, showCopyButton: false },
        { label: "Completed", value: cancelledPaymentPlansCount.toString(), hasButton: false, showCopyButton: false, labelTooltip: "Number of registrants with no remaining balance" }
      ]
    },
    {
      label: "Total Registration Value",
      // Accrual accounting: Paid to Date + Outstanding - Refunded
      value: `$${(widgetData.totalPaid + widgetData.totalOutstanding - widgetData.totalRefunded).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      size: "medium",
      avatar: null,
      subheader: null,
      labelTooltip: "Sum of paid to date and outstanding less refunds",
      rows: [
        { label: "Paid to Date", value: `$${widgetData.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, hasButton: false, showCopyButton: false },
        { label: "Outstanding", value: `$${widgetData.totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, hasButton: false, showCopyButton: false },
        { label: "Refunded", value: widgetData.totalRefunded > 0 ? `($${widgetData.totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : '', hasButton: false, showCopyButton: false }
      ]
    }
  ] : widgets;

  return (
    <>
      <style>
        {`
          .registration-overview-main {
            background-color: white;
            padding: 28px 32px;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-two, 32px);
            max-width: 1600px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
          }


          .registration-overview-widgets {
            display: flex;
            gap: var(--u-space-three, 48px);
          }

          @media (max-width: 767px) {
            .registration-overview-main {
              padding: 16px;
            }

            .registration-overview-widgets {
              flex-direction: column;
              gap: var(--u-space-one-half, 24px);
            }
          }
        `}
      </style>
      <div style={{ backgroundColor: 'white', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
        <main className="registration-overview-main">
          {/* Page Header */}
          <PageHeader
            title={registration.title}
            subtitle={registration.subtitle}
            showBreadcrumbs={true}
            showTabs={true}
            tabs={['overview', 'teams', 'waitlist']}
            showWaitlistToggle={true}
            waitlistToggleLabel="Open Waitlist"
            waitlistToggleTooltip="When enabled, athletes can sign up for this program's waitlist. When disabled, the waitlist is closed and no new athletes can join."
            waitlistToggleValue={waitlistOpen}
            onWaitlistToggleChange={handleWaitlistToggle}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showToggle={true}
            showShare={false}
            showMore={false}
            breadcrumbText={breadcrumbText}
            toggleLabel="Open Registration"
            toggleTooltip="Open/Close this registration"
            toggleValue={registration.enabled}
            onToggleChange={handleToggleChange}
            onMore={() => console.log('More clicked')}
            onBack={onBack}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Data Widgets */}
              <div className="registration-overview-widgets">
                {displayWidgets.map((widget, index) => (
                  <DataWidget
                    key={index}
                    label={widget.label}
                    value={widget.value}
                    size={widget.size}
                    avatar={widget.avatar}
                    subheader={widget.subheader}
                    rows={widget.rows}
                    labelTooltip={widget.labelTooltip}
                  />
                ))}
              </div>

              {/* Registrants Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-half, 8px)' }}>
                <TableToolbar
                  title="Registrants"
                  filterValue={filterValue}
                  onFilterChange={setFilterValue}
                  onSearch={(value) => setSearchQuery(value)}
                  onDownload={() => console.log('Download clicked')}
                />
                <RegistrantsTable
                  registrants={sortedRegistrants}
                  onRegistrantClick={onRegistrantClickFromHere || onRegistrantClick}
                  hideRegistrationColumn={true}
                />
              </div>
            </>
          )}

          {activeTab === 'teams' && (
            <>
              {registration.invitedTeams && registration.invitedTeams.length > 0 ? (
                <>
                  <style>
                    {`
                      .teams-table-container {
                        width: 100%;
                        background-color: var(--u-color-background-container, #fefefe);
                        overflow-x: auto;
                        overflow-y: visible;
                      }
                      
                      .teams-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-family: var(--u-font-body);
                      }

                      .teams-table th:nth-child(1),
                      .teams-table td:nth-child(1) {
                        width: auto;
                      }

                      .teams-table th:nth-child(2),
                      .teams-table td:nth-child(2) {
                        width: 12%;
                      }
                      
                      .teams-table thead tr {
                        background-color: transparent !important;
                      }
                      
                      .teams-table thead tr:hover {
                        background-color: transparent !important;
                      }
                      
                      .teams-table th {
                        padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
                        text-align: left;
                        font-weight: var(--u-font-weight-bold, 700);
                        font-size: var(--u-font-size-small, 14px);
                        color: var(--u-color-base-foreground, #36485c);
                        letter-spacing: var(--u-letter-spacing-default, 0px);
                        line-height: 1.4;
                        white-space: nowrap;
                        background-color: transparent;
                        border-bottom: 1px solid #36485C !important;
                      }
                      
                      .teams-table tbody tr {
                        height: 48px;
                      }
                      
                      .teams-table tbody tr:not(:last-child) {
                        border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8) !important;
                      }
                      
                      .teams-table tbody tr:hover {
                        background-color: transparent;
                        cursor: default;
                      }
                      
                      .teams-table tbody td {
                        padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
                        font-family: var(--u-font-body);
                        font-weight: var(--u-font-weight-medium, 500);
                        font-size: var(--u-font-size-small, 14px);
                        color: var(--u-color-base-foreground-contrast, #071c31);
                        letter-spacing: var(--u-letter-spacing-default, 0px);
                        line-height: 1.4;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      }
                      
                      .teams-table tbody td.team-name {
                        font-weight: var(--u-font-weight-bold, 700);
                      }
                      
                      .teams-table th.align-right,
                      .teams-table td.align-right {
                        text-align: right;
                      }
                    `}
                  </style>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-half, 8px)' }}>
                    <TableToolbar
                      title=""
                      showFilter={false}
                      showSearch={true}
                      onSearch={() => {}}
                      actionButton={
                        <UniformButton
                          buttonStyle="standard"
                          buttonType="primary"
                          size="medium"
                          onClick={() => console.log('Manage teams clicked')}
                        >
                          Manage Teams
                        </UniformButton>
                      }
                    />
                    
                    <div className="teams-table-container">
                      <table className="teams-table">
                        <thead>
                          <tr>
                            <th>Team Name</th>
                            <th className="align-right">Rostered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registration.invitedTeams.map((team, index) => {
                            // Calculate number of athletes assigned to this team
                            const teamAthletes = registrants ? registrants.filter(r => r.team === team).length : 0;
                            const teamCapacity = 16;
                            
                            return (
                              <tr key={index}>
                                <td className="team-name">{team}</td>
                                <td className="align-right">{teamAthletes}/{teamCapacity}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--u-space-four, 64px) var(--u-space-two, 32px)',
                  textAlign: 'center',
                  color: 'var(--u-color-base-foreground, #36485c)',
                  minHeight: '400px'
                }}>
                  <h3 style={{ 
                    fontFamily: 'var(--u-font-body)',
                    fontSize: 'var(--u-font-size-xlarge, 20px)',
                    fontWeight: 'var(--u-font-weight-semibold, 600)',
                    marginBottom: 'var(--u-space-half, 8px)',
                    color: 'var(--u-color-base-foreground-contrast, #071c31)'
                  }}>
                    No Teams Linked Yet
                  </h3>
                  <p style={{ 
                    fontFamily: 'var(--u-font-body)',
                    fontSize: 'var(--u-font-size-medium, 16px)',
                    lineHeight: '1.5',
                    marginBottom: 'var(--u-space-one-and-half, 24px)',
                    color: 'var(--u-color-base-foreground, #36485c)',
                    maxWidth: '480px'
                  }}>
                    Link teams to this registration to invite all their athletes at once. Athletes from linked teams will be able to register directly.
                  </p>
                  <UniformButton
                    buttonStyle="standard"
                    buttonType="primary"
                    size="medium"
                    onClick={() => console.log('Link teams clicked')}
                  >
                    Link Teams
                  </UniformButton>
                </div>
              )}
            </>
          )}

          {activeTab === 'waitlist' && (
            <div className="waitlist-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-quarter, 4px)' }}>
              {/* Waitlist summary - two equal widgets: Waitlist (count) and Waitlist Value (dollar) */}
              <div className="registration-overview-widgets waitlist-widget-wrapper" style={{ marginBottom: 0 }}>
                <DataWidget
                  label="Waitlist Registrants"
                  value={waitlistOpen ? waitlistAthletesData.length.toString() : '0'}
                  size="medium"
                  avatar={null}
                  subheader={null}
                  labelTooltip="Number of athletes on the waitlist for this registration"
                  rows={[]}
                />
                <DataWidget
                  label="Waitlist Value"
                  value={waitlistOpen ? `$${(waitlistAthletesData.length * 385).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                  size="medium"
                  avatar={null}
                  subheader={null}
                  labelTooltip="Potential revenue from waitlist athletes"
                  rows={[]}
                />
              </div>
              <style>
                {`
                  .waitlist-widget-wrapper {
                    width: 100%;
                    justify-content: space-between;
                  }

                  .waitlist-widget-wrapper .data-widget {
                    flex: 1;
                    min-width: 0;
                  }

                  .waitlist-section {
                    --waitlist-right: var(--u-space-one, 16px);
                  }

                  .waitlist-action-bar {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    position: relative;
                    min-height: 40px;
                    padding-left: var(--u-space-one, 16px);
                    padding-right: var(--waitlist-right);
                    box-sizing: border-box;
                  }

                  .waitlist-closed-banner {
                    display: flex;
                    align-items: stretch;
                    width: 100%;
                    background-color: #ffffff;
                    border-radius: var(--u-border-radius-small, 4px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                  }

                  .waitlist-title-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    gap: var(--u-space-one, 16px);
                    padding-left: var(--u-space-one, 16px);
                    padding-right: var(--waitlist-right);
                    padding-bottom: var(--u-space-quarter, 4px);
                  }

                  .waitlist-title-row .table-toolbar {
                    flex: 0 0 197px;
                    min-width: 0;
                  }

                  .waitlist-closed-banner-icon-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #36485c;
                    padding: var(--u-space-three-quarter, 12px);
                    min-width: 48px;
                    min-height: 32px;
                  }

                  .waitlist-closed-banner-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    background-color: #ffffff;
                    border-radius: 50%;
                    color: #36485c;
                    font-family: var(--u-font-body);
                    font-size: 12px;
                    font-weight: var(--u-font-weight-bold, 700);
                    line-height: 1;
                  }

                  .waitlist-closed-banner-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    padding: var(--u-space-three-quarter, 12px);
                    background-color: #ffffff;
                    min-height: 32px;
                  }

                  .waitlist-closed-banner-text {
                    font-family: var(--u-font-body);
                    font-size: var(--u-font-size-small, 14px);
                    font-weight: var(--u-font-weight-medium, 500);
                    color: var(--u-color-base-foreground-contrast, #071c31);
                    line-height: 1.4;
                    flex: 1;
                  }

                  .waitlist-closed-banner-dismiss {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--u-space-three-quarter, 12px);
                    background-color: #ffffff;
                    border: none;
                    cursor: pointer;
                    color: var(--u-color-base-foreground, #36485c);
                    transition: background-color 0.2s ease;
                    min-height: 32px;
                  }

                  .waitlist-closed-banner-dismiss:hover {
                    background-color: var(--u-color-background-subtle, #f5f6f7);
                  }

                  .waitlist-closed-banner-dismiss svg {
                    width: 16px;
                    height: 16px;
                  }

                  .waitlist-table-container {
                    width: 100%;
                    background-color: var(--u-color-background-container, #fefefe);
                    border-radius: var(--u-border-radius-small, 4px);
                    overflow-x: auto;
                    overflow-y: visible;
                  }

                  .waitlist-table {
                    width: 100%;
                    min-width: 800px;
                    border-collapse: collapse;
                    font-family: var(--u-font-body);
                  }

                  .waitlist-table thead tr {
                    background-color: transparent !important;
                  }

                  .waitlist-table thead tr:hover {
                    background-color: transparent !important;
                  }

                  .waitlist-table th {
                    padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
                    text-align: left;
                    font-weight: var(--u-font-weight-bold, 700);
                    font-size: var(--u-font-size-small, 14px);
                    color: var(--u-color-base-foreground, #36485c);
                    letter-spacing: var(--u-letter-spacing-default, 0px);
                    line-height: 1.4;
                    white-space: nowrap;
                    background-color: transparent;
                    vertical-align: middle;
                    border-bottom: 1px solid #36485C !important;
                  }

                  .waitlist-table tbody tr {
                    position: relative;
                    z-index: 1;
                    height: 48px;
                    cursor: pointer;
                  }

                  .waitlist-table tbody tr:hover {
                    background-color: var(--u-color-background-subtle, #f5f6f7);
                    z-index: 10;
                  }

                  .waitlist-table-container.waitlist-closed .waitlist-table tbody tr:hover {
                    background-color: transparent;
                  }

                  .waitlist-table td {
                    padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
                    font-weight: var(--u-font-weight-medium, 500);
                    font-size: var(--u-font-size-small, 14px);
                    color: var(--u-color-base-foreground-contrast, #071c31);
                    letter-spacing: var(--u-letter-spacing-default, 0px);
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 0;
                    vertical-align: middle;
                  }

                  .waitlist-table td.waitlist-athlete-name {
                    color: var(--u-color-base-foreground-contrast, #071c31) !important;
                    transition: background-color 0.2s ease;
                  }

                  .waitlist-table td.waitlist-athlete-name:hover {
                    background-color: var(--u-color-background-subtle, #f5f6f7);
                  }

                  .waitlist-registration-link {
                    color: var(--u-color-emphasis-background-contrast, #0273e3);
                    text-decoration: underline;
                    cursor: default;
                  }

                  .waitlist-primary-contact-cell {
                    position: relative;
                    overflow: visible;
                  }

                  .waitlist-primary-contact-cell > div:hover .primary-contact-tooltip {
                    visibility: visible;
                    opacity: 1;
                  }

                  .primary-contact-tooltip {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: 8px;
                    padding: 8px 12px;
                    background-color: #000000;
                    color: #ffffff;
                    font-family: var(--u-font-body);
                    font-size: var(--u-font-size-micro, 12px);
                    font-weight: var(--u-font-weight-medium, 500);
                    line-height: 1.4;
                    border-radius: var(--u-border-radius-small, 2px);
                    white-space: nowrap;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    z-index: 10001;
                    pointer-events: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                  }

                  .primary-contact-tooltip::after {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 4px solid transparent;
                    border-bottom-color: #000000;
                  }

                  .waitlist-status-pill {
                    display: inline-block;
                    padding: 4px 12px;
                    background-color: var(--u-color-base-background, #e0e1e1);
                    color: var(--u-color-base-foreground, #36485c);
                    border-radius: var(--u-border-radius-medium, 4px);
                    font-weight: var(--u-font-weight-bold, 700);
                    font-size: var(--u-font-size-micro, 12px);
                    line-height: 1.4;
                    margin: 0;
                  }

                  .waitlist-status-pill.invited {
                    background-color: #FDF0D6;
                    color: #6F3900;
                  }

                  .waitlist-status-pill.expired {
                    background-color: #ebe3d8;
                    color: #5c4d3a;
                  }

                  .waitlist-status-pill.declined {
                    background-color: #FFE5E5;
                    color: #BB1700;
                  }

                  .waitlist-status-pill.removed {
                    background-color: #FFE5E5;
                    color: #DC3545;
                  }

                  .waitlist-status-pill-clickable {
                    cursor: pointer;
                    border: none;
                    font-family: var(--u-font-body);
                    font-weight: var(--u-font-weight-bold, 700);
                    font-size: var(--u-font-size-micro, 12px);
                    line-height: 1.4;
                    padding: 4px 12px;
                    margin: 0;
                    display: inline-block;
                    border-radius: var(--u-border-radius-medium, 4px);
                  }

                  .waitlist-status-pill-clickable:hover {
                    opacity: 0.9;
                  }

                  .waitlist-checkbox {
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                    accent-color: var(--u-color-emphasis-background-contrast, #0273e3);
                    vertical-align: middle;
                    margin: 0;
                  }

                  .waitlist-bulk-action-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0;
                    min-height: 40px;
                    height: 40px;
                    width: 100%;
                    background-color: var(--u-color-emphasis-background-contrast, #0273e3);
                    color: var(--u-color-emphasis-foreground-contrast, #ffffff);
                    border-radius: var(--u-border-radius-large, 4px);
                    margin-bottom: 0;
                  }

                  .waitlist-bulk-action-bar-left {
                    display: flex;
                    align-items: center;
                    padding-left: var(--u-space-one, 16px);
                    height: 40px;
                  }

                  .waitlist-bulk-action-count {
                    font-family: var(--u-font-body);
                    font-weight: var(--u-font-weight-bold, 700);
                    font-size: var(--u-font-size-default, 16px);
                    line-height: 1.4;
                    color: var(--u-color-emphasis-foreground-contrast, #ffffff);
                    letter-spacing: var(--u-letter-spacing-default, 0px);
                  }

                  .waitlist-bulk-action-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--u-space-half, 8px);
                    height: 40px;
                  }

                  .waitlist-bulk-action-button-override {
                    background-color: transparent !important;
                    color: var(--u-color-emphasis-foreground-contrast, #ffffff) !important;
                    border: none !important;
                  }

                  .waitlist-bulk-action-button-override:hover,
                  .waitlist-bulk-action-button-override:hover:not(:disabled),
                  .uniform-button-ghost.waitlist-bulk-action-button-override:hover:not(:disabled) {
                    background-color: var(--u-color-emphasis-background-contrast-hover, #085bb4) !important;
                  }


                  .waitlist-bulk-action-dismiss {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 40px;
                    min-height: 40px;
                    padding: 0 var(--u-space-three-quarter, 12px);
                    background: transparent;
                    border: none;
                    border-left: 1px solid var(--u-color-emphasis-background-contrast-hover, #085bb4);
                    cursor: pointer;
                    color: var(--u-color-emphasis-foreground-contrast, #ffffff);
                    transition: background-color 0.2s ease;
                  }

                  .waitlist-bulk-action-dismiss:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                  }

                  .waitlist-bulk-action-dismiss:active {
                    background-color: rgba(255, 255, 255, 0.2);
                  }
                `}
              </style>
              <div className="waitlist-action-bar">
                {!waitlistOpen && selectedRows.size === 0 && (
                  <div className="waitlist-closed-banner">
                    <div className="waitlist-closed-banner-icon-section">
                      <div className="waitlist-closed-banner-icon">i</div>
                    </div>
                    <div className="waitlist-closed-banner-content">
                      <span className="waitlist-closed-banner-text">
                        Waitlist is closed to new entries. You can still manage existing athletes below.
                      </span>
                    </div>
                    <button 
                      className="waitlist-closed-banner-dismiss"
                      onClick={() => {}}
                      aria-label="Dismiss banner"
                    >
                      <IconDismiss />
                    </button>
                  </div>
                )}
                {selectedRows.size > 0 && (
                  <div className="waitlist-bulk-action-bar">
                    <div className="waitlist-bulk-action-bar-left">
                      <span className="waitlist-bulk-action-count">
                        {selectedRows.size} {selectedRows.size === 1 ? 'Athlete' : 'Athletes'} Selected
                      </span>
                    </div>
                    <div className="waitlist-bulk-action-actions">
                      <UniformButton
                        buttonStyle="ghost"
                        buttonType="primary"
                        size="medium"
                        className="waitlist-bulk-action-button-override"
                        onClick={handleRemoveFromWaitlist}
                      >
                        Remove From Waitlist
                      </UniformButton>
                      <UniformButton
                        buttonStyle="ghost"
                        buttonType="primary"
                        size="medium"
                        className="waitlist-bulk-action-button-override"
                        onClick={() => {
                          setIsClosingWaitlist(false);
                          setShowInviteDrawer(true);
                        }}
                      >
                        {selectedRows.size === 1 ? 'Invite Athlete' : 'Invite Athletes'}
                      </UniformButton>
                      <button
                        className="waitlist-bulk-action-dismiss"
                        onClick={() => {
                          setSelectedRows(new Set());
                        }}
                        aria-label="Dismiss"
                      >
                        <IconDismiss />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="waitlist-title-row" style={{ marginTop: 'var(--u-space-one, 16px)' }}>
                <h2 className="waitlist-table-title" style={{ margin: 0, fontFamily: 'var(--u-font-body)', fontWeight: 'var(--u-font-weight-bold, 700)', fontSize: 'var(--u-font-size-default, 16px)', color: 'var(--u-color-base-foreground-contrast, #071c31)', lineHeight: 1.2 }}>
                  Waitlist Registrants
                </h2>
                <TableToolbar
                  title=""
                  showFilter={false}
                  searchPlaceholder="Search by Name"
                  onSearch={(value) => setWaitlistSearchQuery(value)}
                  showDownload={false}
                />
              </div>
              <div className={`waitlist-table-container${!waitlistOpen ? ' waitlist-closed' : ''}`}>
                <table className="waitlist-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', padding: 'var(--u-space-three-quarter, 12px) var(--u-space-quarter, 4px) var(--u-space-three-quarter, 12px) var(--u-space-one, 16px)' }}>
                        <input
                          type="checkbox"
                          className="waitlist-checkbox"
                          checked={filteredWaitlistAthletes.length > 0 && filteredWaitlistAthletes.every((athlete) => {
                            const originalIndex = waitlistAthletesData.findIndex(a => a.name === athlete.name);
                            return selectedRows.has(originalIndex);
                          })}
                          onChange={() => {
                            const allFilteredSelected = filteredWaitlistAthletes.every((athlete) => {
                              const originalIndex = waitlistAthletesData.findIndex(a => a.name === athlete.name);
                              return selectedRows.has(originalIndex);
                            });
                            
                            if (allFilteredSelected) {
                              // Deselect all filtered athletes
                              const newSelected = new Set(selectedRows);
                              filteredWaitlistAthletes.forEach((athlete) => {
                                const originalIndex = waitlistAthletesData.findIndex(a => a.name === athlete.name);
                                newSelected.delete(originalIndex);
                              });
                              setSelectedRows(newSelected);
                            } else {
                              // Select all filtered athletes
                              const newSelected = new Set(selectedRows);
                              filteredWaitlistAthletes.forEach((athlete) => {
                                const originalIndex = waitlistAthletesData.findIndex(a => a.name === athlete.name);
                                newSelected.add(originalIndex);
                              });
                              setSelectedRows(newSelected);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ paddingLeft: 'var(--u-space-quarter, 4px)' }}>Athlete Name</th>
                      <th>Age</th>
                      <th>Date of Birth</th>
                      <th>Gender</th>
                      <th>Registration</th>
                      <th>Primary Contact</th>
                      <th>Date Added</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!waitlistOpen ? null : filteredWaitlistAthletes.length > 0 ? (
                      filteredWaitlistAthletes.map((athlete, filteredIndex) => {
                        // Find the original index in waitlistAthletesData
                        const originalIndex = waitlistAthletesData.findIndex(a => a.name === athlete.name);
                        // Skip if athlete not found (shouldn't happen, but safety check)
                        if (originalIndex === -1) return null;
                        return (
                        <tr key={`${athlete.name}-${originalIndex}`}>
                          <td style={{ width: '40px', padding: 'var(--u-space-half, 8px) var(--u-space-quarter, 4px) var(--u-space-half, 8px) var(--u-space-one, 16px)' }}>
                            <input
                              type="checkbox"
                              className="waitlist-checkbox"
                              checked={selectedRows.has(originalIndex)}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newSelected = new Set(selectedRows);
                                if (newSelected.has(originalIndex)) {
                                  newSelected.delete(originalIndex);
                                } else {
                                  newSelected.add(originalIndex);
                                }
                                setSelectedRows(newSelected);
                              }}
                            />
                          </td>
                          <td 
                            className="waitlist-athlete-name"
                            style={{ 
                              fontWeight: 'var(--u-font-weight-bold, 700)', 
                              paddingLeft: 'var(--u-space-quarter, 4px)',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setSelectedAthlete(athlete);
                              setShowAthleteDrawer(true);
                            }}
                          >
                            {athlete.name}
                          </td>
                          <td>{athlete.age}</td>
                          <td>{athlete.dateOfBirth ?? (() => {
                            const year = 2025 - athlete.age;
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const month = months[originalIndex % 12];
                            const day = (originalIndex % 28) + 1;
                            return `${month} ${day}, ${year}`;
                          })()}</td>
                          <td>{athlete.gender}</td>
                          <td>
                            <span className="waitlist-registration-link">{registration.title}</span>
                          </td>
                          <td className="waitlist-primary-contact-cell" style={{ position: 'relative' }}>
                            {(() => {
                              const athleteLastName = athlete.name.split(' ').pop();
                              const parentFirstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'James', 'Patricia', 'Christopher', 'Barbara', 'Daniel', 'Mark', 'Kevin', 'Steven', 'Brian', 'Jason', 'Eric', 'Thomas', 'Ryan', 'Nicholas', 'Jonathan', 'Matthew', 'Andrew', 'Joshua', 'Justin', 'Robert', 'John', 'Mary', 'William', 'Elizabeth', 'Richard'];
                              const parentFirstName = parentFirstNames[originalIndex % parentFirstNames.length];
                              const parentName = `${parentFirstName} ${athleteLastName}`;
                              const parentEmail = `${parentFirstName.toLowerCase()}.${athleteLastName.toLowerCase()}@hudl.com`;
                              return (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <span>{parentName}</span>
                                  <div className="primary-contact-tooltip">
                                    {parentEmail}
                                  </div>
                                </div>
                              );
                            })()}
                          </td>
                          <td>{(() => {
                            const times = ['9:15 AM', '10:30 AM', '11:45 AM', '1:20 PM', '2:35 PM', '3:50 PM', '4:10 PM', '5:25 PM', '6:40 PM', '7:55 PM', '8:05 AM', '9:20 AM', '10:35 AM', '11:50 AM', '12:15 PM', '1:30 PM', '2:45 PM', '3:00 PM', '4:15 PM', '5:30 PM', '6:45 PM', '7:00 PM', '8:15 PM', '9:30 PM', '10:45 AM', '11:00 AM', '12:30 PM', '1:45 PM', '2:00 PM', '3:15 PM'];
                            const time = times[originalIndex % times.length];
                            return `${athlete.dateAdded} at ${time}`;
                          })()}</td>
                          <td>
                            {removedAthletes.has(originalIndex) ? (
                              <span className="waitlist-status-pill removed">Removed</span>
                            ) : invitedAthletes.has(originalIndex) ? (
                              (() => {
                                const subStatus = inviteStatusMap[originalIndex] || 'invited';
                                const label = subStatus === 'invited' ? 'Invited' : subStatus === 'expired' ? 'Expired' : 'Declined';
                                return (
                                  <button
                                    type="button"
                                    className={`waitlist-status-pill waitlist-status-pill-clickable ${subStatus}`}
                                    onClick={(e) => { e.stopPropagation(); cycleInviteStatus(originalIndex); }}
                                    title="Click to cycle: Invited → Expired → Declined → Waitlist"
                                  >
                                    {label}
                                  </button>
                                );
                              })()
                            ) : (
                              <button
                                type="button"
                                className="waitlist-status-pill waitlist-status-pill-clickable"
                                onClick={(e) => { e.stopPropagation(); cycleInviteStatus(originalIndex); }}
                                title="Click to cycle: Waitlist → Invited → Expired → Declined → Waitlist"
                              >
                                Waitlist
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--u-space-four, 64px)' }}>
                          {waitlistSearchQuery.trim() 
                            ? 'No athletes found matching your search.' 
                            : 'No athletes on waitlist for this registration.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      )}

      {/* Invite Drawer */}
      {showInviteDrawer && (
        <>
          <div
            className="invite-drawer-overlay"
            onClick={() => {
              setShowInviteDrawer(false);
              setIsClosingWaitlist(false);
              setShowAllRecipients(false);
            }}
          />
          <div className="invite-drawer">
            <style>
              {`
                .invite-drawer-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.2s ease;
                }

                .invite-drawer {
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 600px;
                  max-width: 90vw;
                  background-color: var(--u-color-background-container, #fefefe);
                  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                  z-index: 9999;
                  display: flex;
                  flex-direction: column;
                  animation: slideInRight 0.3s ease;
                  overflow: hidden;
                }

                @keyframes slideInRight {
                  from {
                    transform: translateX(100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }

                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }

                .invite-drawer-content {
                  flex: 1;
                  overflow-y: auto;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  gap: 0;
                }

                .invite-drawer-header {
                  position: sticky;
                  top: 0;
                  background-color: #f5f6f7;
                  z-index: 100;
                  padding: var(--u-space-one-and-half, 24px) var(--u-space-one-and-half, 24px) var(--u-space-one-and-half, 24px) var(--u-space-one-and-half, 24px);
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-half, 8px);
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .invite-drawer-header-top {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                }

                .invite-drawer-close-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                  margin-top: -4px;
                  margin-right: -4px;
                }

                .invite-drawer-close-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .invite-drawer-footer {
                  position: sticky;
                  bottom: 0;
                  background-color: #f5f6f7;
                  border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
                  z-index: 100;
                  display: flex;
                  justify-content: flex-end;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.2;
                  color: var(--u-color-base-foreground-contrast, #071c31);
                  margin: 0;
                }

                .invite-drawer-description {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-small, 14px);
                  line-height: 1.4;
                  color: var(--u-color-base-foreground, #36485c);
                  margin: 0;
                  margin-top: var(--u-space-half, 8px);
                }

                .invite-drawer-form {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.2;
                  color: var(--u-color-base-foreground-contrast, #071c31);
                  margin: 0;
                }

                .invite-drawer-description {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-small, 14px);
                  line-height: 1.4;
                  color: var(--u-color-base-foreground, #36485c);
                  margin: 0;
                  margin-top: var(--u-space-half, 8px);
                }

                .invite-drawer-form {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-field {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-quarter, 4px);
                }

                .invite-drawer-label {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1;
                  color: var(--u-color-base-foreground, #36485c);
                  display: flex;
                  gap: var(--u-space-eighth, 2px);
                  align-items: center;
                }

                .invite-drawer-label-required {
                  color: var(--u-color-alert-foreground, #bb1700);
                }

                .invite-drawer-input {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                }

                .invite-drawer-input:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }

                .invite-drawer-input[readonly],
                .invite-drawer-to-input-readonly {
                  background-color: var(--u-color-background-callout, #f8f8f9);
                  opacity: 0.8;
                  cursor: default;
                }

                .invite-drawer-to-field {
                  width: 100%;
                  box-sizing: border-box;
                  min-height: 40px;
                  padding: 0 var(--u-space-one, 16px);
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  gap: 0 0.25em;
                  background-color: var(--u-color-background-callout, #f8f8f9);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  cursor: default;
                }

                .invite-drawer-to-more-text {
                  font-family: inherit;
                  font-size: inherit;
                  font-weight: inherit;
                  color: inherit;
                  white-space: nowrap;
                }

                .invite-drawer-help-text {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-micro, 12px);
                  line-height: 1.4;
                  color: var(--u-color-content-subtle, #506277);
                  margin: 0;
                }

                .invite-drawer-textarea-wrapper {
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  display: flex;
                  flex-direction: column;
                  height: 350px;
                  background-color: var(--u-color-background-container, #fefefe);
                }

                .invite-drawer-textarea-toolbar {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
                  border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  background-color: var(--u-color-background-container, #fefefe);
                  border-radius: var(--u-border-radius-small, 2px) var(--u-border-radius-small, 2px) 0 0;
                }

                .invite-drawer-textarea-toolbar-left {
                  display: flex;
                  align-items: center;
                  gap: var(--u-space-half, 8px);
                }

                .invite-drawer-textarea-toolbar-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: var(--u-space-quarter, 4px) var(--u-space-half, 8px);
                  background-color: transparent;
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  font-family: var(--u-font-body);
                  font-size: var(--u-font-size-small, 14px);
                  font-weight: var(--u-font-weight-medium, 500);
                  color: var(--u-color-base-foreground, #36485c);
                  cursor: pointer;
                  transition: all 0.2s ease;
                }

                .invite-drawer-textarea-toolbar-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                  border-color: var(--u-color-base-foreground, #36485c);
                }

                .invite-drawer-textarea-toolbar-button:active {
                  background-color: var(--u-color-base-background, #e0e1e1);
                }

                .invite-drawer-textarea {
                  flex: 1;
                  padding: var(--u-space-one, 16px);
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.5;
                  color: #13293f;
                  border: none;
                  outline: none;
                  resize: none;
                  overflow-y: auto;
                  background-color: transparent;
                }

                .invite-drawer-textarea::placeholder {
                  font-family: var(--u-font-body);
                }

                .invite-drawer-textarea-contenteditable {
                  flex: 1;
                  padding: var(--u-space-one, 16px);
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.5;
                  color: #13293f;
                  border: none;
                  outline: none;
                  resize: none;
                  overflow-y: auto;
                  background-color: transparent;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }

                .invite-drawer-textarea-contenteditable:empty:before {
                  content: attr(data-placeholder);
                  color: #999;
                  pointer-events: none;
                }

                .invite-drawer-textarea-contenteditable a {
                  color: #0066cc;
                  text-decoration: underline;
                }

                .invite-drawer-textarea-contenteditable:focus {
                  outline: none;
                }

                .invite-drawer-select {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                  cursor: pointer;
                }

                .invite-drawer-select:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }

                .invite-drawer-copy-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  min-width: 32px;
                  padding: 0;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                }

                .invite-drawer-copy-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .invite-drawer-copy-button:active {
                  background-color: var(--u-color-base-background, #e0e1e1);
                }

                .invite-drawer-time-limit-card {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 4px);
                  padding: var(--u-space-one, 16px);
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-time-limit-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-time-limit-content {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-quarter, 4px);
                  animation: slideDown 0.2s ease;
                }

                @keyframes slideDown {
                  from {
                    opacity: 0;
                    max-height: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    max-height: 200px;
                    transform: translateY(0);
                  }
                }

                .invite-drawer-toggle-switch {
                  position: relative;
                  display: inline-block;
                  width: 44px;
                  height: 24px;
                  flex-shrink: 0;
                  margin-top: 2px;
                }

                .invite-drawer-toggle-switch input {
                  opacity: 0;
                  width: 0;
                  height: 0;
                }

                .invite-drawer-toggle-slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: var(--u-color-base-background, #e0e1e1);
                  transition: 0.3s;
                  border-radius: 24px;
                }

                .invite-drawer-toggle-slider:before {
                  position: absolute;
                  content: "";
                  height: 18px;
                  width: 18px;
                  left: 3px;
                  bottom: 3px;
                  background-color: white;
                  transition: 0.3s;
                  border-radius: 50%;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                }

                .invite-drawer-toggle-switch input:checked + .invite-drawer-toggle-slider {
                  background-color: var(--u-color-emphasis-background-contrast, #0273e3);
                }

                .invite-drawer-toggle-switch input:checked + .invite-drawer-toggle-slider:before {
                  transform: translateX(20px);
                }

                .invite-drawer-toggle-switch input:focus + .invite-drawer-toggle-slider {
                  box-shadow: 0 0 0 2px rgba(2, 115, 227, 0.2);
                }
              `}
            </style>
            <div className="invite-drawer-content">
              <div className="invite-drawer-header">
                <div className="invite-drawer-header-top">
                  <div style={{ flex: 1 }}>
                    <h2 className="invite-drawer-title">
                      {isClosingWaitlist ? 'Close Waitlists' : 'Compose Your Message'}
                    </h2>
                    <p className="invite-drawer-description">
                      {isClosingWaitlist 
                        ? 'You are about to close this program\'s waitlists. Athletes will no longer be able to sign up for this program.'
                        : 'Select athletes to send a message.'}
                    </p>
                  </div>
                  <button
                    className="invite-drawer-close-button"
                    onClick={() => {
                      setShowInviteDrawer(false);
                      setIsClosingWaitlist(false);
                    }}
                    aria-label="Close drawer"
                  >
                    <IconDismiss />
                  </button>
                </div>
              </div>

              <div className="invite-drawer-form" style={{ padding: 'var(--u-space-one-and-half, 24px)' }}>
                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">Sender</label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value="no-reply@hudl.com"
                    readOnly
                  />
                </div>

                <div className="invite-drawer-field" style={{ width: '100%', minWidth: 0 }}>
                  <label className="invite-drawer-label">
                    To <span className="invite-drawer-label-required">*</span>
                  </label>
                  <div
                    className="invite-drawer-to-field"
                    role="textbox"
                    aria-readonly="true"
                    aria-label="Recipients"
                  >
                    {(() => {
                      const result = getSelectedAthleteNames(false);
                      if (typeof result === 'string') return result;
                      return (
                        <>
                          {result.text}
                          {result.moreCount > 0 && (
                            <span className="invite-drawer-to-more-text">{` +${result.moreCount} more`}</span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Subject <span className="invite-drawer-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value={subjectText}
                    onChange={(e) => setSubjectText(e.target.value)}
                  />
                </div>

                {!isClosingWaitlist && (
                  <div className="invite-drawer-field">
                    <label className="invite-drawer-label">
                      Registration Link
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--u-space-half, 8px)', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="invite-drawer-input"
                        value={getRegistrationLinkText()}
                        readOnly
                        style={{ flex: 1 }}
                      />
                      <button
                        className="invite-drawer-copy-button"
                        onClick={handleCopyRegistrationLink}
                        aria-label="Copy registration link"
                      >
                        <IconCopy />
                      </button>
                    </div>
                    <p className="invite-drawer-help-text">
                      This link will be automatically included in your message.
                    </p>
                  </div>
                )}

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Message <span className="invite-drawer-label-required">*</span>
                  </label>
                  <div className="invite-drawer-textarea-wrapper">
                    <div
                      ref={messageContentEditableRef}
                      className="invite-drawer-textarea-contenteditable"
                      contentEditable
                      data-placeholder="Great news! You've been removed from the waitlist and are now invited to register for this program. We're excited to have you join us!"
                      onInput={(e) => {
                        const html = e.currentTarget.innerHTML;
                        const text = e.currentTarget.innerText || e.currentTarget.textContent || '';
                        setMessageHtml(html);
                        setMessageText(text);
                      }}
                      onBlur={(e) => {
                        // Ensure links stay formatted
                        const html = e.currentTarget.innerHTML;
                        // Re-format any links that lost their styling
                        const updatedHtml = html.replace(
                          /(https?:\/\/[^\s<>"']+)/g,
                          (match) => {
                            if (!match.includes('<a')) {
                              return `<a href="${match}" style="color: #0066cc; text-decoration: underline;">${match}</a>`;
                            }
                            return match;
                          }
                        );
                        if (updatedHtml !== html) {
                          setMessageHtml(updatedHtml);
                          e.currentTarget.innerHTML = updatedHtml;
                        }
                      }}
                    />
                  </div>
                </div>

                {!isClosingWaitlist && (
                  <div className="invite-drawer-time-limit-card">
                    <div className="invite-drawer-time-limit-header">
                      <div>
                        <label style={{ margin: 0, fontSize: 'var(--u-font-size-default, 16px)', lineHeight: '1.2', fontFamily: 'var(--u-font-body)', fontWeight: 'var(--u-font-weight-bold, 700)', color: 'var(--u-color-base-foreground-contrast, #071c31)' }}>
                          Time Limit <span style={{ fontFamily: 'var(--u-font-body)', fontWeight: 'var(--u-font-weight-medium, 500)', color: 'var(--u-color-base-foreground, #36485c)' }}>(Optional)</span>
                        </label>
                        <p className="invite-drawer-help-text" style={{ margin: '4px 0 0 0' }}>
                          Set a time limit for an athlete to respond to after waitlist invitation.
                        </p>
                      </div>
                      <label className="invite-drawer-toggle-switch">
                        <input
                          type="checkbox"
                          checked={timeLimitEnabled}
                          onChange={(e) => setTimeLimitEnabled(e.target.checked)}
                        />
                        <span className="invite-drawer-toggle-slider"></span>
                      </label>
                    </div>
                    {timeLimitEnabled && (
                      <div className="invite-drawer-time-limit-content">
                        <select 
                          className="invite-drawer-select"
                          value={timeLimitValue}
                          onChange={(e) => setTimeLimitValue(e.target.value)}
                        >
                          <option>Time Limit</option>
                          <option>1 day</option>
                          <option>3 days</option>
                          <option>7 days</option>
                          <option>14 days</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="invite-drawer-footer">
              <UniformButton
                buttonStyle="standard"
                buttonType="primary"
                size="medium"
                disabled={!isClosingWaitlist && (
                  selectedRows.size === 0 ||
                  !subjectText.trim() ||
                  !messageText.trim()
                )}
                onClick={() => {
                  if (isClosingWaitlist) {
                    setWaitlistOpen(false);
                    setShowInviteDrawer(false);
                    setIsClosingWaitlist(false);
                    setToastMessage('Waitlists closed');
                  } else {
                    // Capture count before clearing
                    const count = selectedRows.size;
                    // Add selected athletes to invited set with status 'invited'
                    const newInvited = new Set(invitedAthletes);
                    const newStatusMap = { ...inviteStatusMap };
                    selectedRows.forEach(index => {
                      newInvited.add(index);
                      newStatusMap[index] = 'invited';
                    });
                    setInvitedAthletes(newInvited);
                    setInviteStatusMap(newStatusMap);
                    // Automatically append registration link to message if not already included
                    let finalMessage = messageText;
                    if (registrationLinks.length > 0) {
                      // Always show just one link, regardless of how many athletes
                      const linkText = `\n\nRegister here: ${registrationLinks[0].link}`;
                      // Only append if link isn't already in the message
                      if (!finalMessage.includes(registrationLinks[0].link)) {
                        finalMessage = (finalMessage || '') + linkText;
                      }
                    }
                    // In production, you would send the email with finalMessage here
                    // Close drawer and clear selection
                    setShowInviteDrawer(false);
                    setSelectedRows(new Set());
                    setMessageText('');
                    setSubjectText('You\'re off the waitlist!');
                    setRegistrationLinks([]);
                    // Show toast
                    setToastMessage(count === 1 ? 'Invite sent' : `${count} invites sent`);
                  }
                }}
              >
                {isClosingWaitlist ? 'Close Waitlists' : 'Send'}
              </UniformButton>
            </div>
          </div>
        </>
      )}

      {/* Remove From Waitlist Modal */}
      {showRemoveModal && (
        <>
          <div
            className="remove-modal-overlay"
            onClick={() => setShowRemoveModal(false)}
          />
          <div className="remove-modal">
            <style>
              {`
                .remove-modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.2s ease;
                }

                .remove-modal {
                  position: fixed;
                  bottom: var(--u-space-two, 32px);
                  right: var(--u-space-two, 32px);
                  background-color: var(--u-color-background-popover, #fefefe);
                  border-radius: 4px;
                  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.3), 0px 0px 64px 0px rgba(0, 0, 0, 0.2);
                  padding: var(--u-space-one-and-half, 24px);
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one-and-half, 24px);
                  max-width: 400px;
                  z-index: 9999;
                  animation: slideInFromBottom 0.3s ease;
                }

                @keyframes slideInFromBottom {
                  from {
                    transform: translateY(100%);
                    opacity: 0;
                  }
                  to {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }

                .remove-modal-content {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one, 16px);
                }

                .remove-modal-text {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-small, 14px);
                  color: var(--u-color-base-foreground-contrast, #071c31);
                  line-height: 1.4;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                  margin: 0;
                }

                .remove-modal-actions {
                  display: flex;
                  gap: var(--u-space-half, 8px);
                  justify-content: flex-end;
                  width: 100%;
                }
              `}
            </style>
            <div className="remove-modal-content">
              <p className="remove-modal-text">
                Are you sure you would like to remove {selectedRows.size === 1 ? 'this athlete' : 'these athletes'} from this waitlist?
              </p>
            </div>
            <div className="remove-modal-actions">
              <UniformButton
                buttonStyle="standard"
                buttonType="subtle"
                size="medium"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </UniformButton>
              <UniformButton
                buttonStyle="standard"
                buttonType="destructive"
                size="medium"
                onClick={handleConfirmRemove}
              >
                Remove {selectedRows.size === 1 ? 'Athlete' : 'Athletes'}
              </UniformButton>
            </div>
          </div>
        </>
      )}

      {/* Athlete Details Drawer */}
      {showAthleteDrawer && selectedAthlete && (
        <>
          <div
            className="athlete-drawer-overlay"
            onClick={() => setShowAthleteDrawer(false)}
          />
          <div className="athlete-drawer">
            <style>
              {`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }

                @keyframes slideInFromRight {
                  from {
                    transform: translateX(100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }

                .athlete-drawer-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.3s ease;
                }

                .athlete-drawer {
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 100%;
                  max-width: 360px;
                  min-width: 288px;
                  background-color: var(--u-color-background-container, #fefefe);
                  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1), 0px 0px 64px 0px rgba(0, 0, 0, 0.1);
                  z-index: 9999;
                  display: flex;
                  flex-direction: column;
                  transform: translateX(100%);
                  animation: slideInFromRight 0.3s ease forwards;
                  overflow: hidden;
                }

                .athlete-drawer-header {
                  background-color: var(--u-color-background-container, #fefefe);
                  border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  padding: var(--u-space-one, 16px);
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: var(--u-space-three-quarter, 12px);
                  position: sticky;
                  top: 0;
                  z-index: 2;
                  width: 100%;
                }

                .athlete-drawer-header-left {
                  display: flex;
                  align-items: center;
                  gap: var(--u-space-quarter, 4px);
                  flex: 1;
                  min-width: 0;
                }

                .athlete-drawer-avatar {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background-color: var(--u-color-base-background-contrast, #607081);
                  color: var(--u-color-emphasis-foreground-reversed, #fefefe);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-small, 14px);
                  flex-shrink: 0;
                }

                .athlete-drawer-name {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.2;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  flex: 1;
                  min-width: 0;
                }

                .athlete-drawer-close-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                }

                .athlete-drawer-close-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .athlete-drawer-content {
                  flex: 1;
                  overflow-y: auto;
                  padding: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                }

                .athlete-drawer-section {
                  background-color: transparent;
                  border-radius: 0;
                  padding: var(--u-space-one-and-half, 24px) var(--u-space-one, 16px);
                  margin: 0;
                }

                .athlete-drawer-section-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.2;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                  margin: 0 0 var(--u-space-half, 8px) 0;
                }

                .athlete-drawer-field-row {
                  display: flex;
                  gap: 12px;
                }

                .athlete-drawer-field {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-eighth, 2px);
                }

                .athlete-drawer-field-label {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-small, 14px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.4;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                }

                .athlete-drawer-field-value {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.4;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                }

                .athlete-drawer-field-value-with-action {
                  display: flex;
                  align-items: center;
                  gap: var(--u-space-quarter, 4px);
                }

                .athlete-drawer-divider {
                  height: 0;
                  position: relative;
                  margin: var(--u-space-half, 8px) 0;
                }

                .athlete-drawer-divider::before {
                  content: '';
                  position: absolute;
                  top: -0.5px;
                  left: 0;
                  right: 0;
                  height: 1px;
                  background-color: var(--u-color-line-subtle, #c4c6c8);
                }

                .athlete-drawer-copy-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 24px;
                  height: 24px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                }

                .athlete-drawer-copy-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }
              `}
            </style>
            <div className="athlete-drawer-header">
              <div className="athlete-drawer-header-left">
                <div className="athlete-drawer-avatar">
                  {selectedAthlete.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="athlete-drawer-name">{selectedAthlete.name}</div>
              </div>
              <button
                className="athlete-drawer-close-button"
                onClick={() => setShowAthleteDrawer(false)}
                aria-label="Close drawer"
              >
                <IconDismiss />
              </button>
            </div>
            <div className="athlete-drawer-content">
              <div className="athlete-drawer-section">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-one-and-half, 24px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Personal Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      <div className="athlete-drawer-field-row">
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Gender</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.gender}</div>
                        </div>
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Date of Birth</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.dob}</div>
                        </div>
                      </div>
                      <div className="athlete-drawer-field-row">
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Grade</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.grade}</div>
                        </div>
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Graduation Year</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.graduationYear}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="athlete-drawer-divider"></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Family Members</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      <div className="athlete-drawer-field">
                        <div className="athlete-drawer-field-label">Name</div>
                        <div className="athlete-drawer-field-value">{selectedAthlete.familyName}</div>
                      </div>
                      <div className="athlete-drawer-field">
                        <div className="athlete-drawer-field-label">Email</div>
                        <div className="athlete-drawer-field-value-with-action">
                          <span>{selectedAthlete.familyEmail}</span>
                          <button
                            className="athlete-drawer-copy-button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedAthlete.familyEmail);
                              setToastMessage('Email copied to clipboard');
                            }}
                            aria-label="Copy email"
                          >
                            <IconCopy />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="athlete-drawer-divider"></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Registration History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      {selectedAthlete.registrationHistory && selectedAthlete.registrationHistory.map((reg, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 'var(--u-space-three-quarter, 12px)',
                          marginBottom: index < selectedAthlete.registrationHistory.length - 1 ? 'var(--u-space-half, 8px)' : '0'
                        }}>
                          <div className="athlete-drawer-field-row">
                            <div className="athlete-drawer-field">
                              <div className="athlete-drawer-field-label">Program</div>
                              <div className="athlete-drawer-field-value">{reg.program}</div>
                            </div>
                            <div className="athlete-drawer-field">
                              <div className="athlete-drawer-field-label">Season</div>
                              <div className="athlete-drawer-field-value">{reg.season}</div>
                            </div>
                          </div>
                          <div className="athlete-drawer-field">
                            <div className="athlete-drawer-field-label">Status</div>
                            <div className="athlete-drawer-field-value">
                              <span className="waitlist-status-pill">
                                {reg.status === 'Waitlist' ? 'Waitlist' : reg.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegistrationOverview;


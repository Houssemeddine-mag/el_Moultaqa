import { toIsoDate } from './theme';

export type Presentation = {
  id: string;
  title: string;
  time: string;
  speaker: string;
};

export type Session = {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  speaker: string;
  chairs: string[];
  presentations: Presentation[];
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  institution: string;
  bio: string;
};

export type StreamItem = {
  id: string;
  name: string;
  url: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority?: string;
  createdAt: number;
};

export type Question = {
  id: string;
  author: string;
  message: string;
  createdAt: number;
  answer?: string;
  streamId?: string;
};

export type FeedbackItem = {
  id: string;
  presenter: number;
  presentation: number;
  comment: string;
  createdAt: number;
};

export type UserProfile = {
  name: string;
  email: string;
  organization: string;
  schoolLevel: string;
  gender: string;
  birthday: string;
  country: string;
  province: string;
};

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const CONFERENCE_START = new Date(NOW + 30 * DAY);

function dayIso(offset: number) {
  return toIsoDate(new Date(CONFERENCE_START.getTime() + offset * DAY));
}

export const MOCK_CONFERENCE = {
  name: 'ElMoultaqa 2026',
  description:
    'A premium conference experience bringing together researchers, engineers and practitioners. Promoting collaboration and innovation with a focus on emerging technologies.',
  startDate: CONFERENCE_START,
  location: 'Algiers, Algeria',
  website: 'https://elmoultaqa.com',
  totalParticipants: 480,
};

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Opening Ceremony',
    date: dayIso(0),
    time: '09:00 - 10:00',
    room: 'Main Hall',
    speaker: 'Dr. Yasmine Kaci',
    chairs: ['Pr. Omar Haddad'],
    presentations: [],
  },
  {
    id: 's2',
    title: 'AI Research Track',
    date: dayIso(0),
    time: '10:30 - 12:30',
    room: 'Room A',
    speaker: '',
    chairs: ['Dr. Lina Mansouri', 'Dr. Karim Ziani'],
    presentations: [
      {
        id: 'p1',
        title: 'Large Language Models for Arabic Dialects',
        time: '10:30 - 11:15',
        speaker: 'Dr. Sara Benali',
      },
      {
        id: 'p2',
        title: 'Edge AI in Embedded Systems',
        time: '11:30 - 12:15',
        speaker: 'Pr. Mehdi Cherif',
      },
    ],
  },
  {
    id: 's3',
    title: 'Keynote: The Future of Computing',
    date: dayIso(1),
    time: '09:30 - 10:30',
    room: 'Main Hall',
    speaker: 'Pr. Nadia Boumediene',
    chairs: [],
    presentations: [],
  },
  {
    id: 's4',
    title: 'Cloud & DevOps Workshop',
    date: dayIso(1),
    time: '11:00 - 13:00',
    room: 'Room B',
    speaker: 'Eng. Riad Belkacem',
    chairs: [],
    presentations: [
      {
        id: 'p3',
        title: 'Kubernetes at Scale',
        time: '11:00 - 12:00',
        speaker: 'Eng. Riad Belkacem',
      },
      {
        id: 'p4',
        title: 'GitOps in Practice',
        time: '12:00 - 13:00',
        speaker: 'Dr. Hiba Larbi',
      },
    ],
  },
  {
    id: 's5',
    title: 'Closing & Awards',
    date: dayIso(2),
    time: '16:00 - 17:30',
    room: 'Main Hall',
    speaker: 'Dr. Yasmine Kaci',
    chairs: [],
    presentations: [],
  },
];

export const MOCK_SPEAKERS: Speaker[] = [
  {
    id: 'sp1',
    name: 'Pr. Nadia Boumediene',
    title: 'Keynote Speaker',
    institution: 'University of Algiers',
    bio: 'Pr. Nadia Boumediene is a leading researcher in distributed systems with over 20 years of experience. She has published more than 120 papers and advises several national technology programs.',
  },
  {
    id: 'sp2',
    name: 'Dr. Sara Benali',
    title: 'AI Researcher',
    institution: 'CERIST',
    bio: 'Dr. Sara Benali works on natural language processing for low-resource languages, with a focus on Arabic dialects. Her team released two open-source language models used across North Africa.',
  },
  {
    id: 'sp3',
    name: 'Pr. Mehdi Cherif',
    title: 'Professor, Embedded Systems',
    institution: 'USTHB',
    bio: 'Pr. Mehdi Cherif leads the embedded AI laboratory at USTHB. His research brings machine learning to microcontrollers and real-time industrial systems.',
  },
];

export const MOCK_STREAMS: StreamItem[] = [
  {
    id: 'st1',
    name: 'Main Hall Live',
    url: 'https://elmoultaqa.com/live/main',
  },
  {
    id: 'st2',
    name: 'Room A Live',
    url: 'https://elmoultaqa.com/live/room-a',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Welcome to ElMoultaqa 2026',
    message:
      'Registration is confirmed. Check the program tab to plan your sessions.',
    type: 'info',
    createdAt: NOW - 5 * 60 * 1000,
  },
  {
    id: 'n2',
    title: 'Keynote moved to Main Hall',
    message:
      'The opening keynote will now take place in the Main Hall at 09:30.',
    type: 'urgent',
    createdAt: NOW - 3 * 60 * 60 * 1000,
  },
  {
    id: 'n3',
    title: 'Workshop materials available',
    message: 'Slides for the Cloud & DevOps workshop are now attached.',
    type: 'info',
    createdAt: NOW - 2 * DAY,
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    author: 'Amine B.',
    message: 'Will the keynote slides be shared after the session?',
    createdAt: NOW - 42 * 60 * 1000,
    answer: 'Yes, all slides will be published in the app this evening.',
    streamId: 'st1',
  },
  {
    id: 'q2',
    author: 'Lina M.',
    message: 'Is there a Q&A mic in Room A?',
    createdAt: NOW - 12 * 60 * 1000,
    streamId: 'st1',
  },
];

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'f1',
    presenter: 5,
    presentation: 4,
    comment: 'Very clear explanations and great demos.',
    createdAt: NOW - 90 * 60 * 1000,
  },
];

export const MOCK_PROFILE: UserProfile = {
  name: 'Amine Benali',
  email: 'amine.benali@example.com',
  organization: 'University of Algiers',
  schoolLevel: 'Master',
  gender: 'Male',
  birthday: '14/3/1998',
  country: 'Algeria',
  province: 'Algiers',
};

export const SCHOOL_LEVELS = ['High School', 'Bachelor', 'Master', 'PhD'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const COUNTRIES = [
  'Algeria',
  'Tunisia',
  'Morocco',
  'Egypt',
  'Libya',
  'Other',
];
export const PROVINCES = [
  'Algiers',
  'Blida',
  'Bouira',
  'Tlemcen',
  'Oran',
  'Constantine',
];

/**
 * DEMO SEED — local sample data for the client-facing visual demo.
 *
 * This is NOT live backend data. The provider, booking and chat backends do
 * not exist yet (the API only serves users, pets and addresses). These
 * fixtures let the marketplace screens render faithfully to docs/design.md
 * for the client demo.
 *
 * Replace each block with a real API query as the matching backend endpoint
 * ships. Search for `DEMO SEED` to find every consumer.
 */
import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface DemoCategory {
  id: string;
  label: string;
  icon: IconName;
}

export interface DemoProvider {
  id: string;
  name: string;
  service: string;
  // Matches a DemoCategory id (used by the Search filter).
  categoryId: string;
  avatarUri: string;
  rating: number;
  reviewCount: number;
  distanceMeters: number;
  isAvailable: boolean;
  pricePerHour: number;
  bio: string;
}

export interface DemoTimeSlot {
  id: string;
  label: string;
  isAvailable: boolean;
}

export interface DemoConversationMessage {
  id: string;
  fromProvider: boolean;
  text: string;
  time: string;
}

export interface DemoConversation {
  id: string;
  providerId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: DemoConversationMessage[];
}

/** The tutor signed in for the demo (matches the Mobile02 reference). */
export const demoTutor = {
  firstName: 'Juliana',
  condominium: 'Condomínio Jardim das Flores',
} as const;

export const demoCategories: DemoCategory[] = [
  { id: 'walk', label: 'Passeio', icon: 'walk-outline' },
  { id: 'sitting', label: 'Pet Sitting', icon: 'home-outline' },
  { id: 'transport', label: 'Transporte', icon: 'car-outline' },
  { id: 'boarding', label: 'Hospedagem', icon: 'bed-outline' },
  { id: 'more', label: '+ Mais', icon: 'ellipsis-horizontal' },
];

export const demoProviders: DemoProvider[] = [
  {
    id: 'p-carla',
    name: 'Carla Oliveira',
    service: 'Dog Walker',
    categoryId: 'walk',
    avatarUri: 'https://i.pravatar.cc/160?img=47',
    rating: 4.9,
    reviewCount: 128,
    distanceMeters: 150,
    isAvailable: true,
    pricePerHour: 35,
    bio: 'Passeios diários e cuidado atencioso para o seu pet, dentro do condomínio.',
  },
  {
    id: 'p-bruno',
    name: 'Bruno Santos',
    service: 'Pet Sitter',
    categoryId: 'sitting',
    avatarUri: 'https://i.pravatar.cc/160?img=12',
    rating: 4.8,
    reviewCount: 96,
    distanceMeters: 150,
    isAvailable: true,
    pricePerHour: 40,
    bio: 'Acompanhamento e companhia para o seu pet enquanto você está fora.',
  },
  {
    id: 'p-mariana',
    name: 'Mariana Costa',
    service: 'Hospedagem',
    categoryId: 'boarding',
    avatarUri: 'https://i.pravatar.cc/160?img=32',
    rating: 4.7,
    reviewCount: 74,
    distanceMeters: 320,
    isAvailable: false,
    pricePerHour: 60,
    bio: 'Hospedagem familiar com espaço e rotina tranquila para pets de porte pequeno.',
  },
  {
    id: 'p-pedro',
    name: 'Pedro Lima',
    service: 'Transporte',
    categoryId: 'transport',
    avatarUri: 'https://i.pravatar.cc/160?img=51',
    rating: 4.6,
    reviewCount: 52,
    distanceMeters: 540,
    isAvailable: true,
    pricePerHour: 30,
    bio: 'Transporte seguro para consultas, banho e tosa na região do condomínio.',
  },
];

export const demoTimeSlots: DemoTimeSlot[] = [
  { id: 't-09', label: '09:00', isAvailable: true },
  { id: 't-10', label: '10:00', isAvailable: true },
  { id: 't-11', label: '11:00', isAvailable: false },
  { id: 't-14', label: '14:00', isAvailable: true },
  { id: 't-15', label: '15:00', isAvailable: true },
  { id: 't-16', label: '16:00', isAvailable: true },
];

export const demoConversations: DemoConversation[] = [
  {
    id: 'c-carla',
    providerId: 'p-carla',
    lastMessage: 'Combinado! Levo a Bel às 10h para o passeio.',
    lastTime: '09:24',
    unread: 2,
    messages: [
      {
        id: 'm1',
        fromProvider: true,
        text: 'Olá, Juliana! Vi a sua solicitação de passeio.',
        time: '09:18',
      },
      {
        id: 'm2',
        fromProvider: false,
        text: 'Oi, Carla! Consegue amanhã de manhã?',
        time: '09:20',
      },
      {
        id: 'm3',
        fromProvider: true,
        text: 'Consigo sim. Tenho 09h e 10h livres.',
        time: '09:21',
      },
      {
        id: 'm4',
        fromProvider: false,
        text: 'Perfeito, pode ser 10h então.',
        time: '09:23',
      },
      {
        id: 'm5',
        fromProvider: true,
        text: 'Combinado! Levo a Bel às 10h para o passeio.',
        time: '09:24',
      },
    ],
  },
  {
    id: 'c-bruno',
    providerId: 'p-bruno',
    lastMessage: 'Pode deixar, fico com ele no sábado.',
    lastTime: 'Ontem',
    unread: 0,
    messages: [
      {
        id: 'm1',
        fromProvider: false,
        text: 'Bruno, você tem disponibilidade no sábado?',
        time: 'Ontem',
      },
      {
        id: 'm2',
        fromProvider: true,
        text: 'Pode deixar, fico com ele no sábado.',
        time: 'Ontem',
      },
    ],
  },
];

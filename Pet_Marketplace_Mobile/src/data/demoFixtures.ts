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
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

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
  firstName: "Juliana",
  condominium: "Garden Flats",
} as const;

export const demoCategories: DemoCategory[] = [
  { id: "walk", label: "Walks", icon: "walk-outline" },
  { id: "sitting", label: "Pet sitting", icon: "home-outline" },
  { id: "transport", label: "Transport", icon: "car-outline" },
  { id: "boarding", label: "Boarding", icon: "bed-outline" },
  { id: "more", label: "More", icon: "ellipsis-horizontal" },
];

export const demoProviders: DemoProvider[] = [
  {
    id: "p-carla",
    name: "Carla Oliveira",
    service: "Dog Walker",
    categoryId: "walk",
    avatarUri: "https://i.pravatar.cc/160?img=47",
    rating: 4.9,
    reviewCount: 128,
    distanceMeters: 150,
    isAvailable: true,
    pricePerHour: 35,
    bio: "Daily walks and attentive care for your pet near your area.",
  },
  {
    id: "p-bruno",
    name: "Bruno Santos",
    service: "Pet Sitter",
    categoryId: "sitting",
    avatarUri: "https://i.pravatar.cc/160?img=12",
    rating: 4.8,
    reviewCount: 96,
    distanceMeters: 150,
    isAvailable: true,
    pricePerHour: 40,
    bio: "Care and companionship for your pet while you are away.",
  },
  {
    id: "p-mariana",
    name: "Mariana Costa",
    service: "Boarding",
    categoryId: "boarding",
    avatarUri: "https://i.pravatar.cc/160?img=32",
    rating: 4.7,
    reviewCount: 74,
    distanceMeters: 320,
    isAvailable: false,
    pricePerHour: 60,
    bio: "Home boarding with space and a calm routine for smaller pets.",
  },
  {
    id: "p-pedro",
    name: "Pedro Lima",
    service: "Pet Transport",
    categoryId: "transport",
    avatarUri: "https://i.pravatar.cc/160?img=51",
    rating: 4.6,
    reviewCount: 52,
    distanceMeters: 540,
    isAvailable: true,
    pricePerHour: 30,
    bio: "Pet transport for appointments, grooming and local care visits.",
  },
];

export const demoTimeSlots: DemoTimeSlot[] = [
  { id: "t-09", label: "09:00", isAvailable: true },
  { id: "t-10", label: "10:00", isAvailable: true },
  { id: "t-11", label: "11:00", isAvailable: false },
  { id: "t-14", label: "14:00", isAvailable: true },
  { id: "t-15", label: "15:00", isAvailable: true },
  { id: "t-16", label: "16:00", isAvailable: true },
];

export const demoConversations: DemoConversation[] = [
  {
    id: "c-carla",
    providerId: "p-carla",
    lastMessage: "All set. I can take Bel for the 10:00 walk.",
    lastTime: "09:24",
    unread: 2,
    messages: [
      {
        id: "m1",
        fromProvider: true,
        text: "Hello Juliana, I saw your walk request.",
        time: "09:18",
      },
      {
        id: "m2",
        fromProvider: false,
        text: "Hi Carla. Are you available tomorrow morning?",
        time: "09:20",
      },
      {
        id: "m3",
        fromProvider: true,
        text: "Yes. I have 09:00 and 10:00 free.",
        time: "09:21",
      },
      {
        id: "m4",
        fromProvider: false,
        text: "Great, 10:00 works for me.",
        time: "09:23",
      },
      {
        id: "m5",
        fromProvider: true,
        text: "All set. I can take Bel for the 10:00 walk.",
        time: "09:24",
      },
    ],
  },
  {
    id: "c-bruno",
    providerId: "p-bruno",
    lastMessage: "No problem, I can look after him on Saturday.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        fromProvider: false,
        text: "Bruno, are you available on Saturday?",
        time: "Yesterday",
      },
      {
        id: "m2",
        fromProvider: true,
        text: "No problem, I can look after him on Saturday.",
        time: "Yesterday",
      },
    ],
  },
];

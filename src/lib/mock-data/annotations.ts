/**
 * Mock annotation data
 */

import { Annotation } from "@/types/annotations";

export const mockAnnotations: Annotation[] = [
  {
    id: "1",
    memeUrl: "https://picsum.photos/150/150?random=1",
    explanation:
      "This meme shows a funny situation where someone is confused about technology. The humor comes from the relatable struggle of understanding modern devices.",
    status: "Approved",
  },
  {
    id: "2",
    memeUrl: "https://picsum.photos/150/150?random=2",
    explanation:
      "A classic reaction meme expressing surprise and disbelief at an unexpected situation.",
    status: "Pending",
  },
  {
    id: "3",
    memeUrl: "https://picsum.photos/150/150?random=3",
    explanation:
      "This meme represents the feeling of being overwhelmed by too many tasks at once.",
    status: "Approved",
  },
  {
    id: "4",
    memeUrl: "https://picsum.photos/150/150?random=4",
    explanation: "A humorous take on procrastination and deadlines.",
    status: "Rejected",
  },
  {
    id: "5",
    memeUrl: "https://picsum.photos/150/150?random=5",
    explanation:
      "This meme captures the moment of realization when you understand something important.",
    status: "Pending",
  },
  {
    id: "6",
    memeUrl: "https://picsum.photos/150/150?random=6",
    explanation:
      "A funny representation of social awkwardness in group settings.",
    status: "Approved",
  },
  {
    id: "7",
    memeUrl: "https://picsum.photos/150/150?random=7",
    explanation: "A meme about the struggle of waking up early in the morning.",
    status: "Approved",
  },
  {
    id: "8",
    memeUrl: "https://picsum.photos/150/150?random=8",
    explanation:
      "This meme shows the excitement of finally understanding a difficult concept.",
    status: "Pending",
  },
];

/**
 * Generate deterministic mock annotations for a user
 */
export const generateMockAnnotations = (userId: string): Annotation[] => {
  const userIdHash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = (userIdHash % 50) + 20; // 20-70 annotations, deterministic per user
  
  return Array.from({ length: count }, (_, index) => {
    const memeIdHash = (userIdHash * 1000 + index * 7) % 10000;
    return {
      id: `ann-${userId}-${index + 1}`,
      memeId: `meme-${memeIdHash}`,
      memeUrl: `https://picsum.photos/300/300?random=${userIdHash + index}`,
      explanation: `This is a detailed explanation for meme ${index + 1}. The user has provided context about the humor, cultural references, or meaning behind this particular meme.`,
      status: "Pending" as const,
    };
  });
};




















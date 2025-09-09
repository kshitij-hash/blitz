import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ZoraProfileData {
  displayName?: string;
  avatar?: {
    medium?: string;
  };
}

export interface BattleCardData {
  battleId: string;
  creatorOne: {
    username: string;
    displayName?: string;
    avatar?: string;
    handle: string;
  };
  creatorTwo: {
    username: string;
    displayName?: string;
    avatar?: string;
    handle: string;
  };
  cardNumber: number;
}

export async function createBattleCard(
  contestId: string,
  createdBy?: string
): Promise<BattleCardData> {
  // Check if a card already exists for this contest and user
  const existingCard = await prisma.battleCard.findFirst({
    where: {
      battleId: contestId, // Using contestId as battleId for now
      createdBy: createdBy || null,
    },
  });

  if (existingCard) {
    return existingCard.battleData as unknown as BattleCardData;
  }

  // Get contest data with participants
  const contest = await prisma.contest.findUnique({
    where: { contestId },
    include: {
      participants: true,
    },
  });

  if (!contest) {
    throw new Error("Contest not found");
  }

  const participants = contest.participants;
  if (participants.length !== 2) {
    throw new Error("Battle must have exactly 2 participants");
  }

  // Get the next card number
  const lastCard = await prisma.battleCard.findFirst({
    orderBy: { cardNumber: "desc" },
  });
  const nextCardNumber = (lastCard?.cardNumber || 0) + 1;

  // Extract participant data
  const creatorOne = participants[0];
  const creatorTwo = participants[1];

  const battleCardData: BattleCardData = {
    battleId: contestId,
    creatorOne: {
      username: creatorOne.handle,
      displayName: (creatorOne.zoraProfileData as ZoraProfileData)?.displayName || creatorOne.handle,
      avatar: (creatorOne.zoraProfileData as ZoraProfileData)?.avatar?.medium,
      handle: creatorOne.handle,
    },
    creatorTwo: {
      username: creatorTwo.handle,
      displayName: (creatorTwo.zoraProfileData as ZoraProfileData)?.displayName || creatorTwo.handle,
      avatar: (creatorTwo.zoraProfileData as ZoraProfileData)?.avatar?.medium,
      handle: creatorTwo.handle,
    },
    cardNumber: nextCardNumber,
  };

  // Create the battle card record
  await prisma.battleCard.create({
    data: {
      cardNumber: nextCardNumber,
      battleId: contestId,
      createdBy,
      battleData: JSON.parse(JSON.stringify(battleCardData)),
    },
  });

  return battleCardData;
}

export async function getBattleCard(cardId: string): Promise<BattleCardData | null> {
  const card = await prisma.battleCard.findUnique({
    where: { id: cardId },
  });

  return card ? (card.battleData as unknown as BattleCardData) : null;
}

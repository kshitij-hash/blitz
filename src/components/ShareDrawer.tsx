"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FarcasterIcon from "../assets/farcaster.svg";
import LinkIcon from "../assets/link.svg";
import TelegramIcon from "../assets/telegram.svg";
import XIcon from "../assets/x.svg";

interface Contest {
  contestId: string;
  name: string;
  status: string;
  participants: Array<{
    handle: string;
    walletAddress: string;
    zoraProfile?: string;
    zoraProfileData?: {
      displayName?: string;
      avatar?: {
        medium?: string;
      };
    } | null;
  }>;
  createdAt: string;
  battleStartTime?: string | null;
  battleEndTime?: string | null;
  contentDeadline?: string | null;
}

type ShareDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  contest?: Contest | null;
  userId?: string;
};

export function ShareDrawer({
  isOpen,
  onClose,
  contest,
  userId,
}: ShareDrawerProps) {
  const [battleCardUrl, setBattleCardUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);

  const generateBattleCard = useCallback(async () => {
    if (!contest?.contestId) return;

    setIsGenerating(true);
    try {
      const params = new URLSearchParams({
        contestId: contest.contestId,
        ...(userId && { userId }),
      });
      console.log(params.toString());
      const url = `/api/battle-card?${params.toString()}`;
      setBattleCardUrl(url);
      setCardGenerated(true);
    } catch (error) {
      console.error("Error generating battle card:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [contest?.contestId, userId]);

  useEffect(() => {
    if (isOpen && contest?.contestId && !cardGenerated) {
      generateBattleCard();
    }
  }, [isOpen, contest?.contestId, cardGenerated, generateBattleCard]);

  const shareUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "https://blitzdotfun-three.vercel.app"
  }${battleCardUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareOnX = () => {
    const text = encodeURIComponent("Check out this epic battle on Blitz! ⚡");
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent("Check out this epic battle on Blitz! ⚡");
    const url = encodeURIComponent(shareUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  const shareOnFarcaster = () => {
    const text = encodeURIComponent("Check out this epic battle on Blitz! ⚡");
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`,
      "_blank"
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="font-schibsted-grotesk max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#161616" }}
      >
        <DialogHeader className="border-b border-gray-800 pb-6">
          <DialogTitle className="text-xl font-bold text-white text-left">
            Share Battle Card ⚡
          </DialogTitle>
          <DialogDescription className="text-sm text-left text-gray-300">
            Flip Battle Live!
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6">
          {/* Battle Card Preview */}
          <div className="mx-auto max-w-xs mb-8">
            {isGenerating ? (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-[32px]">
                <div className="text-white">Generating battle card...</div>
              </div>
            ) : battleCardUrl ? (
              <div className="rounded-[32px] overflow-hidden border border-gray-700">
                <Image
                  src={battleCardUrl}
                  alt="Battle Card"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-[32px]">
                <div className="text-gray-400">
                  {contest ? "Unable to generate card" : "No contest available"}
                </div>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex justify-around mt-8">
            <div className="flex flex-col items-center">
              <button
                onClick={copyToClipboard}
                disabled={!battleCardUrl}
                className="w-12 h-12 rounded-full border flex items-center justify-center mb-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src={LinkIcon.src}
                  alt="Copy link"
                  width={24}
                  height={24}
                />
              </button>
              <span className="text-gray-400 text-xs">Copy link</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={shareOnX}
                disabled={!battleCardUrl}
                className="w-12 h-12 rounded-full border flex items-center justify-center mb-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image src={XIcon.src} alt="X post" width={24} height={24} />
              </button>
              <span className="text-gray-400 text-xs">X post</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={shareOnTelegram}
                disabled={!battleCardUrl}
                className="w-12 h-12 rounded-full border flex items-center justify-center mb-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src={TelegramIcon.src}
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </button>
              <span className="text-gray-400 text-xs">Telegram</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={shareOnFarcaster}
                disabled={!battleCardUrl}
                className="w-12 h-12 rounded-full border flex items-center justify-center mb-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src={FarcasterIcon.src}
                  alt="Farcaster"
                  width={24}
                  height={24}
                />
              </button>
              <span className="text-gray-400 text-xs">Farcaster</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useContestPolling } from "@/hooks/useContestPolling";
import { Header } from "@/components/Header";
import { ContestTimer } from "@/components/ContestTimer";
import { CreatorCard } from "@/components/CreatorCard";
import VsZorb from "@/assets/vs_zorb.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PreBattlePage() {
  return (
    <AuthGuard>
      <PreBattle />
    </AuthGuard>
  );
}

function PreBattle() {
  const router = useRouter();
  const { contest, isPolling } = useContestPolling({
    enabled: true,
    interval: 5000,
    onStatusChange: (oldStatus, newStatus) => {
      console.log(`Contest status changed: ${oldStatus} → ${newStatus}`)
      
      // Handle routing based on contest status
      if (newStatus === 'ACTIVE_BATTLE') {
        router.replace('/contest')
      } else if (newStatus === 'COMPLETED' || newStatus === 'FORFEITED') {
        router.replace('/winner')
      }
      // For CREATED, AWAITING_DEPOSITS, AWAITING_CONTENT - stay on /pre-battle
    }
  });
  
  const loading = !contest && isPolling;
  
  // Handle routing based on contest status using useEffect to avoid setState-in-render
  useEffect(() => {
    if (contest?.status === 'ACTIVE_BATTLE') {
      router.replace('/contest')
    } else if (contest?.status === 'COMPLETED' || contest?.status === 'FORFEITED') {
      router.replace('/winner')
    }
  }, [contest?.status, router])

  // Show loading state while checking contest data
  if (loading) {
    return (
      <div className="min-h-screen size-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#67CE67] rounded-full animate-spin"></div>
            <span className="text-[#67CE67]">Loading battle info...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no active contest, show message
  if (!contest) {
    return (
      <div className="min-h-screen size-full flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-xl text-center space-y-6">
            <div className="space-y-2">
              <h2
                className="font-dela-gothic-one text-4xl font-bold"
                style={{
                  color: "#F1F1F1",
                  WebkitTextStroke: "1px #1C7807",
                  letterSpacing: "0.1em",
                }}
              >
                NO ACTIVE BATTLE
              </h2>
              <p
                className="font-schibsted-grotesk font-medium text-lg"
                style={{
                  color: "#124D04",
                }}
              >
                There are no active battles at the moment. Check back later!
              </p>
            </div>
          </div>
        </div>

        <div className="pb-8 text-center">
          <h3
            className="font-dela-gothic-one text-2xl font-bold opacity-60"
            style={{
              color: "#F1F1F1",
              WebkitTextStroke: "1px #1C7807",
              letterSpacing: "0.1em",
            }}
          >
            THE ARENA FOR CREATOR COINS.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen size-full flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Battle Header */}
          <div className="space-y-4">
            <ContestTimer 
              time={contest?.battleStartTime ? new Date(contest.battleStartTime) : undefined} 
              isStart={true} 
            />
          </div>

          {/* Creator Cards with VS */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* First Creator Card */}
            {contest.participants[0]?.zoraProfileData && (
              <div className="flex-1 max-w-lg">
                <CreatorCard creator={contest.participants[0].zoraProfileData} />
              </div>
            )}
            
            {/* VS Zorb */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <Image
                src={VsZorb}
                alt="VS"
                width={75}
                height={75}
                className="animate-pulse"
              />
            </div>
            
            {/* Second Creator Card */}
            {contest.participants[1]?.zoraProfileData && (
              <div className="flex-1 max-w-lg">
                <CreatorCard creator={contest.participants[1].zoraProfileData} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pb-8 text-center">
        <h3
          className="font-dela-gothic-one text-2xl font-bold opacity-60"
          style={{
            color: "#F1F1F1",
            WebkitTextStroke: "1px #1C7807",
            letterSpacing: "0.1em",
          }}
        >
          THE ARENA FOR CREATOR COINS.
        </h3>
      </div>
    </div>
  );
}

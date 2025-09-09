import { Link } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

interface Props {
  params: Promise<{ contestId: string }>;
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contestId } = await params;

  // You can fetch contest data here if needed for dynamic titles
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://blitzdotfun-three.vercel.app";
  const imageUrl = `${baseUrl}/api/battle-card?contestId=${contestId}`;

  return {
    title: `Battle Card - Blitz Contest ${contestId}`,
    description: "Check out this epic battle on Blitz! ⚡",
    openGraph: {
      title: `Battle Card - Blitz Contest ${contestId}`,
      description: "Check out this epic battle on Blitz! ⚡",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: "Blitz Battle Card",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Battle Card - Blitz Contest ${contestId}`,
      description: "Check out this epic battle on Blitz! ⚡",
      images: [imageUrl],
    },
  };
}

export default async function ContestSharePage({ params }: Props) {
  const { contestId } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://blitzdotfun-three.vercel.app";
  const imageUrl = `${baseUrl}/api/battle-card?contestId=${contestId}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Blitz Battle Card ⚡
          </h1>
          <p className="text-gray-400">Contest #{contestId}</p>
        </div>

        <div className="rounded-[32px] overflow-hidden border border-gray-700 mb-8">
          <Image src={imageUrl} alt="Battle Card" width={300} height={400} />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-[#67CE67] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#5bb85b] transition-colors"
          >
            Join the Battle
          </Link>
        </div>
      </div>
    </div>
  );
}

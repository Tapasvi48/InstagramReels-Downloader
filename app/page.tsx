"use client";
import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import "./globals.css";
import VideoCard from "@/components/ui/videoPlayer";
import { TextGenerateEffect } from "@/components/ui/textGenerate";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholder";

interface Video {
  video_url: string;
  caption?: string;
}

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const placeholders = ["Enter Instagram Username"];
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    setVideos([]);

    try {
      const response = await axios.post("/api/videos", { username });
      if (response.data?.videos) {
        setVideos(response.data.videos.slice(0, 10));
      } else {
        setError("No videos found.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (videoUrl: string) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "video.mp4";
    link.click();
  };

  const handleSearch = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      // Simply redirect with username
      window.location.href = `/videos?username=${encodeURIComponent(username)}`;
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#FF9F00] via-[#FF1C5E] to-[#5233EA] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,28,94,0.3),rgba(255,255,255,0.1))]" />

      <div className="w-full max-w-7xl px-4 py-8 mx-auto relative z-10">
        <div className="w-full font-bold flex items-center justify-center mb-12">
          <TextGenerateEffect
            duration={2}
            filter={false}
            words={"Top 10 Instagram Videos"}
          />
        </div>

        <div className="w-full max-w-xl mx-auto">
          <Card className="shadow-md border border-white/20 bg-gradient-to-br from-white/20 via-pink-100/20 to-orange-100/20 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl sm:text-3xl text-center text-black">
                  Download Your Favourite Reels
                </h2>
                <div className="w-full">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 text-black backdrop-blur-sm border border-black/20 rounded-md hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/10 text-sm transition duration-200"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                  ) : (
                    "Search Videos"
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="w-full max-w-xl mt-6 mx-auto">
            <Card className="border-red-500/20 bg-red-500/10 backdrop-blur-lg">
              <CardContent className="p-4">
                <p className="text-red-200 text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {videos.map((video, index) => (
            <Card
              key={index}
              className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white/20 via-pink-100/20 to-orange-100/20 backdrop-blur-md border border-white/20"
            >
              <CardHeader>
                <h2 className="text-lg font-medium text-white">
                  Video {index + 1}
                </h2>
              </CardHeader>
              <CardContent>
                <VideoCard video={video} />
                {video.caption && (
                  <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                    {video.caption}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleDownload(video.video_url)}
                  className="w-full px-4 py-2 text-white backdrop-blur-sm border border-white/20 rounded-md hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/10 text-sm transition duration-200"
                >
                  Download
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

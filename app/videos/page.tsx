"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import { TextGenerateEffect } from "@/components/ui/textGenerate";

interface Video {
  video_url: string;
  caption?: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const username = searchParams.get("username");
        console.log(username, "username is");

        if (!username) {
          setError("No username provided");
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/videos", { username });

        if (response.data?.videos) {
          setVideos(response.data.videos.slice(0, 10));
        } else {
          setError("No videos found");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Failed to load videos");
        } else {
          setError("An unexpected error occurred");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#FF9F00] via-[#FF1C5E] to-[#5233EA]">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-white rounded-full"></div>
      </div>
    );
  }

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `instagram-video-${Date.now()}.mp4`; // unique filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("Failed to download video. Please try again.");
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
            words={"Your Instagram Videos"}
          />
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
              className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white/20 via-pink-100/20 to-orange-100/20 backdrop-blur-md border border-white/20 flex flex-col"
            >
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium text-white">
                  Video {index + 1}
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col border-t border-white/20">
                <div className="w-full h-[300px] relative flex items-center justify-center">
                  <video
                    src={video.video_url}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {video.caption && (
                  <p className="mt-2 text-sm text-black-200 line-clamp-2 overflow-hidden">
                    {video.caption}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-2 flex justify-center">
                <button
                  className="px-8 py-2 bg-gray-700 text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
                  onClick={() => handleDownload(video.video_url)}
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

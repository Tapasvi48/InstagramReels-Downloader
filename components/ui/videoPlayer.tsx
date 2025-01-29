import { Card } from "@/components/ui/card";
import ReactPlayer from "react-player";
import { useState } from "react";

interface Video {
  video_url: string;
  caption?: string;
  thumbnail_src?: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to truncate caption to 100 characters
  const truncateCaption = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Card className="w-[400px] bg-[#141414] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden">
      <div className="relative w-full h-[225px]">
        {!isPlaying && video.thumbnail_src && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handlePlay}
            style={{
              backgroundImage: `url(${video.thumbnail_src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-white/30 hover:bg-white/80 rounded-full p-4 transition-all duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        <ReactPlayer
          url={video.video_url}
          width="100%"
          height="100%"
          controls={isPlaying}
          playing={isPlaying}
          onPlay={handlePlay}
          className="!absolute top-0 left-0 !w-full !h-full"
        />
      </div>
      {video.caption && (
        <div className="p-3 bg-[#141414]">
          <p className="text-sm text-gray-200 font-medium">
            {truncateCaption(video.caption)}
          </p>
        </div>
      )}
    </Card>
  );
};

export default VideoCard;

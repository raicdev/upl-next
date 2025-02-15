import React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  SiBluesky,
  SiSpotify,
  SiGithub,
  SiYoutube,
  SiTwitch,
  SiKick,
  SiInstagram,
  SiOsu,
  SiNamemc,
  SiSteam,
  SiX,
} from "@icons-pack/react-simple-icons";

const Socials: React.FC = () => {
  return (
    <div className="p-8" id="socials">
      <h1 className="text-5xl font-bold mb-5 bold-h1">SNS</h1>

      <p className="text-xl font-bold mb-5">基本</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild>
          <Link
            href="https://bsky.app/profile/raic.dev"
            className="flex items-center space-x-2"
          >
            <SiBluesky /> <span>Bluesky</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://open.spotify.com/artist/3hdGoSYvBsQhtgpQop28AO?si=n0X-ga5RQVSw3w0B9jCrxA"
            className="flex items-center space-x-2"
          >
            <SiSpotify /> <span>Spotify</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://github.com/raidesuuu"
            className="flex items-center space-x-2"
          >
            <SiGithub /> <span>GitHub</span>
          </Link>
        </Button>
      </div>

      <p className="text-xl font-bold mb-5">メディア</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild>
          <Link
            href="https://www.youtube.com/channel/UC4c5qLRRG3HCTmzxH69XBtw"
            className="flex items-center space-x-2"
          >
            <SiYoutube /> <span>YouTube</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://twitch.tv/raisandane"
            className="flex items-center space-x-2"
          >
            <SiTwitch /> <span>Twitch</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://kick.com/raisandesu"
            className="flex items-center space-x-2"
          >
            <SiKick /> <span>Kick</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://instagram.com/raisandayoo"
            className="flex items-center space-x-2"
          >
            <SiInstagram /> <span>Instagram</span>
          </Link>
        </Button>
      </div>

      <p className="text-xl font-bold mb-5">X (Twitter)</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild>
          <Link
            href="https://x.com/raic_dev"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>X (Twitter)</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://x.com/uplauncherxyz"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>UpLauncher</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://x.com/vistaupdater"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>VistaUpdater</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://x.com/chatfromrai"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>Rai Chat</span>
          </Link>
        </Button>
      </div>

      <p className="text-xl font-bold mb-5">ゲーム</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild>
          <Link
            href="https://osu.ppy.sh/users/34918440"
            className="flex items-center space-x-2"
          >
            <SiOsu /> <span>osu!</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://namemc.com/profile/voidroom.1"
            className="flex items-center space-x-2"
          >
            <SiNamemc /> <span>Minecraft</span>
          </Link>
        </Button>

        <Button asChild>
          <Link
            href="https://steamcommunity.com/id/raisandesu"
            className="flex items-center space-x-2"
          >
            <SiSteam /> <span>Steam</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Socials;

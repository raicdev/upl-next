import React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  SiSpotify,
  SiGithub,
  SiYoutube,
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

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild size={"lg"}>
          <Link
            href="https://github.com/raicdev"
            className="flex items-center space-x-2"
          >
            <SiGithub /> <span>@raicdev</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
          <Link
            href="https://open.spotify.com/artist/3hdGoSYvBsQhtgpQop28AO?si=n0X-ga5RQVSw3w0B9jCrxA"
            className="flex items-center space-x-2"
          >
            <SiSpotify /> <span>Spotify</span>
          </Link>
        </Button>
      </div>


      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild size={"lg"}>
          <Link
            href="https://www.youtube.com/channel/UC4c5qLRRG3HCTmzxH69XBtw"
            className="flex items-center space-x-2"
          >
            <SiYoutube /> <span>@雷</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
          <Link
            href="https://instagram.com/raisandayoo"
            className="flex items-center space-x-2"
          >
            <SiInstagram /> <span>@raisandayoo</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild size={"lg"}>
          <Link
            href="https://x.com/raic_dev"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>@raic_dev</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
          <Link
            href="https://x.com/baketumawashi"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>@baketumawashi</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
          <Link
            href="https://x.com/vistaupdater"
            className="flex items-center space-x-2"
          >
            <SiX /> <span>@vistaupdater</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild size={"lg"}>
          <Link
            href="https://osu.ppy.sh/users/34918440"
            className="flex items-center space-x-2"
          >
            <SiOsu /> <span>osu!</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
          <Link
            href="https://namemc.com/profile/voidroom.1"
            className="flex items-center space-x-2"
          >
            <SiNamemc /> <span>Minecraft</span>
          </Link>
        </Button>

        <Button asChild size={"lg"}>
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

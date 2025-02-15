import React from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="p-8" >
      <h1 className="text-5xl font-bold mb-5 bold-h1" id="contact">お問い合わせ</h1>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Button asChild>
          <Link href="https://discord.gg/tJTTM56Wg2" className="flex items-center space-x-2">
            <SiDiscord /> <span>Discord (Ticket)</span>
          </Link>
        </Button>

        <Button asChild>
          <Link href="https://x.com/raic_dev" className="flex items-center space-x-2">
            <SiDiscord /> <span>X (Twitter)</span>
          </Link>
        </Button>

        <Button asChild>
          <Link href="mailto:contact@raic.dev?subject=%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B&body=%E9%9B%B7%E3%81%B8%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%0A%0A%23%20%E5%86%85%E5%AE%B9%0A%0A%2F*%20%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%E5%86%85%E5%AE%B9%20*%2F" className="flex items-center space-x-2">
            <Mail /> <span>メール</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Contact;

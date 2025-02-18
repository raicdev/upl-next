"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/components/button";

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          animate={{
            x: position.x,
            y: position.y,
            rotate: position.x,
          }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        </motion.div>
        <h2 className="text-3xl font-semibold text-gray-300 mb-8">
          ページが見つかりません
        </h2>
        <p className="text-gray-400 mb-8">
          お探しのページは移動または削除された可能性があります
        </p>

        { /* Links */}
        <Button asChild variant={"link"}>
          <Link href="/#products">製品</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/#socials">SNS</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/#contacts">お問い合わせ</Link>
        </Button>

        <Button asChild>
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  );
}

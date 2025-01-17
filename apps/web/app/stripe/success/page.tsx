"use client";

import React, { useEffect } from "react";

const StripeSuccess: React.FC = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.pathname = "https://chat.raic.dev/account/subscriptions";
    }, 10000);
  }, []);

  return (
    <div className="min-h-screen w-full mt-16 p-8">
      <h1 className="text-6xl font-bold mb-4">ご購入ありがとうございます！</h1>
      <p className="text-xl mb-8 max-w-5xl">Stripeでのご購入に成功しました！10秒でパネルのサブスクリプションに移動されます。</p>
    </div>
  );
};

export default StripeSuccess;

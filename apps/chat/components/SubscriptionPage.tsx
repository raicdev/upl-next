import React, { useEffect, useRef } from "react";
import { useSubscriptionData } from "@/hooks/use-subscription";
import { SubscriptionDataInterface } from "@firebase/types";
import { Loading } from "@repo/ui/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Button } from "@repo/ui/components/button";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Label } from "@repo/ui/components/label";
import { Badge } from "@repo/ui/components/badge";
import { ShoppingCart } from "lucide-react";

const SubscriptionDetails: React.FC<{
  data: SubscriptionDataInterface;
  formRef: React.RefObject<HTMLFormElement>;
}> = ({ data, formRef }) => {
  
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.display = "none";
    }
  }, [formRef]);

  const getPlanName = (plan: string) => {
    if (plan.includes("pro")) {
      return "Pro";
    } else if (plan.includes("premiumPlus")) {
      return "プレミアムプラス";
    } else if (plan.includes("premium")) {
      return "プレミアム";
    } else {
      return "無料";
    }
  };

  const planName = getPlanName(data.plan);

  if (planName === "無料") {
    return null;
  }

  return (
    <Alert>
      <ShoppingCart className="h-5 w-5" />
      <AlertTitle className="text-lg text-green-400">
        {planName}はアクティブです
      </AlertTitle>
      <AlertDescription>
        Stripeでの購入が完了したか、あなたの特典申請リクエストは承認されました。
        <br />
        {planName}をご購入いただき、ありがとうございます。
      </AlertDescription>
    </Alert>
  );
};

const SubscriptionPage: React.FC = () => {
  const { subscriptionData, loading, authToken } = useSubscriptionData();
  const formRef = useRef<HTMLFormElement>(null);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-4xl lg:text-6xl font-bold mb-4">
        サブスクリプション
      </h1>
      <p className="text-lg lg:text-xl mb-8 max-w-5xl">
        プレミアムの購入とサブスクリプションの管理
      </p>

      <h2 className="text-2xl lg:text-3xl font-bold mb-5">
        プレミアムを購入する
      </h2>
      <p className="mb-8 max-w-5xl">
        GitHub
        SponsorsまたはStripeで、プレミアム以上のランクを購入してください。
        <br />
        サブスクリプション(ランク)についての詳細は
        <a
          href="/category/infomation/ranks.html"
          className="underline text-blue-400"
        >
          こちら
        </a>
        をご覧ください。
        <br />
        <br />
        サブスクリプションを購入すると、
        <a
          href="https://raic.tech/category/infomation/purchaser-tos.html"
          className="underline text-blue-400"
        >
          購入者の利用規約
        </a>
        に同意したことになります。
      </p>

      <form
        ref={formRef}
        className="mb-3"
        method="post"
        action="http://api.raic.dev/stripe/create-checkout-session"
      >
        <h2 className="text-2xl lg:text-3xl font-bold mb-5">
          Stripeで購入する
        </h2>

        <p className="mb-3 max-w-5xl">
          サブスクリプションを購入して、即座に特典を使用します。
        </p>

        <h3 className="text-lg lg:text-2xl mb-3 font-bold">期間を選択</h3>
        <RadioGroup className="flex" name="selectPeriod" defaultValue="monthly">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="r1" />
            <Label htmlFor="r1">一か月</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="r2" />
            <Label htmlFor="r2">
              一年 <Badge className="ml-2">割引あり</Badge>
            </Label>
          </div>
        </RadioGroup>

        <h3 className="text-lg lg:text-2xl mb-3 mt-3 font-bold">
          プランを選択
        </h3>

        <p className="mb-3 max-w-5xl">
          「50OFFSTRIPE」を使うと50%オフでプレミアムプラスとProを入手できます！
        </p>

        <input type="hidden" name="FB_AUTH_TOKEN" value={authToken || ""} />

        <Select
          defaultValue="premium"
          aria-label="プラン選択"
          name="selectPlan"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="プランを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>プラン</SelectLabel>
              <SelectItem value="premium">プレミアム</SelectItem>
              <SelectItem value="premiumPlus">プレミアムプラス</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="mt-5" type="submit">
          購入する
        </Button>
      </form>

      {subscriptionData && (
        <SubscriptionDetails
          data={subscriptionData}
          formRef={formRef as React.RefObject<HTMLFormElement>}
        />
      )}
    </div>
  );
};
export default function SubscriptionPageWithSuspense() {
  return <SubscriptionPage />;
}

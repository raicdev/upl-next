import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

const MessageSkeleton: React.FC = () => {
  return (
    <Card
      className={`isMessageDiv inline-block rounded-lg p-2 px-3 md:px-6 w-full`}
    >
      <CardHeader className="flex gap-4 p-4">
        <Skeleton className="w-12 h-12 rounded-full"></Skeleton>
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-1">
            <Skeleton className="w-24 h-4 rounded-full"></Skeleton>
            <Skeleton className="w-16 h-4 rounded-full"></Skeleton>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-4">
        <Skeleton className="w-full h-4 rounded-full mb-2"></Skeleton>
        <Skeleton className="w-full h-4 rounded-full"></Skeleton>
      </CardContent>

      <Separator />
      <CardFooter className="flex items-center justify-between p-4 border-muted">
        <Skeleton className="w-24 h-12 rounded-full"></Skeleton>
      </CardFooter>
    </Card>
  );
};

export default MessageSkeleton;

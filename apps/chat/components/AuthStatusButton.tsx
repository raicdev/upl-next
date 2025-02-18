import { auth } from "@firebase/config";
import { Button } from "@repo/ui/components/button";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const AuthStatusButton = () => {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <Button
        variant="destructive"
        size="icon"
        onClick={() => {
          auth.signOut();
          router.push("/login");
        }}
      >
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button asChild variant="secondary" size="icon">
      <Link href="/login">
        <LogIn className="h-[1.2rem] w-[1.2rem]" />
      </Link>
    </Button>
  );
};
import { Button } from "@repo/ui/components/button";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { Loading } from "./loading";
import { memo } from "react";

interface ImagePreviewProps {
  image: string;
  isUploading: boolean;
  setImage: (image: string | null) => void;
}

export const ImagePreview = memo(({ image, isUploading, setImage }: ImagePreviewProps) => {
  return (
    <div className="flex mb-2 rounded border gap-2 w-fit p-1">
      <Image src={image} width="300" height="300" alt="Uploaded Image" />
      {isUploading && <Loading />}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setImage(null)}
      >
        <XIcon />
      </Button>
    </div>
  );
});
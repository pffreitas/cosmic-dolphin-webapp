import type { Resource } from "@cosmic-dolphin/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OpenGraphImageProps {
  imageUrl: string;
  description: string;
}

export default function OpenGraphImage({
  imageUrl,
  description,
}: OpenGraphImageProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 bg-gray-50 rounded-lg">
      {imageUrl && (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              alt={description || "Image"}
              className="w-full h-40 object-cover rounded-md mb-2 cursor-pointer hover:opacity-80 transition-opacity mb-4"
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              {description && <DialogTitle>Title</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt={description || "Image"}
                className="max-w-full max-h-96 object-contain rounded-md"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {description && (
        <h4 className="text-sm font-medium text-gray-900 mb-1">Title</h4>
      )}
      {description && (
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      )}
    </div>
  );
}

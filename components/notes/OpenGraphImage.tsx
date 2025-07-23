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
  resource: Resource;
}

export default function OpenGraphImage({ resource }: OpenGraphImageProps) {
  if (!resource.openGraph) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 bg-gray-50 rounded-lg">
      {resource.openGraph.image && (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={resource.openGraph.image}
              alt={resource.openGraph.title || "Image"}
              className="w-full h-40 object-cover rounded-md mb-2 cursor-pointer hover:opacity-80 transition-opacity mb-4"
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              {resource.openGraph.title && (
                <DialogTitle>{resource.openGraph.title}</DialogTitle>
              )}
              {resource.openGraph.description && (
                <DialogDescription>
                  {resource.openGraph.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={resource.openGraph.image}
                alt={resource.openGraph.title || "Image"}
                className="max-w-full max-h-96 object-contain rounded-md"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {resource.openGraph.title && (
        <h4 className="text-sm font-medium text-gray-900 mb-1">
          {resource.openGraph.title}
        </h4>
      )}
      {resource.openGraph.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {resource.openGraph.description}
        </p>
      )}
    </div>
  );
}
interface OpenGraphImageProps {
  imageUrl: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function OpenGraphImage({
  imageUrl,
  title,
  description,
  onClick,
}: OpenGraphImageProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 rounded-lg">
      <div className="flex justify-center items-center md:flex-[2]">
        <img
          src={imageUrl}
          alt={description || "Image"}
          className="w-full h-48 md:h-60 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClick}
        />
      </div>
      <div className="flex flex-col gap-1 px-3 md:px-0 md:flex-[1]">
        {title && (
          <h4 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

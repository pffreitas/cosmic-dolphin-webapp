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
    <div className="flex gap-6 bg-gray-50 rounded-lg py-4">
      <div className="flex justify-center items-center" style={{ flex: "2" }}>
        <img
          src={imageUrl}
          alt={description || "Image"}
          className="w-full h-60 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClick}
        />
      </div>
      <div className="flex flex-col gap-1" style={{ flex: "1" }}>
        {title && (
          <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
        )}
        {description && <p className="text-xs text-gray-600">{description}</p>}
      </div>
    </div>
  );
}

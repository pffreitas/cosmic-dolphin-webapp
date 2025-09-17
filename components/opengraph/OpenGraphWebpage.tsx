interface OpenGraphWebpageProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function OpenGraphWebpage({
  title,
  description,
  image,
  url,
}: OpenGraphWebpageProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex text-inherit no-underline select-none transition-all duration-75 ease-in-out cursor-pointer flex-grow min-w-0 flex-wrap-reverse items-stretch text-left overflow-hidden border border-white/13 rounded-[10px] relative hover:bg-white/5"
    >
      {/* Text Content Section */}
      <div className="flex-[4_1_180px] p-3 pb-[14px] overflow-hidden text-left">
        {/* Title */}
        <div className="text-sm leading-5 text-white/81 whitespace-nowrap overflow-hidden text-ellipsis min-h-6 mb-0.5">
          {title}
        </div>

        {/* Description */}
        <div className="text-xs leading-4 text-white/46 h-8 overflow-hidden">
          {description}
        </div>

        {/* URL with Favicon */}
        <div className="flex mt-1.5">
          {image && (
            <img
              src={image}
              alt=""
              className="w-4 h-4 min-w-4 mr-1.5 rounded-sm"
            />
          )}
          <div className="text-xs leading-4 text-white/81 whitespace-nowrap overflow-hidden text-ellipsis">
            {url}
          </div>
        </div>
      </div>

      {/* Image Section */}
      {image && (
        <div className="flex-[1_1_180px] block relative">
          <div className="absolute inset-0">
            <div className="w-full h-full">
              <img
                src={image}
                alt={title || ""}
                className="block object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </a>
  );
}

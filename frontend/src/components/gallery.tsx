import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Info,
} from "lucide-react";
import { useToastCleanup } from "@/utils/safeToast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@apollo/client";
import { GET_GALLERY_IMAGES } from "@/lib/graphql/gallery";

interface GalleryProps {
  className?: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  order: number;
}

const Gallery: React.FC<GalleryProps> = ({ className }) => {
  // Cleanup toasts when component unmounts
  useToastCleanup();

  // Fetch gallery images from backend
  const { data, loading, error } = useQuery(GET_GALLERY_IMAGES, {
    errorPolicy: "all",
  });

  // Use backend images if available, otherwise fallback to static images
  const images: GalleryImage[] = React.useMemo(() => {
    const fallbackImages: GalleryImage[] = [
      {
        id: "fallback-1",
        src: "/images/eclat.jpg",
        alt: "Étincelle des futures mariés",
        caption: "L'éclat des moments qui resteront gravés à jamais",
        order: 1,
      },
      {
        id: "fallback-2",
        src: "/images/bague.jpg",
        alt: "La bague un symbole plein de sens",
        caption: "Amour, engagement, promesse, union, éternité",
        order: 2,
      },
      {
        id: "fallback-3",
        src: "/images/oints.jpg",
        alt: "consécration",
        caption: "La bénédiction divine avant toute chose",
        order: 3,
      },
      {
        id: "fallback-4",
        src: "/images/champagne.jpg",
        alt: "Trinquons!",
        caption: "Des bulles de joie au reflet pétillant d'amour!",
        order: 4,
      },
      {
        id: "fallback-5",
        src: "/images/bouquet.jpg",
        alt: "Les fleurs",
        caption: "La délicatesse d'un bouquet pour une journée romantique.",
        order: 5,
      },
      {
        id: "fallback-6",
        src: "/images/maries-8.jpg",
        alt: "Un ciel bleu ",
        caption: "Et la lumière fut!",
        order: 6,
      },
    ];
    if (loading) return fallbackImages;
    if (error || !data?.galleryImages?.length) {
      console.warn(
        "Using fallback images due to:",
        error?.message || "No images found"
      );
      return fallbackImages;
    }
    return data.galleryImages.sort(
      (a: GalleryImage, b: GalleryImage) => a.order - b.order
    );
  }, [data, loading, error]);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Refs for touch handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const panPositionRef = useRef({ x: 0, y: 0 });

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Auto-hide controls after a period of inactivity
  useEffect(() => {
    if (!isLightboxOpen) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    const handleUserActivity = () => {
      setShowControls(true);
      clearTimeout(timer);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, [isLightboxOpen, showControls]);

  // Function to open lightbox with selected image
  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setIsZoomed(false);
  }, []);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
    });
    setZoomLevel(1);
    setIsZoomed(false);
  }, [selectedImageIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
    });
    setZoomLevel(1);
    setIsZoomed(false);
  }, [selectedImageIndex, images.length]);

  // Zoom functions
  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
    setZoomLevel(isZoomed ? 1 : 2.5);
    // Reset pan position when toggling zoom
    panPositionRef.current = { x: 0, y: 0 };
  }, [isZoomed]);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = Math.min(prev + 0.5, 3);
      setIsZoomed(newZoom > 1);
      return newZoom;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setIsZoomed(false);
        // Reset pan position when fully zoomed out
        panPositionRef.current = { x: 0, y: 0 };
      }
      return newZoom;
    });
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - track for swipe
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
      } else if (e.touches.length === 2 && isZoomed) {
        // Two touches - track for pinch zoom
        e.preventDefault(); // Prevent default browser pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        pinchStartDistanceRef.current = distance;
        pinchStartZoomRef.current = zoomLevel;
      }
    },
    [isZoomed, zoomLevel]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (
        e.touches.length === 2 &&
        pinchStartDistanceRef.current !== null &&
        isZoomed
      ) {
        // Handle pinch zoom
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const pinchRatio = currentDistance / pinchStartDistanceRef.current;
        const newZoom = Math.max(
          1,
          Math.min(3, pinchStartZoomRef.current * pinchRatio)
        );

        setZoomLevel(newZoom);
        setIsZoomed(newZoom > 1);
      } else if (e.touches.length === 1 && isZoomed && zoomLevel > 1) {
        // Handle pan when zoomed in
        if (imageContainerRef.current) {
          const deltaX = e.touches[0].clientX - (touchStartXRef.current || 0);
          const deltaY = e.touches[0].clientY - (touchStartYRef.current || 0);

          // Update touch start position for continuous panning
          touchStartXRef.current = e.touches[0].clientX;
          touchStartYRef.current = e.touches[0].clientY;

          // Update pan position (will be applied in CSS)
          panPositionRef.current.x += deltaX;
          panPositionRef.current.y += deltaY;

          // Apply transform
          imageContainerRef.current.style.transform = `scale(${zoomLevel}) translate(${
            panPositionRef.current.x / zoomLevel
          }px, ${panPositionRef.current.y / zoomLevel}px)`;
        }
      }
    },
    [isZoomed, zoomLevel]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (
        touchStartXRef.current !== null &&
        e.changedTouches.length === 1 &&
        !isZoomed
      ) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartXRef.current;
        const deltaY = touchEndY - (touchStartYRef.current || 0);

        // Check if it's a horizontal swipe (more horizontal than vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Check if the swipe is long enough to be considered a navigation gesture
          if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
              // Swipe right -> previous image
              goToPrevious();
            } else {
              // Swipe left -> next image
              goToNext();
            }
          }
        }
      }

      // Reset refs
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      pinchStartDistanceRef.current = null;
    },
    [goToNext, goToPrevious, isZoomed]
  );

  // Reset pan position when image changes
  useEffect(() => {
    panPositionRef.current = { x: 0, y: 0 };
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform = `scale(${zoomLevel})`;
    }
  }, [selectedImageIndex, zoomLevel]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          setIsLightboxOpen(false);
          break;
        case "+":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case " ":
          toggleZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext, zoomIn, zoomOut, toggleZoom]);

  // Show loading state
  if (loading) {
    return (
      <section
        id='gallery'
        className={cn("py-20 px-4 bg-royal-50 relative", className)}
      >
        <div className='container mx-auto'>
          <div className='text-center mb-16'>
            <motion.h2
              className='text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Galerie Photo
            </motion.h2>
            <div className='w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4' />
            <span className='text-xl text-muted-foreground'>
              Chargement des photos...
            </span>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className='relative overflow-hidden rounded-lg h-72 card-royal animate-pulse bg-gray-200'
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id='gallery'
      className={cn("py-20 px-4 bg-royal-50 relative", className)}
    >
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <motion.h2
            className='text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Galerie Photo
          </motion.h2>
          <div className='w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4' />
          <span className='text-xl text-muted-foreground'>
            En souvenir des moments les plus marquants
          </span>
        </div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className='relative overflow-hidden rounded-lg h-72 card-royal cursor-pointer group'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              whileHover={{ scale: 1.03 }}
              onClick={() => openLightbox(index)}
              role='button'
              tabIndex={0}
              aria-label={`View ${image.alt} in lightbox`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
            >
              <div className='overflow-hidden h-full w-full'>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  width={500}
                  height={500}
                  quality={100}
                  priority
                  unoptimized={true} // Required for static export
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    console.error(`Failed to load gallery image: ${image.src}`);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-royal-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                <div className='text-white'>
                  <p className='text-lg font-medium'>{image.alt}</p>
                  {image.caption && (
                    <p className='text-sm font-light italic'>{image.caption}</p>
                  )}
                  <div className='mt-2'>
                    <span className='inline-flex items-center text-xs bg-white/20 px-2 py-1 rounded'>
                      <ZoomIn className='h-3 w-3 mr-1' />
                      {isMobile
                        ? "Touchez pour agrandir"
                        : "Cliquez pour agrandir"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className='text-center mt-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className='text-foreground italic font-playfair gradient-text'>
            Ma famille et moi nous servirons l&apos;Éternel. Josué 24:15
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={isLightboxOpen}
        onOpenChange={(open) => {
          setIsLightboxOpen(open);
          if (!open) {
            setZoomLevel(1);
            setIsZoomed(false);
          }
        }}
      >
        <DialogContent className='max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden'>
          <DialogTitle className='sr-only'>
            {selectedImageIndex !== null
              ? images[selectedImageIndex].alt
              : "Image Gallery"}
          </DialogTitle>
          <AnimatePresence mode='wait'>
            {selectedImageIndex !== null && (
              <div className='relative w-full h-full flex flex-col'>
                {/* Close button */}
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn(
                    "absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 h-10 w-10 rounded-full",
                    !showControls && "opacity-0 transition-opacity duration-300"
                  )}
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label='Close lightbox'
                >
                  <X className='h-5 w-5' />
                </Button>

                {/* Mobile help button */}
                {isMobile && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className={cn(
                      "absolute top-4 left-4 z-50 text-white bg-black/50 hover:bg-black/70 h-10 w-10 rounded-full",
                      !showControls &&
                        "opacity-0 transition-opacity duration-300"
                    )}
                    onClick={() => {
                      alert(
                        "Gestes disponibles:\n" +
                          "• Glisser à gauche/droite: changer d'image\n" +
                          "• Pincer avec deux doigts: zoomer/dézoomer\n" +
                          "• Toucher pour zoomer/dézoomer\n" +
                          "• Glisser pour déplacer l'image zoomée"
                      );
                    }}
                    aria-label='Help'
                  >
                    <Info className='h-5 w-5' />
                  </Button>
                )}

                {/* Image container */}
                <div
                  className={cn(
                    "flex-1 overflow-hidden relative flex items-center justify-center",
                    isZoomed ? "cursor-move" : "cursor-zoom-in"
                  )}
                  onClick={!isMobile ? toggleZoom : undefined}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <motion.div
                    className='w-full h-full flex items-center justify-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key={selectedImageIndex}
                  >
                    <div className='relative h-[80vh] w-full max-w-6xl flex items-center justify-center overflow-auto'>
                      <div
                        ref={imageContainerRef}
                        className={cn(
                          "transition-transform duration-300 ease-out transform origin-center",
                          isZoomed ? "cursor-move" : "cursor-zoom-in"
                        )}
                        style={{
                          transform: `scale(${zoomLevel})`,
                        }}
                      >
                        <Image
                          src={images[selectedImageIndex].src}
                          alt={images[selectedImageIndex].alt}
                          width={1200}
                          height={800}
                          quality={100}
                          className='object-contain max-h-[80vh] w-auto'
                          unoptimized={true}
                          onError={(e) => {
                            console.error(
                              `Failed to load lightbox image: ${images[selectedImageIndex].src}`
                            );
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Caption and controls */}
                <div
                  className={cn(
                    "p-4 bg-black/80 text-white transition-opacity duration-300",
                    !showControls && "opacity-0"
                  )}
                >
                  <div className='flex justify-between items-center'>
                    <div className='space-y-1 max-w-[70%]'>
                      <h3 className='font-playfair text-xl truncate'>
                        {images[selectedImageIndex].alt}
                      </h3>
                      {images[selectedImageIndex].caption && (
                        <p className='text-sm text-gray-300 italic line-clamp-2'>
                          {images[selectedImageIndex].caption}
                        </p>
                      )}
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-10 w-10 border-gray-600 text-gray-300 hover:text-white hover:border-white rounded-full'
                        onClick={zoomOut}
                        disabled={zoomLevel <= 1}
                        aria-label='Zoom out'
                      >
                        <ZoomOut className='h-5 w-5' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-10 w-10 border-gray-600 text-gray-300 hover:text-white hover:border-white rounded-full'
                        onClick={zoomIn}
                        disabled={zoomLevel >= 3}
                        aria-label='Zoom in'
                      >
                        <ZoomIn className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "absolute inset-y-1/2 left-4 transform -translate-y-1/2 flex items-center transition-opacity duration-300",
                      !showControls && "opacity-0"
                    )}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-12 w-12 md:h-14 md:w-14 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full'
                      onClick={goToPrevious}
                      aria-label='Previous image'
                    >
                      <ChevronLeft className='h-6 w-6 md:h-8 md:w-8' />
                    </Button>
                  </div>

                  <div
                    className={cn(
                      "absolute inset-y-1/2 right-4 transform -translate-y-1/2 flex items-center transition-opacity duration-300",
                      !showControls && "opacity-0"
                    )}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-12 w-12 md:h-14 md:w-14 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full'
                      onClick={goToNext}
                      aria-label='Next image'
                    >
                      <ChevronRight className='h-6 w-6 md:h-8 md:w-8' />
                    </Button>
                  </div>
                </div>

                {/* Image counter */}
                <div
                  className={cn(
                    "absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm transition-opacity duration-300",
                    isMobile && "left-16",
                    !showControls && "opacity-0"
                  )}
                >
                  {selectedImageIndex + 1} / {images.length}
                </div>

                {/* Controls help text */}
                <div
                  className={cn(
                    "absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white/80 px-3 py-1 rounded-full text-xs transition-opacity duration-300",
                    !showControls && "opacity-0"
                  )}
                >
                  {isMobile ? (
                    <span className='flex items-center'>
                      <Smartphone size={12} className='mr-1' />
                      Glissez pour naviguer
                    </span>
                  ) : (
                    <span>
                      Utilisez les flèches ← → pour naviguer, + - pour zoomer
                    </span>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;

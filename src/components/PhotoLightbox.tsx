import { useEffect, useRef, useState, type TouchEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import type { AppStrings } from '../i18n/translations';
import type { PhotoItem } from '../types/archive';
import { formatFileSize } from '../utils/archiveLogic';
import { ResilientImage } from './ResilientImage';

interface PhotoLightboxProps {
  folderName: string;
  photos: PhotoItem[];
  currentIndex: number | null;
  t: AppStrings;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
  onSharePhoto: (photo: PhotoItem, pageNumber: number) => void;
  onDownloadPhoto: (photo: PhotoItem, pageNumber: number) => void;
  onRequestDeletePhoto: (photo: PhotoItem, pageNumber: number) => void;
}

export function PhotoLightbox({
  folderName,
  photos,
  currentIndex,
  t,
  onClose,
  onChangeIndex,
  onSharePhoto,
  onDownloadPhoto,
  onRequestDeletePhoto,
}: PhotoLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < photos.length;

  useEffect(() => {
    if (!isOpen || currentIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onChangeIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        onChangeIndex(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onChangeIndex]);

  if (!isOpen || currentIndex === null) return null;

  const photo = photos[currentIndex];
  const pageNumber = currentIndex + 1;
  const formattedSize = formatFileSize(photo.size);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setDragOffsetX(0);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null || e.touches.length !== 1) {
      return;
    }
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragOffsetX(dx * 0.45);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;
    setDragOffsetX(0);

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && hasNext) {
        onChangeIndex(currentIndex + 1);
      } else if (dx > 0 && hasPrev) {
        onChangeIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 h-dvh bg-[#0A0A0C]/92 backdrop-blur-2xl text-stone-100 flex flex-col select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`${folderName} — ${t.pageLabel(pageNumber)}`}
    >
      {/* Smoked Glass Top Bar */}
      <div className="min-h-[56px] px-4 sm:px-6 pt-[calc(var(--safe-top)+0.375rem)] pb-1.5 bg-white/[0.04] backdrop-blur-xl flex items-center justify-between gap-4 border-b border-white/12 shrink-0">
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-stone-100 truncate">{folderName}</div>
          <div className="text-xs text-stone-400 tabular-nums">
            <span>
              {pageNumber} / {photos.length}
            </span>
            {formattedSize && (
              <>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{formattedSize}</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeLightboxAria}
          className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-[2px] bg-white/[0.06] border border-white/15 text-stone-200 hover:text-white hover:bg-white/15 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Swipeable Full-Screen Stage */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden px-3 sm:px-14 py-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => hasPrev && onChangeIndex(currentIndex - 1)}
          aria-label={t.prevPhotoAria}
          className="min-h-[44px] min-w-[44px] absolute left-3 sm:left-5 z-10 flex items-center justify-center rounded-[2px] bg-black/60 backdrop-blur-md border border-white/20 text-stone-100 hover:bg-white/15 disabled:opacity-20 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          style={{
            transform: dragOffsetX ? `translate3d(${dragOffsetX}px, 0, 0)` : undefined,
          }}
          className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
        >
          <ResilientImage
            key={photo.id}
            src={photo.previewUrl}
            alt={`${folderName} — ${t.pageLabel(pageNumber)}`}
            className="max-h-full max-w-full object-contain rounded-[2px] border border-white/15 shadow-2xl"
          />
        </div>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => hasNext && onChangeIndex(currentIndex + 1)}
          aria-label={t.nextPhotoAria}
          className="min-h-[44px] min-w-[44px] absolute right-3 sm:right-5 z-10 flex items-center justify-center rounded-[2px] bg-black/60 backdrop-blur-md border border-white/20 text-stone-100 hover:bg-white/15 disabled:opacity-20 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Smoked Glass Justified 3-Column Bottom Action Bar */}
      <div className="min-h-[64px] px-4 sm:px-6 pt-2.5 pb-[calc(var(--safe-bottom)+0.625rem)] border-t border-white/12 bg-white/[0.04] backdrop-blur-xl flex items-center shrink-0">
        <div className="w-full max-w-lg mx-auto grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSharePhoto(photo, pageNumber)}
            className="min-h-[42px] px-2.5 py-2 rounded-[2px] bg-white/[0.07] border border-white/14 text-xs sm:text-sm font-medium text-stone-100 hover:bg-white/15 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.shareFolderTitle}</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadPhoto(photo, pageNumber)}
            className="min-h-[42px] px-2.5 py-2 rounded-[2px] bg-white/[0.07] border border-white/14 text-xs sm:text-sm font-medium text-stone-100 hover:bg-white/15 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.downloadSingleBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDeletePhoto(photo, pageNumber)}
            className="min-h-[42px] px-2.5 py-2 rounded-[2px] bg-red-950/45 border border-red-400/30 text-xs sm:text-sm font-medium text-red-300 hover:bg-red-900/50 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.deleteBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

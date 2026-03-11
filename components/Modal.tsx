import { Dialog } from "@headlessui/react";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import SharedModal from "./SharedModal";

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[];
  onClose?: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { photoId } = router.query;

  const initialIndex = typeof photoId === "string" ? Number(photoId) : 0;

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(initialIndex);

  // Sync state with URL
  useEffect(() => {
    if (typeof photoId === "string") {
      const newIndex = Number(photoId);
      if (!isNaN(newIndex)) {
        setCurIndex(newIndex);
      }
    }
  }, [photoId]);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose?.();
  }

  function changePhotoId(newVal: number) {
    if (newVal < 0 || newVal >= images.length) return;

    setDirection(newVal > curIndex ? 1 : -1);
    setCurIndex(newVal);

    router.replace(
      {
        pathname: "/",
        query: { photoId: newVal },
      },
      `/p/${newVal}`,
      { shallow: true },
    );
  }

  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < images.length) {
      changePhotoId(curIndex + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(curIndex - 1);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div as any}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}

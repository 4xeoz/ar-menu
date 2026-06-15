"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";

export type ModelViewerHandle = {
  setSrc: (src: string) => void;
};

type Props = {
  src: string;
  poster?: string;
  alt: string;
};

const ModelViewer = forwardRef<ModelViewerHandle, Props>(
  ({ src, poster, alt }, ref) => {
    const mvRef = useRef<HTMLElement>(null);

    // expose setSrc so parent can swap the model
    useImperativeHandle(ref, () => ({
      setSrc: (newSrc: string) => {
        if (mvRef.current) {
          (mvRef.current as any).src = newSrc;
        }
      },
    }));

    return (
      <model-viewer
        ref={mvRef}
        src={src}
        poster={poster}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        loading="eager"
        style={{
          width: "100%",
          height: "70%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    );
  }
);

ModelViewer.displayName = "ModelViewer";
export default ModelViewer;

"use client";

type Props = {
  src: string;
  poster?: string;
  alt: string;
};

export default function ModelViewer({ src, poster, alt }: Props) {
  return (
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      loading="lazy"
      style={{ width: "100%", height: "400px" }}
    />
  );
}

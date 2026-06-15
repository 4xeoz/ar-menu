"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl" />
  ),
});

type Props = {
  src: string;
  poster?: string;
  alt: string;
};

export default function ModelViewerClient(props: Props) {
  return <ModelViewer {...props} />;
}

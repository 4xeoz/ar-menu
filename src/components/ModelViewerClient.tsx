"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { ModelViewerHandle } from "./ModelViewer";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black animate-pulse" />,
});

type Props = {
  src: string;
  poster?: string;
  alt: string;
};

const ModelViewerClient = forwardRef<ModelViewerHandle, Props>((props, ref) => {
  return <ModelViewer ref={ref} {...props} />;
});

ModelViewerClient.displayName = "ModelViewerClient";
export default ModelViewerClient;

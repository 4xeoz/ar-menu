"use client";

import { useRef, useState } from "react";
import ModelViewerClient from "@/components/ModelViewerClient";
import type { ModelViewerHandle } from "@/components/ModelViewer";

const items = [
  {
    id: 1,
    name: "Astronaut",
    price: "$12.00",
    image: "https://modelviewer.dev/shared-assets/models/Astronaut.webp",
    model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  },
  {
    id: 2,
    name: "Helmet",
    price: "$18.00",
    image: "https://modelviewer.dev/shared-assets/models/reflective-sphere.webp",
    model: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(items[0]);
  const mvRef = useRef<ModelViewerHandle>(null);

  function selectItem(item: typeof items[0]) {
    setSelected(item);
    mvRef.current?.setSrc(item.model);
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* FULLSCREEN 3D / AR VIEWER */}
      <ModelViewerClient
        ref={mvRef}
        src={selected.model}
        poster={selected.image}
        alt={selected.name}
      />

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-10 pb-4 bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-white text-lg font-semibold">AR Menu</h1>
        <span className="text-white/70 text-sm">by WeTrends</span>
      </div>

      {/* SELECTED ITEM INFO */}
      <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
        <p className="text-white text-xl font-bold drop-shadow">{selected.name}</p>
        <p className="text-white/80 text-base drop-shadow">{selected.price}</p>
      </div>

      {/* BOTTOM ITEM TRAY */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 pb-8 pt-12">
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => selectItem(item)}
              className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                selected.id === item.id
                  ? "border-white scale-110"
                  : "border-white/30 opacity-60"
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

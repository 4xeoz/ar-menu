"use client";

import { useState } from "react";
import ModelViewerClient from "@/components/ModelViewerClient";

const items = [
  {
    id: 1,
    name: "Grilled Salmon",
    price: "$24.00",
    description: "Fresh Atlantic salmon with lemon butter and seasonal vegetables.",
    image: "https://modelviewer.dev/shared-assets/models/Astronaut.webp",
    model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  },
  {
    id: 2,
    name: "Wagyu Burger",
    price: "$18.00",
    description: "200g wagyu patty, caramelized onions, truffle mayo, brioche bun.",
    image: "https://modelviewer.dev/shared-assets/models/reflective-sphere.webp",
    model: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: "$16.00",
    description: "San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil.",
    image: "https://modelviewer.dev/shared-assets/models/Astronaut.webp",
    model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  },
];

type Item = typeof items[0];

export default function Home() {
  const [activeModel, setActiveModel] = useState<Item | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#f8f7f4] px-5 pt-12 pb-4 border-b border-black/5">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">WeTrends</p>
        <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
      </div>

      {/* MENU LIST */}
      <div className="px-4 py-4 flex flex-col gap-4 pb-24">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm"
          >
            {/* DISH IMAGE */}
            <div className="relative w-full h-52">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* DISH INFO */}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                <span className="text-lg font-semibold text-gray-900 ml-2 shrink-0">{item.price}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>

              {/* VIEW 3D BUTTON */}
              <button
                onClick={() => setActiveModel(item)}
                className="w-full py-3 rounded-2xl bg-gray-900 text-white text-sm font-medium tracking-wide active:scale-95 transition-transform"
              >
                View in 3D
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D MODAL */}
      {activeModel && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

          {/* CLOSE + TITLE */}
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <div>
              <h2 className="text-white text-lg font-semibold">{activeModel.name}</h2>
              <p className="text-white/50 text-sm">{activeModel.price}</p>
            </div>
            <button
              onClick={() => setActiveModel(null)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* MODEL VIEWER */}
          <div className="relative flex-1">
            <ModelViewerClient
              src={activeModel.model}
              poster={activeModel.image}
              alt={activeModel.name}
            />
          </div>

          <p className="text-center text-white/30 text-xs pb-8">
            Drag to rotate
          </p>
        </div>
      )}

    </div>
  );
}

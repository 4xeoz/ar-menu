"use client";

import { useState } from "react";
import ModelViewerClient from "@/components/ModelViewerClient";
import type { Restaurant, MenuItem } from "@/lib/api";

type Props = {
  restaurant: Restaurant;
  items: MenuItem[];
};

export default function MenuClient({ restaurant, items }: Props) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#f8f7f4] px-5 pt-12 pb-4 border-b border-black/5">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">WeTrends</p>
        <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
      </div>

      {/* MENU LIST */}
      <div className="px-4 py-4 flex flex-col gap-4 pb-24">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {item.image_url && (
              <div className="relative w-full h-52">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                <span className="text-lg font-semibold text-gray-900 ml-2 shrink-0">${item.price}</span>
              </div>
              {item.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>
              )}
              {item.model_url && (
                <button
                  onClick={() => setActiveItem(item)}
                  className="w-full py-3 rounded-2xl bg-gray-900 text-white text-sm font-medium tracking-wide active:scale-95 transition-transform"
                >
                  View in 3D
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3D MODAL */}
      {activeItem && activeItem.model_url && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <div>
              <h2 className="text-white text-lg font-semibold">{activeItem.name}</h2>
              <p className="text-white/50 text-sm">${activeItem.price}</p>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-lg"
            >
              ✕
            </button>
          </div>
          <div className="relative flex-1">
            <ModelViewerClient
              src={activeItem.model_url}
              poster={activeItem.image_url ?? undefined}
              alt={activeItem.name}
            />
          </div>
          <p className="text-center text-white/30 text-xs pb-8">Drag to rotate</p>
        </div>
      )}
    </div>
  );
}

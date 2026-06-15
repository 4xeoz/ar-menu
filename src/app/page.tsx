import ModelViewerClient from "@/components/ModelViewerClient";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">AR Menu</h1>
      <p className="text-lg text-gray-500 mb-8">by WeTrends</p>

      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
        <ModelViewerClient
          src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
          poster="https://modelviewer.dev/shared-assets/models/Astronaut.webp"
          alt="A 3D model"
        />
      </div>

      <p className="mt-4 text-sm text-gray-400">
        Drag to rotate · Tap AR to place in your space
      </p>
    </main>
  );
}

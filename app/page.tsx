// app/page.tsx
"use client";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";

export default function ChannableVisualizer() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  const isImageUrl = (val: any) => {
    if (typeof val !== "string") return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(val);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Channable Feed Viewer</h1>

        <div className="flex gap-2 mb-10">
          <input
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Pega aquí tu URL de Channable (.xml o .csv)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={fetchFeed}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Cargando..." : "Visualizar"}
          </button>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="break-inside-avoid bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {Object.entries(item).map(([key, value]: [string, any]) => (
                <div key={key} className="mb-2 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">{key}</span>
                  {isImageUrl(value) ? (
                    <div className="relative group cursor-zoom-in mt-1" onClick={() => setZoomImg(value)}>
                      <img src={value} alt={key} className="w-full h-auto rounded-lg" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 break-words">{String(value)}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Zoom Mode */}
      {zoomImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomImg(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:scale-110 transition-transform">
            <X size={40} />
          </button>
          <img src={zoomImg} className="max-w-full max-h-full object-contain" alt="Zoom" />
        </div>
      )}
    </main>
  );
}

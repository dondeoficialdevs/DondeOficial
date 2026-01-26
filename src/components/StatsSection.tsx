'use client';

export default function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Nuestros Aliados Estratégicos</h2>
          <p className="mt-4 text-gray-600">Empresas que confían en nosotros</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-50">
          {/* Espacios para logos de aliados */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-center p-8 grayscale hover:grayscale-0 transition-all border-2 border-dashed border-gray-200 rounded-xl">
              <span className="text-gray-400 font-bold text-sm">Logo Aliado {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

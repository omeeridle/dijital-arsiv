"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Manifesto() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sağ Üstteki İncecik Buton */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-8 md:top-12 right-6 md:right-12 z-[90] text-[9px] tracking-[0.3em] uppercase text-gray-400 hover:text-gray-900 transition-colors mix-blend-difference"
      >
        Manifesto
      </button>

      {/* Sürgülü Siyah Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Arka planı hafif karartan perde */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/10 z-[95] backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[440px] bg-[#0A0A0A] z-[100] p-10 md:p-16 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-24 border-b border-gray-800 pb-8">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-gray-600">Bearth Arşivi</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[9px] tracking-[0.3em] uppercase text-gray-400 hover:text-white transition-colors"
                  >
                    Kapat [X]
                  </button>
                </div>
                
                <h2 className="text-3xl font-serif text-gray-100 mb-10 tracking-wide">Neden Buradayız?</h2>
                
                <div className="space-y-6">
                  <p className="text-[11px] md:text-[12px] leading-[2.6] tracking-wide font-light text-gray-400">
                    Dünya, her gün kendi etrafında dönerken milyarlarca hikaye yaratır. Ancak biz insanlar, kendi gürültümüzden doğanın o sessiz ve kusursuz mühendisliğini duyamayacak kadar sağırlaştık.
                  </p>
                  <p className="text-[11px] md:text-[12px] leading-[2.6] tracking-wide font-light text-gray-400">
                    BEARTH; satmak, bağırmak veya dikkat çekmek için değil; durup bakmak, hatırlamak ve evrenin karşısında ne kadar küçük olduğumuzu kabullenmek için var olan dijital bir sığınaktır.
                  </p>
                </div>
              </div>
              
              <div className="text-[8px] tracking-[0.4em] uppercase text-gray-700">
                EST. 2026 — DÜNYA, GÜNEŞ SİSTEMİ
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
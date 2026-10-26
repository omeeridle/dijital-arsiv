"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111] font-sans pt-32 md:pt-48">
      <main className="max-w-3xl mx-auto px-6 pb-24">
        
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-16"
        >
          {/* Başlık Alanı - Daha Minimal ve Toplu */}
          <div className="space-y-6 border-b border-gray-200 pb-12">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-snug">
              gereksiz hiçbir şeyin olmadığı, <br className="hidden md:block"/>
              saf gerçekliğe dönüş.
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-light max-w-xl leading-relaxed">
              bu seçki, doğanın ve evrenin detaylarını dijital gürültüden arındırarak sunmak için tasarlandı.
            </p>
          </div>

          {/* Okuması Kolay, İnce Hatlı Metin Alanı */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            
            {/* Sol Taraf: İnce Detay */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-medium">
                felsefe
              </p>
              <div className="w-6 h-[1px] bg-gray-300"></div>
            </div>

            {/* Sağ Taraf: Ana Metin */}
            <div className="md:col-span-9 space-y-6 text-[13px] md:text-[14px] text-gray-600 font-light leading-loose">
              <p>
                gündelik hayatın hızında kaybolan o sessiz anları yakalamak, sadece vizörden bakmakla ilgili değildir. O anı, hiçbir dikkat dağıtıcı unsur olmadan, olduğu gibi yansıtabilmektir.
              </p>
              <p>
                asimetrik yerleşimler, devasa boşluklar ve keskin bir tipografi. dünyanın pürüzlü dokusunu ve okyanusların derinliğini ekrana taşırken, dijital dünyanın karmaşasını kapıda bırakıyoruz. gözün sadece ışığa, renklere ve anın kendisine odaklanmasını istiyoruz.
              </p>
              <p className="text-gray-900 font-medium tracking-wide">
                çünkü biliyoruz ki; gerçek lüks, kalabalıklarda değil, seçkin bir sadeliktedir.
              </p>
            </div>

          </div>
        </motion.article>

      </main>
    </div>
  );
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ já tinha
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },

      // 🔥 novos da sua lista
      { protocol: "https", hostname: "www.havan.com.br" },
      { protocol: "https", hostname: "epocacosmeticos.vteximg.com.br" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "cdn.sistemawbuy.com.br" },
      { protocol: "https", hostname: "cdn.awsli.com.br" },
      { protocol: "https", hostname: "www.giraofertas.com.br" },
      { protocol: "https", hostname: "acdn-us.mitiendanube.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "images.tcdn.com.br" },
      { protocol: "https", hostname: "cdn.dooca.store" },
      { protocol: "https", hostname: "fimgs.net" },
      { protocol: "https", hostname: "origemarabe.com.br" },
      
      // ✅ Supabase Storage local
      { protocol: "https", hostname: "fjhfmekfwzqvpkwnwhht.supabase.co" },
    ],
  },
};

export default nextConfig;
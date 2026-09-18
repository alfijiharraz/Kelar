/*
 * KONTEN WEBSITE — ubah data di file ini tanpa menyentuh layout.
 * Baca PANDUAN.md di folder utama untuk contoh proyek asli dan pengaturan kontak.
 * Jangan isi nomor orang lain atau menyebut contoh di bawah sebagai proyek/ulasan asli.
 */
window.SITE_CONTENT = {
  whatsappNumber: "62856462044", // Isi nomor milikmu: kode negara + nomor, hanya angka, tanpa tanda + / spasi.
  whatsappGreeting: "Hi Min Kealour, saya ingin bertanya tentang layanan yang tersedia.",
  telegramUsername: "hhrraz", // Isi username Telegram milikmu, boleh dengan atau tanpa awalan @.
  projects: [
    {
      id: "daftar-jasa",
      title: "Daftar jasa",
      category: "Design",
      categoryLabel: "Design",
      year: "2026",
      description: "Desain daftar jasa untuk publikasi dengan fokus pada hierarki informasi jasa agar mudah dipahami/dibaca oleh masyarakat. Proyek ini sudah berizin oleh pemilik ",
      tools: ["Canva"],
      deliverable: "Daftar Harga/jasa · PNG / PDF",
      cover: "../assets/dftrhrg.webp", // Contoh setelah file ada: "assets/projects/poster-kegiatan.webp"
      coverAlt: "Daftar harga dengan judul utama, harga, produk dan informasi pembayaran",
      previews: [{ type: "image", src: "../assets/dftrhrg.webp", alt: "Poster lengkap" }], // Contoh: [{ type: "image", src: "assets/projects/poster-kegiatan.webp", alt: "Poster lengkap" }]
      projectUrl: "https://drive.google.com/file/d/1TVpA48dob61vX0rdPoDUU7VcrVlwiAPC/view?usp=sharing", // URL HTTPS publik (Canva/Drive/YouTube) atau file lokal. Cek izin akses.
      sample: false, // false HANYA setelah diganti dengan proyek nyata yang boleh dipublikasikan.
      coverStyle: "Pricelist",
      featured: true
    },
    {
      id: "video-dokumentasi",
      title: "Video Dokumentasi Kegiatan",
      category: "Video",
      categoryLabel: "Video Editing",
      year: "2026",
      description: "Contoh struktur proyek: editing video dokumentasi dengan pemilihan footage, penyusunan sequence, musik, subtitle, transisi, dan penyesuaian warna. Ganti dengan pekerjaan serta tools yang benar-benar kamu gunakan.",
      tools: ["CapCut / Premiere Pro"],
      deliverable: "Video dokumentasi · MP4",
      cover: "",
      coverAlt: "Cuplikan video dokumentasi kegiatan",
      previews: [], // Video: [{ type: "video", src: "assets/projects/dokumentasi.mp4", poster: "assets/projects/dokumentasi.webp", captions: "assets/projects/subtitle-id.vtt" }]
      projectUrl: "",
      sample: true,
      coverStyle: "video",
      featured: true
    },
    {
      id: "redesign-presentasi",
      title: "Redesign Presentasi",
      category: "Presentation",
      categoryLabel: "Presentation",
      year: "2026",
      description: "Contoh struktur proyek: mengubah presentasi yang sebelumnya penuh teks menjadi lebih visual, konsisten, dan nyaman digunakan saat presentasi. Tampilkan slide sebelum dan sesudah dari proyek asli dengan izin pemilik materi.",
      tools: ["Canva", "PowerPoint"],
      deliverable: "Slide presentasi · PPTX / PDF",
      cover: "",
      coverAlt: "Slide presentasi dengan susunan informasi yang ringkas dan visual",
      previews: [],
      projectUrl: "",
      sample: true,
      coverStyle: "presentation",
      featured: true
    },
    {
      id: "formatting-dokumen",
      title: "Formatting Laporan Akademik",
      category: "Document",
      categoryLabel: "Document",
      year: "2026",
      description: "Dump proyek: merapikan margin, heading, daftar isi, penomoran halaman, dan konsistensi format laporan. Seluruh isi pada contoh menggunakan teks dummy; tidak ada identitas pelanggan.",
      tools: ["Microsoft Word"],
      deliverable: "Dokumen terformat · DOCX / PDF",
      cover: "../assets/DUMP.webp",
      coverAlt: "Dump Laporan Akademik dengan teks dummy",
      previews: [ { type: "image", src: "../assets/DUMP.webp", alt: "Halaman laporan dengan teks dummy" } ],
      projectUrl: "https://docs.google.com/document/d/1DesJVm0c1ZWBfDGVoRaDdRaMDsVGpifw/edit?usp=sharing&ouid=107332877542766645073&rtpof=true&sd=true",
      sample: false,
      coverStyle: "document",
      featured: true,
      privacyNote: true
    }
  ],
  testimonials: [
    {
      quote: "iyapp aman bintang 5 kok..ramah bgtt dan sabar.",
      name: "D***", category: "Video Editing PKKMB", sample: false
    },
    {
      quote: "PPT-nya jadi lebih enak dilihat dan nggak terlalu penuh seperti sebelumnya.  (dump)",
      name: "R***", category: "Presentation", sample: true
    },
    {
      quote: "Desain posternya bagus, sesuai referensi yang aku kasih. (dump)",
      name: "D***", category: "Design", sample: true
    },
    {
      quote: "Kerjain tugasnya cepat dan hasilnya rapi. Terima kasih bub.",
      name: "S******", category: "Document", sample: false
    }
  ]
};

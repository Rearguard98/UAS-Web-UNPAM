const cursor = document.querySelector(".cursor"); // Ambil elemen bola kita
const targets = document.querySelectorAll("a, img"); // Ambil semua target
const btnHero = document.querySelector(".hero-btn");

// Loop setiap target
targets.forEach(target => {
    // Saat masuk
    target.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    // Saat keluar
    target.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});

btnHero.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
});

btnHero.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
});

// 1. Inisialisasi Lenis
const lenis = new Lenis({
    duration: 1.2, // Atur durasi kelicinan (semakin besar semakin licin/lambat)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Fungsi matematika untuk kehalusan
});

// 2. Hubungkan event scroll Lenis ke ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 3. Tambahkan Lenis ke loop animasi GSAP
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Lenis butuh waktu dalam milidetik
});

// 4. Matikan lag smoothing GSAP (opsional, tapi disarankan untuk scroll)
gsap.ticker.lagSmoothing(0);


// Membuat wadah timeline
const tl = gsap.timeline();

// Langkah 1: Teks Muncul
tl.to(".overlay-text", {
    y: 0,
    opacity: 1,
    duration: 1
});

// Langkah 2: Teks Menghilang
tl.to(".overlay-text", {
    y: 0,
    opacity: 0,
    duration: 1,
    delay: 1 // Opsional: Tahan sebentar sebelum hilang
});

// Langkah 3: Tirai Terbuka
tl.to(".overlay", {
    y: "-100%",
    borderBottomLeftRadius: "50%",  // Membuat sudut kiri bawah melengkung
    borderBottomRightRadius: "50%", // Membuat sudut kanan bawah melengkung
    duration: 2,
    ease: "power4.inOut"
});

// Langkah 4: Sudut Tirai Kembali Rata
tl.to(".overlay", {
    borderBottomLeftRadius: "0%",
    borderBottomRightRadius: "0%",
    duration: 0.5, // Cepat saja
    ease: "power1.out"
});

// Langkah 5: Navigasi Turun
tl.to(".navbar", {
    y: "0%",
    duration: 1,
    ease: "power2.out"
}, "-=0.5"); // Trik kecil: Mulai 0.5 detik LEBIH AWAL sebelum tirai selesai (biar smooth)

// Langkah 6: Hero Section Muncul (Stagger)
tl.to(".hero > *", {
    y: "0%",
    opacity: 1,
    duration: 1,
    stagger: 0.2,     // Jeda 0.2 detik antar elemen
    ease: "power2.out"
}, "-=0.8"); // Trik: Mulai 0.8 detik lebih awal (saat Navigasi sedang turun)

// Memastikan halaman sudah dimuat sepenuhnya sebelum animasi jalan
window.addEventListener("load", () => {

    // Set posisi awal elemen turun 50px ke bawah
    gsap.set(".hero-text", { y: 50 });
    
    // Animasi Text
    gsap.to(".hero-text", {
        duration: 1.5,    // Durasi animasi dalam detik
        y: 0,             // Posisi vertikal akhir (0 berarti kembali ke posisi asli)
        opacity: 1,       // Opasitas akhir
        ease: "power3.out", // Gaya gerakan (cepat di awal, melambat di akhir)
        stagger: 0.3      // Jeda waktu antar elemen .hero-text
    });

    // Animasi Tombol (muncul setelah text selesai)
    gsap.to(".hero-btn", {
        duration: 1,
        delay: 1,         // Menunggu 1 detik sebelum mulai
        opacity: 1,
        scale: 1,         // Ukuran normal
        ease: "back.out(1.7)" // Efek membal sedikit (bouncy)
    });
    
    /* Catatan: Agar efek gerakannya terlihat (slide up), 
       kita perlu set posisi awal elemen di CSS atau lewat gsap.set()
       tapi untuk sekarang kita fokus ke opacity dulu.
    */
});

// Mendaftarkan plugin agar bisa dipakai
gsap.registerPlugin(ScrollTrigger);

// Animasi Scroll
gsap.to(".about-content h2, .about-content p", { // Targetkan kedua elemen
    scrollTrigger: {
        trigger: ".about",
        start: "top 60%",    // Kita ubah sedikit agar mulai saat elemen di 60% layar
    },
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.3,  // <--- INI KUNCINYA: Jeda 0.3 detik antar elemen
    ease: "power2.out"
});

// Animasi Parallax Gambar
gsap.to(".project-img", {
    scrollTrigger: {
        trigger: ".project-container", // Pemicu saat container masuk layar
        start: "top bottom", // Mulai saat bagian ATAS container menyentuh BAGIAN BAWAH layar
        end: "bottom top",   // Selesai saat bagian BAWAH container menyentuh BAGIAN ATAS layar
        scrub: 1,            // Mengikat animasi ke scrollbar (angka 1 memberi sedikit efek halus/delay)
    },
    y: -50,         // Gerakkan gambar ke atas sejauh 50px
    ease: "none"    // Penting: Gunakan "none" agar gerakannya linear/rata mengikuti scroll
});

// Animasi Pinning (Sticky Side)
ScrollTrigger.create({
    trigger: ".services",   // Pemicu adalah kontainer utamanya
    start: "top top",       // Mulai saat BAGIAN ATAS .services menyentuh BAGIAN ATAS layar
    end: "bottom bottom",   // Selesai saat BAGIAN BAWAH .services menyentuh BAGIAN BAWAH layar
    pin: ".services-left"   // Elemen mana yang mau dipaku?
});

// Menggerakkan kursor mengikuti mouse
window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Sedikit delay agar terlihat "mengayun" halus
        ease: "power2.out"
    });
});
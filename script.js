const cursor = document.querySelector(".cursor"); // Ambil elemen bola kita
const targets = document.querySelectorAll("a, img"); // Ambil semua target
const btnHero = document.querySelector(".hero-btn"); // Ambil tombol hero

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

// Safe event listeners - Cek jika elemen ada (untuk menu mobile)
if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle("active");
    });

    // Tutup menu saat link diklik
    mobileMenuLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });

    // Tutup menu saat klik di luar
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".navbar") && !e.target.closest(".mobile-menu")) {
            mobileMenu.classList.remove("active");
        }
    });
}

// Menambahkan magnetik cursor pada tombol hero (dengan null check)
if (btnHero) {
    btnHero.addEventListener("mousemove", (e) => {
        const x = e.offsetX - (btnHero.offsetWidth / 2);
        const y = e.offsetY - (btnHero.offsetHeight / 2);
        gsap.to(".hero-btn", { // Animasi tombol magnetik pake gsap
            x: x,
            y: y,
            duration: 0.1, 
            ease: "power2.out"
        });
    });

    // Reset saat mouse keluar dengan efek elastis
    btnHero.addEventListener("mouseleave", () => {
        gsap.to(btnHero, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });

    btnHero.addEventListener("mouseenter", () => {
        cursor.classList.add("active"); // nyalain efek cursor saat diatas tombol
    });

    btnHero.addEventListener("mouseleave", () => {
        cursor.classList.remove("active"); // matiin efek cursor saat keluar dari tombol
    });
}

// Loop setiap target link dan gambar (hanya jika cursor ada)
if (cursor) {
    targets.forEach(target => {
        target.addEventListener("mouseenter", () => {
            cursor.classList.add("active");
        });

        target.addEventListener("mouseleave", () => {
            cursor.classList.remove("active");
        });
    });
}

// 1. Inisialisasi Lenis untuk smooth scrolling
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

// Langkah 1: Teks Muncul (2 detik untuk tampil)
tl.to(".overlay-text", {
    y: 0,
    opacity: 1,
    duration: 2,
    ease: "power2.out"
});

// Langkah 2: Teks Menghilang (2 detik untuk hilang)
tl.to(".overlay-text", {
    y: 0,
    opacity: 0,
    duration: 2,
    delay: 1 // Tahan 1 detik sebelum hilang
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

// Mendaftarkan plugin agar bisa dipakai
gsap.registerPlugin(ScrollTrigger);

// Animasi Scroll
gsap.to(".about-content h2, .about-content p, .about-image", { // Targetkan kedua elemen
    scrollTrigger: {
        trigger: ".about",
        start: "top 60%",    // Kita ubah sedikit agar mulai saat elemen di 60% layar
    },
    y: 0,
    opacity: 1,
    duration: 3,
    stagger: 0.3,  // Jeda 0.3 detik antar elemen
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

// Menggerakkan kursor mengikuti mouse (hanya jika cursor ada dan bukan mobile)
if (cursor && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });
}

// Fungsi Modal pada gambar proyek
const projectCards = document.querySelectorAll(".project-card");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal-close");

// Buka modal saat kartu proyek diklik
projectCards.forEach(card => {
    card.addEventListener("click", () => {
        const modalId = card.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // mematikan scroll saat modal aktif
        }
    });

    // Membuka modal dengan keyboard (Enter atau Spasi)
    card.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.click();
        }
    });
});

// Tutup modal saat tombol close/X diklik
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const modal = btn.closest(".modal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = ""; // mengembalikan scroll saat modal ditutup
        }
    });
});

// Tutup modal saat klik di luar konten modal/Konten Proyek
modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
});

// Tutup modal saat menekan tombol Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modals.forEach(modal => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }
});


// Preloader - Hapus setelah 4.5 detik (disinkronkan dengan animasi overlay)
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = "none";
        }, 4500);
    }
});

// Progress Bar saat scroll yang diatas
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
    if (scrollProgress) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = scrolled + "%";
    }
});

// Theme Toggle (Dark/Light Mode)
const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

// Muat tema dari LocalStorage saat halaman dimuat
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Filter Proyek
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Hapus class aktif dari semua tombol
        filterButtons.forEach(btn => btn.classList.remove("active"));
        // Tambahkan class aktif ke tombol yang diklik
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        // Tampilkan atau sembunyikan kartu proyek berdasarkan filter
        projectCards.forEach(card => {
            if (filterValue === "all") {
                card.classList.remove("hidden");
            } else {
                const categories = card.getAttribute("data-category").split(" ");
                if (categories.includes(filterValue)) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            }
        });
    });
});

// Animasi Counter
const counters = document.querySelectorAll(".counter");
counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-value"));
    let current = 0;
    const increment = target / 30;

    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, 50);
        } else {
            counter.textContent = target;
        }
    };

    // Gunakan Intersection Observer untuk memulai animasi saat elemen terlihat
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(counter);
        }
    });

    observer.observe(counter);
});

// Timeline Animation
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = "slideInTimeline 0.6s ease forwards";
            timelineObserver.unobserve(entry.target);
        }
    });
});

timelineItems.forEach(item => timelineObserver.observe(item));

// Validasi dan Pengiriman Form Kontak
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Regex untuk validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

        // Bersihkan error sebelumnya
        document.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("error");
            const errorMsg = group.querySelector(".error-msg");
            if (errorMsg) errorMsg.textContent = "";
        });

        // Validasi nama
        if (name.length < 3) {
            showError(document.getElementById("name"), "Nama minimal 3 karakter");
            isValid = false;
        }

        // Validasi email
        if (!emailRegex.test(email)) {
            showError(document.getElementById("email"), "Email tidak valid");
            isValid = false;
        }

        // Validasi pesan
        if (message.length < 10) {
            showError(document.getElementById("message"), "Pesan minimal 10 karakter");
            isValid = false;
        }

        if (isValid) {
            // Simulasi terkirim (harus diganti dengan integrasi backend asli)
            const submitBtn = contactForm.querySelector(".submit-btn");
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Mengirim...";
            submitBtn.disabled = true;

            setTimeout(() => {
                // Tampilkan pesan sukses
                const formMessage = contactForm.querySelector(".form-message");
                formMessage.textContent = "Pesan terkirim! Terima kasih telah menghubungi saya.";
                formMessage.className = "form-message success";

                // Reset form
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Hapus pesan setelah 5 detik
                setTimeout(() => {
                    formMessage.className = "form-message";
                }, 5000);
            }, 1500);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add("error");
    const errorMsg = formGroup.querySelector(".error-msg");
    if (errorMsg) errorMsg.textContent = message;
}

// Tambahkan gaya animasi timeline ke dokumen jika belum ada
if (!document.querySelector("style[data-timeline]")) {
    const style = document.createElement("style");
    style.setAttribute("data-timeline", "true");
    style.textContent = `
        @keyframes slideInTimeline {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}
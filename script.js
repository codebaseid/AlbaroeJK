/* =========================================================
   ALBAROEJK
   Pure JavaScript
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {

    /*
     * GANTI nomor WhatsApp sesuai nomor asli admin.
     *
     * Format:
     * 628xxxxxxxxxx
     *
     * Jangan menggunakan:
     * +62
     * 08...
     * spasi
     * tanda -
     */
    admins: {
        "6289670255996": "Admin 1",
        "6289517607419": "Admin 2",
        "6285695181400": "Admin 3",
        "6285213538741": "Admin 4"
    },

    brand: "AlbaroeJK"

};


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;

const orderForm = document.getElementById("orderForm");

const serviceType =
    document.getElementById("serviceType");

const rankService =
    document.getElementById("rankService");

const bundleService =
    document.getElementById("bundleService");

const starServiceGroup =
    document.getElementById("starServiceGroup");

const bundleServiceGroup =
    document.getElementById("bundleServiceGroup");

const quantity =
    document.getElementById("quantity");

const currentRank =
    document.getElementById("currentRank");

const notes =
    document.getElementById("notes");

const accountId =
    document.getElementById("accountId");

const accountPassword =
    document.getElementById("accountPassword");

const platform =
    document.getElementById("LoginVia");

const requiredHero =
    document.getElementById("requiredHero");

const customerWhatsapp =
    document.getElementById("customerWhatsapp");

const adminWhatsapp =
    document.getElementById("adminWhatsapp");

const summaryService =
    document.getElementById("summaryService");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const summaryTotal =
    document.getElementById("summaryTotal");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(value) {

    const number = Number(value) || 0;

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(title, message) {

    clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mobileNav =
    document.getElementById("mobileNav");


mobileMenuBtn.addEventListener(
    "click",
    () => {

        mobileNav.classList.toggle("open");
        body.classList.toggle("menu-open");

    }
);


mobileNav.querySelectorAll("a").forEach(link => {

    link.addEventListener(
        "click",
        () => {

            mobileNav.classList.remove("open");
            body.classList.remove("menu-open");

        }
    );

});


/* =========================================================
   THEME
   ========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");


const savedTheme =
    localStorage.getItem("albaroejk-theme");


if (savedTheme === "light") {

    body.classList.add("light-theme");
    themeIcon.textContent = "☀";

}


themeToggle.addEventListener(
    "click",
    () => {

        body.classList.toggle("light-theme");

        const isLight =
            body.classList.contains("light-theme");

        localStorage.setItem(
            "albaroejk-theme",
            isLight ? "light" : "dark"
        );

        themeIcon.textContent =
            isLight ? "☀" : "☾";

    }
);


/* =========================================================
   CURRENT YEAR
   ========================================================= */

document.getElementById(
    "currentYear"
).textContent = new Date().getFullYear();


/* =========================================================
   ORDER STATE
   ========================================================= */

let currentStep = 1;

let selectedService = "";
let selectedPrice = 0;
let selectedType = "";


/* =========================================================
   SERVICE TYPE
   ========================================================= */

serviceType.addEventListener(
    "change",
    () => {

        const type = serviceType.value;

        selectedType = type;

        if (type === "star") {

            starServiceGroup.classList.remove("hidden");
            bundleServiceGroup.classList.add("hidden");

            bundleService.value = "";

        } else if (type === "bundle") {

            starServiceGroup.classList.add("hidden");
            bundleServiceGroup.classList.remove("hidden");

            rankService.value = "";

        } else {

            starServiceGroup.classList.remove("hidden");
            bundleServiceGroup.classList.add("hidden");

        }

        updateSelectedService();

    }
);


/* =========================================================
   UPDATE SERVICE
   ========================================================= */

function updateSelectedService() {

    if (serviceType.value === "star") {

        const option =
            rankService.options[
                rankService.selectedIndex
            ];

        selectedService =
            rankService.value || "";

        selectedPrice =
            Number(option?.dataset.price || 0);

    }

    if (serviceType.value === "bundle") {

        const option =
            bundleService.options[
                bundleService.selectedIndex
            ];

        selectedService =
            bundleService.value || "";

        selectedPrice =
            Number(option?.dataset.price || 0);

    }

    updateSummary();

}


/* =========================================================
   SERVICE SELECT CHANGE
   ========================================================= */

rankService.addEventListener(
    "change",
    updateSelectedService
);

bundleService.addEventListener(
    "change",
    updateSelectedService
);


/* =========================================================
   QUANTITY
   ========================================================= */

const minusQuantity =
    document.getElementById("minusQuantity");

const plusQuantity =
    document.getElementById("plusQuantity");


minusQuantity.addEventListener(
    "click",
    () => {

        const current =
            Number(quantity.value) || 1;

        quantity.value =
            Math.max(1, current - 1);

        updateSummary();

    }
);


plusQuantity.addEventListener(
    "click",
    () => {

        const current =
            Number(quantity.value) || 1;

        quantity.value =
            Math.min(999, current + 1);

        updateSummary();

    }
);


quantity.addEventListener(
    "input",
    updateSummary
);


/* =========================================================
   CALCULATE TOTAL
   ========================================================= */

function calculateTotal() {

    const qty =
        Math.max(
            1,
            Number(quantity.value) || 1
        );

    /*
     * Untuk paket bundling,
     * harga paket tidak dikalikan jumlah.
     */
    if (serviceType.value === "bundle") {

        return selectedPrice;

    }

    return selectedPrice * qty;

}


/* =========================================================
   UPDATE SUMMARY
   ========================================================= */

function updateSummary() {

    const total =
        calculateTotal();

    const qty =
        Math.max(
            1,
            Number(quantity.value) || 1
        );

    summaryService.textContent =
        selectedService || "-";

    summaryQuantity.textContent =
        serviceType.value === "bundle"
            ? "1 paket"
            : `${qty} star`;

    summaryTotal.textContent =
        formatRupiah(total);

}


/* =========================================================
   SELECT SERVICE FROM CATALOG
   ========================================================= */

document
    .querySelectorAll(
        ".service-select, .bundle-select"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const service =
                    button.dataset.service;

                const price =
                    Number(button.dataset.price);

                if (
                    button.classList.contains(
                        "bundle-select"
                    )
                ) {

                    serviceType.value = "bundle";

                    starServiceGroup
                        .classList
                        .add("hidden");

                    bundleServiceGroup
                        .classList
                        .remove("hidden");

                    bundleService.value =
                        service;

                } else {

                    serviceType.value = "star";

                    starServiceGroup
                        .classList
                        .remove("hidden");

                    bundleServiceGroup
                        .classList
                        .add("hidden");

                    rankService.value =
                        service;

                }

                selectedService = service;
                selectedPrice = price;

                updateSummary();

                goToStep(1);

                document
                    .getElementById("order")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                showToast(
                    "Layanan dipilih",
                    `${service} berhasil dipilih.`
                );

            }
        );

    });


/* =========================================================
   STEP NAVIGATION
   ========================================================= */

function goToStep(stepNumber) {

    currentStep = stepNumber;

    document
        .querySelectorAll(".form-step")
        .forEach(step => {

            const number =
                Number(
                    step.dataset.formStep
                );

            step.classList.toggle(
                "active",
                number === stepNumber
            );

        });


    document
        .querySelectorAll(".step")
        .forEach(step => {

            const number =
                Number(
                    step.dataset.step
                );

            step.classList.toggle(
                "active",
                number === stepNumber
            );

            step.classList.toggle(
                "completed",
                number < stepNumber
            );

        });


    updateSummary();

}


function validateCurrentStep() {

    const currentForm =
        document.querySelector(
            `.form-step[data-form-step="${currentStep}"]`
        );

    if (!currentForm) {
        return true;
    }

    const requiredFields =
        currentForm.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

    for (const field of requiredFields) {

        if (!field.value.trim()) {

            field.focus();

            showToast(
                "Data belum lengkap",
                "Silakan lengkapi data sebelum lanjut."
            );

            return false;

        }

    }


    /*
     * Step 1 memiliki pilihan layanan
     */
    if (currentStep === 1) {

        if (!serviceType.value) {

            showToast(
                "Pilih layanan",
                "Tentukan joki star atau paket bundling."
            );

            serviceType.focus();

            return false;

        }

        if (
            serviceType.value === "star" &&
            !rankService.value
        ) {

            showToast(
                "Pilih rank",
                "Silakan pilih rank yang ingin dipesan."
            );

            rankService.focus();

            return false;

        }

        if (
            serviceType.value === "bundle" &&
            !bundleService.value
        ) {

            showToast(
                "Pilih paket",
                "Silakan pilih paket bundling."
            );

            bundleService.focus();

            return false;

        }

    }


    /*
     * Step 3
     */
    if (currentStep === 3) {

        if (
            !accountId.value.trim() ||
            !accountPassword.value.trim() ||
            !platform.value
        ) {

            showToast(
                "Data akun belum lengkap",
                "Email/ID, password, dan platform wajib diisi."
            );

            return false;

        }

    }


    /*
     * Step 4
     */
    if (currentStep === 4) {

        if (
            !customerWhatsapp.value.trim() ||
            !adminWhatsapp.value ||
            !document.querySelector(
                'input[name="payment"]:checked'
            )
        ) {

            showToast(
                "Data pembayaran belum lengkap",
                "Lengkapi WhatsApp, admin, dan pembayaran."
            );

            return false;

        }

    }


    return true;

}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

document
    .querySelectorAll(".next-step")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!validateCurrentStep()) {
                    return;
                }

                const next =
                    Number(button.dataset.next);

                goToStep(next);

                document
                    .getElementById("order")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    });


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

document
    .querySelectorAll(".prev-step")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const previous =
                    Number(button.dataset.prev);

                goToStep(previous);

            }
        );

    });


/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener(
    "click",
    () => {

        const isPassword =
            accountPassword.type === "password";

        accountPassword.type =
            isPassword
                ? "text"
                : "password";

        togglePassword.textContent =
            isPassword
                ? "Sembunyikan"
                : "Lihat";

    }
);


/* =========================================================
   NORMALIZE WHATSAPP
   ========================================================= */

function normalizeWhatsapp(number) {

    let clean =
        String(number)
            .replace(/\D/g, "");

    if (clean.startsWith("0")) {

        clean =
            "62" + clean.slice(1);

    }

    if (clean.startsWith("+62")) {

        clean =
            clean.slice(1);

    }

    return clean;

}


/* =========================================================
   ESCAPE MESSAGE VALUE
   ========================================================= */

function safeValue(value) {

    const clean =
        String(value || "").trim();

    return clean || "-";

}


/* =========================================================
   GET PAYMENT
   ========================================================= */

function getPaymentMethod() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    return selected
        ? selected.value
        : "-";

}


/* =========================================================
   BUILD WHATSAPP MESSAGE
   ========================================================= */

function buildWhatsappMessage() {

    const customerNumber =
        normalizeWhatsapp(
            customerWhatsapp.value
        );

    const payment =
        getPaymentMethod();

    const qty =
        Math.max(
            1,
            Number(quantity.value) || 1
        );

    const total =
        calculateTotal();


    const message = [

        `*ORDER ${CONFIG.brand.toUpperCase()}*`,

        ``,

        `Halo Admin ${CONFIG.brand}, ingin melakukan order.`,

        ``,

        `*DETAIL LAYANAN*`,
        `Layanan: ${safeValue(selectedService)}`,
        `Jenis: ${
            serviceType.value === "bundle"
                ? "Paket Bundling"
                : "Joki Rank / Star"
        }`,
        `Jumlah: ${
            serviceType.value === "bundle"
                ? "1 Paket"
                : `${qty} Star`
        }`,
        `Rank Saat Ini: ${safeValue(currentRank.value)}`,
        `Total Estimasi: ${formatRupiah(total)}`,

        ``,

        `*DATA AKUN*`,
        `Email / ID: ${safeValue(accountId.value)}`,
        `Password: ${safeValue(accountPassword.value)}`,
        `Platform: ${safeValue(platform.value)}`,
        `Hero Request: ${safeValue(requiredHero.value)}`,

        ``,

        `*CATATAN*`,
        `${safeValue(notes.value)}`,

        ``,

        `*PEMBAYARAN*`,
        `Metode: ${payment}`,

        ``,

        `*KONTAK PELANGGAN*`,
        `WhatsApp: ${customerNumber || safeValue(customerWhatsapp.value)}`,

        ``,

        `Mohon konfirmasi detail order dan total pembayaran sebelum proses dimulai.`

    ].join("\n");


    return message;

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!validateCurrentStep()) {
            return;
        }


        const agreement =
            document.getElementById("agreement");


        if (!agreement.checked) {

            showToast(
                "Konfirmasi diperlukan",
                "Centang persetujuan sebelum mengirim order."
            );

            agreement.focus();

            return;

        }


        const adminNumber =
            adminWhatsapp.value;


        if (!adminNumber) {

            showToast(
                "Admin belum dipilih",
                "Pilih salah satu admin WhatsApp."
            );

            return;

        }


        const message =
            buildWhatsappMessage();


        const whatsappUrl =
            `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================================================
   LIVE SUMMARY
   ========================================================= */

[
    currentRank,
    notes,
    accountId,
    accountPassword,
    platform,
    requiredHero,
    customerWhatsapp
].forEach(field => {

    if (!field) {
        return;
    }

    field.addEventListener(
        "input",
        updateSummary
    );

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

serviceType.value = "";

starServiceGroup.classList.remove("hidden");
bundleServiceGroup.classList.add("hidden");

updateSummary();


/* =========================================================
   PREVENT INVALID QUANTITY
   ========================================================= */

quantity.addEventListener(
    "blur",
    () => {

        let value =
            Number(quantity.value) || 1;

        value =
            Math.min(
                999,
                Math.max(1, value)
            );

        quantity.value = value;

        updateSummary();

    }
);


/* =========================================================
   ESCAPE ENTER ON INPUT
   ========================================================= */

orderForm.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            event.target.tagName !== "TEXTAREA"
        ) {

            event.preventDefault();

        }

    }
);
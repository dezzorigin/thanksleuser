/* ==========================================================================
   Thanksleuser Web MVP - Application Logic (ES6 Vanilla JS)
   Implements FR-1 to FR-6 per prd.md specifications
   Aligned with Design Spec v2 (Light Editorial Outdoor Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let allTripsData = [];
  let showAllTrips = false;
  let currentFilters = {
    kategori: 'all',
    tingkatKesulitan: 'all',
    date: 'all',
    budget: 'all'
  };
  let activeSelectedTrip = null;

  // Merchandise State
  let selectedMerchColor = null;
  let selectedMerchSize = null;

  // DOM Elements
  const tripGridContainer = document.getElementById('trip-grid-container');
  const exploreMoreContainer = document.getElementById('explore-more-container');
  const btnExploreMore = document.getElementById('btn-explore-more');
  const exploreMoreText = document.getElementById('explore-more-text');
  const exploreMoreIcon = document.getElementById('explore-more-icon');

  const bookingModal = document.getElementById('booking-modal');
  const bookingForm = document.getElementById('booking-form');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTripTitle = document.getElementById('modal-trip-title');
  const modalTripDate = document.getElementById('modal-trip-date');

  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  // Destination Data with Multiple Photos for Bento Grid (Section 7 & 12 design.md v2)
  const destinasiData = {
    'savana-siron': {
      nama: 'Padang Savana Siron',
      elevasi: '450 mdpl',
      jarak: '6 km (Trek Landai)',
      kesulitan: 'Pemula',
      foto1: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      foto2: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
      foto3: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
      deskripsi: 'Savana Siron menyajikan keindahan bukit-bukit hijau berlapis yang membentang indah. Tempat paling sempurna untuk camping keluarga maupun pendaki pemula yang mendambakan pemandangan bintang malam tanpa trek berat.'
    },
    'gle-bae': {
      nama: 'Punggungan Gle Bae',
      elevasi: '1.200 mdpl',
      jarak: '12 km (Ridge Walk)',
      kesulitan: 'Menengah',
      foto1: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      foto2: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
      foto3: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
      deskripsi: 'Gle Bae menawarkan pengalaman berjalan di sepanjang pematang punggungan gunung dengan hutan lumut eksotis dan pemandangan samudera awan spektakuler saat terbit matahari.'
    },
    'seulawah': {
      nama: 'Gunung Seulawah Agam',
      elevasi: '1.810 mdpl',
      jarak: '18 km (Kawah & Puncak)',
      kesulitan: 'Lanjutan',
      foto1: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
      foto2: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
      foto3: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80',
      deskripsi: 'Gunung berapi aktif legendaris di Aceh. Menawarkan tantangan fisik pendakian tektok menembus hutan tropis lebat hingga kawah vulkanik aktif dan puncak utama.'
    },
    'leuser': {
      nama: 'Taman Nasional Leuser',
      elevasi: '3.404 mdpl',
      jarak: 'Ekspedisi 5-7 Hari',
      kesulitan: 'Lanjutan',
      foto1: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      foto2: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80',
      foto3: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
      deskripsi: 'Salah satu ekosistem hutan hujan terluas di Asia Tenggara. Rumah bagi satwa liar langka Sumatera dan tempat pengujian ketahanan fisik serta mental sejati para petualang.'
    }
  };

  // Format Helper: Currency IDR
  function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format Helper: Date Range
  function formatDateRange(startStr, endStr) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (startStr === endStr) {
      return start.toLocaleDateString('id-ID', options);
    }
    const startDay = start.getDate();
    const endFormatted = end.toLocaleDateString('id-ID', options);
    return `${startDay} - ${endFormatted}`;
  }

  // 1. Fetch & Initialize Data (FR-1)
  async function loadTripsData() {
    try {
      const response = await fetch('data/trips.json');
      if (!response.ok) throw new Error('Gagal memuat data trips.json');
      allTripsData = await response.json();
      renderTrips();
    } catch (err) {
      console.error(err);
      tripGridContainer.innerHTML = `
        <div class="empty-state">
          <h3>Gagal Memuat Data Trip</h3>
          <p class="body-text">Terjadi kesalahan saat memuat jadwal trip. Pastikan file data/trips.json tersedia.</p>
        </div>
      `;
    }
  }

  // Calculate Trip Status based on Acceptance Criteria (FR-1)
  function getTripStatus(trip) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(trip.batasPendaftaran);
    deadline.setHours(23, 59, 59, 999);

    const sisaKuota = trip.kuotaTotal - trip.kuotaTerisi;
    const rasioSisa = sisaKuota / trip.kuotaTotal;

    // AC 3: If today > batasPendaftaran -> Pendaftaran Ditutup
    if (today > deadline) {
      return {
        code: 'closed',
        label: 'Pendaftaran Ditutup',
        badgeClass: 'badge-closed',
        isBookable: false
      };
    }

    // AC 1: If kuotaTerisi == kuotaTotal -> Sold Out
    if (trip.kuotaTerisi >= trip.kuotaTotal || sisaKuota <= 0) {
      return {
        code: 'soldout',
        label: 'Sold Out',
        badgeClass: 'badge-danger',
        isBookable: false
      };
    }

    // AC 2: If sisa kuota < 30% of total -> Sisa X Slot (Warning)
    if (rasioSisa < 0.30) {
      return {
        code: 'warning',
        label: `Hampir Penuh (Sisa ${sisaKuota} Slot)`,
        badgeClass: 'badge-warning',
        isBookable: true
      };
    }

    // Normal Available
    return {
      code: 'available',
      label: `Tersedia (${sisaKuota} Slot)`,
      badgeClass: 'badge-success',
      isBookable: true
    };
  }

  // 2. Render Trips & Multi-Filtering (Reference Image Tour Card Layout)
  function renderTrips() {
    const filteredTrips = allTripsData.filter(trip => {
      const matchKategori = currentFilters.kategori === 'all' || trip.kategori === currentFilters.kategori;
      const matchKesulitan = currentFilters.tingkatKesulitan === 'all' || trip.tingkatKesulitan === currentFilters.tingkatKesulitan;

      let matchBudget = true;
      if (currentFilters.budget === 'low') matchBudget = trip.harga < 200000;
      else if (currentFilters.budget === 'mid') matchBudget = trip.harga >= 200000 && trip.harga <= 350000;
      else if (currentFilters.budget === 'high') matchBudget = trip.harga > 350000;

      return matchKategori && matchKesulitan && matchBudget;
    });

    if (filteredTrips.length === 0) {
      tripGridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
          <h3 style="font-size: 24px; margin-bottom: 8px;">Belum ada trip untuk filter ini</h3>
          <p class="body-text">Coba ubah opsi filter atau pencarian di atas.</p>
        </div>
      `;
      if (exploreMoreContainer) exploreMoreContainer.style.display = 'none';
      return;
    }

    // Limit initial display to 6 trips unless showAllTrips is toggled
    const tripsToRender = showAllTrips ? filteredTrips : filteredTrips.slice(0, 6);

    tripGridContainer.innerHTML = tripsToRender.map(trip => {
      const rating = trip.rating || '4.9';
      const lokasiText = trip.lokasiSingkat || 'Aceh, Indonesia';
      const status = getTripStatus(trip);
      const isBookable = status.isBookable;
      const btnText = isBookable ? 'Booking Slot' : status.label;
      const btnDisabled = !isBookable ? 'disabled' : '';

      return `
        <div class="tour-card" data-trip-id="${trip.id}">
          <img src="${trip.foto}" alt="${trip.nama}" class="tour-card-bg" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';">
          
          <div class="tour-card-top">
            <div class="tour-rating-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFC107">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${rating}
            </div>
          </div>

          <div class="tour-card-bottom-glass">
            <div class="tour-info-left">
              <h3 class="tour-card-title">${trip.nama}</h3>
              <div class="tour-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${lokasiText}
              </div>
            </div>
            <div class="tour-action-right">
              <div class="tour-price">${formatRupiah(trip.harga)}</div>
              <button class="btn-card-book" ${btnDisabled}>
                ${btnText}
                ${isBookable ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>` : ''}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    attachCardEventListeners();

    // Manage Explore More Button
    if (exploreMoreContainer && btnExploreMore) {
      if (filteredTrips.length > 6) {
        exploreMoreContainer.style.display = 'block';
        if (showAllTrips) {
          exploreMoreText.textContent = 'Tampilkan Lebih Sedikit';
          exploreMoreIcon.style.transform = 'rotate(180deg)';
        } else {
          const sisa = filteredTrips.length - 6;
          exploreMoreText.textContent = `Eksplor Trip Lainnya (${sisa})`;
          exploreMoreIcon.style.transform = 'rotate(0deg)';
        }
      } else {
        exploreMoreContainer.style.display = 'none';
      }
    }
  }

  function attachCardEventListeners() {
    document.querySelectorAll('.tour-card').forEach(card => {
      card.addEventListener('click', () => {
        const tripId = card.getAttribute('data-trip-id');
        const trip = allTripsData.find(t => t.id === tripId);
        if (trip) openBookingModal(trip);
      });
    });
  }

  // Handle Explore More Button click
  if (btnExploreMore) {
    btnExploreMore.addEventListener('click', () => {
      showAllTrips = !showAllTrips;
      renderTrips();
    });
  }

  // 3. Tour Search Widget & Pill Filter Handlers
  const tourPills = document.querySelectorAll('.tour-filter-pill');
  tourPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tourPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      showAllTrips = false;
      currentFilters.kategori = pill.getAttribute('data-val');
      renderTrips();
    });
  });

  // Custom Popover Dropdown Handlers
  const dropdownContainers = document.querySelectorAll('.custom-dropdown-container');

  function closeAllDropdowns() {
    dropdownContainers.forEach(container => {
      container.classList.remove('open');
      const popover = container.querySelector('.custom-dropdown-popover');
      if (popover) popover.classList.remove('open');
    });
  }

  dropdownContainers.forEach(container => {
    const trigger = container.querySelector('.custom-dropdown-trigger');
    const popover = container.querySelector('.custom-dropdown-popover');
    const options = container.querySelectorAll('.custom-option');
    const labelTextEl = container.querySelector('.dropdown-label-text');

    let filterKey = 'kategori';
    if (container.id === 'dropdown-container-date') filterKey = 'date';
    else if (container.id === 'dropdown-container-budget') filterKey = 'budget';
    else if (container.id === 'dropdown-container-level') filterKey = 'tingkatKesulitan';

    if (trigger && popover) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          container.classList.add('open');
          popover.classList.add('open');
        }
      });
    }

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const val = option.getAttribute('data-value');
        const label = option.getAttribute('data-label') || option.querySelector('span').textContent;

        showAllTrips = false;
        currentFilters[filterKey] = val;
        if (labelTextEl) labelTextEl.textContent = label;

        closeAllDropdowns();
        renderTrips();
      });
    });
  });

  // Close popovers on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown-container')) {
      closeAllDropdowns();
    }
  });

  const btnSearchTrigger = document.getElementById('btn-search-trigger');
  if (btnSearchTrigger) {
    btnSearchTrigger.addEventListener('click', () => {
      closeAllDropdowns();
      showAllTrips = false;
      renderTrips();
    });
  }

  // 4. Multi-Step Wizard Booking Modal & WhatsApp Form Generator (FR-4 - Image 2 Style)
  let currentWizardStep = 1;

  const wizardHeadings = {
    1: { title: "Data Diri Peserta", subtitle: "Lengkapi informasi dasar identitas peserta open trip" },
    2: { title: "Data Safety & Kontak Darurat", subtitle: "Kontak darurat & riwayat medis untuk keamanan pendakian" },
    3: { title: "Tambahan & Logistics", subtitle: "Ukuran kaos eksklusif & penyewaan alat tambahan" }
  };

  const btnWizardBack = document.getElementById('btn-wizard-back');
  const btnWizardNext = document.getElementById('btn-wizard-next');
  const btnWizardSubmit = document.getElementById('btn-wizard-submit');
  const wizardStepHeading = document.getElementById('wizard-step-heading');
  const wizardStepSubheading = document.getElementById('wizard-step-subheading');
  const wizardStepCaption = document.getElementById('wizard-step-caption');

  function updateWizardUI(step) {
    currentWizardStep = step;

    // Toggle panels
    document.querySelectorAll('.wizard-step-panel').forEach((panel, idx) => {
      if (idx + 1 === step) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Toggle stepper bar items
    document.querySelectorAll('.wizard-step-item').forEach((item) => {
      const itemStep = parseInt(item.getAttribute('data-step'));
      item.classList.remove('active', 'completed');
      if (itemStep === step) {
        item.classList.add('active');
        item.querySelector('.step-dot').textContent = itemStep;
      } else if (itemStep < step) {
        item.classList.add('completed');
        item.querySelector('.step-dot').textContent = '✓';
      } else {
        item.querySelector('.step-dot').textContent = itemStep;
      }
    });

    // Update card header
    if (wizardHeadings[step] && wizardStepHeading && wizardStepSubheading) {
      wizardStepHeading.textContent = wizardHeadings[step].title;
      wizardStepSubheading.textContent = wizardHeadings[step].subtitle;
    }

    // Update bottom caption
    if (wizardStepCaption && wizardHeadings[step]) {
      wizardStepCaption.textContent = `Step ${step} of 3: ${wizardHeadings[step].title}`;
    }

    // Toggle buttons
    if (step === 1) {
      if (btnWizardBack) btnWizardBack.style.display = 'none';
      if (btnWizardNext) btnWizardNext.style.display = 'inline-block';
      if (btnWizardSubmit) btnWizardSubmit.style.display = 'none';
    } else if (step === 2) {
      if (btnWizardBack) btnWizardBack.style.display = 'inline-block';
      if (btnWizardNext) btnWizardNext.style.display = 'inline-block';
      if (btnWizardSubmit) btnWizardSubmit.style.display = 'none';
    } else if (step === 3) {
      if (btnWizardBack) btnWizardBack.style.display = 'inline-block';
      if (btnWizardNext) btnWizardNext.style.display = 'none';
      if (btnWizardSubmit) btnWizardSubmit.style.display = 'inline-block';
    }
  }

  function validateStep(step) {
    let isValid = true;

    function checkReq(id, errId) {
      const el = document.getElementById(id);
      if (!el) return '';
      const val = el.value.trim();
      const errEl = document.getElementById(errId);
      if (!val) {
        if (errEl) errEl.classList.add('visible');
        isValid = false;
      } else {
        if (errEl) errEl.classList.remove('visible');
      }
      return val;
    }

    function checkPh(id, errId) {
      const el = document.getElementById(id);
      if (!el) return '';
      const val = el.value.trim();
      const errEl = document.getElementById(errId);
      const isDigits = /^[0-9+ -]{8,16}$/.test(val);
      if (!val || !isDigits) {
        if (errEl) errEl.classList.add('visible');
        isValid = false;
      } else {
        if (errEl) errEl.classList.remove('visible');
      }
      return val;
    }

    if (step === 1) {
      checkReq('namaLengkap', 'err-namaLengkap');
      checkReq('namaPanggilan', 'err-namaPanggilan');
      checkPh('noWA', 'err-noWA');
      checkReq('akunIG', 'err-akunIG');
    } else if (step === 2) {
      checkReq('kontakDaruratNama', 'err-kontakDaruratNama');
      checkReq('kontakDaruratHubungan', 'err-kontakDaruratHubungan');
      checkPh('kontakDaruratTelp', 'err-kontakDaruratTelp');
      checkReq('golonganDarah', 'err-golonganDarah');
    } else if (step === 3) {
      checkReq('ukuranKaos', 'err-ukuranKaos');
    }

    return isValid;
  }

  if (btnWizardNext) {
    btnWizardNext.addEventListener('click', () => {
      if (validateStep(currentWizardStep)) {
        updateWizardUI(currentWizardStep + 1);
      }
    });
  }

  if (btnWizardBack) {
    btnWizardBack.addEventListener('click', () => {
      if (currentWizardStep > 1) {
        updateWizardUI(currentWizardStep - 1);
      }
    });
  }

  function openBookingModal(trip) {
    activeSelectedTrip = trip;
    modalTripTitle.textContent = trip.nama;
    modalTripDate.textContent = `Tanggal: ${formatDateRange(trip.tanggalMulai, trip.tanggalSelesai)} | Harga: ${formatRupiah(trip.harga)}`;

    bookingForm.reset();
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));

    updateWizardUI(1);

    bookingModal.classList.add('open');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingModal.classList.remove('open');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeBookingModal);
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeSelectedTrip) return;

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const namaLengkap = document.getElementById('namaLengkap').value.trim();
    const namaPanggilan = document.getElementById('namaPanggilan').value.trim();
    const noWA = document.getElementById('noWA').value.trim();
    const akunIG = document.getElementById('akunIG').value.trim();

    const kontakDaruratNama = document.getElementById('kontakDaruratNama').value.trim();
    const kontakDaruratHubungan = document.getElementById('kontakDaruratHubungan').value.trim();
    const kontakDaruratTelp = document.getElementById('kontakDaruratTelp').value.trim();
    const riwayatMedis = document.getElementById('riwayatMedis').value.trim() || 'Tidak ada';
    const golonganDarah = document.getElementById('golonganDarah').value.trim();

    const ukuranKaos = document.getElementById('ukuranKaos').value.trim();
    const sewaAlat = document.getElementById('sewaAlat').value || 'Tidak ada';

    const dateFormatted = formatDateRange(activeSelectedTrip.tanggalMulai, activeSelectedTrip.tanggalSelesai);
    const hargaFormatted = formatRupiah(activeSelectedTrip.harga);

    const waText =
      `FORM REGISTRASI OPEN TRIP THANKSLEUSER
------------------------------
Trip: ${activeSelectedTrip.nama} (${dateFormatted})
Nama: ${namaLengkap} (${namaPanggilan})
WA: ${noWA}
IG: ${akunIG}
Gol. Darah: ${golonganDarah}
Kontak Darurat: ${kontakDaruratNama} (${kontakDaruratHubungan}) - ${kontakDaruratTelp}
Riwayat Medis: ${riwayatMedis}
Ukuran Kaos: ${ukuranKaos}
Sewa Alat: ${sewaAlat}
------------------------------
Total Tagihan: ${hargaFormatted}
Mohon instruksi transfer dan konfirmasi slot.`;

    const adminWANumber = '6282284245086';
    const waURL = `https://wa.me/${adminWANumber}?text=${encodeURIComponent(waText)}`;

    window.open(waURL, '_blank');
    closeBookingModal();
  });

  // 5. Merchandise Handlers (Exact Shopee PDP Interactivity - Zero Emojis)
  const merchHeroPreview = document.getElementById('merch-img-preview');
  const shopeeThumbBtns = document.querySelectorAll('.shopee-thumb-btn');
  const shopeeColorPills = document.querySelectorAll('#merch-color-options .shopee-color-pill');
  const shopeeSizeBtns = document.querySelectorAll('#merch-size-options .shopee-size-btn');
  const btnQtyMinus = document.getElementById('btn-qty-minus');
  const btnQtyPlus = document.getElementById('btn-qty-plus');
  const inputMerchQty = document.getElementById('input-merch-qty');
  const btnAddCartMerch = document.getElementById('btn-add-cart-merch');
  const btnPreorderMerch = document.getElementById('btn-preorder-merch');
  const thumbTrack = document.querySelector('.shopee-thumb-track');
  const thumbPrevBtn = document.getElementById('thumb-prev-btn');
  const thumbNextBtn = document.getElementById('thumb-next-btn');

  let merchQty = 1;
  selectedMerchColor = 'Hitam';
  selectedMerchSize = 'M';

  // Set initial selected state for size M
  shopeeSizeBtns.forEach(btn => {
    if (btn.getAttribute('data-size') === 'M') {
      btn.classList.add('selected');
    }
  });

  // Quantity Stepper Handlers
  if (btnQtyMinus && btnQtyPlus && inputMerchQty) {
    btnQtyMinus.addEventListener('click', () => {
      if (merchQty > 1) {
        merchQty--;
        inputMerchQty.value = merchQty;
      }
    });

    btnQtyPlus.addEventListener('click', () => {
      if (merchQty < 99) {
        merchQty++;
        inputMerchQty.value = merchQty;
      }
    });

    inputMerchQty.addEventListener('change', () => {
      let val = parseInt(inputMerchQty.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      merchQty = val;
      inputMerchQty.value = merchQty;
    });
  }

  // Thumbnail Carousel Nav
  if (thumbTrack) {
    if (thumbPrevBtn) {
      thumbPrevBtn.addEventListener('click', () => {
        thumbTrack.scrollBy({ left: -160, behavior: 'smooth' });
      });
    }
    if (thumbNextBtn) {
      thumbNextBtn.addEventListener('click', () => {
        thumbTrack.scrollBy({ left: 160, behavior: 'smooth' });
      });
    }
  }

  // Thumbnail Selection Handler
  shopeeThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shopeeThumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgSrc = btn.getAttribute('data-img');
      if (merchHeroPreview && imgSrc) {
        merchHeroPreview.src = imgSrc;
      }

      const color = btn.getAttribute('data-color');
      if (color) selectShopeeColor(color);
    });
  });

  // Color Pill Selection Handler
  function selectShopeeColor(colorName) {
    selectedMerchColor = colorName;

    shopeeColorPills.forEach(pill => {
      if (pill.getAttribute('data-color') === colorName) {
        pill.classList.add('selected');
        const colorImg = pill.getAttribute('data-img');
        if (merchHeroPreview && colorImg) {
          merchHeroPreview.src = colorImg;
        }
      } else {
        pill.classList.remove('selected');
      }
    });

    shopeeThumbBtns.forEach(btn => {
      if (btn.getAttribute('data-color') === colorName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  shopeeColorPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const color = pill.getAttribute('data-color');
      selectShopeeColor(color);
    });
  });

  // Size Button Selection Handler
  shopeeSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shopeeSizeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMerchSize = btn.getAttribute('data-size');
    });
  });

  // Order via WhatsApp (Beli Sekarang & Masukkan Keranjang)
  function sendShopeeWhatsAppOrder(actionType) {
    const qty = merchQty || 1;
    const color = selectedMerchColor || 'Hitam';
    const size = selectedMerchSize || 'M';

    const merchWAText =
      `FORM PRE-ORDER OFFICIAL MERCHANDISE THANKSLEUSER
==================================================
Detail Pemesanan:
- Produk : THANKSLEUSER TACTICAL OVERSIZED T-SHIRT
- Warna  : ${color}
- Ukuran : ${size}
- Jumlah : ${qty} Pcs
- Harga  : Rp 150.000 / pcs
- Total  : Rp ${(150000 * qty).toLocaleString('id-ID')}

Halo Admin Thanksleuser, saya ingin melakukan Pre-Order kaos official edisi terbatas ini. Mohon info nomor rekening dan alur pengirimannya. Terima kasih!`;

    const adminWANumber = '6282284245086';
    const waURL = `https://wa.me/${adminWANumber}?text=${encodeURIComponent(merchWAText)}`;
    window.open(waURL, '_blank');
  }

  if (btnPreorderMerch) {
    btnPreorderMerch.addEventListener('click', () => sendShopeeWhatsAppOrder('Beli Sekarang'));
  }

  if (btnAddCartMerch) {
    btnAddCartMerch.addEventListener('click', () => sendShopeeWhatsAppOrder('Masukkan Keranjang'));
  }

  // Size Chart Modal Handlers
  const btnOpenSizeChart = document.getElementById('btn-open-size-chart');
  const sizeChartModal = document.getElementById('size-chart-modal');
  const sizeChartCloseBtn = document.getElementById('size-chart-close-btn');

  if (btnOpenSizeChart && sizeChartModal) {
    btnOpenSizeChart.addEventListener('click', () => {
      sizeChartModal.classList.add('open');
      sizeChartModal.setAttribute('aria-hidden', 'false');
    });

    if (sizeChartCloseBtn) {
      sizeChartCloseBtn.addEventListener('click', () => {
        sizeChartModal.classList.remove('open');
        sizeChartModal.setAttribute('aria-hidden', 'true');
      });
    }

    sizeChartModal.addEventListener('click', (e) => {
      if (e.target === sizeChartModal) {
        sizeChartModal.classList.remove('open');
        sizeChartModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 6. Destination Section Tabs with Bento Grid Rendering
  const destTabs = document.querySelectorAll('#destinasi-tabs .tab-btn');
  const destContainer = document.getElementById('destinasi-content-container');

  function renderDestination(key) {
    if (!destContainer) return;
    const data = destinasiData[key];
    if (!data) return;

    destContainer.innerHTML = `
      <div class="destinasi-card">
        <!-- Asymmetric Bento Grid for Destination Photos -->
        <div class="destinasi-bento-grid">
          <div class="bento-item bento-item-large">
            <img src="${data.foto1}" alt="${data.nama} Main View" loading="lazy">
          </div>
          <div class="bento-item">
            <img src="${data.foto2}" alt="${data.nama} Detail View 1" loading="lazy">
          </div>
          <div class="bento-item">
            <img src="${data.foto3}" alt="${data.nama} Detail View 2" loading="lazy">
          </div>
        </div>

        <div class="destinasi-info-box">
          <div>
            <h2 style="font-size: 36px; margin-bottom: 6px;">${data.nama}</h2>
            <div class="destinasi-stats-text">
              <span>⛰️ ${data.elevasi}</span>
              <span>•</span>
              <span>🥾 ${data.jarak}</span>
              <span>•</span>
              <span>💪 Level ${data.kesulitan}</span>
            </div>
          </div>

          <p class="body-text">${data.deskripsi}</p>
          <div>
            <a href="#trips" class="btn btn-outline">Cek Jadwal Trip Destinasi Ini</a>
          </div>
        </div>
      </div>
    `;
  }

  if (destTabs.length > 0) {
    destTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        destTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.getAttribute('data-dest');
        renderDestination(key);
      });
    });

    renderDestination('savana-siron');
  }

  // 7. Mobile Navigation Drawer Toggle
  hamburgerToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });

  // 8. Gallery Lightbox
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      lightboxImg.src = fullSrc;
      lightboxModal.classList.add('open');
    });
  });

  lightboxModal.addEventListener('click', () => {
    lightboxModal.classList.remove('open');
  });

  // 9. Sticky Header Scroll Background Effect (Hysteresis to Prevent Flicker)
  const siteHeader = document.querySelector('.site-header');
  function updateHeaderOnScroll() {
    if (!siteHeader) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else if (scrollY < 10) {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    if (!globalLenis) updateHeaderOnScroll();
  }, { passive: true });
  updateHeaderOnScroll();

  // 10. Seamless 3D Parallax Gallery Implementation
  const parallaxWrapper = document.getElementById('parallax-scroll-wrapper');
  const parallaxBanner = document.getElementById('parallax-banner-card');
  const parallaxMatrixGrid = document.getElementById('parallax-matrix-grid');
  const col1 = document.getElementById('para-col-1');
  const col2 = document.getElementById('para-col-2');
  const col3 = document.getElementById('para-col-3');
  const col4 = document.getElementById('para-col-4');

  let updateParallaxGallery = function() {};

  if (parallaxWrapper && parallaxBanner && parallaxMatrixGrid) {
    const imagesData = [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=800&q=80"
    ];

    const titles = [
      "Savana Siron", "Api Unggun Malam", "Lautan Awan Gle Bae", "Puncak Seulawah Agam",
      "Bukit Savana", "Hutan Tropis Leuser", "Camp Stargazing", "Ridge Walk",
      "Basecamp Mount", "Summit Attack", "Sunrise Point", "Jalur Ekspedisi",
      "Lembah Hijau", "Sungai Jernih", "Punggungan Bukit", "Camp Ground Pagi"
    ];

    // Clear and Populate 4 Columns (16 cards total, 4 per column for optimal 60fps performance)
    const cols = [col1, col2, col3, col4];
    cols.forEach(c => { if (c) c.innerHTML = ''; });

    imagesData.forEach((src, idx) => {
      const targetCol = cols[idx % 4];
      if (!targetCol) return;

      const card = document.createElement('div');
      card.className = 'parallax-image-card';
      card.innerHTML = `
        <img src="${src}" alt="${titles[idx]}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';">
        <div class="parallax-card-label">
          <span class="parallax-card-title">${titles[idx]}</span>
          <span class="parallax-card-sub">Thanksleuser</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (lightboxModal && lightboxImg) {
          lightboxImg.src = src;
          lightboxModal.classList.add('open');
        }
      });

      targetCol.appendChild(card);
    });

    // Viewport-based smooth parallax calculation (100% immune to layout shifts)
    let isParallaxTicking = false;

    updateParallaxGallery = function() {
      if (!parallaxWrapper || !parallaxMatrixGrid) return;
      const rect = parallaxWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Only compute when element is near or within viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const p = Math.max(0, Math.min(1, -rect.top / totalScrollable));

        const rotateX = 6 - p * 6;
        const translateZ = -80 + p * 80;

        parallaxMatrixGrid.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(0deg) translateZ(${translateZ.toFixed(1)}px)`;

        const y1 = -p * 28;
        const y2 = -24 + p * 28;
        const y3 = -6 + p * 28;
        const y4 = -26 + p * 28;

        if (col1) col1.style.transform = `translate3d(0, ${y1.toFixed(2)}%, 0)`;
        if (col2) col2.style.transform = `translate3d(0, ${y2.toFixed(2)}%, 0)`;
        if (col3) col3.style.transform = `translate3d(0, ${y3.toFixed(2)}%, 0)`;
        if (col4) col4.style.transform = `translate3d(0, ${y4.toFixed(2)}%, 0)`;
      }
    };

    window.addEventListener('scroll', () => {
      if (!globalLenis && !isParallaxTicking) {
        isParallaxTicking = true;
        requestAnimationFrame(() => {
          updateParallaxGallery();
          isParallaxTicking = false;
        });
      }
    }, { passive: true });
  }

  // GSAP & Lenis Multi-Layer Parallax Hero Initialization (Instant Smooth Scrub)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = document.querySelector('[data-parallax-layers]');
    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      const layers = [
        { layer: "1", yPercent: 25 },
        { layer: "2", yPercent: 15 },
        { layer: "3", yPercent: 8 },
        { layer: "4", yPercent: 0 }
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (targets.length > 0) {
          tl.to(targets, {
            yPercent: layerObj.yPercent,
            ease: "none",
            force3D: true
          }, idx === 0 ? undefined : "<");
        }
      });
    }
  }

  let globalLenis = null;
  if (typeof Lenis !== 'undefined') {
    globalLenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      smoothTouch: false
    });

    globalLenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      updateHeaderOnScroll();
      updateParallaxGallery();
    });

    function lenisRaf(time) {
      globalLenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }

  // Universal Ultra-Smooth Lenis Anchor & Navbar Click Handler
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Close mobile nav drawer if open
          if (mobileNav && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
          }

          if (globalLenis) {
            globalLenis.scrollTo(targetElement, {
              offset: -76,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 76;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });

  // Initialize
  loadTripsData();
});

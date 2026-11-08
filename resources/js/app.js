document.addEventListener("DOMContentLoaded", () => {
  const movies = [
    { id: 1, title: "Avatar: Fire and Ash", poster: "public/images/posters/Avatar%20Fire%20and%20Ash.jpeg", genre: "Petualangan", year: "2026", age: "13+", duration: "2j 10m", rating: "8.7", price: 45000, description: "Petualangan fiksi ilmiah di dunia asing, dengan visual alam yang luas dan konflik antarkelompok." },
    { id: 2, title: "Spider-Man: Brand New Day", poster: "public/images/posters/Spider-Man%20Brand%20New%20Day.jpeg", genre: "Petualangan", year: "2026", age: "13+", duration: "2j 05m", rating: "8.4", price: 40000, description: "Kisah pahlawan kota yang menghadapi tantangan baru sambil berusaha menjaga kehidupan sehari-harinya." },
    { id: 3, title: "Toy Story 5", poster: "public/images/posters/toy%20story%205.jpeg", genre: "Animasi", year: "2026", age: "SU", duration: "1j 45m", rating: "8.6", price: 35000, description: "Petualangan keluarga tentang persahabatan, mainan, dan perubahan saat dunia anak-anak terus berkembang." },
    { id: 4, title: "Danur: The Last Chapter", poster: "public/images/posters/Danur%20The%20Last%20Chapter.jpg", genre: "Horor", year: "2026", age: "17+", duration: "1j 38m", rating: "4.6", price: 35000, description: "Bab terakhir dari kisah Danur. Pilih jadwal tayang dan kursi untuk menyaksikan film horor ini." }
  ];
  const dates = [
    { value: "2026-11-08", label: "Min, 8 Nov" },
    { value: "2026-11-09", label: "Sen, 9 Nov" },
    { value: "2026-11-10", label: "Sel, 10 Nov" }
  ];
  const times = ["13:15", "15:40", "18:10", "20:45"];
  const feePerTicket = 3000;
  const state = { movie: null, date: dates[0], time: null, seats: [], genre: "Semua", search: "" };
  const money = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  const screens = [...document.querySelectorAll(".screen")];
  const movieGrid = document.getElementById("movie-grid");
  const movieCount = document.getElementById("movie-count");
  const movieSearch = document.getElementById("movie-search");
  const continueButton = document.getElementById("continue-to-booking");
  const bookingForm = document.getElementById("booking-form");
  const seatGrid = document.getElementById("seat-grid");
  const nameInput = document.getElementById("customer-name");
  const emailInput = document.getElementById("customer-email");
  const phoneInput = document.getElementById("customer-phone");

  if (!movieGrid || !movieCount || !movieSearch || !continueButton || !bookingForm || !seatGrid || !nameInput || !emailInput || !phoneInput) {
    return;
  }

  function setActiveNavigation(target) {
    document.querySelectorAll(".nav button").forEach((button) => {
      const isActive = target === "venue-info"
        ? button.dataset.scroll === target
        : button.dataset.go === target;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function showScreen(name, scrollToTop = true) {
    screens.forEach((screen) => { screen.hidden = screen.id !== `${name}-screen`; });
    setActiveNavigation(name);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMovies() {
    const query = state.search.trim().toLocaleLowerCase("id");
    const filtered = movies.filter((movie) =>
      (state.genre === "Semua" || movie.genre === state.genre) &&
      movie.title.toLocaleLowerCase("id").includes(query)
    );
    movieCount.textContent = `${filtered.length} film`;
    if (!filtered.length) {
      movieGrid.innerHTML = '<p class="empty">Film tidak ditemukan. Coba kata kunci atau genre lain.</p>';
      return;
    }
    movieGrid.innerHTML = filtered.map((movie) => `
      <article class="movie-card">
        <div class="poster">
          <img class="poster-image" src="${movie.poster}" alt="Poster ${movie.title}" loading="lazy">
          <span class="rating"><b>★</b> ${movie.rating}</span>
        </div>
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <div class="movie-meta"><span>${movie.genre}</span><span>${movie.year ? `${movie.year} · ` : ""}${movie.duration} · ${movie.age}</span></div>
          <div class="card-bottom"><span class="price">${money.format(movie.price)}<small class="muted"> / tiket</small></span><button class="arrow-button" type="button" data-movie="${movie.id}" aria-label="Lihat rincian ${movie.title}">→</button></div>
        </div>
      </article>`).join("");
  }

  function openMovie(id) {
    state.movie = movies.find((movie) => movie.id === Number(id));
    if (!state.movie) return;
    state.date = dates[0];
    state.time = null;
    state.seats = [];
    const poster = document.getElementById("detail-poster-image");
    poster.src = state.movie.poster;
    poster.alt = `Poster ${state.movie.title}`;
    document.getElementById("detail-title").textContent = state.movie.title;
    document.getElementById("detail-description").textContent = state.movie.description;
    document.getElementById("detail-facts").innerHTML = [
      `★ ${state.movie.rating} / 10`, state.movie.genre, ...(state.movie.year ? [state.movie.year] : []), state.movie.duration, `Usia ${state.movie.age}`
    ].map((fact) => `<span class="fact">${fact}</span>`).join("");
    document.getElementById("dates").innerHTML = dates.map((date, index) =>
      `<button class="showtime${index === 0 ? " selected" : ""}" type="button" data-date="${date.value}">${date.label}</button>`
    ).join("");
    document.getElementById("times").innerHTML = times.map((time) =>
      `<button class="showtime" type="button" data-time="${time}">${time}</button>`
    ).join("");
    continueButton.disabled = true;
    showScreen("detail");
  }

  function updateOrder() {
    if (!state.movie) return;
    const count = state.seats.length;
    const subtotal = state.movie.price * count;
    const fee = feePerTicket * count;
    document.getElementById("order-movie").textContent = state.movie.title;
    document.getElementById("order-schedule").textContent = `${state.date.label} · ${state.time}`;
    document.getElementById("order-seats").textContent = count ? state.seats.join(", ") : "Belum dipilih";
    document.getElementById("order-quantity").textContent = `Tiket (${count})`;
    document.getElementById("order-subtotal").textContent = money.format(subtotal);
    document.getElementById("order-fee").textContent = money.format(fee);
    document.getElementById("order-total").textContent = money.format(subtotal + fee);
    document.getElementById("seat-error").textContent = "";
  }

  function openBooking() {
    if (!state.movie || !state.time) return;
    document.getElementById("booking-subtitle").textContent = `${state.movie.title} · ${state.date.label} · ${state.time}`;
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-email").value = "";
    document.getElementById("customer-phone").value = "";
    nameInput.setCustomValidity("");
    emailInput.setCustomValidity("");
    phoneInput.setCustomValidity("");
    document.getElementById("form-error").textContent = "";
    const reserved = new Set(["A4", "A5", "B2", "C7", "D4", "E1", "E8", "F3"]);
    seatGrid.innerHTML = "";
    ["A", "B", "C", "D", "E", "F"].forEach((row) => {
      for (let column = 1; column <= 9; column += 1) {
        if (column === 5) {
          const aisle = document.createElement("span");
          aisle.className = "aisle";
          aisle.setAttribute("aria-hidden", "true");
          seatGrid.append(aisle);
        }
        const seatName = `${row}${column}`;
        const seat = document.createElement("button");
        seat.type = "button";
        seat.className = "seat";
        seat.textContent = String(column);
        seat.dataset.seat = seatName;
        seat.setAttribute("aria-label", `Kursi ${seatName}${reserved.has(seatName) ? ", terisi" : ", tersedia"}`);
        seat.disabled = reserved.has(seatName);
        seat.setAttribute("aria-pressed", "false");
        seatGrid.append(seat);
      }
    });
    state.seats = [];
    updateOrder();
    showScreen("booking");
  }

  function renderQr() {
    const qr = document.getElementById("qr-code");
    const ticketCode = document.getElementById("ticket-code").textContent;
    let seed = 0;
    for (const character of ticketCode) seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
    qr.innerHTML = "";
    for (let index = 0; index < 121; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const cell = document.createElement("i");
      const row = Math.floor(index / 11);
      const column = index % 11;
      const finder = (row < 3 && column < 3) || (row < 3 && column > 7) || (row > 7 && column < 3);
      if (finder) {
        const innerRow = row < 3 ? row : row - 8;
        const innerColumn = column < 3 ? column : column - 8;
        cell.classList.toggle("on", innerRow === 0 || innerRow === 2 || innerColumn === 0 || innerColumn === 2 || (innerRow === 1 && innerColumn === 1));
      } else {
        cell.classList.toggle("on", seed % 3 !== 0);
      }
      qr.append(cell);
    }
  }

  function completeBooking() {
    if (!state.movie) return;
    const name = document.getElementById("customer-name").value.trim();
    const code = `LK${Date.now().toString().slice(-8)}`;
    document.getElementById("ticket-movie").textContent = state.movie.title;
    document.getElementById("ticket-venue").textContent = "LayarKita Central · Studio 2";
    document.getElementById("ticket-name").textContent = name;
    document.getElementById("ticket-date").textContent = state.date.label;
    document.getElementById("ticket-time").textContent = state.time;
    document.getElementById("ticket-seats").textContent = state.seats.join(", ");
    document.getElementById("ticket-quantity").textContent = `${state.seats.length} tiket`;
    document.getElementById("ticket-total").textContent = money.format((state.movie.price + feePerTicket) * state.seats.length);
    document.getElementById("ticket-code").textContent = code;
    renderQr();
    showScreen("ticket");
  }

  document.addEventListener("click", (event) => {
    const goButton = event.target.closest("[data-go]");
    if (goButton) {
      showScreen(goButton.dataset.go);
      return;
    }
    const scrollButton = event.target.closest("[data-scroll]");
    if (scrollButton) {
      showScreen("catalog", false);
      setActiveNavigation(scrollButton.dataset.scroll);
      const section = document.getElementById(scrollButton.dataset.scroll);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const movieButton = event.target.closest("[data-movie]");
    if (movieButton) {
      openMovie(movieButton.dataset.movie);
      return;
    }
    const dateButton = event.target.closest("[data-date]");
    if (dateButton) {
      state.date = dates.find((date) => date.value === dateButton.dataset.date) || dates[0];
      document.querySelectorAll("[data-date]").forEach((button) => button.classList.toggle("selected", button === dateButton));
      return;
    }
    const timeButton = event.target.closest("[data-time]");
    if (timeButton) {
      state.time = timeButton.dataset.time;
      document.querySelectorAll("[data-time]").forEach((button) => button.classList.toggle("selected", button === timeButton));
      continueButton.disabled = false;
      return;
    }
    const seatButton = event.target.closest("[data-seat]");
    if (seatButton && !seatButton.disabled) {
      const seatName = seatButton.dataset.seat;
      const index = state.seats.indexOf(seatName);
      if (index >= 0) {
        state.seats.splice(index, 1);
      } else if (state.seats.length < 6) {
        state.seats.push(seatName);
      } else {
        document.getElementById("seat-error").textContent = "Maksimal 6 kursi untuk satu pemesanan.";
        return;
      }
      state.seats.sort((left, right) => left.localeCompare(right));
      seatButton.classList.toggle("selected", state.seats.includes(seatName));
      seatButton.setAttribute("aria-pressed", String(state.seats.includes(seatName)));
      updateOrder();
    }
  });

  document.querySelectorAll("[data-genre]").forEach((button) => button.addEventListener("click", () => {
    state.genre = button.dataset.genre;
    document.querySelectorAll("[data-genre]").forEach((chip) => chip.classList.toggle("selected", chip === button));
    renderMovies();
  }));
  movieSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderMovies();
  });
  continueButton.addEventListener("click", openBooking);

  nameInput.addEventListener("input", () => {
    nameInput.setCustomValidity(nameInput.value.trim().length < 3 ? "Nama harus terdiri dari minimal 3 karakter." : "");
  });
  emailInput.addEventListener("input", () => {
    emailInput.setCustomValidity(emailInput.validity.typeMismatch ? "Masukkan alamat email dengan format yang benar." : "");
  });
  phoneInput.addEventListener("input", () => {
    phoneInput.setCustomValidity(phoneInput.validity.patternMismatch ? "Masukkan nomor telepon yang valid; boleh diawali tanda +." : "");
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.getElementById("form-error");
    error.textContent = "";
    if (!state.seats.length) {
      document.getElementById("seat-error").textContent = "Pilih setidaknya satu kursi untuk melanjutkan.";
      return;
    }
    nameInput.value = nameInput.value.trim();
    emailInput.value = emailInput.value.trim();
    phoneInput.value = phoneInput.value.trim();
    nameInput.setCustomValidity(nameInput.value.length < 3 ? "Nama harus terdiri dari minimal 3 karakter." : "");
    emailInput.setCustomValidity(emailInput.validity.typeMismatch ? "Masukkan alamat email dengan format yang benar." : "");
    phoneInput.setCustomValidity(phoneInput.validity.patternMismatch ? "Masukkan nomor telepon yang valid; boleh diawali tanda +." : "");
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      error.textContent = "Periksa kembali nama, email, dan nomor telepon.";
      return;
    }
    completeBooking();
  });

  document.getElementById("print-ticket").addEventListener("click", () => window.print());
  document.getElementById("new-booking").addEventListener("click", () => {
    state.movie = null;
    state.date = dates[0];
    state.time = null;
    state.seats = [];
    showScreen("catalog");
  });

  renderMovies();
});

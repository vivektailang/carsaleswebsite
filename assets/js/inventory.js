const inventoryData = [
  { year: 2021, make: "Honda", model: "Accord LX", price: 22900, mileage: 36400, bodyType: "Sedan", fuel: "Petrol" },
  { year: 2020, make: "Toyota", model: "RAV4 XLE", price: 26500, mileage: 42100, bodyType: "SUV", fuel: "Hybrid" },
  { year: 2019, make: "Volkswagen", model: "Golf TDI", price: 18200, mileage: 40700, bodyType: "Hatchback", fuel: "Diesel" },
  { year: 2022, make: "Mazda", model: "CX-5 Touring", price: 28900, mileage: 21400, bodyType: "SUV", fuel: "Petrol" },
  { year: 2018, make: "Hyundai", model: "Elantra SE", price: 15900, mileage: 53200, bodyType: "Sedan", fuel: "Petrol" },
  { year: 2021, make: "Ford", model: "Escape SEL", price: 24400, mileage: 30100, bodyType: "SUV", fuel: "Petrol" },
  { year: 2020, make: "BMW", model: "320i", price: 31500, mileage: 28600, bodyType: "Sedan", fuel: "Petrol" },
  { year: 2019, make: "Kia", model: "Seltos EX", price: 19800, mileage: 38900, bodyType: "SUV", fuel: "Petrol" }
];

const searchInput = document.getElementById("searchInput");
const makeFilter = document.getElementById("makeFilter");
const sortSelect = document.getElementById("sortSelect");
const inventoryGrid = document.getElementById("inventoryGrid");
const resultCount = document.getElementById("resultCount");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function populateMakeFilter() {
  const makes = [...new Set(inventoryData.map((car) => car.make))].sort();
  makes.forEach((make) => {
    const option = document.createElement("option");
    option.value = make;
    option.textContent = make;
    makeFilter.appendChild(option);
  });
}

function renderInventory(cars) {
  inventoryGrid.innerHTML = "";

  if (!cars.length) {
    inventoryGrid.innerHTML = "<p>No vehicles match your search criteria.</p>";
    resultCount.textContent = "0 cars found";
    return;
  }

  resultCount.textContent = `${cars.length} car${cars.length === 1 ? "" : "s"} found`;

  cars.forEach((car) => {
    const card = document.createElement("article");
    card.className = "car-card reveal";
    card.innerHTML = `
      <div class="car-badge">${car.bodyType}</div>
      <h3>${car.make} ${car.model} ${car.year}</h3>
      <p>${car.mileage.toLocaleString()} miles • ${car.fuel}</p>
      <strong>${formatPrice(car.price)}</strong>
    `;
    inventoryGrid.appendChild(card);
  });
}

function applyFiltersAndSort() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedMake = makeFilter.value;
  const selectedSort = sortSelect.value;

  let filteredCars = inventoryData.filter((car) => {
    const fullText = `${car.year} ${car.make} ${car.model} ${car.bodyType} ${car.fuel}`.toLowerCase();
    const matchesKeyword = !keyword || fullText.includes(keyword);
    const matchesMake = selectedMake === "all" || car.make === selectedMake;
    return matchesKeyword && matchesMake;
  });

  filteredCars.sort((a, b) => {
    if (selectedSort === "price-asc") return a.price - b.price;
    if (selectedSort === "price-desc") return b.price - a.price;
    if (selectedSort === "model-asc") return a.model.localeCompare(b.model);
    return b.model.localeCompare(a.model);
  });

  renderInventory(filteredCars);
}

if (searchInput && makeFilter && sortSelect && inventoryGrid && resultCount) {
  populateMakeFilter();
  applyFiltersAndSort();
  searchInput.addEventListener("input", applyFiltersAndSort);
  makeFilter.addEventListener("change", applyFiltersAndSort);
  sortSelect.addEventListener("change", applyFiltersAndSort);
}
// --- Fade-in on scroll ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
    });
});

document.querySelectorAll(".fadein").forEach(el => observer.observe(el));

// --- Catalogue subcategory navigation ---
const buttons = document.querySelectorAll(".sub-nav button");
const sections = {
    originaux: document.getElementById("originaux"),
    dupes: document.getElementById("dupes"),
    decants: document.getElementById("decants")
};

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        // activate button
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // show correct section
        Object.values(sections).forEach(s => s.classList.add("hidden"));
        sections[btn.dataset.target].classList.remove("hidden");

        // smooth scroll
        sections[btn.dataset.target].scrollIntoView({ behavior: "smooth" });
    });
});
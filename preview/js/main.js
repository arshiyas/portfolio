document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll("[data-project-type]").forEach((card) => {
      const type = card.dataset.projectType;
      const show = filter === "all" || type === filter;
      card.classList.toggle("hidden", !show);
    });
  });
});

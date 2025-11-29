const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.cat;

    projects.forEach(project => {
      const cats = project.dataset.cats.split(",");
      project.style.display = (category === "all" || cats.includes(category)) ? "block" : "none";
    });
  });
});

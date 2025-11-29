async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

async function loadTestimonials() {
  const container = document.getElementById("testimonials");
  if (!container) return;
  const data = await loadJSON("assets/data/testimonials.json");
  container.innerHTML = data
    .map(item => `<div class="testimonial"><p>${item.text}</p><h4>- ${item.author}</h4></div>`)
    .join("");
}

async function loadTeam() {
  const container = document.getElementById("team-list");
  if (!container) return;
  const data = await loadJSON("assets/data/team.json");
  container.innerHTML = data
    .map(member => `<div class="team-member"><h3>${member.name}</h3><p>${member.role}</p><p>Age: ${member.age}</p></div>`)
    .join("");
}

async function loadTimeline() {
  const container = document.getElementById("timeline");
  if (!container) return;
  const data = await loadJSON("assets/data/timeline.json");
  container.innerHTML = data
    .map(item => `<div class="timeline-item"><h4>${item.year}</h4><p>${item.event}</p></div>`)
    .join("");
}

loadTestimonials();
loadTeam();
loadTimeline();

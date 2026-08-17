export async function onPageTransitionEnd() {
  document.body.classList.remove("page-transition");
  if (window.location.hash) return;
  document.getElementById("page-content")?.scrollTo({ top: 0 });
}

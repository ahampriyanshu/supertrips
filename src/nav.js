export function navigateTo(href, state = null) {
  if (typeof window === 'undefined') return;
  window.history.pushState(state, '', href);
  window.dispatchEvent(new Event('popstate'));
}

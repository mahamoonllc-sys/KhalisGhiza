if (!window.__cardVariantPillsBound) {
  window.__cardVariantPillsBound = true;

  document.addEventListener('click', function (event) {
    const pill = event.target.closest('.card-variant-pill');
    if (!pill || pill.disabled) return;

    const group = pill.closest('.card-variant-pills');
    const form = pill.closest('form');
    if (!group || !form) return;

    group.querySelectorAll('.card-variant-pill').forEach((otherPill) => {
      otherPill.classList.remove('is-selected');
      otherPill.setAttribute('aria-pressed', 'false');
    });
    pill.classList.add('is-selected');
    pill.setAttribute('aria-pressed', 'true');

    const variantIdInput = form.querySelector('[name="id"]');
    if (variantIdInput) variantIdInput.value = pill.dataset.variantId;

    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.setAttribute('aria-disabled', 'false');
    }

    const card = pill.closest('.card-wrapper') || form.closest('.card-wrapper');
    const priceContainer = card ? card.querySelector('[id^="CardPrice-"]') : null;
    if (priceContainer && pill.dataset.priceHtml) {
      priceContainer.innerHTML = pill.dataset.priceHtml;
    }
  });
}

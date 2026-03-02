/**
 * Initializes an observer to track error messages in the registration form.
 * It listens for changes in the specific error <ul> and synchronizes its messages
 * into a custom wrapper inside the form (#register). Old messages are cleared
 * before adding new ones, ensuring no duplicates or outdated errors remain.
 */
function initMessageCopyObserver() {
  /**
   * Processes the error <ul> found in the given selector.
   * Clears any previous messages in the wrapper and inserts the new ones.
   *
   * @param {jQuery} $targetUl - The jQuery object containing the <ul> element with error messages.
   */
  function processList($targetUl) {
    var $form = $('#register');
    if (!$form.length) return;

    var $wrapper = $form.find('ul.error-wrapper');

    if (!$wrapper.length) {
      $wrapper = $('<ul class="error-wrapper"></ul>');
      $form.prepend($wrapper);
    }

    $wrapper.empty();

    $targetUl.find('li').each(function() {
      var $clone = $(this).clone();
      $wrapper.append($clone);
    });

    // Remove the original error list
    $targetUl.remove();
  }

  /**
   * Checks if the error <ul> exists at the defined selector and processes it.
   *
   * @returns {boolean} - True if the target <ul> was found and processed.
   */
  function checkAndProcess() {
    var $targetUl = $('#register-form > div.js-form-feedback > div.js-form-errors.status.submission-error > ul');

    if ($targetUl.length) {
      processList($targetUl);
      return true;
    }

    return false;
  }

  var observer = new MutationObserver(function() {
    checkAndProcess();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

$(document).ready(function() {
  initMessageCopyObserver();
});

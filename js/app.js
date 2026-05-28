/**
 * Concierge Service Workflow - jQuery App
 * Handles navigation, tabs, modals, and interactivity
 */

$(document).ready(function() {
  // Initialize all components
  initTabs();
  initModals();
  initDropdowns();
  initMobileMenu();
  initChecklist();
  initFormValidation();

  // Active sidebar link highlighting based on current page
  highlightActiveLink();

  // Tooltip initialization
  initTooltips();
});

// ============================================
// TAB NAVIGATION
// ============================================
function initTabs() {
  $(document).on('click', '.tab', function() {
    var $tab = $(this);
    var tabGroup = $tab.closest('.tabs');
    var tabContainer = tabGroup.closest('.tab-container, .card, .section-card-body, .page-content').first();

    // Get all tabs in this group
    var tabs = tabGroup.find('.tab');
    var index = tabs.index($tab);

    // Deactivate all tabs in group
    tabs.removeClass('active');
    $tab.addClass('active');

    // Find and toggle panels
    var panels = tabContainer.find('.tab-panel');
    panels.removeClass('active');
    if (panels.length > index) {
      panels.eq(index).addClass('active');
    }
  });
}

// ============================================
// MODAL HANDLING
// ============================================
function initModals() {
  // Open modal
  $(document).on('click', '[data-modal]', function() {
    var modalId = $(this).attr('data-modal');
    $('#' + modalId).addClass('active');
    $('body').css('overflow', 'hidden');
  });

  // Close modal
  $(document).on('click', '.modal-overlay', function(e) {
    if (e.target === this) {
      $(this).removeClass('active');
      $('body').css('overflow', '');
    }
  });

  $(document).on('click', '.modal-close', function() {
    $(this).closest('.modal-overlay').removeClass('active');
    $('body').css('overflow', '');
  });
}

function openModal(modalId) {
  $('#' + modalId).addClass('active');
  $('body').css('overflow', 'hidden');
}

function closeModal(modalId) {
  $('#' + modalId).removeClass('active');
  $('body').css('overflow', '');
}

// ============================================
// DROPDOWN MENUS
// ============================================
function initDropdowns() {
  $(document).on('click', '[data-dropdown]', function(e) {
    e.stopPropagation();
    var dropdownId = $(this).attr('data-dropdown');
    var $dropdown = $('#' + dropdownId);

    // Close others
    $('.action-dropdown').not($dropdown).removeClass('active');
    $dropdown.toggleClass('active');
  });

  // Close on outside click
  $(document).on('click', function() {
    $('.action-dropdown').removeClass('active');
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  $(document).on('click', '[data-mobile-menu]', function() {
    $('.sidebar').toggleClass('mobile-open');
  });

  $(document).on('click', '.sidebar-overlay', function() {
    $('.sidebar').removeClass('mobile-open');
  });
}

// ============================================
// CHECKLIST INTERACTIONS
// ============================================
function initChecklist() {
  $(document).on('click', '.checklist-item', function() {
    $(this).toggleClass('completed');
    var $checkbox = $(this).find('.check-box');
    if ($(this).hasClass('completed')) {
      $checkbox.html('&#10003;');
    } else {
      $checkbox.html('');
    }
    updateProgressBar();
  });
}

function updateProgressBar() {
  var $container = $('.checklist');
  if ($container.length === 0) return;

  var total = $container.find('.checklist-item').length;
  var completed = $container.find('.checklist-item.completed').length;
  var percent = Math.round((completed / total) * 100);

  var $progressBar = $('.progress-fill');
  var $progressText = $('.progress-text');

  if ($progressBar.length) {
    $progressBar.css('width', percent + '%');
  }
  if ($progressText.length) {
    $progressText.text(percent + '%');
  }
}

// ============================================
// FORM VALIDATION
// ============================================
function initFormValidation() {
  $(document).on('submit', 'form', function(e) {
    var $form = $(this);
    var isValid = true;

    $form.find('[required]').each(function() {
      if (!$(this).val().trim()) {
        isValid = false;
        $(this).addClass('error');
      } else {
        $(this).removeClass('error');
      }
    });

    if (!isValid) {
      e.preventDefault();
      showToast('Please fill in all required fields.', 'error');
    }
  });

  $(document).on('input', '.form-input.error, .form-select.error, .form-textarea.error', function() {
    if ($(this).val().trim()) {
      $(this).removeClass('error');
    }
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type) {
  type = type || 'info';

  var bgColors = {
    info: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  };

  var $toast = $('<div></div>')
    .css({
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColors[type] || bgColors.info,
      color: '#fff',
      padding: '0.875rem 1.25rem',
      borderRadius: 'var(--radius)',
      fontSize: '0.9rem',
      fontWeight: '500',
      zIndex: '9999',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      maxWidth: '400px',
      wordBreak: 'break-word'
    })
    .text(message);

  $('body').append($toast);

  setTimeout(function() {
    $toast.fadeOut(300, function() { $(this).remove(); });
  }, 3000);
}

// ============================================
// SIDEBAR ACTIVE LINK
// ============================================
function highlightActiveLink() {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  $('.sidebar-link').each(function() {
    var href = $(this).attr('href') || $(this).attr('data-href') || '';
    if (href.indexOf(currentPage) !== -1) {
      $(this).addClass('active');
    }
  });
}

// ============================================
// TOOLTIPS
// ============================================
function initTooltips() {
  $(document).on('mouseenter', '[data-tooltip]', function() {
    var text = $(this).attr('data-tooltip');
    if (!text) return;

    var $tooltip = $('<span class="tooltip-text"></span>').text(text);
    $(this).addClass('tooltip').append($tooltip);
  });

  $(document).on('mouseleave', '.tooltip[data-tooltip]', function() {
    $(this).find('.tooltip-text').remove();
    $(this).removeClass('tooltip');
  });
}

// ============================================
// CONFIRMATION DIALOG
// ============================================
function confirmAction(message, onConfirm) {
  var $overlay = $('<div class="modal-overlay active"></div>');
  var $modal = $('<div class="modal"></div>');
  var $header = $('<div class="modal-header"><span class="modal-title">Confirm Action</span><button class="modal-close">&times;</button></div>');
  var $body = $('<div class="modal-body"><p>' + message + '</p></div>');
  var $footer = $('<div class="modal-footer"></div>');

  var $cancelBtn = $('<button class="btn btn-secondary">Cancel</button>');
  var $confirmBtn = $('<button class="btn btn-primary">Confirm</button>');

  $footer.append($cancelBtn, $confirmBtn);
  $modal.append($header, $body, $footer);
  $overlay.append($modal);
  $('body').append($overlay);

  $cancelBtn.on('click', function() {
    $overlay.remove();
  });

  $confirmBtn.on('click', function() {
    $overlay.remove();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  });

  $overlay.on('click', function(e) {
    if (e.target === this) {
      $overlay.remove();
    }
  });
}

// ============================================
// SEARCH FILTER
// ============================================
function filterTable(tableSelector, searchTerm) {
  var $rows = $(tableSelector).find('tbody tr');
  searchTerm = searchTerm.toLowerCase();

  $rows.each(function() {
    var text = $(this).text().toLowerCase();
    $(this).toggle(text.indexOf(searchTerm) > -1);
  });
}

// ============================================
// DATA TOGGLE
// ============================================
$(document).on('click', '[data-toggle]', function() {
  var target = $(this).attr('data-toggle');
  $(target).toggleClass('hidden');
});

// Hidden utility
.hidden { display: none !important; }

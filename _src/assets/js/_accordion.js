import $ from 'jquery';

/* Accordion with WCAG Support
********************************************** */
export const initAccordion = () => {
  const $accordionTriggers = $('.js-accordion-trigger');

  // Khởi tạo trạng thái ban đầu cho các accordion
  $accordionTriggers.each(function () {
    const $trigger = $(this);
    const $accordionPanel = $(`#${$trigger.attr('aria-controls')}`);

    if ($trigger.hasClass('is-expanded')) {
      $accordionPanel.show(); // Hiển thị panel nếu trigger có lớp .is-expanded
      $trigger.attr('aria-expanded', 'true');
    } else {
      $accordionPanel.hide(); // Ẩn panel nếu không có lớp .is-expanded
      $trigger.attr('aria-expanded', 'false');
    }
  });

  // Xử lý sự kiện click
  $accordionTriggers.on('click', function (event) {
    const $trigger = $(this);
    const $accordionPanel = $(`#${$trigger.attr('aria-controls')}`);
    const isExpanded = $trigger.attr('aria-expanded') === 'true';

    $accordionPanel.stop(true, true).slideToggle(300, function () {
      // Cập nhật trạng thái aria-expanded sau khi toggle hoàn tất
      $trigger.attr('aria-expanded', isExpanded ? 'false' : 'true');
      $trigger.toggleClass('is-expanded', !isExpanded);
    });

    event.preventDefault();
  });
};

// import $ from 'jquery';

/* SET VW
********************************************** */
export const setVWVH = () => {
  const root = document.documentElement;

  const updateVWVH = () => {
    root.style.setProperty('--vw', `${document.documentElement.clientWidth}px`);
    root.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };

  updateVWVH();

  // Tối ưu resize bằng requestAnimationFrame
  let resizeTicking = false;
  const onResize = () => {
    if (!resizeTicking) {
      resizeTicking = true;
      requestAnimationFrame(() => {
        updateVWVH();
        resizeTicking = false;
      });
    }
  };

  window.addEventListener('resize', onResize);
}

/* Mobile Detect
********************************************** */
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
};


/* Update Mobile Class to HTML
********************************************** */
export const updateMobileClass = () => {
  const root = document.documentElement;
  root.classList.toggle("is-mobile", isMobileDevice());
};


/* Anchor Link
********************************************** */
export const anchorLink = () => {
  let headerHeight = calculateHeaderHeight();

  // Tính chiều cao của header tùy theo kích thước màn hình
  function calculateHeaderHeight() {
    return window.innerWidth < 768 ? 86 : 86;
  }

  // Cập nhật headerHeight khi thay đổi kích thước cửa sổ
  window.addEventListener("resize", () => {
    headerHeight = calculateHeaderHeight();
  });

  // Thêm sự kiện click cho các liên kết anchor
  document.querySelectorAll('a.js-anchor[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      event.preventDefault();

      const href = anchor.getAttribute("href");
      const target = href === "#" || href === "" ? document.documentElement : document.querySelector(href);

      if (target) {
        const position = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: position,
          behavior: "smooth"
        });
      }
    });
  });

  // Xử lý cuộn đến anchor dựa trên URL query string
  const smoothScrollParam = {
    location: location.pathname,
    init: function () {
      // Bỏ qua nếu trong admin
      if (!this.location.includes("/admin/")) {
        // Lấy giá trị anc từ query string
        const params = new URLSearchParams(location.search);
        const anchor = params.get("anc") || params.keys().next().value;
        const hashP = `#${anchor}`;

        if (anchor) {
          const target = document.querySelector(hashP);
          if (target) {
            const position = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            setTimeout(() => {
              window.scrollTo({
                top: position,
                behavior: "smooth"
              });
            }, 700); // Tương đương với độ trễ của jQuery animate
          }
        }
      }
    }
  };

  // Khởi chạy cuộn đến anchor nếu URL chứa query string
  if (location.href.includes("?")) {
    setTimeout(() => {
      smoothScrollParam.init();
    }, 100); // Độ trễ để đảm bảo DOM đã sẵn sàng
  }
};


/* Inline SVG
********************************************** */
export const convertImgToSVG = (callback) => {
  document.querySelectorAll('img.js-svg').forEach(async image => {
    try {
      const res = await fetch(image.src);
      const data = await res.text();
      const svg = new DOMParser().parseFromString(data, 'image/svg+xml').querySelector('svg');

      // Sao chép các thuộc tính từ <img> sang <svg>
      if (image.id) svg.id = image.id;
      if (image.className) svg.classList = image.classList;

      // Thiết lập thuộc tính role và aria-label cho <svg> để hỗ trợ khả năng truy cập
      svg.setAttribute('role', 'img');
      if (image.alt) {
        svg.setAttribute('aria-label', image.alt);
      }

      image.replaceWith(svg);
      if (callback) callback();
    } catch (error) {
      console.error(error);
    }
  });
};


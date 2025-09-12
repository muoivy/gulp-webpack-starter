/**
 * matchHeight(elements, options)
 * ------------------------------------------
 * elements: selector | NodeList | Element[] | Element
 *
 * options:
 *  - byRow: boolean = true
 *      Chia nhóm theo từng hàng (row) dựa trên tọa độ top (có tolerance).
 *  - property: 'min-height' | 'height' = 'min-height'
 *      Kiểu set chiều cao.
 *  - groupAttr: string = 'data-mh'
 *      Thuộc tính để gom nhóm như plugin gốc (ví dụ data-mh="group1").
 *      Nếu không có attr, tất cả phần tử sẽ được gom chung.
 *  - target: number | selector | Element = null
 *      Ép tất cả phần tử về chiều cao này (từ số px, selector, hoặc Element).
 *  - remove: boolean = false
 *      Chỉ reset lại các chiều cao đã set, không tính toán gì thêm.
 *  - watch: boolean = true
 *      Tự cập nhật khi window resize/load.
 *  - throttle: number (ms) = 100
 *      Độ trễ cho debounce/throttle.
 *  - rowTolerance: number (px) = 2
 *      Sai số khi so sánh top để coi là cùng hàng.
 *
 *  // === cải tiến để mượt hơn khi resize ===
 *  - mode: 'debounce' | 'throttle' = 'debounce'
 *      debounce: chạy sau khi người dùng dừng resize (có thể bật leading để chạy ngay khi bắt đầu).
 *      throttle: cập nhật định kỳ trong lúc resize.
 *  - leading: boolean = true
 *      Với debounce: chạy ngay khi bắt đầu tương tác.
 *  - trailing: boolean = true
 *      Chạy “nốt” sau khi kết thúc (hữu ích cho cả debounce/throttle).
 *  - useResizeObserver: boolean = false
 *      Dùng ResizeObserver (nếu có) để nghe thay đổi kích thước thực tế từ layout.
 *
 * Trả về:
 *  { update: Function, destroy: Function }
 *    - update(): tính lại và set chiều cao (gọi thủ công khi DOM đổi).
 *    - destroy(): gỡ listeners + reset chiều cao đã set.
 */
export const matchHeight = (elements, opts = {}) => {
  const {
    byRow = true,
    property = 'height',
    groupAttr = 'data-mh',
    target = null,
    remove = false,
    watch = true,
    throttle = 100,
    rowTolerance = 2,
    // nâng cấp responsiveness
    mode = 'debounce',        // 'debounce' | 'throttle'
    leading = true,           // chạy ngay khi bắt đầu
    trailing = true,          // chạy khi kết thúc
    useResizeObserver = false // quan sát thay đổi kích thước thực
  } = opts;

  // ---- Helpers cơ bản ----
  const toArr = (els) => {
    if (typeof els === 'string') return [...document.querySelectorAll(els)];
    if (els instanceof Element) return [els];
    if (els && (els instanceof NodeList || Array.isArray(els))) return [...els];
    return [];
  };

  const els = toArr(elements);
  if (!els.length) return { update: () => {}, destroy: () => {} };

  const styleProp = property === 'height' ? 'height' : 'minHeight';

  const resetHeights = (nodes) => {
    nodes.forEach((el) => {
      el.style.minHeight = '';
      el.style.height = '';
    });
  };

  const px = (n) => `${Math.max(0, Math.ceil(n))}px`;

  const naturalHeight = (el) => {
    // Đo chiều cao hiện tại (không margin); getBoundingClientRect gồm padding + border.
    // Lưu ý: trước khi đo, toàn bộ nhóm đã được reset để đo chính xác.
    const rect = el.getBoundingClientRect();
    return Math.ceil(rect.height || 0);
  };

  const resolveTargetHeight = (tgt) => {
    if (typeof tgt === 'number' && isFinite(tgt)) return Math.ceil(tgt);
    let node = null;
    if (typeof tgt === 'string') node = document.querySelector(tgt);
    else if (tgt && tgt.nodeType === 1) node = tgt;
    return node ? Math.ceil(node.getBoundingClientRect().height || 0) : null;
  };

  const groupByAttr = (nodes, attr) => {
    const map = new Map();
    nodes.forEach((el) => {
      const key = el.getAttribute ? el.getAttribute(attr) : null;
      const k = key || '__all__';
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(el);
    });
    return [...map.values()];
  };

  const groupByRow = (nodes) => {
    // Sắp theo top rồi theo left để gom hàng ổn định.
    const arr = nodes.map((el) => {
      const r = el.getBoundingClientRect();
      return { el, top: Math.round(r.top), left: Math.round(r.left) };
    }).sort((a, b) => (a.top - b.top) || (a.left - b.left));

    const rows = [];
    let currentTop = null;
    arr.forEach(({ el, top }) => {
      if (currentTop === null || Math.abs(top - currentTop) > rowTolerance) {
        rows.push([el]);
        currentTop = top;
      } else {
        rows[rows.length - 1].push(el);
      }
    });
    return rows;
  };

  const setHeightsFor = (nodes, heightValue) => {
    nodes.forEach((el) => {
      el.style[styleProp] = px(heightValue);
    });
  };

  // ---- Tính & áp dụng ----
  const apply = () => {
    // Bỏ set trước đó để đo chính xác
    resetHeights(els);
    if (remove) return;

    const targetH = target != null ? resolveTargetHeight(target) : null;
    const groups = groupAttr ? groupByAttr(els, groupAttr) : [els];

    groups.forEach((group) => {
      // byRow: chia nhóm theo từng hàng; ngược lại, coi cả group là 1 hàng
      const buckets = byRow ? groupByRow(group) : [group];
      buckets.forEach((row) => {
        const maxH = targetH != null ? targetH : Math.max(...row.map(naturalHeight));
        setHeightsFor(row, maxH);
      });
    });
  };

  // ---- Limiter: debounce/throttle + leading/trailing ----
  const createLimiter = (fn, { mode, delay, leading, trailing }) => {
    if (mode === 'throttle') {
      let last = 0, t;
      return () => {
        const now = Date.now();
        const remain = delay - (now - last);
        if (remain <= 0) {
          last = now;
          fn();
        } else if (trailing) {
          clearTimeout(t);
          t = setTimeout(() => { last = Date.now(); fn(); }, Math.max(0, remain));
        }
      };
    }
    // debounce
    let t, invoked = false;
    return () => {
      if (leading && !invoked) { fn(); invoked = true; }
      clearTimeout(t);
      t = setTimeout(() => {
        if (trailing || !leading) fn();
        invoked = false;
      }, delay);
    };
  };

  let limiter = null;
  let ro = null;

  const setupWatchers = () => {
    if (!watch || remove) return;
    limiter = createLimiter(apply, { mode, delay: throttle, leading, trailing });
    window.addEventListener('resize', limiter);
    window.addEventListener('orientationchange', limiter);
    window.addEventListener('load', limiter);

    if (useResizeObserver && 'ResizeObserver' in window) {
      // Quan sát viewport (có thể đổi sang container cụ thể nếu cần)
      ro = new ResizeObserver(() => limiter());
      ro.observe(document.documentElement);
    }
  };

  const teardownWatchers = () => {
    if (!watch || !limiter) return;
    window.removeEventListener('resize', limiter);
    window.removeEventListener('orientationchange', limiter);
    window.removeEventListener('load', limiter);
    if (ro) { ro.disconnect(); ro = null; }
    limiter = null;
  };

  // Chạy ngay lần đầu & gắn watcher
  apply();
  setupWatchers();

  // API trả về
  return {
    update: apply,
    destroy: () => {
      teardownWatchers();
      resetHeights(els);
    }
  };
};

/* ===========================
 *  CÁCH DÙNG NHANH
 * ===========================
 */
// 1) Cơ bản (tự cập nhật khi resize):
// matchHeight('.card');

// 2) Chia theo hàng, gom theo data-mh (giống plugin):
// matchHeight('[data-mh]', { byRow: true });

// 3) Mượt hơn khi kéo resize (chạy ngay + chạy nốt khi dừng):
// matchHeight('.card', { mode: 'debounce', throttle: 120, leading: true, trailing: true });

// 4) Cập nhật đều trong lúc kéo (throttle):
// matchHeight('.card', { mode: 'throttle', throttle: 120 });

// 5) Bật ResizeObserver cho trang layout động:
// matchHeight('.card', { useResizeObserver: true });

// 6) Ép chiều cao bằng một phần tử tham chiếu hoặc số px:
// matchHeight('.tile', { target: '.tile--ref' });
// matchHeight('.tile', { target: 240 });

// 7) Tắt và reset:
// matchHeight('.card', { remove: true });

// 8) Tự điều khiển update:
// const mh = matchHeight('.card', { watch: false });
// someAsyncThings().then(() => mh.update());

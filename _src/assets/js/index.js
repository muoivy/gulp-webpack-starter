
import { setVWVH, updateMobileClass, anchorLink, convertImgToSVG } from './_common';
import { initHeader } from './_header';
import { inview } from './_inview';
import { initAccordion } from './_accordion';
import { matchHeight } from './_matchHeight';

setVWVH();
updateMobileClass();
anchorLink();
convertImgToSVG();
initHeader();
inview();
initAccordion();
matchHeight('.js-matchHeight', { mode: 'debounce', throttle: 120, leading: true, trailing: true });




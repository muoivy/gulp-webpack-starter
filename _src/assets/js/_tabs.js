const setInitialState = (tab, panel, isSelected) => {
  tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  tab.tabIndex = 0;
  tab.classList.toggle('is-active', isSelected);

  if (panel) {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;

    if (isSelected) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  }
};

const activateTab = (tab, tabs, panels) => {
  tabs.forEach((currentTab, index) => {
    const panelId = currentTab.getAttribute('aria-controls');
    const panel = panels[index] || document.getElementById(panelId);
    const isSelected = currentTab === tab;

    setInitialState(currentTab, panel, isSelected);
  });

  tab.focus();
};

const focusTab = (tabs, index) => {
  const totalTabs = tabs.length;
  const nextIndex = (index + totalTabs) % totalTabs;

  tabs.forEach((currentTab) => {
    currentTab.tabIndex = 0;
  });

  tabs[nextIndex].focus();
};

export const initTabs = () => {
  const tabContainers = document.querySelectorAll('.js-tabs');

  tabContainers.forEach((container, containerIndex) => {
    const tabList = container.querySelector('[role="tablist"]');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    const panels = tabs.map((tab, index) => {
      if (!tab.id) {
        tab.id = `js-tab-${containerIndex}-${index}`;
      }

      const controlsId = tab.getAttribute('aria-controls');
      return controlsId ? document.getElementById(controlsId) : null;
    });

    let selectedIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }

    tabs.forEach((tab, index) => {
      setInitialState(tab, panels[index], index === selectedIndex);

      tab.addEventListener('click', (event) => {
        event.preventDefault();
        activateTab(tab, tabs, panels);
      });

      tab.addEventListener('keydown', (event) => {
        const { key } = event;
        const currentIndex = tabs.indexOf(tab);
        const orientation = tabList.getAttribute('aria-orientation') || 'horizontal';
        const isHorizontal = orientation === 'horizontal';
        const isVertical = orientation === 'vertical';

        if ((isHorizontal && (key === 'ArrowLeft' || key === 'ArrowRight')) ||
            (isVertical && (key === 'ArrowUp' || key === 'ArrowDown'))) {
          event.preventDefault();
          const direction = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
          focusTab(tabs, currentIndex + direction);
        } else if (key === 'Home') {
          event.preventDefault();
          focusTab(tabs, 0);
        } else if (key === 'End') {
          event.preventDefault();
          focusTab(tabs, tabs.length - 1);
        } else if (key === 'Tab') {
          const isSelected = tab.getAttribute('aria-selected') === 'true';
          if (isSelected) {
            event.preventDefault();
            panels[currentIndex]?.focus();
          }
        } else if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          activateTab(tab, tabs, panels);
        }
      });
    });
  });
};

import { createApp, Events, Utils } from 'veloxi';

const MacOsDockPlugin = (context) => {
  let items;
  let root;

  context.subscribeToEvents((eventBus) => {
    eventBus.subscribeToEvent(Events.PointerMoveEvent, onMouseMove);
  });

  function onMouseMove(event) {
    if (!root || !items) return;
    if (!root.intersects(event.x, event.y)) {
      items.forEach((item) => {
        item.size.reset();
      });
      return;
    }
    
    items.forEach((item) => {
      // The interaction radius from the cursor is 120 pixels
      const progress = Utils.pointToViewProgress(
        { x: event.x, y: event.y },
        item,
        120
      );
      // Remap progress to a scale multiplier (1x to 2x)
      const scale = Utils.remap(progress, 0, 1, 1, 2);
      // With our base item size being 44px
      item.size.set({ width: 44 * scale, height: 44 * scale });
    });
  }

  context.setup(() => {
    root = context.getView('root');
    items = context.getViews('item');
    if (!root || !items) return;

    items.forEach((item) => {
      item.size.setAnimator('dynamic');
      // Origin bottom-center so items grow upward
      item.origin.set({ x: 0.5, y: 1 });
    });
  });
};

MacOsDockPlugin.pluginName = 'MacOsDock';

export function initDock() {
  const app = createApp();
  app.addPlugin(MacOsDockPlugin);
  app.run();
}

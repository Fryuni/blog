import {defineAllRoutesHook, defineSidebarHook, type Sidebar} from '@astrojs/starlight/hooks';

export const allRoutesHook = defineAllRoutesHook(routes => {
  const shownRoutes = import.meta.env.DEV
    ? routes
    : routes.filter(route => !route.entry.data.draft);

  for (const route of shownRoutes) {
    if (route.firstPublished === undefined && route.entry.data.firstPublished !== false) {
      // The first published date could not be inferred, consider as just published
      route.firstPublished = new Date();
    }
  }

  return shownRoutes;
});

// async function buildTagsEntry(): Promise<Sidebar> {
//   const {routes} = await import('@astrojs/starlight/routes');
//   const tagCounter = new Map<string, number>();
//
//   for (const route of routes) {
//     for (const tag of new Set<string>(route.entry.data.tags).values()) {
//       const count = tagCounter.get(tag) ?? 0;
//
//       tagCounter.set(tag, count + 1);
//     }
//   }
//
//   return [{
//     type: 'group',
//     collapsed: false,
//     label: 'Tags',
//     badge: undefined,
//     entries: Array.from(tagCounter.entries()).map(
//       ([tag, count]) => ({
//         type: 'link',
//         label: `${tag} (${count})`,
//         href: `/tags/${tag}`,
//         badge: undefined,
//         isCurrent: false,
//         attrs: {},
//       }),
//     ),
//   }];
// }

// const tagsEntry = LazyInstance.of(buildTagsEntry);

function dropEmptySidebarSections(sidebar: Sidebar): Sidebar {
  return sidebar.map(
    section => (
      section.type === 'group'
        ? {...section, entries: dropEmptySidebarSections(section.entries)}
        : section
    ),
  )
    .filter(section => section.type === 'link' || section.entries.length > 0);
}

export const sidebarHook = defineSidebarHook((route, sidebar) => {
  if (route.entry.data.template !== 'doc') {
    return [];
  }

  // await tagsEntry.get();

  return dropEmptySidebarSections(sidebar);
});

import {defineAllRoutesHook, defineSidebarHook, type Sidebar} from '@astrojs/starlight/hooks';
import {type MarkdownRenderer, parse, render} from '@croct/md-lite';

const plainTextRenderer: MarkdownRenderer<string> = {
  text: node => node.content,
  code: node => node.content,
  image: () => '',
  bold: node => node.children,
  italic: node => node.children,
  strike: node => node.children,
  link: node => node.children,
  paragraph: node => node.children.join(''),
  fragment: node => node.children.join(''),
};

const htmlRenderer: MarkdownRenderer<string> = {
  text: node => node.content,
  bold: node => `<b>${node.children}</b>`,
  italic: node => `<i>${node.children}</i>`,
  strike: node => `<s>${node.children}</s>`,
  code: node => `<code>${node.content}</code>`,
  link: node => `<a href="${node.href}">${node.children}</a>`,
  image: node => `<img src="${node.src}" alt="${node.alt}">`,
  paragraph: node => `<p>${node.children.join('')}</p>`,
  fragment: node => node.children.join(''),
};

export const allRoutesHook = defineAllRoutesHook(routes => {
  const shownRoutes = import.meta.env.DEV
    ? routes
    : routes.filter(route => !route.entry.data.draft);

  for (const route of shownRoutes) {
    if (route.firstPublished === undefined && route.entry.data.firstPublished !== false) {
      // The first published date could not be inferred, consider as just published
      route.firstPublished = new Date();
    }

    const baseDescription = route.entry.data.description;
    const styledDescription = route.entry.data.styledDescription ?? baseDescription;

    if (baseDescription !== undefined) {
      route.entry.data.description = render(parse(baseDescription), plainTextRenderer);
    }

    if (styledDescription !== undefined) {
      route.entry.data.styledDescription = render(parse(styledDescription), htmlRenderer);
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

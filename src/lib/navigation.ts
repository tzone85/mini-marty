export interface NavItem {
  readonly label: string;
  readonly path: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Block Editor", path: "/block-editor" },
  { label: "Python Editor", path: "/python-editor" },
  { label: "Tutorials", path: "/tutorials" },
  { label: "Challenges", path: "/challenges" },
] as const;

export function getNavItemByPath(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.path === path);
}

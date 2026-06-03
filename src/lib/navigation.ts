export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Block Editor", path: "/block-editor", icon: "🧩" },
  { label: "Python Editor", path: "/python-editor", icon: "🐍" },
  { label: "Tutorials", path: "/tutorials", icon: "📚" },
  { label: "Challenges", path: "/challenges", icon: "🏆" },
] as const;

export function getActiveNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.path === pathname);
}

export interface CodeExample {
  readonly title: string;
  readonly language: "python" | "blocks";
  readonly code: string;
  readonly description?: string;
}

export interface DocEntry {
  readonly title: string;
  readonly description: string;
  readonly content: readonly string[];
  readonly examples?: readonly CodeExample[];
  readonly parameters?: readonly ParameterDoc[];
  readonly returns?: string;
}

export interface ParameterDoc {
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly defaultValue?: string;
}

export interface DocSubSection {
  readonly id: string;
  readonly title: string;
  readonly entries: readonly DocEntry[];
}

export interface DocSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly subsections: readonly DocSubSection[];
}

export type DocSectionId =
  | "quick-start"
  | "block-reference"
  | "python-api"
  | "parent-teacher"
  | "keyboard-shortcuts"
  | "faq";

export interface SearchResult {
  readonly sectionId: string;
  readonly sectionTitle: string;
  readonly subsectionId: string;
  readonly subsectionTitle: string;
  readonly entryTitle: string;
  readonly matchContext: string;
}

import type { DocSection } from "../types";
import { QUICK_START_SECTION } from "./quick-start";
import { BLOCK_REFERENCE_SECTION } from "./block-reference";
import { PYTHON_API_SECTION } from "./python-api-reference";
import { PARENT_TEACHER_SECTION } from "./parent-teacher-guide";
import { KEYBOARD_SHORTCUTS_SECTION } from "./keyboard-shortcuts";
import { FAQ_SECTION } from "./faq";

export const ALL_DOC_SECTIONS: readonly DocSection[] = [
  QUICK_START_SECTION,
  BLOCK_REFERENCE_SECTION,
  PYTHON_API_SECTION,
  PARENT_TEACHER_SECTION,
  KEYBOARD_SHORTCUTS_SECTION,
  FAQ_SECTION,
];

export {
  QUICK_START_SECTION,
  BLOCK_REFERENCE_SECTION,
  PYTHON_API_SECTION,
  PARENT_TEACHER_SECTION,
  KEYBOARD_SHORTCUTS_SECTION,
  FAQ_SECTION,
};

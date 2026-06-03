---
aliases: [Mini Marty Architecture]
tags: [project/mini-marty, type/architecture]
---

# Architecture

Five layers stacked from UI down to vendors. Dependencies only flow downward.

![[../diagrams/architecture.svg]]

## Module dependencies

![[../diagrams/module-dependencies.svg]]

## Execution sequences

Blocks path:

![[../diagrams/sequence-blocks.svg]]

Python path:

![[../diagrams/sequence-python.svg]]

## Command lifecycle

![[../diagrams/state-command.svg]]

## Cross-references

- Repo: [overview](../architecture/overview.md), [virtual-marty](../architecture/virtual-marty.md), [python-runtime](../architecture/python-runtime.md), [scene](../architecture/scene.md)
- Vault: [[Decisions]], [[Glossary]]

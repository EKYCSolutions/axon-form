# Axon Form Monorepo

Axon Form is a dynamic form platform built around a graph-based form engine. This repository contains the core engine, a Flutter runtime SDK, and a console application for designing and managing form definitions.

## 🎯 What This Repo Contains

| Module | Path | Role |
|---|---|---|
| Flutter SDK | `axon_form_flutter` | Renders Axon JSON forms in Flutter apps (mobile/web) and bridges to native core via FFI |
| Core Engine | `axon-form-core` (aka `axon_form_core`) | Graph engine for form parsing, validation, conditional visibility, option resolution, address hierarchies, and result generation |
| Form Console | `axon-form-console` | Web console for building and managing form schemas, nodes, edges, and related metadata |

## 🧱 System Architecture

```text
Form Design (Console)
        ↓
     JSON Schema
        ↓
   Axon Core Engine
(validation + visibility + result resolution)
        ↓
 Flutter Runtime (axon_form_flutter)
        ↓
Rendered UI + Submission Payload
```

## 🔩 Core Concepts

- **Graph-driven forms**: forms are modeled as nodes and edges, not hardcoded screens.
- **Layout + logic separation**: page layout lives in `layout.pages`; behavior lives in node/edge relationships.
- **Dynamic visibility**: `shows` and condition expressions decide which pages/fields are visible at runtime.
- **Option relationships**: `has_options` and `filter_by` connect inputs to selectable value nodes and cascaded dependencies.
- **Native validation flow**: validation is evaluated by the core engine and surfaced to UI.

## 📦 Module Overview

### `axon_form_flutter`

Flutter package that renders multi-page forms from Axon JSON.

Key responsibilities:

- Provides `AxonForm.json(...)` and `AxonForm.file(...)` as primary entry points.
- Uses `AxonFormProvider` + `AxonFormController` for state and navigation.
- Supports built-in field widgets:
  - text, number, date, password, radio, dropdown, address dropdown, checkbox, multi-select, file
- Exposes customization via:
  - `fieldBuilder`, `pageBuilder`, `pageNavigatorBuilder`
  - `ThemeExtension` style classes for each field type
- Connects to the core through FFI (`AxonFormFFI`) for initialization, validation, option lookup, and submission output.

### `axon-form-core` (`axon_form_core`)

Go-based engine that interprets form JSON into an executable graph.

Key responsibilities:

- Parses and initializes:
  - pages, nodes, edges, condition groups, and address datasets
- Maintains grouped and combined node maps for fast graph operations.
- Evaluates:
  - node validation
  - page/form value extraction
  - node/page visibility changes from conditional edges
- Resolves output values:
  - option IDs to value payloads
  - hierarchical address selections
- Emits events consumed by clients (for example visibility change notifications).
- Provides wrappers for:
  - **FFI bridge** (`ffi_wrapper.go`) for Flutter/native integration
  - **WASM bridge** (`wasm_wrapper.go`) for web-oriented runtime surfaces

### `axon-form-console`

React + TypeScript web application for form authoring and management.

Key responsibilities:

- Provides a visual/editor workflow for constructing form graphs.
- Manages schema entities such as pages, input nodes, value nodes, and edges.
- Supports validation-friendly schema authoring for downstream runtime execution.
- Acts as the primary producer/maintainer of JSON configurations consumed by runtimes.

## 🔄 End-to-End Flow

1. Form authors define pages, fields, and logic in **axon-form-console**.
2. Console outputs a JSON graph schema.
3. **axon-form-core** parses and executes runtime logic (visibility, validation, value resolution).
4. **axon_form_flutter** renders UI and delegates validation/logic calls to the core.
5. Final form submission is returned as normalized JSON payload.

## 🧠 JSON Contract (High Level)

Typical schema sections used across the platform:

- `layout.pages`: ordered page metadata and field placement
- `nodes`: page/input/value nodes
- `edges`: relationships (`has_options`, `filter_by`, `shows`, etc.)
- `condition_groups`: grouped conditional logic
- `address`: hierarchical address source used by address dropdown inputs

## ✅ Design Goals

- **Single source of truth for form logic** in the core engine
- **Cross-platform rendering** through Flutter SDK
- **Separation of concerns** between authoring (console), execution (core), and presentation (runtime)
- **Extensibility** for new field types, rules, and UI customizations without redesigning form screens

## 📁 Repository Structure

```text
axon-form/
├── axon_form_flutter/    # Flutter runtime SDK
├── axon-form-core/       # Go graph engine + FFI/WASM wrappers
├── axon-form-console/    # React/TypeScript authoring console
└── README.md
```

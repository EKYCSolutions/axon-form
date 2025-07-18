# Axon Form

A lightweight, graph-based engine for building dynamic forms.

Axon empowers you to create complex, conditional forms by representing fields as **nodes** and the logic connecting them as **edges**.

---

## Core Concept

* **Nodes**: Represent individual form fields (e.g., a text input, dropdown, or checkbox). Each node can have its own validation rules.
* **Edges**: Represent the relationships and conditional logic between nodes. An edge can also determines which node becomes accessible based on the input of its parent node.

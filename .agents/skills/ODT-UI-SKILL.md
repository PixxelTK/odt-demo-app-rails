---
name: odt-ui-rails
description: Guide for AI agents to integrate and build with the odt-ui-rails gem in Ruby on Rails applications. Covers installation, ActionView helpers, Hotwire/Turbo Streams, Stimulus controllers, Tailwind CSS v4, and form patterns.
---

# ODT UI Rails Integration Guide

`odt-ui-rails` brings the ODT Design System to Ruby on Rails with server-rendered ActionView helpers, pre-compiled standalone CSS, Stimulus controllers, and Hotwire/Turbo Stream integration.

---

## 1. Quickstart

### Installation

Add to your `Gemfile`:

```ruby
gem "odt-ui-rails"
```

Install dependencies and run the generator:

```bash
bundle install
bin/rails g odt:install
```

### What the Generator Does

- **Stylesheet:** Injects `<%= stylesheet_link_tag "odt_ui", "data-turbo-track": "reload" %>` into `app/views/layouts/application.html.erb`.
- **Tailwind v4:** Copies `odt_theme.css` into your Tailwind assets directory and adds `@import "./odt_theme.css";` to register design tokens in `@theme`.
- **Stimulus Controllers:** Copies interactive controllers into `app/javascript/controllers/`:
  - `odt_toaster_controller.js`
  - `odt_toast_controller.js`
  - `odt_modal_controller.js`
  - `odt_dropdown_controller.js`
- **Type Signatures:** Copies `sig/odt_ui.rbs` for Ruby LSP / Solargraph IDE autocomplete.

---

## 2. Component Reference

All helpers are available in ERB templates via `ActionView::Base`.

### Button (`odt_button`)

Renders a `<button>` or an `<a>` anchor link when `href` is supplied.

```erb
<%# Standard actions %>
<%= odt_button "Save Changes", variant: :filled, color: :primary, size: :md %>
<%= odt_button "Explore", variant: :capsule, color: :secondary, size: :sm %>
<%= odt_button "Cancel", variant: :ghost, color: :surface %>

<%# Button with icon %>
<%= odt_button "New Task", variant: :filled, color: :primary, icon: "fa-solid fa-plus" %>

<%# Link styled as a button %>
<%= odt_button "View Details", href: project_path(@project), variant: :filled, color: :secondary %>

<%# Loading state %>
<%= odt_button "Submitting...", loading: true, disabled: true %>
```

| Parameter | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `text` | String | `nil` | Label text (omit if using a block) |
| `variant:` | Symbol | `:filled` | `:filled`, `:frosted`, `:capsule`, `:ghost` |
| `color:` | Symbol | `:primary` | `:primary`, `:secondary`, `:surface`, `:muted`, `:inverse`, `:success`, `:warning`, `:danger`, `:info` |
| `size:` | Symbol | `:md` | `:sm`, `:md`, `:lg` |
| `radius:` | Symbol | `nil` | `:none`, `:xs`, `:sm`, `:md`, `:lg`, `:xl`, `:"2xl"`, `:"3xl"`, `:"4xl"`, `:full` |
| `href:` | String | `nil` | Renders `<a>` tag instead of `<button>` |
| `icon:` | String | `nil` | Leading icon CSS class (e.g. `"fa-solid fa-plus"`) |
| `right_icon:` | String | `nil` | Trailing icon CSS class |
| `icon_only:` | Boolean | `false` | Square icon button |
| `full_width:` | Boolean | `false` | Stretches width to 100% |
| `loading:` | Boolean | `false` | Displays spinner animation |
| `disabled:` | Boolean | `false` | Disables interaction |

---

### Badge (`odt_badge`)

Compact indicator for statuses, counters, and tags.

```erb
<%= odt_badge "Active", variant: :subtle, color: :success, dot: true %>
<%= odt_badge "Admin", variant: :filled, color: :primary, size: :sm %>
<%= odt_badge "Draft", variant: :outlined, color: :neutral %>
```

| Parameter | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `variant:` | Symbol | `:subtle` | `:subtle`, `:filled`, `:outlined` |
| `color:` | Symbol | `:primary` | `:primary`, `:secondary`, `:success`, `:warning`, `:danger`, `:info`, `:neutral` |
| `size:` | Symbol | `:md` | `:sm`, `:md` |
| `dot:` | Boolean | `false` | Displays leading status dot |
| `radius:` | Symbol | `nil` | Corner radius token |

---

### Card (`odt_card`)

Surface container with optional header, padding, and hover elevation.

```erb
<%= odt_card title: "Analytics", subtitle: "Monthly performance overview", variant: :elevated, radius: :"3xl", class: "p-6" do %>
  <p>Card content</p>
<% end %>
```

| Parameter | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `title:` | String | `nil` | Header title |
| `subtitle:` | String | `nil` | Header subtitle |
| `variant:` | Symbol | `:elevated` | `:elevated`, `:outlined`, `:subtle`, `:ghost` |
| `radius:` | Symbol | `nil` | Radius token (`:none` to `:"4xl"`, `:full`) |
| `border:` | Symbol/Bool | `nil` | `:none`, `:muted`, `:base`, `:strong`, `:primary`, `true`, `false` |
| `hoverable:` | Boolean | `false` | Enables hover elevation effect |
| `as:` | Symbol | `:div` | `:div`, `:article`, `:section`, `:aside`, `:main` |

---

### Form Controls

#### Text Input (`odt_input`)
```erb
<%= odt_input(
  label: "Email Address",
  name: "user[email]",
  value: @user.email,
  placeholder: "you@example.com",
  left_icon: "fa-solid fa-envelope",
  error: @user.errors[:email].first,
  radius: :xl,
  required: true
) %>
```

#### Textarea (`odt_textarea`)
```erb
<%= odt_textarea(
  label: "Description",
  name: "task[description]",
  rows: 4,
  placeholder: "Enter details...",
  helper: "Brief summary of your project",
  radius: :xl
) %>
```

#### Select (`odt_select`)
Renders an interactive dropdown menu synchronized with a hidden form input.

```erb
<%= odt_select(
  label: "Category",
  name: "task[category]",
  options: [["Work", "work"], ["Personal", "personal"]],
  selected: @task.category,
  radius: :xl,
  size: :md
) %>
```

#### Checkbox & Radio (`odt_checkbox`, `odt_radio`)
```erb
<%= odt_checkbox label: "Keep me signed in", name: "remember", checked: true, color: :primary %>
<%= odt_radio label: "Monthly Plan", name: "plan", value: "monthly", checked: true %>
<%= odt_radio label: "Annual Plan (Save 20%)", name: "plan", value: "annual" %>
```

#### Form Group Wrapper (`odt_form_group`)
Wraps custom or third-party inputs with standard label, helper, and error text:

```erb
<%= odt_form_group label: "Upload File", helper: "Max 5MB (PNG, JPG)" do %>
  <%= file_field_tag :avatar, class: "..." %>
<% end %>
```

---

### Dropdown Menu (`odt_dropdown_menu`)

Floating dropdown menu with keyboard navigation (`ArrowUp`, `ArrowDown`, `Esc`) and click-outside dismissal.

```erb
<%= odt_dropdown_menu do %>
  <%= odt_dropdown_trigger "Actions", variant: :outlined, size: :md %>
  <%= odt_dropdown_content align: :end, radius: :xl do %>
    <%= odt_dropdown_label "Manage" %>
    <%= odt_dropdown_item "Edit", href: edit_task_path(@task), left_icon: "fa-solid fa-pen", shortcut: "⌘E" %>
    <%= odt_dropdown_item "Duplicate", left_icon: "fa-solid fa-copy" %>
    <%= odt_dropdown_separator %>
    <%= odt_dropdown_item "Delete", destructive: true, left_icon: "fa-solid fa-trash", data: { turbo_method: :delete } %>
  <% end %>
<% end %>
```

---

### Modal (`odt_modal`)

Dialog with backdrop blur, scale animation, and keyboard accessibility.

```erb
<%# 1. Trigger Button (placed anywhere in the DOM) %>
<%= odt_button "New Task", variant: :filled, radius: :full, data: { odt_modal_target_id: "new_task_modal" } %>

<%# 2. Modal Dialog %>
<%= odt_modal id: "new_task_modal", title: "Create Task", subtitle: "Add a new task to your list", size: :md do %>
  <%= render "form", task: Task.new %>
<% end %>
```

- **Trigger:** Connect any element by setting `data: { odt_modal_target_id: "<modal_id>" }`.
- **Turbo Auto-Close:** Automatically closes when a form inside the modal finishes submitting via Turbo (`turbo:submit-end`).
- **Dismissal:** Closes on `Escape`, clicking the backdrop, or clicking elements with `data: { action: "click->odt-modal#close" }`.

---

### Toasts & Flash Notifications

#### In Layout (`app/views/layouts/application.html.erb`)
```erb
<%= odt_toaster position: :bottom_right %>
<%= odt_flash_toasts flash %>
```

#### In Turbo Stream Responses
```erb
<%# app/views/tasks/create.turbo_stream.erb %>
<%= turbo_stream.prepend "tasks_list", partial: "task", locals: { task: @task } %>
<%= odt_toast_stream @task.title, title: "Task created!", type: :success %>
```

| Type | Description |
| :--- | :--- |
| `:default` | Neutral notification |
| `:success` | Green check icon |
| `:warning` | Amber alert icon |
| `:danger` / `:error` | Red cross icon |
| `:info` | Blue info icon |
| `:loading` | Animated spinner icon |

---

### Typography & Avatars

```erb
<%# Headings %>
<%= odt_heading "Dashboard", as: :h1, size: :"4xl", weight: :bold, color: :strong %>
<%= odt_heading "Recent Projects", as: :h3, size: :xl, weight: :semibold %>

<%# Body Text %>
<%= odt_text "Description paragraph.", size: :base, color: :default %>
<%= odt_text "Subtle caption text", size: :sm, color: :muted %>

<%# Avatars %>
<%= odt_avatar name: "John Doe", size: :md, color: :primary %>
<%= odt_avatar src: "/avatars/john.jpg", size: :lg %>
```

---

### Alerts (`odt_alert`)

```erb
<%= odt_alert "Changes saved successfully.", variant: :success %>
<%= odt_alert "Please verify your email address.", variant: :warning %>
<%= odt_alert "Failed to connect to service.", variant: :danger %>
```

---

## 3. Real-World Form Pattern

A complete example of using ODT UI helpers in a standard Rails `form_with`:

```erb
<div class="max-w-xl mx-auto py-8">
  <%= odt_card title: "New Project", subtitle: "Fill in the project details below", radius: :"3xl", class: "p-6" do %>
    <%= form_with model: @project, class: "space-y-4" do |f| %>
      <%= odt_input(
        label: "Project Title",
        name: "project[title]",
        value: @project.title,
        placeholder: "e.g. Website Redesign",
        error: @project.errors[:title].first,
        radius: :xl,
        required: true
      ) %>

      <%= odt_textarea(
        label: "Description",
        name: "project[description]",
        value: @project.description,
        placeholder: "Describe the scope...",
        rows: 3,
        radius: :xl
      ) %>

      <div class="grid grid-cols-2 gap-3">
        <%= odt_select(
          label: "Category",
          name: "project[category]",
          options: [["Design", "design"], ["Development", "dev"], ["Marketing", "marketing"]],
          selected: @project.category,
          radius: :xl
        ) %>

        <%= odt_select(
          label: "Priority",
          name: "project[priority]",
          options: [["Low", "low"], ["Medium", "medium"], ["High", "high"]],
          selected: @project.priority || "medium",
          radius: :xl
        ) %>
      </div>

      <div class="pt-2">
        <%= odt_button "Create Project", type: "submit", color: :primary, variant: :filled, radius: :full, full_width: true %>
      </div>
    <% end %>
  <% end %>
</div>
```

---

## 4. Tailwind CSS v4 Interop

When using Tailwind CSS alongside ODT UI, `odt_theme.css` maps design tokens into Tailwind `@theme`:

```html
<!-- You can freely use ODT tokens in Tailwind utility classes -->
<div class="bg-surface-info text-fg-info p-4 rounded-2xl">
  <p class="text-fg-strong font-semibold">Token-driven styling</p>
  <div class="bg-primary-500 h-2 rounded-full w-3/4 mt-2"></div>
</div>
```

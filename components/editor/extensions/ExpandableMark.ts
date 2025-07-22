import { Mark, mergeAttributes } from "@tiptap/core";
import { InputRule, PasteRule } from "@tiptap/core";

export interface ExpandableMarkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    expandableMark: {
      setExpandableMark: (attributes?: { content: string }) => ReturnType;
      toggleExpandableMark: (attributes?: { content: string }) => ReturnType;
      unsetExpandableMark: () => ReturnType;
    };
  }
}

export const ExpandableMark = Mark.create<ExpandableMarkOptions>({
  name: "expandableMark",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      content: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-content"),
        renderHTML: (attributes) => {
          if (!attributes.content) {
            return {};
          }
          return {
            "data-content": attributes.content,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-expandable]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          "data-expandable": "true",
          class:
            "expandable-mark bg-blue-100 hover:bg-blue-200 cursor-pointer px-1 py-0.5 rounded border border-blue-300 transition-colors",
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setExpandableMark:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleExpandableMark:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetExpandableMark:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addInputRules() {
    const inputRegex = /\?\?([^?]+)\?\?(\s?)$/;

    return [
      new InputRule({
        find: inputRegex,
        handler: ({ state, range, match }) => {
          const { from, to } = range;
          const content = match[1];
          const space = match[2] || "";

          if (!content) return null;

          const tr = state.tr;
          tr.delete(from, to);
          tr.insertText(content + space, from);
          tr.addMark(
            from,
            from + content.length,
            this.type.create({ content })
          );

          return tr;
        },
      }),
    ];
  },

  addPasteRules() {
    const pasteRegex = /\?\?([^?]+)\?\?/g;

    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ state, range, match }) => {
          const { from, to } = range;
          const content = match[1];

          if (!content) return null;

          const tr = state.tr;
          tr.delete(from, to);
          tr.insertText(content, from);
          tr.addMark(
            from,
            from + content.length,
            this.type.create({ content })
          );

          return tr;
        },
      }),
    ];
  },
});

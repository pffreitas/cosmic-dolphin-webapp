import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import "./styles.css";
import { Response } from "../ai-elements/response";

// Custom remark plugin to handle ??term?? notation
function remarkTermLinks() {
  return (tree: any) => {
    visit(tree, "text", (node) => {
      const regex = /\?\?([^?]+)\?\?/g;
      const value = node.value;

      if (regex.test(value)) {
        const parts = value.split(regex);
        const children = [];

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // Regular text
            if (parts[i]) {
              children.push({ type: "text", value: parts[i] });
            }
          } else {
            // Term to be linked
            children.push({
              type: "link",
              url: `/terms/${parts[i].toLowerCase().replace(/\s+/g, "-")}`,
              children: [{ type: "text", value: parts[i] }],
            });
          }
        }

        // Replace the text node with multiple nodes
        Object.assign(node, {
          type: "paragraph",
          children: children,
        });
      }
    });
  };
}

function CosmicMarkdown({ body }: { body: string }) {
  return <Response>{body}</Response>;
}

export default CosmicMarkdown;

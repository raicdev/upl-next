import { Button } from "@shadcn/button";
import { Check, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { useMemo, ClassAttributes, HTMLAttributes, useState } from "react";
import { ExtraProps } from "react-markdown";
import { dark, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const Pre = ({
  children,
  ...props
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) => {
  const [copiedLines, setCopiedLines] = useState<Record<string, boolean>>({});

  if (!children || typeof children !== "object") {
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }
  const childType =
    "type" in children && typeof children.type === "string"
      ? children.type
      : "";
  if (childType !== "code") {
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  const childProps =
    "props" in children && typeof children.props === "object"
      ? children.props
      : {};
  const code =
    childProps && "children" in childProps ? childProps.children : "";

  return (
    <div>
      <div className="relative rounded rounded-b-none bg-primary-foreground pl-5 pr-5 p-2 mb-0 text-sm flex items-center justify-between">
        <span className="cursor-default">Generated Code</span>
        <Button
          variant={"default"}
          className="cursor-pointer"
          onClick={(event) => {
            const codeString = String(code);
            navigator.clipboard.writeText(codeString);

            setCopiedLines((prev) => ({
              ...prev,
              [codeString]: true,
            }));

            // Reset back to copy icon and text after 2 seconds
            setTimeout(() => {
              setCopiedLines((prev) => ({
                ...prev,
                [codeString]: false,
              }));
            }, 2000);
          }}
        >
          {copiedLines[String(code)] ? <Check /> : <Copy />}
        </Button>
      </div>
      <SyntaxHighlighter className="mt-0 rounded-none rounded-b !p-3 mb-0" style={vs2015}>
        {String(code).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

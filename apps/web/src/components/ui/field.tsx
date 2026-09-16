import { Button as TButton } from "@fitnexx/ui";
import type React from "react";

type SubmitButtonProps = React.ComponentProps<typeof TButton> & {
  type?: "submit" | "button" | "reset";
};

export const SubmitButton = TButton as unknown as React.FC<SubmitButtonProps>;

const baseFieldStyle: React.CSSProperties = {
  backgroundColor: "#0d121a",
  border: "1px solid #243043",
  borderRadius: 12,
  color: "#f4f7fb",
  fontSize: 15,
  fontFamily: "inherit",
  width: "100%",
  outline: "none",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
};

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        ...baseFieldStyle,
        height: 44,
        padding: "0 12px",
        ...props.style,
      }}
    />
  );
}

export function TextAreaField(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      style={{
        ...baseFieldStyle,
        height: 140,
        padding: "10px 12px",
        resize: "vertical",
        ...props.style,
      }}
    />
  );
}

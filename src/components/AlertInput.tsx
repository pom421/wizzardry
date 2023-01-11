type AlertType = "error" | "warning" | "success"

// Global Alert div.
export const Alert = ({ children, type }: { children: string; type: AlertType }) => {
  const backgroundColor = type === "error" ? "tomato" : type === "warning" ? "orange" : "powderBlue"

  return <div style={{ padding: "0 10", backgroundColor }}>{children}</div>
}

// Use role="alert" to announce the error message.
export const AlertInput = ({ children }: { children: React.ReactNode }) =>
  children ? (
    <span role="alert" style={{ color: "tomato" }}>
      {children}
    </span>
  ) : null

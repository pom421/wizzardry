export const Label = ({ children, htmlFor }: { children: string; htmlFor: string }) => (
  <label htmlFor={htmlFor} style={{ width: "80px", display: "inline-block" }}>
    {children}
  </label>
)

import { forwardRef } from "react"

const Button = forwardRef(({ className = "", children, ...props }, ref) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200"
  const defaultStyles = "bg-primary text-white hover:bg-primary/90"
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${className || defaultStyles}`}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }

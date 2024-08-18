import { useState } from "react"
import { Button, ButtonProps } from "./ui/button"
import { Loader2 } from "lucide-react"

type AsyncButtonProps = ButtonProps & {
  onClick?: () => Promise<void>
}

const AsyncButton = (props: AsyncButtonProps) => {
  const { onClick, disabled, children, ...reset } = props
  const [loading, setLoading] = useState(false)

  return (
    <Button
      {...reset}
      disabled={loading || disabled}
      onClick={async () => {
        try {
          setLoading(true)
          await onClick?.()
        } catch (e) {
          throw e
        } finally {
          setLoading(false)
        }
      }}
    >
      {loading ? <Loader2 size={16} className="mr-1 animate-spin" /> : null}
      {children}
    </Button>
  )
}

export default AsyncButton

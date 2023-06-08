import { ButtonHTMLAttributes } from "react"

import { ButtonIconContainer } from "./styles"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function ButtonIcon({ ...rest }: ButtonProps) {
  return <ButtonIconContainer {...rest} />
}

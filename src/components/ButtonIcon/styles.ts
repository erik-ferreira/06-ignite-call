import { styled } from "@ignite-ui/react"

export const ButtonIconContainer = styled("button", {
  all: "unset",

  cursor: "pointer",
  lineHeight: 0,
  borderRadius: "$sm",

  svg: {
    width: "$5",
    height: "$5",
  },

  "&:hover": {
    color: "$gray100",
  },

  "&:focus": {
    boxShadow: "0 0 0 2px $colors$gray100",
  },
})

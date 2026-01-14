declare module "react-responsive-masonry" {
  import type { ReactNode, FC } from "react"

  interface MasonryProps {
    columnsCount?: number
    gutter?: string
    children?: ReactNode
  }

  const Masonry: FC<MasonryProps>
  export default Masonry
}

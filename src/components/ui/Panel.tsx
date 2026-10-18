import type { PropsWithChildren, ReactNode } from 'react'

type PanelProps = PropsWithChildren<{
  className?: string
  labelledBy?: string
}>

export function Panel({ children, className = '', labelledBy }: PanelProps) {
  return <section className={`ui-panel ${className}`.trim()} aria-labelledby={labelledBy}>{children}</section>
}

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  detail?: ReactNode
}

export function SectionHeading({ eyebrow, title, detail }: SectionHeadingProps) {
  return <div className="study-panel-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
    {detail && <span className="review-count">{detail}</span>}
  </div>
}

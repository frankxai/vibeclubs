import { Card, CardEyebrow, CardTitle, CardBody } from '@/components/ui'

interface FeatureCardProps {
  eyebrow?: string
  title: string
  body: string
  footer?: React.ReactNode
}

export function FeatureCard({ eyebrow, title, body, footer }: FeatureCardProps) {
  return (
    <Card pad="lg" interactive>
      {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}
      <CardTitle className="mb-3">{title}</CardTitle>
      <CardBody>{body}</CardBody>
      {footer && <div className="mt-4">{footer}</div>}
    </Card>
  )
}

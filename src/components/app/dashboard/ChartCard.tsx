import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import cn from "@/utils/cn";

export function ChartCard({
  title,
  description,
  children,
  footer,
  className,
  headerExtra,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerExtra?: React.ReactNode;
}) {
  return (
    <Card size="sm" className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {headerExtra}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">{children}</CardContent>
      {footer}
    </Card>
  );
}

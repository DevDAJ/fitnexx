export function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-heading text-lg font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

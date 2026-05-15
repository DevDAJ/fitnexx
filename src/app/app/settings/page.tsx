import { Header } from "@/components/app/Header";
import { ModeToggle } from "@/components/shared/mode-toggle";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:px-6">
      <Header
        title="Settings"
        description="Manage your account and preferences."
      />

      <section aria-label="Appearance" className="md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 space-y-0.5">
            <p className="font-medium text-foreground leading-snug">Dark mode</p>
            <p className="text-muted-foreground text-sm leading-snug">
              Easier on the eyes in low light.
            </p>
          </div>
          <ModeToggle className="shrink-0" />
        </div>
      </section>

      <div className="hidden md:block">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose light or dark colors for the Fitnexx interface.
            </CardDescription>
            <CardAction className="self-center">
              <ModeToggle />
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

/**
 * Maps Fitnexx `globals.css` theme tokens into Clerk so sign-in, user menu,
 * and related surfaces follow the app palette in light and dark mode.
 *
 * References `var(--…)` resolve when Clerk renders under `<html>` (next-themes
 * toggles `:root` / `.dark`).
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorDanger: "var(--destructive)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorTextOnPrimaryBackground: "var(--primary-foreground)",
    colorBackground: "var(--background)",
    colorInputBackground: "var(--card)",
    colorInputText: "var(--foreground)",
    colorNeutral: "var(--border)",
    borderRadius: "var(--radius-lg)",
    fontFamily: "inherit",
    fontSmoothing: "antialiased" as const,
  },
  elements: {
    card: "rounded-[var(--radius-xl)] border border-border bg-card text-card-foreground shadow-sm",
    modalBackdrop: "bg-black/45! backdrop-blur-sm dark:bg-black/60!",
    navbar: "border-b border-border bg-background/80 backdrop-blur-md",
    navbarButton:
      "text-foreground hover:bg-accent hover:text-accent-foreground",
    headerTitle: "font-semibold tracking-tight text-foreground",
    headerSubtitle: "text-muted-foreground text-sm",
    dividerLine: "bg-border",
    formFieldLabel: "text-foreground text-sm font-medium",
    formFieldHintText: "text-muted-foreground",
    formFieldErrorText: "text-destructive text-sm",
    formButtonPrimary:
      "bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
    formButtonSecondary:
      "border border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/90",
    footerActionLink:
      "text-primary font-medium no-underline hover:opacity-90 focus-visible:underline",
    /** Border + elevation: see `globals.css` `.border-clerk-social`, `.shadow-clerk-social`, `.cl-providerIcon` */
    socialButtonsIconButton:
      "border-clerk-social bg-background! shadow-clerk-social! hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50",
    socialButtonsBlockButton:
      "border-clerk-social bg-background! shadow-clerk-social! hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50",
    socialButtonsBlockButtonManyInView:
      "border-clerk-social bg-background! shadow-clerk-social! hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50",
    userButtonPopoverCard:
      "z-[100] border-border bg-popover text-popover-foreground shadow-lg",
    userButtonPopoverActionButton: "text-foreground hover:bg-accent",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </section>
  );
}

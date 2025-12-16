export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Curated Finds. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

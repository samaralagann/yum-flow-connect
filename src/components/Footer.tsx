import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">Y</div>
            <span className="text-lg font-extrabold">Yumly</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Your favorite restaurants, delivered fast.</p>
        </div>
        <FooterCol title="Company" links={[["About", "/"], ["Careers", "/"], ["Blog", "/"]]} />
        <FooterCol title="For you" links={[["Restaurants", "/restaurants"], ["Offers", "/offers"], ["Support", "/support"]]} />
        <FooterCol title="Legal" links={[["Terms", "/"], ["Privacy", "/"], ["Cookies", "/"]]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Yumly. All rights reserved.</div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([l, h]) => <li key={l}><Link to={h} className="hover:text-foreground">{l}</Link></li>)}
      </ul>
    </div>
  );
}

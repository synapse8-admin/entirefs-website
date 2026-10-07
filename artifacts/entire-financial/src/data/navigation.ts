export type NavChild = { name: string; href: string };

export type NavLink = {
  name: string;
  href: string;
  children?: NavChild[];
};

export const navigationLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Services",
    href: "/#services",
    children: [
      { name: "Transition to retirement", href: "/transition-to-retirement" },
      { name: "Retirement planning", href: "/retirement-planning" },
      { name: "Aged care", href: "/aged-care" },
    ],
  },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Contact", href: "/contact" },
];

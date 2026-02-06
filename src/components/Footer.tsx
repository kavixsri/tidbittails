import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { label: "About Us", href: "#home" },
    { label: "Our Network", href: "#nodes" },
    { label: "Partner NGOs", href: "#ngos" },
    { label: "Events", href: "#events" },
  ],
  getInvolved: [
    { label: "Volunteer", href: "#volunteer" },
    { label: "Donate", href: "#" },
    { label: "Foster", href: "#" },
    { label: "Adopt", href: "#" },
  ],
  resources: [
    { label: "Emergency Helpline", href: "#emergency" },
    { label: "Pet Care Tips", href: "#" },
    { label: "Report Cruelty", href: "#emergency" },
    { label: "FAQs", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">
                TIDBIT TAILS
              </span>
            </div>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Delhi's unified animal welfare network connecting NGOs, volunteers, and 
              compassionate citizens to create a safer city for our furry friends.
            </p>
            <div className="space-y-2">
              <a href="tel:+911234567890" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91-123-456-7890 (24/7 Helpline)</span>
              </a>
              <a href="mailto:savestrays14@gmail.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>savestrays14@gmail.com</span>
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2026 TIDBIT TAILS. All rights reserved. Made with 💛 for Delhi's strays.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

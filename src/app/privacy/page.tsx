import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GlowHacks handles your data: all tools run in your browser and nothing you enter is sent to our servers.",
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Introduction",
    body: [
      "Welcome to GlowHacks. Your privacy is important to us. This Privacy Policy explains what information is and is not collected when you use our website and tools, and the choices you have. By using GlowHacks you agree to the practices described below.",
    ],
  },
  {
    title: "2. Information you enter into our tools",
    body: [
      "All GlowHacks tools run entirely in your web browser. Anything you type, select, or upload into a tool, such as an ingredient list, your body weight, or your cycle dates, is processed on your own device. We do not send this information to our servers, we do not store it in a database, and we cannot see it.",
    ],
  },
  {
    title: "3. Local storage on your device",
    body: [
      "Some tools, including the Period Calculator and Water Tracker, save your progress using your browser's local storage so that it is still there when you come back. This data is stored only on your device and is never transmitted to us. You can delete it at any time by using the reset options inside a tool or by clearing your browser's site data. Clearing it will permanently remove your saved information, and because we do not have a copy, we cannot restore it.",
    ],
  },
  {
    title: "4. Log data",
    body: [
      "Like most websites, our hosting provider may automatically record standard technical information when you visit, such as your IP address, browser type, device type, pages viewed, and the time of your visit. This information is used to keep the site secure and running smoothly and is not used to identify you personally.",
    ],
  },
  {
    title: "5. Cookies and advertising",
    body: [
      "GlowHacks may display advertisements provided by third-party advertising partners, including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet.",
      "You may opt out of personalized advertising by visiting Google Ads Settings (google.com/settings/ads). You can also opt out of some third-party vendors' use of cookies for personalized advertising by visiting aboutads.info. Most browsers also let you block or delete cookies in their settings; note that some parts of the site may not work as expected if you do.",
    ],
  },
  {
    title: "6. Third-party links",
    body: [
      "Our website may contain links to other websites. We are not responsible for the privacy practices or content of those sites, and we encourage you to read their privacy policies.",
    ],
  },
  {
    title: "7. Children's privacy",
    body: [
      "GlowHacks does not knowingly collect personal information from children under 13. Because our tools process information locally on your device, we do not receive or store personal details. If you believe a child has provided personal information to us, please contact us and we will take appropriate steps.",
    ],
  },
  {
    title: "8. Health disclaimer",
    body: [
      "The tools on GlowHacks are for general informational purposes only and do not provide medical, dermatological, or nutritional advice. Always consult a qualified professional about health concerns.",
    ],
  },
  {
    title: "9. Your rights and choices",
    body: [
      "Because we do not collect personal data through our tools, there is generally nothing for us to access, correct, or delete. You remain in full control of anything stored in your browser. If you are in a region with data protection laws such as the GDPR or CCPA and have questions about your rights, please contact us.",
    ],
  },
  {
    title: "10. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will change the date at the top of this page. We encourage you to review it periodically.",
    ],
  },
  {
    title: "11. Contact us",
    body: [`If you have any questions about this Privacy Policy, please email us at ${siteConfig.email} or visit our Contact page.`],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-glow-muted">Last updated: October 24, 2026</p>

      <div className="card mt-8 space-y-8 p-6 sm:p-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-glow-ink/85">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

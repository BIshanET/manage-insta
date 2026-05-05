import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Instagram Post Manager",
  description: "Plan and publish your Instagram content seamlessly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

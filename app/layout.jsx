import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "@styles/globals.css";
import "react-medium-image-zoom/dist/styles.css";
import ModalContext from "@context/ModalContext";
import UserContext from "@context/UserContext";
import DataContext from "@context/DataContext";
import ScreenTemplate from "@components/ScreenTemplate";

const Modal = dynamic(() => import("@components/Modal"), { ssr: false });
const Navbar = dynamic(() => import("@components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

export const metadata = {
  title: "PickEat | Order Food from Your Seat",
  description:
    "Experience convenience with PickEat. Browse menus, order food, and get it delivered to your seat or ready for pickup—all while enjoying the game.",
  keywords:
    "PickEat, stadium food, food delivery, food pickup, sports venue dining, in-seat delivery, fast service, mobile ordering, stadium restaurants.",
  alternates: {
    canonical: "https://pickeat.com/",
  },
  charset: "UTF-8",
  robots: "index, follow",
  author: "PickEat Team",
  openGraph: {
    title: "PickEat | Order Food from Your Seat",
    description:
      "Experience convenience with PickEat. Browse menus, order food, and get it delivered to your seat or ready for pickup—all while enjoying the game.",
    url: `https://pickeat.com/`,
    type: "website",
    images: [
      {
        url: `https://pickeat.com/media/background.webp`,
        width: 1280,
        height: 720,
        alt: "PickEat",
      },
    ],
    site_name: "PickEat",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@PickEat",
    title: "PickEat | Order Food from Your Seat",
    description:
      "Experience convenience with PickEat. Browse menus, order food, and get it delivered to your seat or ready for pickup—all while enjoying the game.",
    image: "https://pickeat.com/media/background.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/static/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/static/logo192.png" />
        <link rel="manifest" href="/static/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Request Hub - Your Marketplace for Personalized Content Requests",
              url: "https://requesthub.net",
              description:
                "Get what you need on RequestHub, the unique online marketplace. Post personalized requests, including 18+ content, and receive offers from responsive providers.",
              publisher: {
                "@type": "Organization",
                name: "Request Hub",
                logo: {
                  "@type": "ImageObject",
                  url: "https://requesthub.net/media/m_logo.png",
                },
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ModalContext>
          <UserContext>
            <DataContext>
              <ScreenTemplate>
                <Navbar>
                  <main>{children}</main>
                </Navbar>
              </ScreenTemplate>
              <Modal />
            </DataContext>
          </UserContext>
        </ModalContext>
        <ToastContainer />
      </body>
    </html>
  );
}

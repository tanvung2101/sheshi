import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Footer, Menu } from "@/components";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Menu></Menu>
      <Component {...pageProps} />
      <Footer></Footer>
    </>
  );
}

export const metadata = {
  title: 'hello',
};

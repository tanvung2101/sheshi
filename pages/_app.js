import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Footer, Menu } from "@/components";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Menu></Menu>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />

        <Component {...pageProps} />

        <Footer></Footer>
      </Provider>
    </>
  );
}

export const metadata = {
  title: "hello",
};

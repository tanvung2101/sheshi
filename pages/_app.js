import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Footer, Menu } from "@/components";
import "@/styles/globals.css";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { STORAGE_KEY } from "@/constants/storage-key";
import { setToken } from "@/redux/accountSlice";

// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";

// let persistor = persistStore(store);

export default function App({ Component, pageProps }) {
  // const dispatch = useDispatch();
  // const tokenLogin = window.localStorage.getItem(STORAGE_KEY.TOKEN);
  // if (JSON.parse(tokenLogin)) {
  //   return dispatch(setToken(JSON.parse(tokenLogin)));
  // } else {
  //   dispatch(setToken());
  // }
  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ToastContainer
          position="top-right"
          transition={Zoom}
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {/* Same as */}
        <Menu>
          <Component {...pageProps} />
        </Menu>
        <Footer></Footer>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
}

import React from "react";
import setupStore from "./store/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const store = setupStore();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        {/* <RouterProvider router={router} /> */}
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

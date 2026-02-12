import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SnackbarProvider } from "notistack";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import LoaderError, { ErrorBoundary } from "../src/v2/components/LoaderError";
import App from "./App";
import "./index.css";
import Interceptor from "./interceptor";
import { rootReducer as reducers } from "./rootReducer";
import * as serviceWorker from "./serviceWorker";
const store = reducers && createStore(reducers, applyMiddleware(ReduxThunk));
const theme = createMuiTheme({
  v2: {
    backgrounds: {
      darkBackground: "#1D1D1F",
      greenBackground: "#a9def9",
      lightBlueBackground: "#F4F4F4",
      whiteBackground: "#FFFFFF",
      darkBackgroundShade2: "#363837",
      lightGreyBackground: "#E3E4E3",
      blueBackgroundShade1: "#4196CB",
      whiteBackground2: "#C4C4C4",
      redBackground: "#E36767",
      redBackground2: "#E26666",
      greyBackground3: "#E2E2E2",
      greenBackgroundShade2: "#cdeaff",
      greenBackgroundShade3: "#a9def9",
      darkBackgroundShade3: "#24231F",
      greenBackgroundShade4: "#f0f9ff",
      pinkBackgroundShade1: "#FFC5BA",
      yellowBackgroundShade1: "#FDF1A1",
      yellowBackgroundShade2: "#EF9D3D",
      redBackgroundShade3: "#673737",
      whiteBackgroundShade3: "#FBFBFC",
      greenBackgroundShade5: "#f0f9ff",
      blueBackgroundShade2: "#DAEDF8",
      redBackgroundShade4: "#F4E6E6",
      blueBackgroundShade3: "#1C1C1E",
      greyBackgroundShade4: "#323234",
      greenBackgroundShade6: "#f0f9ff",
      greenBackgroundShade7: "#a9def9",
      greenBackgroundShade8: "#1c3d5a",
      yellowBackgroundShade3: "#E3BD67",
      yellowBackgroundShade4: "#5A452D",
    },
    fonts: {
      colors: {
        darkFont: "#696969",
        whiteFont: "#ffffff",
        whiteShade1: "#C4C4C4",
        greenShade1: "#a9def9",
        blackShade1: "#1D1D1F",
        brownShade1: "#A8A0A0",
        blackShade2: "#24231F",
        greenShade2: "#a9def9",
        darkFont2: "#959592",
        redShade1: "#E36767",
        yellowShade1: "#EF9D3D",
        blueShade1: "#4196CB",
        redErrorMsg: "#f44336",
        greyShade1: "#A8A8A8",
        greyShade2: "#696865",
        greenShade3: "#a9def9",
        greyShade4: "#585858",
        greyShade5: "#B4B4B4",
        redShade2: "#D46E6B",
        greenShade4: "#a9def9",
        greyShade6: "#707071",
        greyShade7: "#E3E4E3",
        greenShade5: "#a9def9",
      },
    },
    borders: {
      lightGreen: "#a9def9",
      darkShade1: "#696969",
      lightGrey: "#E3E4E3",
      darkShade2: "#C4C4C4",
      lightGrey1: "#A2A1A1",
      lightGrey3: "#E2E2E2",
      greenShade1: "#a9def9",
      greenShade2: "#a9def9",
      blueShade1: "#4196CB",
      redShade1: "#D46E6B",
      blackShade1: "#1D1D1F",
      greenShade3: "#a9def9",
    },
    checkboxes: {
      green: "#a9def9",
    },
  },
  props: {
    MuiInput: {
      disableUnderline: true,
    },
    MuiButton: {
      disableElevation: true,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        backgroundColor: "#a9def9",
        color: "#ffffff",
        borderRadius: 10,
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#89cef9",
        },
        "&:disabled": {
          backgroundColor: "grey",
          color: "#ffffff",
        },
      },
      disabled: {
        backgroundColor: "grey",
        color: "#a9def9",
      },
    },
    MuiInput: {
      root: {
        backgroundColor: "#F4F4F4",
        fontColor: "#A8A0A0",
        // padding: "1% 2%",
        borderRadius: 5,
        outline: "1px solid transparent",
        "&$focused": {
          backgroundColor: "#ffffff",
          border: "1px solid #a9def9",
        },
      },
    },
    MuiInputBase: {
      root: {
        height: 45,
      },
    },
    MuiSelect: {
      icon: {
        color: "#a9def9",
      },
    },
    MuiCheckbox: {
      "&$checked": {
        color: "#a9def9",
      },
      colorSecondary: {
        "&.Mui-checked": {
          color: "#a9def9",
        },
      },
    },
  },
});

Interceptor.setup(store);

(async () => {
  const stripePromise = await loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ErrorBoundary className="min-vh-100">
            <Suspense fallback={<LoaderError className="min-vh-100" />}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                maxSnack={3}
              >
                <Elements stripe={stripePromise}>
                  <App />
                </Elements>
              </SnackbarProvider>
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
})();

serviceWorker.unregister();

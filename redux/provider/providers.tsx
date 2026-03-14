"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from 'react-cookie';

type ProviderProps = {
  children: ReactNode;
};
export default function Providers({ children }: ProviderProps) {
  return (
    <>
    {/*  */}
      {/* <SessionProvider> */}
        <CookiesProvider>
          <Provider store={store}>{children}</Provider>
        </CookiesProvider>
      {/* </SessionProvider> */}
    </>
  );
}

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "@next/font/google";
import clsx from "clsx";

import { trpc } from "../utils/trpc";

import "../styles/reset.css";
import "../styles/global.scss";

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--t-inter',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={clsx(inter.variable, 'global-font')}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default trpc.withTRPC(MyApp);

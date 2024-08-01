import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/utils/chakraTheme";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <div className="flex flex-col min-h-screen">
        <main className="grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ChakraProvider>
  );
}

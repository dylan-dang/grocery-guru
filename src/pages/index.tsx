import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const item = api.item.create.useMutation();

  return (
    <>
      <Head>
        <title>Grocery Guru</title>
        <meta name="description" content="Grocery Guru is an amazing web app that allows the user to submit details about foods that they want to buy, and Grocery Guru supplies the best place to buy it!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-white flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4dff73e6] to-[#15162c]">
            <h1 className="text-6xl font-pacifico">Grocery Guru</h1>
            <h2 className="mt-8 text-xl font-playpen">Your one stop shop to the cheapest groceries around you!</h2>
      </main>
    </>
  );
}

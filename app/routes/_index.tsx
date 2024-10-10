import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
    { robots: "noindex, nofollow" },
  ];
};

export default function Index() {
  return (
    <>
      <img
        src="hero.jpg"
        alt="Jo & Neil standing on top of Ben Nevis looking into each other's eyes"
        className="w-full h-96 object-cover"
      />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-center leading-tight">
            Jo &amp; Neil
            <br /> are <br /> Getting Hitched!
          </h1>

          <div className="text-center m-10">
            <p>
              If you are reading this you probably know us, please scan your
              invite for more info.{" "}
            </p>
            <p className="pt-6 bold">
              Lost your invite?{" "}<br />
              <a className="italic" href="mailto:neilross.wkdesign@gmail.com">Contact Neil</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

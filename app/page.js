import ButtonLogin from "@/Components/ButtonLogin";
import ListItem from "@/Components/ListItem";
import Image from "next/image";
import productDemo from "./productDemo.png";
import { auth } from "@/public/auth";

export default async function Home() {
  const isLoggedIn = true;
  const name = "Marc";

    // Obtener la sesión de autenticación
    const session = await auth();

    // Mostrar la sesión en consola
    console.log(session);

  const pricingFeaturesList = [
    "Collect customer feedback",
    "Unlimited boards",
    "Admin dashboard",
    "24/7 support",
  ];

  return (
    <main>
      <section className="bg-base-200">
        <div className="max-w-3xl mx-auto bg-base-200 flex justify-between items-center px-8 py-2">
          <div className="font-bold">CodeFastSaaS</div>
          <div className="space-x-4 max-md:hidden">
            <a className="link link-hover" href="#pricing">
              Pricing
            </a>

            <a className="link link-hover" href="#faq">
              FAQ
            </a>
          </div>
          <div>
            <ButtonLogin session={session}  isLoggedIn={isLoggedIn} name={name} />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="text-center lg:text-left py-32 px-8 max-w-5xl mx-auto 
      flex flex-col lg:flex-row gap-14 items-center lg:items-start">
        <Image
          src={productDemo}
          alt="Product demo"
          className="w-96 rounded-xl"
        />

        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Collect customer feedback to build better products
          </h1>
          <div className="opacity-90 mb-10">
            Create a feedback board in minutes, prioritize features, and build
            products your customers will love.
          </div>
          <ButtonLogin session={session}  isLoggedIn={isLoggedIn} name={name} />
        </div>
      </section>

      {/* Sección de precios */}
      <section className="bg-base-200">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-6">
            Pricing
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">
            A pricing that adapts to your needs
          </h2>

          <div className="p-8 bg-base-100 w-96 rounded-3xl mx-auto space-y-6">
            <div className="flex gap-2 items-baseline">
              <div className="text-4xl font-black">$19</div>
              <div className="uppercase text-sm font-medium opacity-60">
                /month
              </div>
            </div>

            <ul className="space-y-2">
              {pricingFeaturesList.map((priceItem) => {
                return (
                  <li className="flex gap-2 items-center" key={priceItem}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="text-green-600 size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.854 1.854 4.542-6.813a.75.75 0 0 1 1.041-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {priceItem}
                  </li>
                );
              })}
            </ul>

            {/* 
            <ul className="space-y-2">
              

              <ListItem >

             Collect customer feedback

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="text-red-600 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 0 1 1.06-1.06l1.72 1.72 4.47-6.705a.75.75 0 0 1 1.196-.11z"
                    clipRule="evenodd"
                  />
                </svg>
              </ListItem>

              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="text-green-600 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.854 1.854 4.542-6.813a.75.75 0 0 1 1.041-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                Unlimited boards
              </li>

              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="text-green-600 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.854 1.854 4.542-6.813a.75.75 0 0 1 1.041-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                Admin dashboard
              </li>

              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="text-green-600 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.854 1.854 4.542-6.813a.75.75 0 0 1 1.041-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                24/7 support
              </li>
            </ul>

             */}

            <ButtonLogin session={session} 
              isLoggedIn={isLoggedIn}
              name={name}
              extraStyle="w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

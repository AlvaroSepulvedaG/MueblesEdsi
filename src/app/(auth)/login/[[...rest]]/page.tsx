"use client";
import { useEffect, useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";

export default function Page() {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verifica si la URL contiene "login" y si el usuario ya está logueado
    if (window.location.href.includes("login") && isSignedIn) {
      window.location.href = "/comenunca";
    }
  }, [isSignedIn]); // Dependencia para ejecutar el efecto cuando cambie el estado de inicio de sesión

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        // Si la autenticación es exitosa, redirige al usuario
        window.location.href = "/comenunca";
      } else {
        setError("Authentication failed, please try again.");
      }
    } catch (err: any) {
      const clerkErrorCode = err.errors?.[0]?.code;
      if (clerkErrorCode === "form_password_incorrect") {
        setError(
          "La contraseña ingresada es incorrecta. Por favor, inténtalo de nuevo."
        );
      } else if (clerkErrorCode === "form_identifier_not_found") {
        setError("No se encontró una cuenta con este correo electrónico.");
      } else {
        setError("Algo salió mal. Por favor, inténtalo más tarde.");
}
}
  };

  return (
    <section className="flex justify-center items-center h-screen custom-gradient overflow-hidden">
      <div className="flex shadow-[0px_0px_15px_rgba(0,0,0,0.75)] items-center rounded-lg w-[1000px] h-[500px] overflow-hidden">
        <div className="flex flex-col w-[500px] h-[500px] bg-white justify-center items-center hidden sm:flex">
          <img
            src="/logo.png"
            alt="Mi Logo"
            className="w-[250px] h-[150px] bg-white rounded-t rounded-b rounded-l"
          />
        </div>
        <div className="flex flex-col items-center bg-[#DC5F00] justify-center pt-7 rounded-md shadow-md gap-10 w-full h-full md:w-[500px] md:h-[500px]">
          <form onSubmit={handleSignIn} className="flex flex-col text-black gap-4">
            <h2 className="text-2xl font-bold mb-4 text-center border-b border-white text-white">
              Iniciar sesión
            </h2>
            {error && <p className="text-black text-center font-bold mb-4">{error}</p>}
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm text-lg mb-1 text-center text-white font-bold"
              >
                Correo electronico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-none rounded-full"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm text-lg mb-1 font-bold text-white text-center"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-none rounded-full"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-bold rounded-full hover:text-orange-500 transition duration-300"
            >
              Iniciar Sesión
            </button>
            <img
              src="/logo-blanco.png"
              alt="Mi Logo"
              className="w-[100px] h-[50px] ml-14 mt-1"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
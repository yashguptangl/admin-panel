import Image from "next/image";
import logo from "../assets/logo.png";
export default function Header() {
  return (
    <>
      <div className="flex h-16 w-full max-w-full bg-blue-300 justify-between ">
        <div className="relative h-16 w-40 ml-8">
          <Image
            src={logo}
            fill
            className="object-contain cursor-pointer"
            alt="logo"
          />
        </div>
      </div>
    </>
  );
}

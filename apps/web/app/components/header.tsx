import Image from "next/image";
import logo from "../assets/logo.png";
export default function Header() {
  return (
    <>
      <div className="flex h-16 w-full max-w-full bg-blue-400 justify-between p-3">
        <div className="relative h-12 w-32">
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

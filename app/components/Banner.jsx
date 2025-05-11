import Image from "next/image";
export default function Banner({ name }) {
  return (
    <>
      <div className="banner-outer shadow-lg">
        <div className="banner">
          <h1 className="!text-[1.5rem] !pt-1 !text-[var(--bg)]">
            SpilSammen Chats
          </h1>
        </div>
      </div>
    </>
  );
}

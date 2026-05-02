type LogoProps = {
  size?: "sm" | "md" | "lg";
};

const Logo = ({ size = "md" }: LogoProps) => {
  const sizes = {
    sm: {
      icon: "w-7 h-7",
      text: "text-lg",
    },
    md: {
      icon: "w-9 h-9",
      text: "text-xl",
    },
    lg: {
      icon: "w-12 h-12",
      text: "text-3xl",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        className={sizes[size].icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="30" fill="#e8f5e9" />
        <path
          d="M20 38C25 34 30 44 35 40C40 36 36 26 44 24"
          stroke="#388e3c"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M28 32C28 30 30 28 32 28C34 28 36 30 36 32C36 34 34 36 32 36C30 36 28 34 28 32Z"
          fill="#f9a825"
        />
        <text
          x="26"
          y="37"
          fontSize="14"
          fill="#2e7d32"
          fontFamily="Arial"
        >
          ₹
        </text>
      </svg>

      <div className={`${sizes[size].text} font-bold text-[#2e7d32]`}>
        Scraps<span className="text-[#f9a825]">2</span>Stock
      </div>
    </div>
  );
};

export default Logo;
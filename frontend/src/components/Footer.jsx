const Footer = () => {
  return (
    <footer className="shadow-top">
      <div className="mx-auto w-full max-w-screen-xl p-4">
        <span className="text-sm">
          © {new Date().getFullYear()} That1Tests. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

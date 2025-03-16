function SellerTitle({ children, type }) {
  const titleStyles = {
    main: 'text-2xl font-bold',
    sub: 'text-xl font-bold m-0',
    normal: 'text-base m-0',
  };

  return <h2 className={titleStyles[type]}>{children}</h2>;
}

export default SellerTitle;

const Button = (props: any) => {
    const { type, onClick,className,id,value,children } = props;
  return (
    <button
      type={type}
      className={className}
      id={id}
      onClick={onClick}
    >
      {value}
      {children}
    </button>
  );
};

export default Button;

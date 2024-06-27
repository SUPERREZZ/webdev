const Button = (props: any) => {
    const { type, onClick,className,id,value } = props;
  return (
    <button
      type={type}
      className={className}
      id={id}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;

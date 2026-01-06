import cls from './button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    customClass?: string;
    onClick: () => void;
    disabled?: boolean;
}

const Button = ({ children, customClass, onClick, disabled }: ButtonProps) => {
    return (
        <button 
            className={`${cls.button} ${customClass || ''} ${disabled ? cls.disabled : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
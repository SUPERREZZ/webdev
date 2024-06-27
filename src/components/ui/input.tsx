import React from 'react'

const Input = (props: any) => {
    const { classNameLabel, classNameInput, type, name, placeholder, id ,valueLabel} = props;
    return (
        <div>
            <label className={classNameLabel} htmlFor={name}>
                {valueLabel}
            </label>
            <input
                type={type}
                name={name}
                className={classNameInput}
                id={id}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input
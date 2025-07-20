const RadioInput = function ({id, name, value, checked, onChange, className, label}) {
    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
            <input id={id} type="radio"
                   name={name}
                   value={value}
                   checked={checked}
                   onChange={(e) => onChange?.(e.target.value)}
                   className="size-5 relative appearance-none rounded-full text-violet-600 bg-gray-700 border-gray-600
                                focus:ring-violet-500 after:content-[''] after:hidden checked:after:block after:size-2 border after:rounded-full after:bg-purple-500
                                after:absolute after:-translate-x-1/2 after:-translate-y-1/2 after:top-1/2 after:left-1/2 focus:ring-2"/>
            <label htmlFor={id} className="">{label}</label>
        </div>
    );
}

export default RadioInput;
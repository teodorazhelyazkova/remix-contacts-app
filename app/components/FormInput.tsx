export function FormInput({
    type,
    name,
    label,
    placeholder,
    defaultValue = '',
    errors,
}: Readonly<{
    type: string;
    name: string;
    label?: string;
    placeholder?: string;
    errors: any;
    defaultValue?: string;
}>) {
    return (
        <div className="input-field">
            <div>
                <label htmlFor={name}>{label}</label>
                <div>
                    <input
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                    />
                </div>
            </div>
            <ul>
                {errors && errors[name]
                    ? errors[name].map((error: string) => (
                          <li key={error} className="input-error">
                              {error}
                          </li>
                      ))
                    : null}
            </ul>
        </div>
    );
}

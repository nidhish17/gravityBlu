function Section({className, children, id, ...props}) {
    return (
        <section id={id} {...props} className={`px-4 py-16 ${className}`}>
            {children}
        </section>
    );
}

export default Section;

/*

*/


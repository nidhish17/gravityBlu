const Section = function ({children, className}) {
    return (
        <section className={`p-4 sm:p-8 md:p-12 lg:16 ${className}`}>
            {children}
        </section>
    );
}

export default Section;
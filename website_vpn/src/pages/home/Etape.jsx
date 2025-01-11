import React, { useState, useEffect } from "react";

const Etape = () => {
    const [activeSection, setActiveSection] = useState("Section 1");

    const handleScroll = () => {
        const sections = document.querySelectorAll(".scroll-section");
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                setActiveSection(section.getAttribute("data-section"));
            }
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const renderLeftContent = () => {
        switch (activeSection) {
            case "Section 1":
                return (
                    <>
                        <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4">Section 1 : Sécurité VPN</h1>
                        <p className="tw-text-lg tw-leading-relaxed">
                            Découvrez comment un VPN peut protéger votre vie privée et sécuriser vos connexions Internet.
                        </p>
                    </>
                );
            case "Section 2":
                return (
                    <>
                        <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4">Section 2 : Vitesse VPN</h1>
                        <p className="tw-text-lg tw-leading-relaxed">
                            Profitez de vitesses de connexion incroyables avec notre technologie de pointe.
                        </p>
                    </>
                );
            case "Section 3":
                return (
                    <>
                        <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4">Section 3 : Facilité d’utilisation</h1>
                        <p className="tw-text-lg tw-leading-relaxed">
                            Une interface simple et intuitive pour naviguer en toute simplicité.
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="tw-w-full tw-h-auto tw-bg-gray-100">
            <div className="tw-flex tw-h-auto">
                {/* Contenu gauche (fixe) */}
                <div className="tw-hidden lg:tw-flex tw-w-2/4 tw-text-black tw-p-12 tw-items-center tw-justify-center tw-sticky tw-top-0 tw-h-screen">
                    <div className="tw-text-center">{renderLeftContent()}</div>
                </div>

                {/* Contenu droit (scroll) */}
                <div className="xl:tw-w-2/4 tw-w-screen">
                    <div className="tw-flex tw-flex-col">
                        {/* Section 1 */}
                        <div
                            className="tw-h-auto lg:tw-h-[80vh] tw-flex tw-items-center tw-justify-center tw-text-left tw-px-16 lg:tw-px-32 tw-py-10 lg:tw-py-16 scroll-section"
                            data-section="Section 1"
                        >
                            <div className="xl:tw-w-2/3">
                                <h4 className="tw-text-xl tw-font-semibold tw-mb-2 tw-text-blue-link">Protection</h4>
                                <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4 tw-dark-blue">Sécurité Totale</h1>
                                <p className="tw-text-lg tw-text-gray-400 tw-mb-6">
                                    Protégez vos données personnelles et accédez à Internet en toute sécurité grâce à notre VPN.
                                </p>
                                <p className="tw-text-lg tw-text-gray-400 lg:block hidden tw-mb-6">
                                    Surfez anonymement sans laisser de traces en ligne. Nos technologies avancées vous offrent la meilleure protection.
                                </p>
                                <a
                                    href="#"
                                    className="tw-inline-block tw-mt-4 tw-px-6 tw-py-3 tw-bg-transparent tw-border-2 tw-border-blue-link tw-text-blue-link tw-font-medium tw-rounded-lg hover:tw-bg-blue-link hover:tw-text-white hover:tw-transform hover:tw-scale-105 hover:tw-shadow-md transition-all duration-300"
                                >
                                    En savoir plus
                                </a>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div
                            className="tw-h-auto lg:tw-h-[80vh] tw-flex tw-items-center tw-justify-center tw-text-left tw-px-16 lg:tw-px-32 tw-py-10 lg:tw-py-16 scroll-section"
                            data-section="Section 2"
                        >
                            <div className="xl:tw-w-2/3">
                                <h4 className="tw-text-xl tw-font-semibold tw-mb-2 tw-text-blue-link">Performance</h4>
                                <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4 tw-dark-blue">Vitesse Maximale</h1>
                                <p className="tw-text-lg tw-text-gray-400 tw-mb-6">
                                    Profitez d'une connexion rapide et stable, même dans les zones les plus reculées.
                                </p>
                                <p className="tw-text-lg tw-text-gray-400 lg:block hidden tw-mb-6">
                                    Naviguez à une vitesse optimale pour tous vos besoins, que ce soit pour le travail ou le divertissement.
                                </p>
                                <a
                                    href="#"
                                    className="tw-inline-block tw-mt-4 tw-px-6 tw-py-3 tw-bg-transparent tw-border-2 tw-border-green-500 tw-text-green-500 tw-font-medium tw-rounded-lg hover:tw-bg-green-500 hover:tw-text-white hover:tw-transform hover:tw-scale-105 hover:tw-shadow-md transition-all duration-300"
                                >
                                    Découvrir
                                </a>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div
                            className="tw-h-auto lg:tw-h-[80vh] tw-flex tw-items-center tw-justify-center tw-text-left tw-px-16 lg:tw-px-32 tw-py-10 lg:tw-py-16 scroll-section"
                            data-section="Section 3"
                        >
                            <div className="xl:tw-w-2/3">
                                <h4 className="tw-text-xl tw-font-semibold tw-mb-2 tw-text-blue-link">Simplicité</h4>
                                <h1 className="tw-text-4xl tw-font-extrabold tw-mb-4 tw-dark-blue">Utilisation Facile</h1>
                                <p className="tw-text-lg tw-text-gray-400 tw-mb-6">
                                    Un VPN simple à configurer et à utiliser, même pour les débutants.
                                </p>
                                <p className="tw-text-lg tw-text-gray-400 lg:block hidden tw-mb-6">
                                    Démarrez en quelques clics et profitez immédiatement de votre connexion sécurisée.
                                </p>
                                <a
                                    href="#"
                                    className="tw-inline-block tw-mt-4 tw-px-6 tw-py-3 tw-bg-transparent tw-border-2 tw-border-yellow-500 tw-text-yellow-500 tw-font-medium tw-rounded-lg hover:tw-bg-yellow-500 hover:tw-text-white hover:tw-transform hover:tw-scale-105 hover:tw-shadow-md transition-all duration-300"
                                >
                                    Essayez maintenant
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Etape;
